import React from 'react';
import { Button, Text, View } from 'react-native';
import { NutritionRowProps } from '@components/molecules/NutritionRow';

export function NutritionRow({
  label,
  value,
  unit,
  isSubItem = false,
  isEditable = false,
  field,
  onValueChange,
  testId,
}: NutritionRowProps) {
  return (
    <View>
      <View testID={testId}>
        <Text testID={testId + '::Label'}>{label}</Text>
        <Text testID={testId + '::Value'}>{value.toString()}</Text>
        <Text testID={testId + '::Unit'}>{unit}</Text>
        <Text testID={testId + '::IsSubItem'}>{isSubItem.toString()}</Text>
        <Text testID={testId + '::IsEditable'}>{isEditable.toString()}</Text>
        <Text testID={testId + '::Field'}>{field || 'undefined'}</Text>
        {onValueChange && field && (
          <Button
            testID={testId + '::OnValueChange'}
            onPress={() => onValueChange(field, 999)}
            title='Mock Value Change'
          />
        )}
      </View>
    </View>
  );
}

export default NutritionRow;
