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
  preparationStepElement,
  recipeColumnsNames,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import {
  FUSE_THRESHOLD,
  nutritionObject,
  NutritionTerms,
  OcrKeys,
  per100gKey,
  perPortionKey,
} from '@customTypes/OCRTypes';
import {
  allNonDigitCharacter,
  endsWithLetters,
  findAllNumbers,
  hasLettersInMiddle,
  letterRegExp,
  numberAtFirstIndex as numberAtFirstIndex,
  onlyDigitsDotsSpaces,
  replaceAllBackToLine,
  startsWithLetter,
} from '@styles/typography';

import TextRecognition, {
  TextBlock,
  TextRecognitionResult,
} from '@react-native-ml-kit/text-recognition';
import { scaleQuantityForPersons } from '@utils/Quantity';
import { isArrayOfNumber, isArrayOfType, isNumber, isString } from '@utils/TypeCheckingFunctions';
import { defaultValueNumber } from '@utils/Constants';
import { ocrLogger } from '@utils/logger';
import i18n from '@utils/i18n';
import Fuse from 'fuse.js/dist/fuse.js';

/** Type representing person count and cooking time extracted from OCR */
export type personAndTimeObject = { person: number; time: number };
export const keysPersonsAndTimeObject = Object.keys({
  person: 0,
  time: 0,
} as personAndTimeObject) as (keyof personAndTimeObject)[];

/** Type representing a tag extracted from OCR */
export type tagObject = { id?: string; name: string };
export const keysTagObject = Object.keys({
  name: '',
} as tagObject) as (keyof tagObject)[];

/** Type representing ingredient quantity for a specific number of persons */
export type ingredientQuantityPerPersons = {
  persons: number;
  quantity: string;
};

/** Type representing an ingredient with multiple quantity specifications */
export type ingredientObject = {
  name: string;
  unit: string;
  quantityPerPersons: Array<ingredientQuantityPerPersons>;
};
export const keysIngredientObject = Object.keys({
  name: '',
  unit: '',
  quantityPerPersons: [],
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
      case recipeColumnsNames.nutrition:
        return transformOCRInNutrition(ocr);
      case recipeColumnsNames.image:
        ocrLogger.error('Image field should not be processed through OCR', { fieldName });
        return '';
      default:
        ocrLogger.error('Unrecognized field type for OCR processing', { fieldName });
        return '';
    }
  } catch (e) {
    ocrLogger.error('OCR text recognition failed', { imageUri, fieldName, error: e });
    return '';
  }
}

function convertBlockOnArrayOfString(ocrBloc: Array<TextBlock>): Array<string> {
  return ocrBloc.map(block => block.lines.map(line => line.text)).flat();
}

// TODO add an option to convert to uppercase ?
function tranformOCRInOneString(ocr: TextRecognitionResult): string {
  // Replace all \n by spaces
  return ocr.text.replace(replaceAllBackToLine, ' ');
}

function tranformOCRInTags(ocr: TextRecognitionResult): Array<tagTableElement> {
  return ocr.blocks
    .map(block => block.lines.map(line => line.text).join(' '))
    .join(' ')
    .split(' ')
    .filter(tag => tag.length > 0)
    .map(tag => {
      return {
        name: tag,
      } as tagTableElement;
    });
}

function retrieveNumbersFromArrayOfStrings(str: Array<string>): Array<number> {
  return str.map(element => retrieveNumberFromString(element));
}

function retrieveNumberFromString(str: string): number {
  return Number(str.split(' ')[0].replace(allNonDigitCharacter, ''));
}

function extractingNumberOrArray(ocr: Array<string>) {
  const result = retrieveNumbersFromArrayOfStrings(ocr);
  return result.length > 1 ? result : result[0];
}

