import React from 'react';
import { Text, View } from 'react-native';

export const customImageMock = () => ({
  CustomImage: function CustomImage({ testID, uri, size }: any) {
    return (
      <View testID={testID}>
        <Text testID={testID + '::Uri'}>{uri}</Text>
        <Text testID={testID + '::Size'}>{size?.toString()}</Text>
      </View>
    );
  },
});
