import { WelcomeScreenProps } from '@screens/WelcomeScreen';

const React = require('react');
const { View, TouchableOpacity, Text } = require('react-native');

export const welcomeScreenMock = () =>
  function WelcomeScreen({ onStartTutorial, onSkip }: WelcomeScreenProps) {
    return (
      <View testID='WelcomeScreen'>
        <TouchableOpacity testID={'WelcomeScreen::StartTutorial'} onPress={onStartTutorial} />
        <TouchableOpacity testID={'WelcomeScreen::Skip'} onPress={onSkip} />
      </View>
    );
  };