function tranformOCRInOneNumber(
  ocr: TextRecognitionResult
): number | Array<number> | Array<personAndTimeObject> {
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
          time: retrieveNumberFromString(timeArray[i]),
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

function tranformOCRInPreparation(ocr: TextRecognitionResult): Array<preparationStepElement> {
  const steps: Array<{ step: preparationStepElement; order: number }> = [];
  let currentStep: preparationStepElement | null = null;
  let currentOrder = 0;
  let waitingForTitle = false;

  for (const block of ocr.blocks) {
    const text = block.text.trim();
    if (!text) {
      continue;
    }

    const stepNumber = extractStepNumber(text);

    if (stepNumber && isValidStepProgression(stepNumber, currentOrder)) {
      // Save previous step before starting new one
      if (currentStep) {
        steps.push({ step: currentStep, order: currentOrder });
      }

      currentOrder = stepNumber;

      if (isNumberOnlyBlock(text)) {
        // Number-only block - wait for title in next block
        currentStep = { title: '', description: '' };
        waitingForTitle = true;
      } else {
        // Number + title/content in same block
        const { title, description } = parseStepContent(text);
        currentStep = { title, description };
        waitingForTitle = false;
      }
    } else if (waitingForTitle && hasTextContent(text)) {
      // This block contains the title for the current step
      if (currentStep) {
        currentStep.title = formatTitle(text);
        waitingForTitle = false;
      }
    } else if (currentStep && hasTextContent(text)) {
      // Add content to current step description
      const separator = currentStep.description ? '\n' : '';
      currentStep.description += separator + text;
    }
  }

  // Save final step
  if (currentStep) {
    steps.push({ step: currentStep, order: currentOrder });
  }

  return steps.sort((a, b) => a.order - b.order).map(item => item.step);
}

function extractStepNumber(text: string): number | null {
  if (!numberAtFirstIndex.test(text)) {
    return null;
  }
  return retrieveNumberInStr(text);
}

function isValidStepProgression(stepNumber: number, currentOrder: number): boolean {
  if (currentOrder === 0) {
    return true;
  }
  if (currentOrder <= 2) {
    return stepNumber <= 4 * currentOrder;
  }
  return stepNumber <= 2 * currentOrder;
}

function parseStepContent(text: string): { title: string; description: string } {
  const lines = text.split('\n');
  const firstLine = lines[0];
  const remainingLines = lines.slice(1);

  // Try to extract title from first line (pattern: "1. TITLE" or "1 TITLE")
  const titleMatch = firstLine.match(/^\d+\.?\s*(.+)$/);

  if (titleMatch && remainingLines.length === 0) {
    // Only number + title, no description in this block
    return {
      title: formatTitle(titleMatch[1]),
      description: '',
    };
  } else if (titleMatch && remainingLines.length > 0) {
    // Number + title + description in same block
    return {
      title: formatTitle(titleMatch[1]),
      description: formatDescription(remainingLines.join('\n')),
    };
  } else {
    // Treat entire text as title (for cases like standalone numbers followed by title blocks)
    return {
      title: formatTitle(text),
      description: '',
    };
  }
}

function formatTitle(title: string): string {
  return convertToLowerCaseExceptFirstLetter(title.trim());
}

function formatDescription(description: string): string {
  // Apply minimal formatting to preserve structure while normalizing case
  return description.replace(
    /^(\W*)([A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ])/,
    (match, prefix, firstLetter) => prefix + firstLetter.toLowerCase()
  );
}

function hasTextContent(text: string): boolean {
  return letterRegExp.test(text);
}

function isNumberOnlyBlock(text: string): boolean {
  return numberAtFirstIndex.test(text) && !letterRegExp.test(text);
}

type groupType = { person: string; quantity: Array<string> };

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
  const lines: string[] = [];
  const ocrLines = ocr.blocks.flatMap(block => block.lines);
  if (ocrLines[0]?.text.toLowerCase().includes('box')) ocrLines.shift();

  for (const line of ocrLines) {
    const trimmed = line.text.trim();
    if (!trimmed) continue;
    if (trimmed.includes('pers.')) {
      lines[lines.length - 1] += 'p';
    } else {
      lines.push(trimmed);
    }
  }

  const headerBoundary = lines.findIndex(line => line.endsWith('p'));
  if (headerBoundary === -1) {
    ocrLogger.debug('No ingredient header found in OCR data');
    return parseIngredientsNoHeader(lines);
  }
  const ingredientsNames = lines.slice(0, headerBoundary);
  const dataTokens = lines.slice(headerBoundary);

  const ingredientsOCR = parseIngredientsNamesAndUnits(ingredientsNames);

  const groups = getIngredientsGroups(dataTokens, ingredientsOCR.length);

  function areIngredientsMergeable(indexFirstSuspicious: number): boolean {
    if (indexFirstSuspicious == firstGroup.quantity.length) {
      return false;
    }
    for (
      let indexNextIngredient = indexFirstSuspicious + 1;
      indexNextIngredient < firstGroup.quantity.length &&
      indexNextIngredient < ingredientsOCR.length;
      indexNextIngredient++
    ) {
      if (
        isIngredientSuspicious(
          firstGroup.quantity[indexNextIngredient],
          ingredientsOCR[indexNextIngredient].unit
        )
      ) {
        return false;
      }
    }
    return true;
  }

  function mergeIngredients(indexFirstSuspicious: number) {
    const currentIngredient = ingredientsOCR[indexFirstSuspicious];
    const nextIngredient = ingredientsOCR[indexFirstSuspicious + 1];

    if (nextIngredient) {
      currentIngredient.name += ' ' + nextIngredient.name;
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
          ingredient1: ingredientsOCR[indexFirstSuspicious]?.name || 'unknown',
          ingredient2: ingredientsOCR[indexFirstSuspicious + 1]?.name || 'unknown',
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
        quantity: g.quantity[ingIdx] ?? '',
      });
    }
  });

  return ingredientsOCR;
}

