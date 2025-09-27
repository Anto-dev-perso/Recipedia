import React, { useRef } from 'react';
import { View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeCopilot } from '@hooks/useSafeCopilot';
import { useI18n } from '@utils/i18n';
import { TabScreenNavigation } from '@customTypes/ScreenTypes';
import { TUTORIAL_STEPS } from '@utils/Constants';
import { padding } from '@styles/spacing';

export function TutorialTooltip() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation<TabScreenNavigation>();
  const copilotData = useSafeCopilot();
  const pendingStepAdvance = useRef<(() => void) | null>(null);

  // Set up navigation listener for step advancement
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      if (pendingStepAdvance.current) {
        pendingStepAdvance.current();
        pendingStepAdvance.current = null;
      }
    });

    return unsubscribe;
  }, [navigation]);

  if (!copilotData) {
    return null;
  }

  const { isFirstStep, isLastStep, goToNext, goToPrev, stop, currentStep } = copilotData;

  // Helper function to find step by order
  const findStepByOrder = (order: number) => {
    const screens = Object.values(TUTORIAL_STEPS);
    const step = screens.find(step => step.order === order);
    if (!step) {
      throw new Error(
        `Tutorial step with order ${order} not found. Check TUTORIAL_STEPS configuration.`
      );
    }
    return step;
  };

  const getNextScreen = (currentOrder: number) => {
    return findStepByOrder(currentOrder + 1).name;
  };

  const getPreviousScreen = (currentOrder: number) => {
    return findStepByOrder(currentOrder - 1).name;
  };

  // Don't render if no current step
  if (!currentStep) {
    return null;
  }

  const handleNext = async () => {
    if (!currentStep) {
      return;
    }

    const nextScreen = getNextScreen(currentStep.order);
    if (!nextScreen) {
      return;
    }

    // Set up step advancement to happen after navigation completes
    pendingStepAdvance.current = goToNext;

    // Navigate to next screen
    navigation.navigate(nextScreen);
  };

  const handlePrevious = async () => {
    if (!currentStep) {
      return;
    }

    const previousScreen = getPreviousScreen(currentStep.order);
    if (!previousScreen) {
      return;
    }

    // Set up step going back to happen after navigation completes
    pendingStepAdvance.current = goToPrev;

    navigation.navigate(previousScreen);
  };

  // From copilot source files, see that they add 15 padding to tooltip
  const paddingOfCopilot = 15;

  const testId = 'TutorialTooltip';

  return (
    <Card
      testID={testId}
      mode='elevated'
      style={{
        //   Remove the padding to let the card filling the tooltip
        marginHorizontal: -paddingOfCopilot,
        marginTop: -paddingOfCopilot,
      }}
    >
      <Card.Content>
        <Text testID={testId + '::Text'} variant='bodyMedium'>
          {currentStep?.text}
        </Text>
      </Card.Content>

      <Card.Actions
        style={{
          justifyContent: 'space-between',
          paddingVertical: padding.small,
          paddingHorizontal: padding.medium,
        }}
      >
        {!isFirstStep && (
          <Button
            testID={testId + '::Previous'}
            mode='text'
            onPress={handlePrevious}
            textColor={colors.primary}
            compact
          >
            {t('tutorial.previous')}
          </Button>
        )}

        <View style={{ flexDirection: 'row', gap: padding.medium }}>
          <Button
            testID={testId + '::Skip'}
            mode='text'
            onPress={stop}
            textColor={colors.outline}
            compact
          >
            {t('tutorial.skip')}
          </Button>

          <Button
            testID={testId + '::Next'}
            mode='contained'
            onPress={isLastStep ? stop : handleNext}
            buttonColor={colors.primary}
            textColor={colors.onPrimary}
            compact
          >
            {isLastStep ? t('tutorial.finish') : t('tutorial.next')}
          </Button>
        </View>
      </Card.Actions>
    </Card>
  );
}

export default TutorialTooltip;
