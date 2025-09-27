import { TutorialProviderProps } from '@components/organisms/TutorialController';

const React = require('react');
const { View, Button } = require('react-native');

export const tutorialControllerMock = () => ({
  TutorialProvider: function TutorialProvider({ children, onComplete }: TutorialProviderProps) {
    return (
      <View testID='TutorialProvider'>
        {children}
        <Button
          testID={'TutorialProvider::Complete'}
          title='Complete Tutorial'
          onPress={onComplete}
        />
      </View>
    );
  },
});
