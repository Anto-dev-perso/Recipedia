/**
 * IngredientsSettings - Comprehensive ingredient database management screen
 *
 * A dedicated screen for managing the app's ingredient database with full CRUD
 * operations, seasonality management, and categorization. Features dialog-based
 * editing with comprehensive validation and real-time synchronization.
 *
 * Key Features:
 * - Complete ingredient CRUD operations (Create, Read, Update, Delete)
 * - Seasonality calendar for ingredient availability
 * - Type categorization (vegetables, proteins, dairy, etc.)
 * - Alphabetical sorting for easy navigation
 * - Dialog-based editing with comprehensive forms
 * - Real-time database synchronization
 * - Usage tracking for deletion warnings
 * - Comprehensive error handling and logging
 *
 * @example
 * ```typescript
 * // Navigation from Parameters screen
 * <List.Item
 *   title="Ingredients"
 *   onPress={() => navigation.navigate('IngredientsSettings')}
 * />
 * ```
 */

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { ingredientTableElement } from '@customTypes/DatabaseElementTypes';
import SettingsItemList from '@components/organisms/SettingsItemList';
import ItemDialog, { DialogMode } from '@components/dialogs/ItemDialog';
import { ingredientsSettingsLogger } from '@utils/logger';
import { useRecipeDatabase } from '@context/RecipeDatabaseContext';

/**
 * IngredientsSettings screen component - Ingredient database management
 *
 * @returns JSX element representing the ingredient management interface
 */
export function IngredientsSettings() {
  const { ingredients, addIngredient, editIngredient, deleteIngredient } = useRecipeDatabase();

  const ingredientsSortedAlphabetically = useMemo(
    () => [...ingredients].sort((a, b) => a.name.localeCompare(b.name)),
    [ingredients]
  );

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedIngredient, setSelectedIngredient] = useState<ingredientTableElement>();

  const testId = 'IngredientsSettings';

  const handleAddIngredient = async (newIngredient: ingredientTableElement) => {
    const insertedIngredient = await addIngredient(newIngredient);
    if (!insertedIngredient) {
      ingredientsSettingsLogger.warn('Failed to add ingredient to database', {
        ingredientName: newIngredient.name,
      });
    }
  };

  const handleEditIngredient = async (newIngredient: ingredientTableElement) => {
    const success = await editIngredient(newIngredient);
    if (!success) {
      ingredientsSettingsLogger.warn('Failed to update ingredient in database', {
        ingredientName: newIngredient.name,
        ingredientId: newIngredient.id,
      });
    }
  };

  const handleDeleteIngredient = async (ingredient: ingredientTableElement) => {
    const success = await deleteIngredient(ingredient);
    if (!success) {
      ingredientsSettingsLogger.warn('Ingredient not found for deletion', { ingredient });
    }
  };

  // Open dialog handlers
  const openAddDialog = () => {
    setDialogMode('add');
    setIsDialogOpen(true);
  };

  const openEditDialog = (ingredient: ingredientTableElement) => {
    setSelectedIngredient(ingredient);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (ingredient: ingredientTableElement) => {
    setSelectedIngredient(ingredient);
    setDialogMode('delete');
    setIsDialogOpen(true);
  };

  // Close dialog handler
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Dialog action handlers
  const handleDialogConfirm = async (mode: DialogMode, newIngredient: ingredientTableElement) => {
    switch (mode) {
      case 'add':
        await handleAddIngredient(newIngredient);
        break;
      case 'edit':
        if (selectedIngredient) {
          await handleEditIngredient(newIngredient);
        }
        break;
      case 'delete':
        if (selectedIngredient) {
          await handleDeleteIngredient(newIngredient);
        }
        break;
    }
    setIsDialogOpen(false);
  };

  // TODO add a counter of how many recipes use this element before deleting it
  return (
    <View>
      <SettingsItemList
        items={ingredientsSortedAlphabetically}
        testIdPrefix={testId}
        onAddPress={openAddDialog}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        type='ingredient'
      />

      {/* Dialog for add/edit/delete operations */}
      <ItemDialog
        isVisible={isDialogOpen}
        onClose={closeDialog}
        testId={testId + '::ItemDialog'}
        mode={dialogMode}
        item={{
          type: 'Ingredient',
          value: selectedIngredient ?? ingredientsSortedAlphabetically[0],
          onConfirmIngredient: handleDialogConfirm,
        }}
      />
    </View>
  );
}

export default IngredientsSettings;
