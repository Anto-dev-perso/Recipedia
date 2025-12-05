import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useCopilot } from 'react-native-copilot';

/**
 * Custom step number component for the tutorial overlay
 *
 * Uses currentStep.order directly instead of the library's currentStepNumber
 * which is incorrectly calculated based on registered steps rather than actual order.
 */
export function TutorialStepNumber() {
  const { colors } = useTheme();
  const { currentStep } = useCopilot();

  if (!currentStep) {
    return null;
  }

  return (
    <View
      style={{
        aspectRatio: 1,
        borderRadius: 999,
        backgroundColor: colors.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.onPrimaryContainer, fontWeight: 'bold' }}>
        {currentStep.order}
      </Text>
    </View>
  );
}
