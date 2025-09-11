import React from 'react';
import { Button, Text, View } from 'react-native';
import { NutritionEmptyStateProps } from '@components/molecules/NutritionEmptyState';

export function NutritionEmptyState({
  onAddNutrition,
  parentTestId = 'NutritionEmptyState',
}: NutritionEmptyStateProps) {
  const testId = parentTestId + '::NutritionEmptyState';

  return (
    <View testID={testId}>
      <Text testID={testId + '::ParentTestId'}>{parentTestId}</Text>
      {onAddNutrition && (
        <Button
          testID={testId + '::OnAddNutrition'}
          onPress={onAddNutrition}
          title='Mock Add Nutrition'
        />
      )}
    </View>
  );
}

export default NutritionEmptyState;
