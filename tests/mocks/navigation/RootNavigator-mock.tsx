const React = require('react');
const { View } = require('react-native');

export const rootNavigatorMock = () => ({
  RootNavigator: function RootNavigator() {
    return <View testID='RootNavigator'></View>;
  },
});
