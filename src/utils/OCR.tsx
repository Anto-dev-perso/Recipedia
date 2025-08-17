/**
 * OCR (Optical Character Recognition) - Advanced text extraction from recipe images
 * 
 * This module provides sophisticated OCR capabilities specifically designed for recipe recognition.
 * It uses ML Kit text recognition to extract and parse various recipe components from images,
 * including ingredients with quantities, preparation steps, cooking times, and serving sizes.
 * 
 * Key Features:
 * - Structured ingredient parsing with automatic quantity scaling
 * - Multi-person serving detection and conversion
 * - Step-by-step preparation instruction extraction
 * - Smart text parsing with error correction
 * - Support for various recipe formats and layouts
 * 
 * @example
 * ```typescript
 * // Extract recipe title from image
 * const title = await recognizeText(imageUri, recipeColumnsNames.title);
 * 
 * // Extract structured ingredients
 * const ingredients = await recognizeText(imageUri, recipeColumnsNames.ingredients);
 * 
 * // Extract complete field data
 * const result = await extractFieldFromImage(uri, recipeColumnsNames.ingredients, currentState);
 * ```
 */

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
import {scaleQuantityForPersons} from "@utils/Quantity";
import {isArrayOfNumber, isArrayOfString, isArrayOfType, isNumber, isString} from "@utils/TypeCheckingFunctions";
import {defaultValueNumber} from "@utils/Constants";
import {ocrLogger} from '@utils/logger';

/** Type representing person count and cooking time extracted from OCR */
export type personAndTimeObject = { person: number, time: number };
export const keysPersonsAndTimeObject = Object.keys({
    person: 0,
    time: 0,
} as personAndTimeObject) as (keyof personAndTimeObject)[];

/** Type representing a tag extracted from OCR */
export type tagObject = { id?: string, name: string };
export const keysTagObject = Object.keys({
    name: "",
} as tagObject) as (keyof tagObject)[];

/** Type representing ingredient quantity for a specific number of persons */
export type ingredientQuantityPerPersons = {
    persons: number,
    quantity: string,
}

/** Type representing an ingredient with multiple quantity specifications */
export type ingredientObject = { name: string, unit: string, quantityPerPersons: Array<ingredientQuantityPerPersons> };
export const keysIngredientObject = Object.keys({
    name: "",
    unit: "",
    quantityPerPersons: []
} as ingredientObject) as (keyof ingredientObject)[];

/** Function type for handling OCR warnings */
export type WarningHandler = (message: string) => void;

