import {ingredientTableElement, ingredientType, recipeColumnsNames} from '@customTypes/DatabaseElementTypes';
import {
    allNonDigitCharacter,
    findAllNumbers,
    letterRegExp,
    numberAtFirstIndex as numberAtFirstIndex,
    replaceAllBackToLine,
    textSeparator
} from '@styles/typography';

import TextRecognition, {TextBlock, TextRecognitionResult} from "@react-native-ml-kit/text-recognition";
import {isArrayOfNumber, isArrayOfString, isArrayOfType, isNumber, isString} from "@utils/TypeCheckingFunctions";

export type personAndTimeObject = { person: number, time: number };
export const keysPersonsAndTimeObject = Object.keys({
    person: 0,
    time: 0,
} as personAndTimeObject) as (keyof personAndTimeObject)[];

export type ingredientQuantityPerPersons = {
    persons: number,
    quantity: string,
}
export type ingredientObject = { name: string, unit: string, quantityPerPersons: Array<ingredientQuantityPerPersons> };
export const keysIngredientObject = Object.keys({
    name: "",
    unit: "",
    quantityPerPersons: []
} as ingredientObject) as (keyof ingredientObject)[];

export type WarningHandler = (message: string) => void;

export async function recognizeText(imageUri: string, fieldName: recipeColumnsNames) {
    const ocr = await TextRecognition.recognize(imageUri);
    switch (fieldName) {
        // TODO should be really use OCR for these ?
        case recipeColumnsNames.time:
            return tranformOCRInOneNumber(ocr);
        case recipeColumnsNames.persons:
            return tranformOCRInOneNumber(ocr);
        case recipeColumnsNames.title:
        case recipeColumnsNames.description:
            return tranformOCRInOneString(ocr);
        case recipeColumnsNames.preparation:
            return tranformOCRInPreparation(ocr);
        case recipeColumnsNames.ingredients:
            return tranformOCRInIngredients(ocr);
        case recipeColumnsNames.tags:
            // TODO to implement

            //  LOG  Recognized text: <650kcal Familial Rapido
            // LOG  Recognized line of block: <650kcal Familial Rapido
            return "";
        case recipeColumnsNames.image:
            console.error("recognizeText: Image field shouldn't go through OCR");
            return "";
        default:
            console.error("recognizeText: Unrecognized type");
            return "";
    }
}

function convertBlockOnArrayOfString(ocrBloc: Array<TextBlock>): Array<string> {
    return ocrBloc.map(block => block.lines.map(line => line.text)).flat();
}

// TODO add an option to convert to uppercase ?
function tranformOCRInOneString(ocr: TextRecognitionResult): string {
    // Replace all \n by spaces
    return ocr.text.replace(replaceAllBackToLine, " ");
}

function retrieveNumbersFromArrayOfStrings(str: Array<string>): Array<number> {
    return str.map(element => retrieveNumberFromString(element));
}

function retrieveNumberFromString(str: string): number {
    return Number(str.split(' ')[0].replace(allNonDigitCharacter, ""));
}

function extractingNumberOrArray(ocr: Array<string>) {
    const result = retrieveNumbersFromArrayOfStrings(ocr);
    return result.length > 1 ? result : result[0];
}


function tranformOCRInOneNumber(ocr: TextRecognitionResult): number | Array<number> | Array<personAndTimeObject> {
    const elementsToConvert = convertBlockOnArrayOfString(ocr.blocks);

    const personsChar = 'p';
    const timeChar = 'm';
    const personsArray = elementsToConvert.filter(element => element.includes(personsChar));
    const timeArray = elementsToConvert.filter(element => element.includes(timeChar));

    if (personsArray.length > 0) {
        if (timeArray.length > 0) {
            if (personsArray.length !== timeArray.length) {
                return extractingNumberOrArray(personsArray);
            }
            const personsAndTime = new Array<personAndTimeObject>();
            for (let i = 0; i < personsArray.length; i++) {
                personsAndTime.push({
                    person: retrieveNumberFromString(personsArray[i]),
                    time: retrieveNumberFromString(timeArray[i])
                });
            }
            return personsAndTime;
        } else {
            return extractingNumberOrArray(personsArray);
        }
    } else if (timeArray.length > 0) {
        return extractingNumberOrArray(timeArray);
    }

    console.error("tranformOCRInOneNumber: Don't know how to convert: ", elementsToConvert);
    return -1;
}

