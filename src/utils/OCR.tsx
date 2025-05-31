import {
    ingredientTableElement,
    ingredientType,
    recipeColumnsNames,
    tagTableElement
} from '@customTypes/DatabaseElementTypes';
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

export type tagObject = { id?: string, name: string };
export const keysTagObject = Object.keys({
    name: "",
} as tagObject) as (keyof tagObject)[];

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
    try {
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
                return tranformOCRInTags(ocr);
            case recipeColumnsNames.image:
                console.error("recognizeText: Image field shouldn't go through OCR");
                return "";
            default:
                console.error("recognizeText: Unrecognized type");
                return "";
        }
    } catch (e) {
        console.error("recognizeText: Error while OCR", e);
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

function tranformOCRInTags(ocr: TextRecognitionResult): Array<tagTableElement> {
    return ocr.blocks.map(block => block.lines.map(line => line.text).join(" ")).join(" ").split(" ").filter(tag => tag.length > 0).map(tag => {
        return {
            name: tag
        } as tagTableElement
    });
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

type groupType = { person: string, quantity: Array<string> };

/**
 * Parses an OCR result that includes structured blocks into an array of ingredientObject.
 * The function assumes that the header (ingredient names with units) is given first, followed by data rows.
 * Each data row starts with a token like "2p" (indicating the number of persons) and is followed by one quantity per ingredient.
 * This function tries to detect if OCR moved some elements around.
 * Also, it do its best to detect and correct when ingredients are on multiple line so that it merge these.
 */
function tranformOCRInIngredients(ocr: TextRecognitionResult): Array<ingredientObject> {
    let lines: string[] = [];
    const ocrLines = ocr.blocks.flatMap(block => block.lines);
    if (ocrLines[0]?.text.toLowerCase().includes("box")) ocrLines.shift();

    for (const line of ocrLines) {
        const trimmed = line.text.trim();
        if (!trimmed) continue;
        if (trimmed.includes("pers.")) {
            lines[lines.length - 1] += "p";
        } else {
            lines.push(trimmed);
        }
    }

    const headerBoundary = lines.findIndex(line => line.endsWith("p"));
    if (headerBoundary === -1) {
        console.log("tranformOCRInIngredients: No ingredient header found in OCR data.");
        return parseIngredientsNoHeader(lines);
    }
    let ingredientsNames = lines.slice(0, headerBoundary);
    let dataTokens = lines.slice(headerBoundary);

    let ingredientsOCR = parseIngredientsNamesAndUnits(ingredientsNames);

    const groups = getIngredientsGroups(dataTokens, ingredientsOCR.length);

    function areIngredientsMergeable(indexFirstSuspicious: number): boolean {
        if (indexFirstSuspicious == firstGroup.quantity.length) {
            return false;
        }
        for (let indexNextIngredient = indexFirstSuspicious + 1; indexNextIngredient < firstGroup.quantity.length && indexNextIngredient < ingredientsOCR.length; indexNextIngredient++) {
            if (isIngredientSuspicious(firstGroup.quantity[indexNextIngredient], ingredientsOCR[indexNextIngredient].unit)) {
                return false;
            }
        }
        return true;
    }

    function mergeIngredients(indexFirstSuspicious: number) {
        const currentIngredient = ingredientsOCR[indexFirstSuspicious];
        const nextIngredient = ingredientsOCR[indexFirstSuspicious + 1];

        if (nextIngredient) {
            currentIngredient.name += " " + nextIngredient.name;
            currentIngredient.unit += nextIngredient.unit;

            ingredientsOCR.splice(indexFirstSuspicious + 1, 1);
            return true;
        }
        return false;
    }

    const firstGroup = groups[0];
    if (groups.length > 0) {
        let indexFirstSuspicious = isSuspiciousGroup(firstGroup, ingredientsOCR);
        while (indexFirstSuspicious > -1) {
            if (areIngredientsMergeable(indexFirstSuspicious)) {
                if (!mergeIngredients(indexFirstSuspicious)) {
                    break;
                }
            } else {
                console.warn("Can't merge two ingredients. Break loop as I don't know what to do");
                break;
            }
            indexFirstSuspicious = isSuspiciousGroup(firstGroup, ingredientsOCR);
        }
    }
    let groupToCheckId = 1;
    while (groupToCheckId < groups.length) {
        if (isSuspiciousGroup(groups[groupToCheckId], ingredientsOCR) === -1) {
            groupToCheckId++;
        } else {
            groups.splice(groupToCheckId, 1);
        }
    }
    // Map groups to ingredientObjects
    groups.forEach(g => {
        const personsMatch = g.person.match(/(\d+)\s*p\s*$/i);
        const persons = personsMatch ? parseInt(personsMatch[1]) : NaN;
        for (let ingIdx = 0; ingIdx < ingredientsOCR.length; ingIdx++) {
            ingredientsOCR[ingIdx].quantityPerPersons.push({
                persons,
                quantity: g.quantity[ingIdx] ?? ""
            });
        }
    });

    return ingredientsOCR;
}

function parseIngredientsNamesAndUnits(namesAndUnits: Array<string>): Array<ingredientObject> {
    return namesAndUnits.map(nameAndUnit => {
        const unitMatch = nameAndUnit.match(/\((.*?)\)/);
        return {
            name: unitMatch ? nameAndUnit.replace(unitMatch[0], "").trim() : nameAndUnit,
            unit: unitMatch ? unitMatch[1] : "",
            quantityPerPersons: []
        };
    });
}

function getIngredientsGroups(tokens: Array<string>, nIngredients: number): Array<groupType> {
    let groups = new Array<groupType>();
    let group: groupType = {person: "", quantity: new Array<string>()};
    for (const token of tokens) {
        if (token.match(/\d+\s*p\s*$/i)) {
            if (group.person.length > 0) {
                while (group.quantity.length < nIngredients) {
                    group.quantity.push("");
                }
                groups.push(group);
                group = {person: "", quantity: new Array<string>()};
            }
            group.person = token;
        } else {
            if (token.includes(" ")) {
                const tokenSplit = token.split(" ");
                for (const split of tokenSplit) {
                    group.quantity.push(split);
                }
            }
            group.quantity.push(token);
        }
    }
    groups.push(group);
    return groups;
}

function isIngredientSuspicious(quantity: string, unit: string): boolean {
    if (quantity.length === 0) {
        return true;
    }
    const num = parseFloat(quantity.replace(/[^\d.]/g, ""));
    return (unit === "" && num > 10);
}

function isSuspiciousGroup(group: groupType, ingredients: Array<ingredientObject>): number {
    for (let i = 0; i < ingredients.length; i++) {
        const quantityStr = group.quantity[i] || "";
        if (isIngredientSuspicious(quantityStr, ingredients[i].unit)) {
            return i;
        }
    }
    return -1;
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
                                                recipeTags: tagTableElement[];
                                                recipeIngredients: any[];
                                            }, onWarn: WarningHandler = console.warn
): Promise<Partial<{
    recipeImage: string;
    recipeTitle: string;
    recipeDescription: string;
    recipeTags: Array<tagTableElement>;
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
            if (Array.isArray(ocrResult) && ocrResult.length > 0 && isArrayOfString(ocrResult)) {
                return {
                    recipePreparation: [...currentState.recipePreparation, ...ocrResult as string[],],
                };
            } else {
                warn("Expected non empty array of strings for preparation");
                return {};
            }
        case recipeColumnsNames.persons:
        case recipeColumnsNames.time:
            if (isNumber(ocrResult)) {
                return field === recipeColumnsNames.persons
                    ? {recipePersons: ocrResult as number}
                    : {recipeTime: ocrResult as number};
            }
            if (Array.isArray(ocrResult) && ocrResult.length > 0) {
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
            if (Array.isArray(ocrResult) && ocrResult.length > 0 && isArrayOfType(ocrResult, keysIngredientObject)) {
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
                                name: ingredient.name,
                                season: [],
                                type: ingredientType.undefined,
                                unit: ingredient.unit,
                                quantity: ingredient.quantityPerPersons[idQuantityToSearch].quantity
                            } as ingredientTableElement
                        }),
                    ],
                };
            }
            warn("Expected non empty array of ingredient objects");
            return {};
        case recipeColumnsNames.tags:
            if (Array.isArray(ocrResult) && ocrResult.length > 0 && isArrayOfType<tagTableElement>(ocrResult, keysTagObject)) {
                return {
                    recipeTags: [...currentState.recipeTags, ...ocrResult as tagTableElement[]],
                };
            } else {
                warn("Expected non empty array of strings for tags");
                return {};
            }
        default:
            console.error("Unrecognized field", field);
            return {};
    }
}

/**
 * Parses ingredients from OCR lines when there is no header/person count.
 * Splits the lines array in half: first part is names, second part is quantities.
 * Assumes all ingredients belong to a single group/serving, with persons = -1 (unknown).
 */
export function parseIngredientsNoHeader(lines: Array<string>): Array<ingredientObject> {
    if (!lines.length) {
        return [];
    }

    const mid = Math.floor(lines.length / 2);

    const nameLines = lines.slice(0, mid);
    const quantityLines = lines.slice(mid);
    const result: ingredientObject[] = [];

    for (let i = 0; i < Math.min(nameLines.length, quantityLines.length); i++) {
        // Unit here is inside the quantity with a space as separator generally
        const [quantity, unit] = quantityLines[i].split(" ");
        const quantityPerPersons = new Array<ingredientQuantityPerPersons>({
            persons: -1,
            quantity: quantity
        });

        result.push({
            name: nameLines[i],
            unit: unit ?? "",
            quantityPerPersons: quantityPerPersons
        });
    }

    return result;
}
