import React from 'react';
import { Button, Text, View } from 'react-native';
import { NutritionEditFormProps } from '@components/molecules/NutritionEditForm';

export function NutritionEditForm({
  portionWeight,
  onPortionWeightChange,
  onRemoveNutrition,
  showRemoveButton = false,
  testId,
}: NutritionEditFormProps) {
  return (
    <View testID={testId}>
      <Text testID={testId + '::PortionWeight'}>{portionWeight.toString()}</Text>
      <Text testID={testId + '::ShowRemoveButton'}>{showRemoveButton.toString()}</Text>
      {onPortionWeightChange && (
        <Button
          testID={testId + '::OnPortionWeightChange'}
          onPress={() => onPortionWeightChange(150)}
          title='Mock Change Portion Weight'
        />
      )}
      {onRemoveNutrition && (
        <Button
          testID={testId + '::OnRemoveNutrition'}
          onPress={onRemoveNutrition}
          title='Mock Remove Nutrition'
        />
      )}
    </View>
  );
}

export default NutritionEditForm;
