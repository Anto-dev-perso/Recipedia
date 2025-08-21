import React from 'react';
import { Button, Text, View } from 'react-native';
import { ItemDialogProps } from '@components/dialogs/ItemDialog';

export function itemDialogMock({ item, mode, onClose, testId, isVisible }: ItemDialogProps) {
  const dialogTestID = testId + '::ItemDialog';

  return (
    <View>
      <Text testID={dialogTestID + '::IsVisible'}>{isVisible}</Text>
      <Text testID={dialogTestID + '::Mode'}>{mode}</Text>
      <Button testID={dialogTestID + '::OnClose'} onPress={() => onClose()} title='Close dialog' />
      <Text testID={dialogTestID + '::Item'}>{item ? JSON.stringify(item) : 'null'}</Text>
      <Text testID={dialogTestID + '::Item::Type'}>{item?.type || 'null'}</Text>
      <Text testID={dialogTestID + '::Item::Value'}>
        {item ? JSON.stringify(item.value) : 'null'}
      </Text>
      <Button
        testID={dialogTestID + '::Item::OnConfirm'}
        onPress={() => {
          if (item) {
            if (item.type === 'Tag') {
              item.onConfirmTag(mode, { ...item.value, name: 'New Value' });
            } else {
              item.onConfirmIngredient(mode, { ...item.value, name: 'New Value' });
            }
          }
        }}
        title='Confirm'
      />
    </View>
  );
}
