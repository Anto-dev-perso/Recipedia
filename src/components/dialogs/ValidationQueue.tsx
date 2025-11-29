/**
 * ValidationQueue - Sequential validation component for tags OR ingredients
 *
 * Handles validation of multiple items of the same type one at a time, showing
 * similarity dialogs sequentially. Works with items from any source (OCR, manual
 * entry, bulk import, etc.) providing a consistent validation experience.
 *
 * Key Features:
 * - Sequential processing of single item type
 * - Similarity detection and resolution dialogs
 * - Duplicate prevention against existing items
 * - Item name prominence in dialogs
 * - Automatic progression through queue
 * - Callbacks for validated items
 *
 * Note: Only accepts tags OR ingredients, not both at the same time, since
 * the modal dialog blocks user interaction.
 *
 * @example
 * ```typescript
 * // For tags
 * <ValidationQueue
 *   type="Tag"
 *   items={ocrExtractedTags}
 *   onItemValidated={(tag) => setRecipeTags(prev => [...prev, tag])}
 *   onComplete={() => setTagQueue([])}
 *   existingItems={recipeTags}
 * />
 *
 * // For ingredients
 * <ValidationQueue
 *   type="Ingredient"
 *   items={ocrExtractedIngredients}
 *   onItemValidated={(ing) => setRecipeIngredients(prev => [...prev, ing])}
 *   onComplete={() => setIngredientQueue([])}
 *   existingItems={recipeIngredients}
 * />
 * ```
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ingredientTableElement, tagTableElement } from '@customTypes/DatabaseElementTypes';
import SimilarityDialog from './SimilarityDialog';
import { useRecipeDatabase } from '@context/RecipeDatabaseContext';

export type ValidationQueuePropsBase<T extends 'Tag' | 'Ingredient', ItemType> = {
  type: T;
  items: ItemType[];
  onValidated: (item: ItemType) => void;
  onDismissed?: (item: ItemType) => void;
};

export type TagValidationProps = ValidationQueuePropsBase<'Tag', tagTableElement>;
export type IngredientValidationProps = ValidationQueuePropsBase<
  'Ingredient',
  ingredientTableElement
>;

export type ValidationQueueProps = { testId: string; onComplete: () => void } & (
  | TagValidationProps
  | IngredientValidationProps
);

export function ValidationQueue({
  type,
  items,
  onValidated,
  onDismissed,
  onComplete,
  testId,
}: ValidationQueueProps) {
  const { findSimilarTags, findSimilarIngredients } = useRecipeDatabase();

  const [remainingItems, setRemainingItems] = useState(items);
  const [showDialog, setShowDialog] = useState(false);

  const currentItem = remainingItems[0];
  const testIdQueue = testId + '::ValidationQueue';

  useEffect(() => {
    setRemainingItems(items);
  }, [items]);

  const processCurrentItem = useCallback(() => {
    const itemName = currentItem.name;
    if (!itemName || itemName.trim().length === 0) {
      setShowDialog(false);
      setRemainingItems(prev => prev.slice(1));
      return;
    }

    setShowDialog(true);
  }, [currentItem]);

  useEffect(() => {
    if (remainingItems.length === 0) {
      onComplete();
      return;
    }

    processCurrentItem();
  }, [remainingItems, onComplete, processCurrentItem]);

  const moveToNext = () => {
    setShowDialog(false);
    setRemainingItems(prev => prev.slice(1));
  };

  const handleItemValidated = (item: tagTableElement | ingredientTableElement) => {
    if (type === 'Ingredient') {
      const originalIngredient = currentItem as ingredientTableElement;
      const validatedIngredient = item as ingredientTableElement;
      const mergedIngredient: ingredientTableElement = {
        ...validatedIngredient,
        quantity: originalIngredient?.quantity || validatedIngredient.quantity,
        unit: originalIngredient?.unit || validatedIngredient.unit,
      };
      onValidated(mergedIngredient);
    } else {
      onValidated(item);
    }
    moveToNext();
  };

  const handleDismiss = () => {
    if (type === 'Ingredient') {
      onDismissed?.(currentItem as ingredientTableElement);
    } else {
      onDismissed?.(currentItem as tagTableElement);
    }
    moveToNext();
  };

  if (remainingItems.length === 0 || !currentItem) {
    return null;
  }

  const itemName = currentItem.name;
  const similarItems =
    type === 'Tag' ? findSimilarTags(itemName) : findSimilarIngredients(itemName);
  const exactMatch = similarItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
  const similarItem = exactMatch || similarItems[0];

  return (
    <SimilarityDialog
      testId={testIdQueue + `::${type}`}
      isVisible={showDialog}
      onClose={moveToNext}
      item={
        type === 'Tag'
          ? {
              type: 'Tag',
              newItemName: itemName,
              similarItem: similarItem as tagTableElement,
              onConfirm: handleItemValidated,
              onUseExisting: handleItemValidated,
              onDismiss: handleDismiss,
            }
          : {
              type: 'Ingredient',
              newItemName: itemName,
              similarItem: similarItem as ingredientTableElement,
              onConfirm: handleItemValidated,
              onUseExisting: handleItemValidated,
              onDismiss: handleDismiss,
            }
      }
    />
  );
}

export default ValidationQueue;
