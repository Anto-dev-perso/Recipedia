/**
 * ItemDialog - Comprehensive CRUD dialog for ingredients and tags
 *
 * A unified, multi-purpose dialog component that handles all CRUD operations
 * (Create, Read, Update, Delete) for both ingredients and tags. Features dynamic
 * form fields, validation, and specialized inputs for different item types.
 *
 * Key Features:
 * - Unified interface for both ingredients and tags
 * - Three operation modes: add, edit, delete
 * - Dynamic form adaptation based on item type and mode
 * - Comprehensive ingredient management (name, type, unit, seasonality)
 * - Simple tag management (name-based)
 * - Real-time validation and user feedback
 * - Seasonality calendar integration for ingredients
 * - Type categorization with dropdown selection
 * - Internationalization support throughout
 *
 * Form Fields by Type:
 *
 * **Ingredients:**
 * - Name (required text input)
 * - Type (dropdown: vegetables, proteins, dairy, etc.)
 * - Unit (text input: cups, grams, pieces, etc.)
 * - Seasonality (interactive month calendar)
 *
 * **Tags:**
 * - Name (required text input)
 *
 * @example
 * ```typescript
 * // Add new ingredient
 * <ItemDialog
 *   testId="add-ingredient"
 *   isVisible={showAddDialog}
 *   mode="add"
 *   onClose={() => setShowAddDialog(false)}
 *   item={{
 *     type: 'Ingredient',
 *     value: newIngredientTemplate,
 *     onConfirmIngredient: (mode, ingredient) => handleAddIngredient(ingredient)
 *   }}
 * />
 *
 * // Edit existing tag
 * <ItemDialog
 *   testId="edit-tag"
 *   isVisible={showEditDialog}
 *   mode="edit"
 *   onClose={() => setShowEditDialog(false)}
 *   item={{
 *     type: 'Tag',
 *     value: selectedTag,
 *     onConfirmTag: (mode, tag) => handleUpdateTag(tag)
 *   }}
 * />
 *
 * // Delete confirmation
 * <ItemDialog
 *   testId="delete-ingredient"
 *   isVisible={showDeleteDialog}
 *   mode="delete"
 *   onClose={() => setShowDeleteDialog(false)}
 *   item={{
 *     type: 'Ingredient',
 *     value: ingredientToDelete,
 *     onConfirmIngredient: (mode, ingredient) => handleDeleteIngredient(ingredient)
 *   }}
 * />
 * ```
 */

