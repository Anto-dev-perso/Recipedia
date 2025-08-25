import { Button, Text, View } from 'react-native';
import React from 'react';
import { HorizontalListProps } from '@components/molecules/HorizontalList';

let cptPress = 0;

export function horizontalListMock(horizontalListProps: HorizontalListProps) {
  return (
    <View testID={horizontalListProps.testID}>
      <Text testID={horizontalListProps.testID + '::PropType'}>{horizontalListProps.propType}</Text>
      <Text testID={horizontalListProps.testID + '::ItemCount'}>
        {horizontalListProps.item.length.toString()}
      </Text>
      <Button
        testID='HorizontalList::OnPress'
        onPress={() => {
          // @ts-ignore onPress is always defined here
          horizontalListProps.onPress(horizontalListProps.item[cptPress]);
          cptPress++;
        }}
        title='Click on Tag'
      />
      {horizontalListProps.item.map((item, index) => (
        <View key={index}>
          {horizontalListProps.propType === 'Image' ? (
            <Button
              testID={horizontalListProps.testID + `::Item::${index}`}
              onPress={() => horizontalListProps.onPress?.(item)}
              title={`Image ${index}`}
            />
          ) : (
            <Button
              testID={horizontalListProps.testID + `::${index}`}
              onPress={() => horizontalListProps.onPress?.(item)}
              title={item}
            />
          )}
          <Text testID={horizontalListProps.testID + `::Item::${index}::Uri`}>{item}</Text>
        </View>
      ))}
      {horizontalListProps.propType == 'Tag' ? (
        <View>
          <Text testID={horizontalListProps.testID + '::Icon'}>{horizontalListProps.icon}</Text>
        </View>
      ) : null}
    </View>
  );
}