/**
 * Recognizes and extracts text from an image based on the specified recipe field type
 * 
 * Uses ML Kit text recognition to extract text from images and processes it according
 * to the expected field type (title, ingredients, preparation steps, etc.).
 * 
 * @param imageUri - URI path to the image to process
 * @param fieldName - Type of recipe field to extract (title, ingredients, etc.)
 * @returns Promise resolving to extracted and processed data specific to field type
 * 
 * @example
 * ```typescript
 * // Extract title as string
 * const title = await recognizeText(imageUri, recipeColumnsNames.title);
 * 
 * // Extract ingredients as structured objects
 * const ingredients = await recognizeText(imageUri, recipeColumnsNames.ingredients);
 * 
 * // Extract preparation steps as array
 * const steps = await recognizeText(imageUri, recipeColumnsNames.preparation);
 * ```
 */
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
                ocrLogger.error('Image field should not be processed through OCR', { fieldName });
                return "";
            default:
                ocrLogger.error('Unrecognized field type for OCR processing', { fieldName });
                return "";
        }
    } catch (e) {
        ocrLogger.error('OCR text recognition failed', { imageUri, fieldName, error: e });
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

    ocrLogger.error('Unable to convert OCR text to number', { elementsToConvert });
    return defaultValueNumber;
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
 * Transforms OCR results into structured ingredient objects
 * 
 * Parses complex ingredient tables that include headers (ingredient names with units)
 * followed by data rows with person counts and quantities. Handles OCR inconsistencies
 * by detecting and correcting misplaced elements and merging multi-line ingredients.
 * 
 * Expected format:
 * - Header: ingredient names with units in parentheses
 * - Data rows: person count (e.g., "2p") followed by quantities
 * 
 * @param ocr - ML Kit text recognition result
 * @returns Array of structured ingredient objects with quantities per person count
 * 
 * @example
 * ```typescript
 * // OCR text like:
 * // "Flour (cups)  Sugar (tsp)  Salt (pinch)"
 * // "2p"
 * // "2 1 1"
 * // "4p" 
 * // "4 2 2"
 * // 
 * // Returns:
 * // [
 * //   { name: "Flour", unit: "cups", quantityPerPersons: [{persons: 2, quantity: "2"}, {persons: 4, quantity: "4"}] },
 * //   { name: "Sugar", unit: "tsp", quantityPerPersons: [{persons: 2, quantity: "1"}, {persons: 4, quantity: "2"}] }
 * // ]
 * ```
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
        ocrLogger.debug('No ingredient header found in OCR data');
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
                ocrLogger.warn('Cannot merge ingredients - breaking loop', { 
                    ingredient1: currentIngredient.name, 
                    ingredient2: previousIngredient.name 
                });
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

/**
 * Extracts and processes a specific recipe field from an image
 * 
 * High-level function that combines OCR text recognition with field-specific processing
 * and validation. Handles automatic quantity scaling, state merging, and error reporting.
 * 
 * @param uri - URI path to the image to process
 * @param field - Specific recipe field to extract
 * @param currentState - Current recipe state for merging and scaling
 * @param onWarn - Optional warning handler for processing issues
 * @returns Promise resolving to partial recipe object with extracted field
 * 
 * @example
 * ```typescript
 * const currentState = {
 *   recipePreparation: [],
 *   recipePersons: 4,
 *   recipeTags: [],
 *   recipeIngredients: []
 * };
 * 
 * const result = await extractFieldFromImage(
 *   imageUri, 
 *   recipeColumnsNames.ingredients, 
 *   currentState,
 *   (warning) => console.warn(warning)
 * );
 * 
 * if (result.recipeIngredients) {
 *   // Ingredients extracted and scaled to current serving size
 *   console.log(`Extracted ${result.recipeIngredients.length} ingredients`);
 * }
 * ```
 */
export async function extractFieldFromImage(uri: string, field: recipeColumnsNames, currentState: {
                                                recipePreparation: string[];
                                                recipePersons: number;
                                                recipeTags: tagTableElement[];
                                                recipeIngredients: any[];
                                            }, onWarn: WarningHandler = (msg) => ocrLogger.warn('OCR extraction warning', { message: msg })
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
                let ocrPersonsCount: number;
                let targetPersonsCount = currentState.recipePersons;

                if (currentState.recipePersons > 0) {
                    const foundPersonIndex = (ocrResult[0] as ingredientObject).quantityPerPersons.findIndex(p => (Number(p.persons) === currentState.recipePersons));
                    if (foundPersonIndex !== -1) {
                        idQuantityToSearch = foundPersonIndex;
                        ocrPersonsCount = currentState.recipePersons;
                    } else {
                        idQuantityToSearch = 0;
                        ocrPersonsCount = (ocrResult[idQuantityToSearch] as ingredientObject).quantityPerPersons[idQuantityToSearch].persons;
                        warn(`Couldn't find exact match for persons (${currentState.recipePersons}) in ingredient. Using ${ocrPersonsCount} and scaling to ${targetPersonsCount}.`);
                    }
                } else {
                    idQuantityToSearch = 0;
                    ocrPersonsCount = (ocrResult[idQuantityToSearch] as ingredientObject).quantityPerPersons[idQuantityToSearch].persons;
                    targetPersonsCount = ocrPersonsCount;
                    warn(
                        `Couldn't find exact match for persons in ingredient. Using first available : ${ocrPersonsCount}.`
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
                                quantity: scaleQuantityForPersons(ingredient.quantityPerPersons[idQuantityToSearch].quantity, ocrPersonsCount, targetPersonsCount)
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
            ocrLogger.error('Unrecognized field in extractFieldFromImage', { field });
            return {};
    }
}

/**
 * Parses ingredients from OCR lines when no structured header is detected
 * 
 * Fallback parsing method for simpler ingredient formats. Splits the input lines
 * assuming the first half contains ingredient names and the second half contains
 * corresponding quantities with units.
 * 
 * @param lines - Array of OCR text lines to parse
 * @returns Array of ingredient objects with person count set to -1 (unknown)
 * 
 * @example
 * ```typescript
 * const lines = [
 *   "Flour", "Sugar", "Salt",      // First half: names
 *   "2 cups", "1 tsp", "1 pinch"   // Second half: quantities
 * ];
 * 
 * const ingredients = parseIngredientsNoHeader(lines);
 * // Returns:
 * // [
 * //   { name: "Flour", unit: "cups", quantityPerPersons: [{persons: -1, quantity: "2"}] },
 * //   { name: "Sugar", unit: "tsp", quantityPerPersons: [{persons: -1, quantity: "1"}] }
 * // ]
 * ```
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
