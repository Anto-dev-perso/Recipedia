const React = require('react');
const { View } = require('react-native');

export const rootNavigatorMock = () =>
  function RootNavigator() {
    return <View testID='RootNavigator'></View>;
  };
