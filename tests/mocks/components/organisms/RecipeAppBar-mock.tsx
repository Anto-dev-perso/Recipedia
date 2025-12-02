import React from 'react';
import { Button, View } from 'react-native';
import { RecipeAppBarProps } from '@components/organisms/RecipeAppBar';

export function recipeAppBarMock({
  isEditing,
  onGoBack,
  onCancel,
  onDelete,
  onEdit,
  onValidate,
}: RecipeAppBarProps) {
  return (
    <View testID='RecipeAppbar'>
      {isEditing ? (
        <Button testID='RecipeCancel' onPress={onCancel} title='Cancel' />
      ) : (
        <Button testID='BackButton' onPress={onGoBack} title='Back' />
      )}
      {onDelete && <Button testID='RecipeDelete' onPress={onDelete} title='Delete' />}
      {onEdit && <Button testID='RecipeEdit' onPress={onEdit} title='Edit' />}
      {isEditing && <Button testID='RecipeValidate' onPress={onValidate} title='Validate' />}
    </View>
  );
}
