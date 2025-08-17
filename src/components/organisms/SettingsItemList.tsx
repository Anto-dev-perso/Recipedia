/**
 * SettingsItemList - Generic list component for settings data management
 *
 * A comprehensive list component that displays and manages collections of settings items
 * with integrated CRUD operations. Features generic type support, automatic item rendering,
 * and a prominent add button for creating new items.
 *
 * Key Features:
 * - Generic type system supporting multiple settings item types
 * - Automatic list rendering with proper spacing and styling
 * - Integrated add functionality with contextual button text
 * - Theme-aware styling and typography
 * - Internationalization support for titles and buttons
 * - Full-height scrollable layout
 * - Type-safe prop forwarding to individual cards
 *
 * @example
 * ```typescript
 * // Ingredient management list
 * <SettingsItemList<ingredientTableElement>
 *   type="ingredient"
 *   items={ingredients}
 *   testIdPrefix="ingredients-list"
 *   onEdit={(ingredient) => editIngredient(ingredient)}
 *   onDelete={(ingredient) => deleteIngredient(ingredient)}
 *   onAddPress={() => openAddIngredientModal()}
 * />
 *
 * // Tag management list
 * <SettingsItemList<tagTableElement>
 *   type="tag"
 *   items={tags}
 *   testIdPrefix="tags-list"
 *   onEdit={(tag) => editTag(tag)}
 *   onDelete={(tag) => deleteTag(tag)}
 *   onAddPress={() => openAddTagModal()}
 * />
 * ```
 */

import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { Icons } from '@assets/Icons';
import { padding } from '@styles/spacing';
import { BottomScreenTitle } from '@styles/typography';
import SettingsItemCard, {
  SettingsItem,
  SettingsItemCardProps,
} from '../molecules/SettingsItemCard';
import { useI18n } from '@utils/i18n';

/**
 * Props for the SettingsItemList component
 * Extends SettingsItemCardProps while omitting individual item props
 */
export type SettingsItemListProps<T extends SettingsItem> = Omit<
  SettingsItemCardProps<T>,
  'index' | 'item'
> & {
  /** Array of items to display in the list */
  items: Array<T>;
  /** Callback fired when the add button is pressed */
  onAddPress: () => void;
};
/**
 * SettingsItemList component for generic settings data management
 *
 * @param props - The component props with generic type constraint
 * @returns JSX element representing a scrollable list of settings items with add functionality
 */
export default function SettingsItemList<T extends SettingsItem>({
  testIdPrefix,
  onEdit,
  onDelete,
  type,
  items,
  onAddPress,
}: SettingsItemListProps<T>) {
  const { t } = useI18n();
  const { colors } = useTheme();

  const title = type === 'ingredient' ? t('ingredients') : t('tags');

  const addButtonLabel = type === 'ingredient' ? t('add_ingredient') : t('add_tag');

  return (
    <View style={{ height: '100%', backgroundColor: colors.background }}>
      <Text
        testID={testIdPrefix + '::Title'}
        variant={BottomScreenTitle}
        style={{ padding: padding.small }}
      >
        {title}
      </Text>

      <FlatList
        data={items}
        contentContainerStyle={{ padding: padding.small }}
        renderItem={({ item, index }) => (
          <SettingsItemCard
            key={index}
            item={item}
            index={index}
            testIdPrefix={testIdPrefix}
            type={type}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        ListFooterComponent={
          <Button
            testID={testIdPrefix + '::AddButton'}
            mode='contained'
            style={{ marginTop: padding.medium }}
            icon={Icons.plusIcon}
            onPress={onAddPress}
          >
            {addButtonLabel}
          </Button>
        }
      />
    </View>
  );
}
