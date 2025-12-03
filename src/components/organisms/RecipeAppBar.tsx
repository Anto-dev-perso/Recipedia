/**
 * RecipeAppBar - AppBar for the Recipe screen with mode-aware actions
 *
 * - isEditing: Shows cancel/validate buttons instead of back button
 * - onDelete/onEdit: Optional - shown only if provided (for readOnly mode)
 */

import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { Icons } from '@assets/Icons';

export type RecipeAppBarProps = {
  isEditing: boolean;
  onGoBack: () => void;
  onCancel: () => void;
  onValidate: () => Promise<void>;
  onDelete?: () => void;
  onEdit?: () => void;
};

export function RecipeAppBar({
  isEditing,
  onGoBack,
  onCancel,
  onDelete,
  onEdit,
  onValidate,
}: RecipeAppBarProps) {
  const { colors } = useTheme();

  return (
    <Appbar.Header
      testID='RecipeAppbar'
      style={{ backgroundColor: colors.primaryContainer }}
      elevated
    >
      {isEditing ? (
        <Appbar.Action
          icon={Icons.crossIcon}
          onPress={onCancel}
          testID='RecipeCancel'
          color={colors.onPrimaryContainer}
        />
      ) : (
        <Appbar.BackAction
          onPress={onGoBack}
          testID='BackButton'
          color={colors.onPrimaryContainer}
        />
      )}
      <Appbar.Content title='' />
      {onDelete && (
        <Appbar.Action
          icon={Icons.trashIcon}
          onPress={onDelete}
          testID='RecipeDelete'
          color={colors.onPrimaryContainer}
        />
      )}
      {onEdit && (
        <Appbar.Action
          icon={Icons.pencilIcon}
          onPress={onEdit}
          testID='RecipeEdit'
          color={colors.onPrimaryContainer}
        />
      )}
      {isEditing && (
        <Appbar.Action
          icon={Icons.checkIcon}
          onPress={onValidate}
          testID='RecipeValidate'
          color={colors.onPrimaryContainer}
        />
      )}
    </Appbar.Header>
  );
}

export default RecipeAppBar;