function parseIngredientsNamesAndUnits(namesAndUnits: Array<string>): Array<ingredientObject> {
  return namesAndUnits.map(nameAndUnit => {
    const unitMatch = nameAndUnit.match(/\((.*?)\)/);
    return {
      name: unitMatch ? nameAndUnit.replace(unitMatch[0], '').trim() : nameAndUnit,
      unit: unitMatch ? unitMatch[1] : '',
      quantityPerPersons: [],
    };
  });
}

function getIngredientsGroups(tokens: Array<string>, nIngredients: number): Array<groupType> {
  const groups = new Array<groupType>();
  let group: groupType = { person: '', quantity: new Array<string>() };
  for (const token of tokens) {
    if (token.match(/\d+\s*p\s*$/i)) {
      if (group.person.length > 0) {
        while (group.quantity.length < nIngredients) {
          group.quantity.push('');
        }
        groups.push(group);
        group = { person: '', quantity: new Array<string>() };
      }
      group.person = token;
    } else {
      if (token.includes(' ')) {
        const tokenSplit = token.split(' ');
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
  const num = parseFloat(quantity.replace(/[^\d.]/g, ''));
  return unit === '' && num > 10;
}

function isSuspiciousGroup(group: groupType, ingredients: Array<ingredientObject>): number {
  for (let i = 0; i < ingredients.length; i++) {
    const quantityStr = group.quantity[i] || '';
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
  const workingStr = firstLetterIndex != -1 ? str.slice(0, firstLetterIndex) : str;

  const allNum = workingStr.match(findAllNumbers);
  if (allNum) {
    if (allNum.length < 1) {
      if (workingStr.includes('.')) {
        return Number(allNum[0] + '.' + allNum[1]);
      }
      if (workingStr.includes(',')) {
        return Number(allNum[0] + ',' + allNum[1]);
      }
    }
    return Number(allNum[0]);
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
export async function extractFieldFromImage(
  uri: string,
  field: recipeColumnsNames,
  currentState: {
    recipePreparation: preparationStepElement[];
    recipePersons: number;
    recipeTags: tagTableElement[];
    recipeIngredients: ingredientTableElement[];
  },
  onWarn: WarningHandler = msg => ocrLogger.warn('OCR extraction warning', { message: msg })
): Promise<
  Partial<{
    recipeImage: string;
    recipeTitle: string;
    recipeDescription: string;
    recipeTags: Array<tagTableElement>;
    recipePreparation: preparationStepElement[];
    recipePersons: number;
    recipeTime: number;
    recipeIngredients: ingredientTableElement[];
    recipeNutrition: nutritionObject;
  }>
> {
  if (field === recipeColumnsNames.image) {
    return { recipeImage: uri };
  }

  const ocrResult = await recognizeText(uri, field);
  const warn = (msg: string) =>
    onWarn(msg + ` {uri: ${uri},field: ${field},ocrResult: ${ocrResult} }`);
  // TODO to implement OCR for tags ?
  switch (field) {
    case recipeColumnsNames.title:
      if (isString(ocrResult)) {
        return { recipeTitle: ocrResult as string };
      } else {
        warn('Expected string for title');
        return {};
      }
    case recipeColumnsNames.description:
      if (isString(ocrResult)) {
        return { recipeDescription: ocrResult as string };
      } else {
        warn('Expected string for description');
        return {};
      }
    case recipeColumnsNames.preparation:
      if (Array.isArray(ocrResult) && ocrResult.length > 0) {
        return {
          recipePreparation: [
            ...currentState.recipePreparation,
            ...(ocrResult as preparationStepElement[]),
          ],
        };
      } else {
        warn('Expected non empty array of preparation steps for preparation');
        return {};
      }
    case recipeColumnsNames.persons:
    case recipeColumnsNames.time:
      if (isNumber(ocrResult)) {
        return field === recipeColumnsNames.persons
          ? { recipePersons: ocrResult as number }
          : { recipeTime: ocrResult as number };
      }
      if (Array.isArray(ocrResult) && ocrResult.length > 0) {
        if (isArrayOfNumber(ocrResult)) {
          return field === recipeColumnsNames.persons
            ? { recipePersons: ocrResult[0] as number }
            : { recipeTime: ocrResult[0] as number };
        } else if (isArrayOfType(ocrResult, keysPersonsAndTimeObject) && ocrResult.length > 0) {
          const valueToTake = ocrResult[0] as personAndTimeObject;
          return {
            recipePersons: valueToTake.person as number,
            recipeTime: valueToTake.time as number,
          };
        }
      }
      warn('Could not parse persons/time field');
      return {};
    case recipeColumnsNames.ingredients:
      if (
        Array.isArray(ocrResult) &&
        ocrResult.length > 0 &&
        isArrayOfType(ocrResult, keysIngredientObject)
      ) {
        let idQuantityToSearch: number;
        let ocrPersonsCount: number;
        let targetPersonsCount = currentState.recipePersons;

        if (currentState.recipePersons > 0) {
          const foundPersonIndex = (ocrResult[0] as ingredientObject).quantityPerPersons.findIndex(
            p => Number(p.persons) === currentState.recipePersons
          );
          if (foundPersonIndex !== -1) {
            idQuantityToSearch = foundPersonIndex;
            ocrPersonsCount = currentState.recipePersons;
          } else {
            idQuantityToSearch = 0;
            ocrPersonsCount = (ocrResult[idQuantityToSearch] as ingredientObject)
              .quantityPerPersons[idQuantityToSearch].persons;
            warn(
              `Couldn't find exact match for persons (${currentState.recipePersons}) in ingredient. Using ${ocrPersonsCount} and scaling to ${targetPersonsCount}.`
            );
          }
        } else {
          idQuantityToSearch = 0;
          ocrPersonsCount = (ocrResult[idQuantityToSearch] as ingredientObject).quantityPerPersons[
            idQuantityToSearch
          ].persons;
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
                quantity: scaleQuantityForPersons(
                  ingredient.quantityPerPersons[idQuantityToSearch].quantity,
                  ocrPersonsCount,
                  targetPersonsCount
                ),
              } as ingredientTableElement;
            }),
          ],
        };
      }
      warn('Expected non empty array of ingredient objects');
      return {};
    case recipeColumnsNames.tags:
      if (
        Array.isArray(ocrResult) &&
        ocrResult.length > 0 &&
        isArrayOfType<tagTableElement>(ocrResult, keysTagObject)
      ) {
        return {
          recipeTags: [...currentState.recipeTags, ...(ocrResult as tagTableElement[])],
        };
      } else {
        warn('Expected non empty array of strings for tags');
        return {};
      }
    case recipeColumnsNames.nutrition:
      if (ocrResult && typeof ocrResult === 'object' && !Array.isArray(ocrResult)) {
        return {
          recipeNutrition: ocrResult as nutritionObject,
        };
      } else {
        warn('Expected nutrition object for nutrition field');
        return {};
      }
    default:
      ocrLogger.error('Unrecognized field in extractFieldFromImage', { field });
      return {};
  }
}

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
    const [quantity, unit] = quantityLines[i].split(' ');
    const quantityPerPersons = new Array<ingredientQuantityPerPersons>({
      persons: -1,
      quantity: quantity,
    });

    result.push({
      name: nameLines[i],
      unit: unit ?? '',
      quantityPerPersons: quantityPerPersons,
    });
  }

  return result;
}