import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Dialog, Menu, Portal, Text } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import CustomTextInput from '@components/atomic/CustomTextInput';
import {
  ingredientTableElement,
  ingredientType,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import { shoppingCategories } from '@customTypes/RecipeFiltersTypes';
import { padding } from '@styles/spacing';
import SeasonalityCalendar from '@components/molecules/SeasonalityCalendar';
import { uiLogger } from '@utils/logger';

/** Available dialog operation modes */
export type DialogMode = 'add' | 'edit' | 'delete';

/** Configuration for ingredient dialogs */
export type ItemIngredientType = {
  type: 'Ingredient';
  /** Current ingredient data */
  value: ingredientTableElement;
  /** Callback fired when ingredient operation is confirmed */
  onConfirmIngredient: (mode: DialogMode, newItem: ingredientTableElement) => void;
};

/** Configuration for tag dialogs */
export type ItemTagType = {
  type: 'Tag';
  /** Current tag data */
  value: tagTableElement;
  /** Callback fired when tag operation is confirmed */
  onConfirmTag: (mode: DialogMode, newItem: tagTableElement) => void;
};

/**
 * Props for the ItemDialog component
 */
export type ItemDialogProps = {
  /** Unique identifier for testing and accessibility */
  testId: string;
  /** Whether the dialog is currently visible */
  isVisible: boolean;
  /** Current operation mode (add, edit, delete) */
  mode: DialogMode;
  /** Callback fired when dialog is closed */
  onClose: () => void;
  /** Item configuration with type-specific properties */
  item: ItemIngredientType | ItemTagType;
};

/**
 * ItemDialog component for comprehensive item CRUD operations
 *
 * @param props - The component props with operation configuration
 * @returns JSX element representing a multi-purpose item management dialog
 */
export function ItemDialog({ onClose, isVisible, testId, mode, item }: ItemDialogProps) {
  const { t } = useI18n();

  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const [itemName, setItemName] = useState(item.value.name);

  const [ingType, setIngType] = useState<ingredientType | undefined>(
    item.type === 'Ingredient' && item.value.type !== ingredientType.undefined
      ? item.value.type
      : undefined
  );
  const [ingUnit, setIngUnit] = useState(item.type === 'Ingredient' ? item.value.unit : '');
  const [ingSeason, setIngSeason] = useState(item.type === 'Ingredient' ? item.value.season : []);

  useEffect(() => {
    if (isVisible) {
      setItemName(item.value.name);
      if (item.type === 'Ingredient') {
        setIngType(item.value.type !== ingredientType.undefined ? item.value.type : undefined);
        setIngUnit(item.value.unit);
        setIngSeason(item.value.season);
      }
    }
  }, [item.value.name, item.type, item.value, isVisible]);

  const handleDismiss = () => {
    onClose();
  };

  const handleConfirm = () => {
    callOnConfirmWithNewItem();
    onClose();
  };

  const callOnConfirmWithNewItem = () => {
    switch (item.type) {
      case 'Ingredient':
        item.onConfirmIngredient(mode, {
          id: item.value.id,
          name: itemName,
          type: ingType ?? ingredientType.undefined,
          unit: ingUnit,
          season: ingSeason,
        });
        break;
      case 'Tag':
        item.onConfirmTag(mode, { id: item.value.id, name: itemName });
        break;
      default:
        uiLogger.error('Unreachable code in ItemDialog');
    }
  };

  const isConfirmButtonDisabled = () => {
    if (!itemName.trim()) {
      return true;
    }

    if (mode === 'delete') {
      return false;
    }

    if (item.type === 'Ingredient') {
      return ingType === undefined || !ingUnit.trim();
    }

    return false;
  };

  // Get dialog properties based on the current mode
  const dialogTitle = (() => {
    switch (mode) {
      case 'add':
        return item.type === 'Ingredient' ? t('add_ingredient') : t('add_tag');
      case 'edit':
        return item.type === 'Ingredient' ? t('edit_ingredient') : t('edit_tag');
      case 'delete':
        return t('delete');
      default:
        uiLogger.error('Unreachable code in ItemDialog');
        return '';
    }
  })();

  const confirmButtonText = (() => {
    switch (mode) {
      case 'add':
        return t('add');
      case 'edit':
        return t('save');
      case 'delete':
        return t('delete');
      default:
        uiLogger.error('Unreachable code in ItemDialog');
        return '';
    }
  })();
  const modalTestId = (() => {
    switch (mode) {
      case 'add':
        return testId + '::AddModal';
      case 'edit':
        return testId + '::EditModal';
      case 'delete':
        return testId + '::DeleteModal';
      default:
        uiLogger.error('Unreachable code in ItemDialog');
        return '';
    }
  })();

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={handleDismiss}>
        <Dialog.Title testID={modalTestId + '::Title'}>{dialogTitle}</Dialog.Title>
        <Dialog.Content>
          {mode === 'delete' ? (
            <Text testID={modalTestId + '::Text'} variant='bodyMedium'>
              {t('confirmDelete')}
              {` ${itemName}${t('interrogationMark')}`}
            </Text>
          ) : (
            <View>
              <CustomTextInput
                label={item.type === 'Ingredient' ? t('ingredient_name') : t('tag_name')}
                value={itemName}
                onChangeText={setItemName}
                testID={modalTestId + '::Name'}
              />
              {item.type === 'Ingredient' ? (
                <View>
                  <View style={styles.inputRow}>
                    <Text
                      testID={modalTestId + '::Type'}
                      variant='bodyMedium'
                      style={styles.inputLabel}
                    >
                      {t('type')}:
                    </Text>
                    <Menu
                      testID={modalTestId + '::Menu'}
                      visible={typeMenuVisible}
                      onDismiss={() => setTypeMenuVisible(false)}
                      anchor={
                        <Button
                          testID={modalTestId + '::Menu::Button'}
                          onPress={() => setTypeMenuVisible(true)}
                        >
                          {ingType ? t(ingType) : t('selectType')}
                        </Button>
                      }
                    >
                      <FlatList
                        data={shoppingCategories.filter(
                          category => category !== ingredientType.undefined
                        )}
                        renderItem={({ item }) => (
                          <Menu.Item
                            key={item}
                            title={t(item)}
                            onPress={() => {
                              setIngType(item);
                              setTypeMenuVisible(false);
                            }}
                          />
                        )}
                      />
                    </Menu>
                  </View>

                  <CustomTextInput
                    testID={modalTestId + '::Unit'}
                    label={t('unit')}
                    value={ingUnit}
                    onChangeText={setIngUnit}
                  />

                  <SeasonalityCalendar
                    testID={modalTestId}
                    selectedMonths={ingSeason}
                    onMonthsChange={setIngSeason}
                  />
                </View>
              ) : null}
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <View style={styles.dialogActions}>
            <Button testID={modalTestId + '::CancelButton'} mode='outlined' onPress={handleDismiss}>
              {t('cancel')}
            </Button>
            <Button
              testID={modalTestId + '::ConfirmButton'}
              mode='contained'
              onPress={handleConfirm}
              disabled={isConfirmButtonDisabled()}
            >
              {confirmButtonText}
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: padding.small,
  },
  inputLabel: {
    marginRight: padding.small,
  },
  dialogActions: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
export default ItemDialog;