function tranformOCRInPreparation(ocr: TextRecognitionResult): Array<string> {
    const result = new Array<string>();
    let cptPreparation = 0;
    for (const block of ocr.blocks) {
        const blockText = block.text;
        if (blockText.length === 0) {
            continue;
        }
        // OCR returns steps (and other characters like bullet points) alone. This means that we must ignore everything that is not a number and retrieve the number in cpt for later
        // Possible to have a back to line followed by a cooking time indication. Detect it and avoid pushing in this case
        const strInNumber = retrieveNumberInStr(blockText) - 1;
        const prepTooHigh = cptPreparation == 0 || (cptPreparation <= 2 && strInNumber <= 4 * cptPreparation) || (cptPreparation > 2 && strInNumber <= 2 * cptPreparation);

        if (numberAtFirstIndex.test(blockText) && prepTooHigh) {

            cptPreparation = strInNumber;
            // Don't push if it is only the id of the preparation
            if (blockText.search(letterRegExp) != -1) {
                result.push(convertToLowerCaseExceptFirstLetter(blockText).replace("\n", textSeparator));
            }
        } else {
            if (result.length < cptPreparation + 1) {
                for (let i = result.length; i < cptPreparation; i++) {
                    result.push("");
                }
                result.push(blockText);
            } else {
                const separator = result[cptPreparation].includes(textSeparator) ? "\n" : textSeparator;
                if (result[cptPreparation].length === 0) {
                    result[cptPreparation] += blockText;
                } else {
                    result[cptPreparation] += separator + blockText;
                }
            }
        }
    }
    return result;
}

/**
 * Parses an OCR result that includes structured blocks into an array of ingredientObject.
 * The function assumes that the header (ingredient names with units) is given first, followed by data rows.
 * Each data row starts with a token like "2p" (indicating the number of persons) and is followed by one quantity per ingredient.
 */
function tranformOCRInIngredients(ocr: TextRecognitionResult): Array<ingredientObject> {

    // Collect all non-empty lines from the blocks.
    const lines = new Array<string>();
    for (const block of ocr.blocks) {
        for (const line of block.lines) {
            const trimmed = line.text.trim();
            if (trimmed.length > 0) {
                lines.push(trimmed);
            }
        }
    }

    // Determine the header boundary: the ingredient list is assumed to be all lines before the first token ending with "p".
    const headerBoundary = lines.findIndex(line => line.endsWith("p"));
    if (headerBoundary === -1) {
        throw new Error("No ingredient header found in OCR data.");
    }

    // Parse header lines into ingredient objects.
    const headerLines = lines.slice(0, headerBoundary);
    const ingredientsOCR: Array<ingredientObject> = headerLines.map(header => {
        const unitMatch = header.match(/\((.*?)\)/);
        return {
            name: unitMatch ? header.replace(unitMatch[0], "").trim() : header,
            unit: unitMatch ? unitMatch[1] : "", quantityPerPersons: new Array<ingredientQuantityPerPersons>()
        };
    });

    // The remaining tokens represent rows of quantities.
    // Each row starts with a persons token (e.g., "2p") followed by one token per ingredient.
    const dataTokens = lines.slice(headerBoundary);
    const groupSize = 1 + ingredientsOCR.length; // 1 for persons + one per ingredient quantity

    // Process each data row group.
    for (let i = 0; i < dataTokens.length; i += groupSize) {
        const group = dataTokens.slice(i, i + groupSize);
        if (group.length < groupSize) {
            console.log("OCR::tranformOCRInIngredients : skip incomplete groups");
            continue;
        }
        const persons = parseInt(group[0].replace("p", ""), 10);
        ingredientsOCR.forEach((ingredient, index) => {
            ingredient.quantityPerPersons.push({
                persons,
                quantity: group[index + 1]
            });
        });
    }
    return ingredientsOCR;
}

function convertToLowerCaseExceptFirstLetter(str: string) {
    const firstLetterIndex = str.search(letterRegExp);
    return str.charAt(firstLetterIndex).toUpperCase() + str.slice(firstLetterIndex + 1).toLowerCase();
}