function parseNutritionValue(ocrText: string): number | undefined {
  const MAX_NUTRITION_VALUE = 10000;
  const DECIMAL_PRECISION = 100;

  let cleanedText = ocrText.trim();
  cleanedText = cleanedText.replace(/\([^)]*\)/g, '');
  cleanedText = cleanedText.replace(/\n/g, ' ');
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  cleanedText = cleanedText.replace(/^I(\d)/g, '1$1');

  if (startsWithLetter.test(cleanedText) || hasLettersInMiddle.test(cleanedText)) {
    return undefined;
  }

  let numericPart = cleanedText;
  if (endsWithLetters.test(cleanedText)) {
    numericPart = cleanedText.replace(endsWithLetters, '').trim();
  } else if (cleanedText.length > 1) {
    numericPart = cleanedText.substring(0, cleanedText.length - 1);
  } else {
    return undefined;
  }

  const normalizedDecimal = numericPart.replace(',', '.');

  if (!onlyDigitsDotsSpaces.test(normalizedDecimal)) {
    return undefined;
  }

  const parsedNumber = parseFloat(normalizedDecimal);
  if (isNaN(parsedNumber) || parsedNumber < 0 || parsedNumber > MAX_NUTRITION_VALUE) {
    return undefined;
  }

  return Math.round(parsedNumber * DECIMAL_PRECISION) / DECIMAL_PRECISION;
}

