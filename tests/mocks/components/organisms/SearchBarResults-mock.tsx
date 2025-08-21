import React from 'react';
import { Button, Text, View } from 'react-native';
import { SearchBarResultsProps } from '@components/organisms/SearchBarResults';

export function searchBarResultsMock({
  testId,
  filteredTitles,
  setSearchBarClicked,
  updateSearchString,
}: SearchBarResultsProps) {
  return (
    <View testID={testId}>
      <Text testID={testId + '::FilteredTitles'}>{JSON.stringify(filteredTitles)}</Text>
      <Button
        testID={testId + '::SetSearchBarClicked'}
        onPress={() => setSearchBarClicked(true)}
        title='Click on Set search bar clicked'
      />
      <Button
        testID={testId + '::UpdateSearchString'}
        onPress={() => updateSearchString('New string')}
        title='Click on Set search bar clicked'
      />
    </View>
  );
}
