import { ingredientTableElement, tagTableElement } from '@customTypes/DatabaseElementTypes';

/**
 * Processes tags for validation by filtering exact database matches
 * Auto-adds exact matches via callback and returns only items that need validation
 *
 * @param tags - Array of tags to process
 * @param findSimilarTags - Function to find similar tags in database
 * @param onExactMatch - Callback to handle exact matches (auto-add them)
 * @returns Array of tags that need validation (non-exact matches)
 */
export function processTagsForValidation(
  tags: tagTableElement[],
  findSimilarTags: (name: string) => tagTableElement[],
  onExactMatch: (tag: tagTableElement) => void
): tagTableElement[] {
  const itemsNeedingValidation: tagTableElement[] = [];

  for (const tag of tags) {
    const similarTags = findSimilarTags(tag.name);
    const exactMatch = similarTags.find(
      dbTag => dbTag.name.toLowerCase() === tag.name.toLowerCase()
    );

    if (exactMatch) {
      onExactMatch(exactMatch);
    } else {
      itemsNeedingValidation.push(tag);
    }
  }

  return itemsNeedingValidation;
}

/**
 * Processes ingredients for validation by filtering exact database matches
 * Auto-adds exact matches (preserving OCR quantity/unit) via callback and returns only items that need validation
 *
 * @param ingredients - Array of ingredients to process
 * @param findSimilarIngredients - Function to find similar ingredients in database
 * @param onExactMatch - Callback to handle exact matches (auto-add them with merged quantity/unit)
 * @returns Array of ingredients that need validation (non-exact matches)
 */
export function processIngredientsForValidation(
  ingredients: ingredientTableElement[],
  findSimilarIngredients: (name: string) => ingredientTableElement[],
  onExactMatch: (ingredient: ingredientTableElement) => void
): ingredientTableElement[] {
  const itemsNeedingValidation: ingredientTableElement[] = [];

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
      onExactMatch(mergedIngredient);
    } else {
      itemsNeedingValidation.push(ingredient);
    }
  }

  return itemsNeedingValidation;
}