function getNutritionTermsForLanguage(language: string) {
  try {
    const t = i18n.getFixedT(language, 'translation', 'recipe.nutrition.ocr');

    const result = t('', { returnObjects: true });
    if (result && typeof result === 'object') {
      return result;
    }
  } catch (error) {
    ocrLogger.error('i18n nutrition terms failed', { error });
    return undefined;
  }
}

function findAndMergePer100gLines(lines: string[], nutritionTerms: NutritionTerms): number {
  const per100gTerms = nutritionTerms[per100gKey];
  const per100gFuse = new Fuse(per100gTerms, {
    threshold: FUSE_THRESHOLD,
  });

  for (let i = 0; i < lines.length; i++) {
    if (per100gFuse.search(lines[i].toLowerCase()).length > 0) {
      // Found a match, now check for contiguous matches to merge
      let endIndex = i;

      // Look for consecutive lines that might be part of the same per100g term
      while (endIndex + 1 < lines.length) {
        const currentMerged = lines.slice(i, endIndex + 2).join(' ');
        if (per100gFuse.search(currentMerged.toLowerCase()).length > 0) {
          endIndex++;
        } else {
          break;
        }
      }

      // If we found consecutive matches, merge them
      if (endIndex > i) {
        const mergedLine = lines.slice(i, endIndex + 1).join(' ');
        lines.splice(i, endIndex - i + 1, mergedLine);
      }

      return i;
    }
  }

  return -1;
}

function createFuseObjects(nutritionTerms: NutritionTerms): Record<OcrKeys, Fuse<string>> {
  const fuseOfNutritionTerms = {} as Record<OcrKeys, Fuse<string>>;

  for (const [termKey, termValue] of Object.entries(nutritionTerms)) {
    if (termKey !== per100gKey && termKey !== perPortionKey) {
      fuseOfNutritionTerms[termKey as OcrKeys] = new Fuse(termValue, {
        threshold: FUSE_THRESHOLD,
      });
    }
  }

  return fuseOfNutritionTerms;
}

function filterNutritionLabels(
  lines: string[],
  per100gIndex: number,
  fuseOfNutritionTerms: Record<OcrKeys, Fuse<string>>
): string[] {
  const linesToSearch = lines.slice(0, per100gIndex + 1);

  const filteredLines = linesToSearch.filter(item => {
    for (const [key, fuse] of Object.entries(fuseOfNutritionTerms)) {
      if (
        key !== per100gKey &&
        key !== perPortionKey &&
        fuse.search(item.toLowerCase()).length > 0
      ) {
        return true;
      }
    }
    return false;
  });

  return duplicateEnergyLabelIfNeeded(filteredLines, fuseOfNutritionTerms);
}

function extractNutritionValues(
  lines: string[],
  per100gIndex: number,
  nutritionTerms: NutritionTerms
): string[] {
  const linesAfterPer100g = lines.slice(per100gIndex + 1);

  // Look for "Per portion" separator to detect two-column format
  const perPortionTerms = nutritionTerms['perPortion'];
  const perPortionFuse = new Fuse(perPortionTerms, {
    threshold: FUSE_THRESHOLD,
  });

  const perPortionIndex = linesAfterPer100g.findIndex(line => {
    return perPortionFuse.search(line.toLowerCase()).length > 0;
  });

  if (perPortionIndex !== -1) {
    return linesAfterPer100g.slice(0, perPortionIndex);
  } else {
    return linesAfterPer100g;
  }
}

