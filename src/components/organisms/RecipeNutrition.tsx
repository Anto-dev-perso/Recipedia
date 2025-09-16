/**
 * RecipeNutrition - Modular nutrition facts component
 *
 * Displays comprehensive nutrition information using Material Design components.
 * Uses segmented buttons for switching between per 100g and per portion views.
 *
 * Key Features:
 * - Tab-based navigation for different measurement units
 * - Modular component architecture
 * - Material Design using react-native-paper
 * - Read-only, edit, add, and OCR modes support
 * - Empty state handling when no nutrition data available
 * - OCR integration for scanning nutrition facts from images
 *
 * @example
 * ```typescript
 * // Read-only display
 * <RecipeNutrition
 *   nutrition={recipe.nutrition}
 *   mode="readOnly"
 *   parentTestId="recipe"
 * />
 *
 * // Edit mode
 * <RecipeNutrition
 *   nutrition={recipe.nutrition}
 *   mode="edit"
 *   onNutritionChange={(updatedNutrition) => setNutrition(updatedNutrition)}
 *   parentTestId="recipe"
 * />
 *
 * // OCR mode
 * <RecipeNutrition
 *   nutrition={recipe.nutrition}
 *   mode="ocr"
 *   openModal={() => openNutritionOCRModal()}
 *   onNutritionChange={(updatedNutrition) => setNutrition(updatedNutrition)}
 *   parentTestId="recipe"
 * />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';
import NutritionTable from '@components/molecules/NutritionTable';
import NutritionEmptyState from '@components/molecules/NutritionEmptyState';
import { recipeStateType } from '@screens/Recipe';
import { recipeLogger } from '@utils/logger';

export interface RecipeNutritionProps {
  /** Current nutrition data (undefined when no nutrition available) */
  nutrition?: nutritionTableElement;
  /** Component mode for different interaction types */
  mode: recipeStateType;
  /** Callback fired when nutrition data changes in edit mode */
  onNutritionChange?: (nutrition: nutritionTableElement | undefined) => void;
  /** Function to open the OCR scanning modal (required when mode is 'ocr') */
  openModal?: () => void;
  /** Test ID of parent for component testing */
  parentTestId: string;
}

export function RecipeNutrition({
  nutrition,
  mode,
  onNutritionChange,
  openModal,
  parentTestId,
}: RecipeNutritionProps) {
  const [editedNutrition, setEditedNutrition] = useState<nutritionTableElement | undefined>(
    nutrition
  );

  const testId = parentTestId + '::RecipeNutrition';
  const isEditing = mode !== recipeStateType.readOnly;
  const currentNutrition = isEditing ? editedNutrition : nutrition;

  useEffect(() => {
    if (isEditing) {
      setEditedNutrition(nutrition);
    }
  }, [nutrition, isEditing]);

  const handleNutritionUpdate = (updates: Partial<nutritionTableElement>) => {
    if (!isEditing) return;

    const updated = currentNutrition
      ? { ...currentNutrition, ...updates }
      : {
          energyKcal: 0,
          energyKj: 0,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 0,
          sugars: 0,
          fiber: 0,
          protein: 0,
          salt: 0,
          portionWeight: 100,
          ...updates,
        };

    setEditedNutrition(updated);
    onNutritionChange?.(updated);
  };

  const handleRemoveNutrition = () => {
    setEditedNutrition(undefined);
    onNutritionChange?.(undefined);
  };

  const handleOCRModal = () => {
    if (mode === recipeStateType.addOCR) {
      openModal?.();
    } else {
      recipeLogger.warn('handleOCRModal called in wrong mode', mode);
    }
  };

  const handleAddNutrition = () => {
    handleNutritionUpdate({});
  };

  if (!currentNutrition && mode === recipeStateType.readOnly) {
    return null;
  }

  if (!currentNutrition && isEditing) {
    return (
      <NutritionEmptyState
        mode={mode === recipeStateType.addOCR ? 'ocr' : 'add'}
        onButtonPressed={mode === recipeStateType.addOCR ? handleOCRModal : handleAddNutrition}
        parentTestId={testId}
      />
    );
  }

  if (!currentNutrition) {
    return null;
  }

  return (
    <NutritionTable
      nutrition={currentNutrition}
      isEditable={isEditing}
      onNutritionChange={handleNutritionUpdate}
      onRemoveNutrition={handleRemoveNutrition}
      showRemoveButton={isEditing}
      parentTestId={testId}
    />
  );
}

export default RecipeNutrition;