function retrieveNumberInStr(str: string) {
    const firstLetterIndex = str.search(letterRegExp);
    const workingStr = (firstLetterIndex != -1) ? (str.slice(0, firstLetterIndex)) : str;

    const allNum = workingStr.match(findAllNumbers);
    if (allNum) {
        if (allNum.length < 1) {
            if (workingStr.includes(".")) {
                return Number(allNum[0] + "." + allNum[1])
            }
            if (workingStr.includes(",")) {
                return Number(allNum[0] + "," + allNum[1])
            }
        }
        return Number(allNum[0])

    }
    return -1;
}

export async function extractFieldFromImage(uri: string, field: recipeColumnsNames, currentState: {
                                                recipePreparation: string[];
                                                recipePersons: number;
                                                recipeIngredients: any[];
                                            }, onWarn: WarningHandler = console.warn
): Promise<Partial<{
    recipeImage: string;
    recipeTitle: string;
    recipeDescription: string;
    recipePreparation: string[];
    recipePersons: number;
    recipeTime: number;
    recipeIngredients: any[];
}>> {
    if (field === recipeColumnsNames.image) {
        return {recipeImage: uri};
    }

    const ocrResult = await recognizeText(uri, field);
    const warn = (msg: string) => onWarn(msg + ` {uri: ${uri},field: ${field},ocrResult: ${ocrResult} }`);
    // TODO to implement OCR for tags ?
    switch (field) {
        case recipeColumnsNames.title:
            if (isString(ocrResult)) {
                return {recipeTitle: ocrResult as string};
            } else {
                warn("Expected string for title");
                return {};
            }
        case recipeColumnsNames.description:
            if (isString(ocrResult)) {
                return {recipeDescription: ocrResult as string};
            } else {
                warn("Expected string for description");
                return {};
            }
        case recipeColumnsNames.preparation:
            if (isArrayOfString(ocrResult)) {
                return {
                    recipePreparation: [...currentState.recipePreparation, ...ocrResult as string[],],
                };
            } else {
                warn("Expected array of strings for preparation");
                return {};
            }
        case recipeColumnsNames.persons:
        case recipeColumnsNames.time:
            if (isNumber(ocrResult)) {
                return field === recipeColumnsNames.persons
                    ? {recipePersons: ocrResult as number}
                    : {recipeTime: ocrResult as number};
            }
            if (Array.isArray(ocrResult)) {
                if (isArrayOfNumber(ocrResult)) {
                    return field === recipeColumnsNames.persons
                        ? {recipePersons: ocrResult[0] as number}
                        : {recipeTime: ocrResult[0] as number};
                } else if (isArrayOfType(ocrResult, keysPersonsAndTimeObject) && ocrResult.length > 0) {
                    const valueToTake = ocrResult[0] as personAndTimeObject;
                    return {
                        recipePersons: valueToTake.person as number,
                        recipeTime: valueToTake.time as number,
                    };
                }
            }
            warn("Could not parse persons/time field");
            return {};
        case recipeColumnsNames.ingredients:
            if (Array.isArray(ocrResult) && isArrayOfType(ocrResult, keysIngredientObject)) {
                let idQuantityToSearch: number;
                if (currentState.recipePersons > 0) {
                    const foundPersonIndex = (ocrResult[0] as ingredientObject).quantityPerPersons.findIndex(p => (Number(p.persons) === currentState.recipePersons));
                    if (foundPersonIndex !== -1) {
                        idQuantityToSearch = foundPersonIndex;
                    } else {
                        warn(`Couldn't find exact match for persons (${currentState.recipePersons}) in ingredient. Using first available.`);
                        idQuantityToSearch = 0;
                    }
                } else {
                    idQuantityToSearch = 0;
                    warn(
                        `Couldn't find exact match for persons in ingredient. Using first available : ${(ocrResult[0] as ingredientObject).quantityPerPersons[0].persons}.`
                    );
                }

                return {
                    recipeIngredients: [
                        ...currentState.recipeIngredients,
                        ...(ocrResult as Array<ingredientObject>).map(ingredient => {
                            return {
                                ingName: ingredient.name,
                                season: [],
                                type: ingredientType.undefined,
                                unit: ingredient.unit,
                                quantity: ingredient.quantityPerPersons[idQuantityToSearch].quantity
                            } as ingredientTableElement
                        }),
                    ],
                };
            }
            warn("Expected array of ingredient objects");
            return {};
        default:
            console.error("Unrecognized field", field);
            return {};
    }
}
