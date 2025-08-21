import React from 'react';
import { Text, View } from 'react-native';
import { RecipeCardProps } from '@components/molecules/RecipeCard';

export function recipeCardMock({ testId, size, recipe }: RecipeCardProps) {
  return (
    <View testID={testId}>
      <Text testID={testId + '::Size'}>{size}</Text>
      <Text testID={testId + '::Recipe'}>{JSON.stringify(recipe)}</Text>
    </View>
  );
}
