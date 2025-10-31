import React from 'react';
import { Button, Text, View } from 'react-native';
import { ItemDialogProps } from '@components/dialogs/ItemDialog';
import { ingredientType } from '@customTypes/DatabaseElementTypes';

export function itemDialogMock({ item, mode, onClose, testId, isVisible }: ItemDialogProps) {
  return (
    <View>
      <Text testID={testId + '::IsVisible'}>{isVisible}</Text>
      <Text testID={testId + '::Mode'}>{mode}</Text>
      <Button testID={testId + '::OnClose'} onPress={() => onClose()} title='Close dialog' />
      <Text testID={testId + '::Item'}>{item ? JSON.stringify(item) : 'null'}</Text>
      <Text testID={testId + '::Item::Type'}>{item?.type || 'null'}</Text>
      <Text testID={testId + '::Item::Value'}>{item ? JSON.stringify(item.value) : 'null'}</Text>
      <Button
        testID={testId + '::Item::OnConfirm'}
        onPress={() => {
          if (item) {
            if (item.type === 'Tag') {
              item.onConfirmTag(mode, { ...item.value, name: 'New Value' });
            } else {
              item.onConfirmIngredient(mode, {
                ...item.value,
                name: 'New Value',
                type: ingredientType.fruit,
                unit: 'g',
                season: ['5', '6', '7', '8', '9', '10'],
              });
            }
          }
        }}
        title='Confirm'
      />
    </View>
  );
}