function duplicateEnergyLabelIfNeeded(
  nutritionLabels: string[],
  fuseOfNutritionTerms: Record<OcrKeys, Fuse<string>>
): string[] {
  const labelsWithPossibleDuplicate = [...nutritionLabels];
  const energyFuse = fuseOfNutritionTerms['energyKcal'];

  let energyLabelCount = 0;
  let firstEnergyIndex = -1;

  for (let i = 0; i < labelsWithPossibleDuplicate.length; i++) {
    if (energyFuse.search(labelsWithPossibleDuplicate[i].toLowerCase()).length > 0) {
      energyLabelCount++;
      firstEnergyIndex = i;
    }
  }

  if (energyLabelCount === 1) {
    const duplicatedEnergyLabel = labelsWithPossibleDuplicate[firstEnergyIndex];
    labelsWithPossibleDuplicate.splice(firstEnergyIndex + 1, 0, duplicatedEnergyLabel);
  }

  return labelsWithPossibleDuplicate;
}

function parseNutritionLabelsAndValues(
  nutritionLabels: string[],
  nutritionValues: string[],
  fuseOfNutritionTerms: Record<OcrKeys, Fuse<string>>
): nutritionObject {
  const parsedNutritionObject: nutritionObject = {};

  const energyCalKey: OcrKeys = 'energyKcal';
  const energyJoulKey: OcrKeys = 'energyKj';

  for (let i = 0; i < nutritionLabels.length; i++) {
    const label = nutritionLabels[i].toLowerCase();
    const value = nutritionValues[i]?.toLowerCase() || '';

    let labelKey: OcrKeys | undefined;
    // Normal label matching
    for (const [key, fuse] of Object.entries(fuseOfNutritionTerms)) {
      if (fuse.search(label).length > 0) {
        labelKey = key as OcrKeys;
        break;
      }
    }

    if (!labelKey) {
      ocrLogger.info(`Label ${label} not found in nutrition terms`);
      continue;
    }

    const valueParsed = parseNutritionValue(value);
    if (!valueParsed) {
      ocrLogger.info(`Value ${value} could not be converted to number`);
      continue;
    }

    if (labelKey !== energyCalKey && labelKey !== energyJoulKey) {
      parsedNutritionObject[labelKey as keyof nutritionObject] = valueParsed;
    } else {
      if (parsedNutritionObject[energyCalKey]) {
        if (valueParsed < parsedNutritionObject[energyCalKey]) {
          parsedNutritionObject[energyJoulKey] = parsedNutritionObject[energyCalKey];
          parsedNutritionObject[energyCalKey] = valueParsed;
        } else {
          parsedNutritionObject[energyJoulKey] = valueParsed;
        }
      } else if (parsedNutritionObject[energyJoulKey]) {
        if (valueParsed > parsedNutritionObject[energyJoulKey]) {
          parsedNutritionObject[energyCalKey] = parsedNutritionObject[energyJoulKey];
          parsedNutritionObject[energyJoulKey] = valueParsed;
        } else {
          parsedNutritionObject[energyCalKey] = valueParsed;
        }
      } else {
        parsedNutritionObject[valueParsed < 1000 ? energyCalKey : energyJoulKey] = valueParsed;
      }
    }
  }

  return parsedNutritionObject;
}

function transformOCRInNutrition(ocr: TextRecognitionResult): nutritionObject {
  const originalLines = convertBlockOnArrayOfString(ocr.blocks);

  const nutritionTerms = getNutritionTermsForLanguage(i18n.language);
  if (!nutritionTerms) {
    return {};
  }

  const nutritionSearches = createFuseObjects(nutritionTerms as NutritionTerms);
  const per100gIndex = findAndMergePer100gLines(originalLines, nutritionTerms as NutritionTerms);

  if (per100gIndex === -1) {
    return {};
  }

  const extractedLabels = filterNutritionLabels(originalLines, per100gIndex, nutritionSearches);
  const extractedValues = extractNutritionValues(
    originalLines,
    per100gIndex,
    nutritionTerms as NutritionTerms
  );

  if (extractedValues.length < extractedLabels.length) {
    return {};
  }
  const matchingValues = extractedValues.slice(0, extractedLabels.length);

  return parseNutritionLabelsAndValues(extractedLabels, matchingValues, nutritionSearches);
}
