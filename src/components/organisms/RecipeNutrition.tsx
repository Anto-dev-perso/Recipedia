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
 * - Read-only and edit modes support
 * - Empty state handling when no nutrition data available
 *
 * @example
 * ```typescript
 * // Read-only display
 * <RecipeNutrition
 *   nutrition={recipe.nutrition}
 *   mode="readOnly"
 * />
 *
 * // Edit mode
 * <RecipeNutrition
 *   nutrition={recipe.nutrition}
 *   mode="edit"
 *   onNutritionChange={(updatedNutrition) => setNutrition(updatedNutrition)}
 * />
 * ```
 */
import React, { useState } from 'react';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';
import NutritionTable from '@components/molecules/NutritionTable';
import NutritionEmptyState from '@components/molecules/NutritionEmptyState';

export type RecipeNutritionMode = 'readOnly' | 'edit' | 'add';

export interface RecipeNutritionProps {
  /** Current nutrition data (undefined when no nutrition available) */
  nutrition?: nutritionTableElement;
  /** Component mode for different interaction types */
  mode: RecipeNutritionMode;
  /** Callback fired when nutrition data changes in edit mode */
  onNutritionChange?: (nutrition: nutritionTableElement | undefined) => void;
  /** Test ID of parent for component testing */
  parentTestId: string;
}

export function RecipeNutrition({
  nutrition,
  mode,
  onNutritionChange,
  parentTestId,
}: RecipeNutritionProps) {
  const [editedNutrition, setEditedNutrition] = useState<nutritionTableElement | undefined>(
    nutrition
  );

  const testId = parentTestId + '::RecipeNutrition';
  const isEditing = mode === 'edit' || mode === 'add';
  const currentNutrition = isEditing ? editedNutrition : nutrition;

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

  const handleAddNutrition = () => {
    handleNutritionUpdate({});
  };

  if (!currentNutrition && mode === 'readOnly') {
    return null;
  }

  if (!currentNutrition && (mode === 'add' || mode === 'edit')) {
    return <NutritionEmptyState onAddNutrition={handleAddNutrition} parentTestId={testId} />;
  }

  if (!currentNutrition) return null;

  return (
    <NutritionTable
      nutrition={currentNutrition}
      isEditable={isEditing}
      onNutritionChange={handleNutritionUpdate}
      onRemoveNutrition={handleRemoveNutrition}
      showRemoveButton={mode === 'edit'}
      parentTestId={testId}
    />
  );
}

export default RecipeNutrition;
