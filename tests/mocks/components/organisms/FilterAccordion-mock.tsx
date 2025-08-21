import React from 'react';
import { Button, Text, View } from 'react-native';
import { FilterAccordionProps } from '@components/organisms/FilterAccordion';
import { mapToObject } from '@mocks/components/organisms/FiltersSelection-mock';
import { listFilter } from '@customTypes/RecipeFiltersTypes';

export function filterAccordionMock({
  testId,
  tagsList,
  ingredientsList,
  filtersState,
  addFilter,
  removeFilter,
}: FilterAccordionProps) {
  return (
    <View testID={testId}>
      <Text testID={testId + '::TagsList'}>{JSON.stringify(tagsList)}</Text>
      <Text testID={testId + '::IngredientsList'}>{JSON.stringify(ingredientsList)}</Text>
      <Text testID={testId + '::FiltersState'}>{JSON.stringify(mapToObject(filtersState))}</Text>
      <Button
        testID={testId + '::AddFilter'}
        onPress={() => addFilter(listFilter.tags, 'New filter')}
        title='Click on Add Filter'
      />
      <Button
        testID={testId + '::RemoveFilter'}
        onPress={() => removeFilter(listFilter.tags, 'New filter')}
        title='Click on Remove Filter'
      />
    </View>
  );
}
