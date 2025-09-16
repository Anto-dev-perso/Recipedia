import React from 'react';
import { Button, Text, View } from 'react-native';
import { NutritionEmptyStateProps } from '@components/molecules/NutritionEmptyState';

export function NutritionEmptyState({
  onButtonPressed,
  mode,
  parentTestId = 'NutritionEmptyState',
}: NutritionEmptyStateProps) {
  const testId = parentTestId + '::NutritionEmptyState';
  const isOCRMode = mode === 'ocr';

  return (
    <View testID={testId}>
      <Text testID={testId + '::ParentTestId'}>{parentTestId}</Text>
      <Text testID={testId + '::Mode'}>{mode}</Text>
      {onButtonPressed && (
        <Button
          testID={testId + (isOCRMode ? '::OnOCRNutrition' : '::OnAddNutrition')}
          onPress={onButtonPressed}
          title={isOCRMode ? 'Mock OCR Nutrition' : 'Mock Add Nutrition'}
        />
      )}
    </View>
  );
}

export default NutritionEmptyState;
