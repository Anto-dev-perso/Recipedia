import { ingredientTableElement, tagTableElement } from '@customTypes/DatabaseElementTypes';

/**
 * Processes tags for validation by filtering exact database matches
 * Returns exact matches and items that need validation separately
 *
 * @param tags - Array of tags to process
 * @param findSimilarTags - Function to find similar tags in database
 * @returns Object with exactMatches and needsValidation arrays
 */
export function processTagsForValidation(
  tags: tagTableElement[],
  findSimilarTags: (name: string) => tagTableElement[]
): {
  exactMatches: tagTableElement[];
  needsValidation: tagTableElement[];
} {
  const exactMatches: tagTableElement[] = [];
  const needsValidation: tagTableElement[] = [];

  for (const tag of tags) {
    const similarTags = findSimilarTags(tag.name);
    const exactMatch = similarTags.find(
      dbTag => dbTag.name.toLowerCase() === tag.name.toLowerCase()
    );

    if (exactMatch) {
      exactMatches.push(exactMatch);
    } else {
      needsValidation.push(tag);
    }
  }

  return { exactMatches, needsValidation };
}

/**
 * Processes ingredients for validation by filtering exact database matches
 * Returns exact matches (preserving OCR quantity/unit) and items that need validation separately
 *
 * @param ingredients - Array of ingredients to process
 * @param findSimilarIngredients - Function to find similar ingredients in database
 * @returns Object with exactMatches and needsValidation arrays
 */
export function processIngredientsForValidation(
  ingredients: ingredientTableElement[],
  findSimilarIngredients: (name: string) => ingredientTableElement[]
): {
  exactMatches: ingredientTableElement[];
  needsValidation: ingredientTableElement[];
} {
  const exactMatches: ingredientTableElement[] = [];
  const needsValidation: ingredientTableElement[] = [];

  for (const ingredient of ingredients) {
    const similarIngredients = findSimilarIngredients(ingredient.name);
    const exactMatch = similarIngredients.find(
      dbIng => dbIng.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (exactMatch) {
      const mergedIngredient: ingredientTableElement = {
        ...exactMatch,
        quantity: ingredient.quantity || exactMatch.quantity,
        unit: ingredient.unit || exactMatch.unit,
      };
      exactMatches.push(mergedIngredient);
    } else {
      needsValidation.push(ingredient);
    }
  }

  return { exactMatches, needsValidation };
}
