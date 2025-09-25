import React, { useEffect } from 'react';
import { CopilotProvider, useCopilot } from 'react-native-copilot';
import { useNavigation } from '@react-navigation/native';
import { tutorialLogger } from '@utils/logger';
import { TabScreenNavigation } from '@customTypes/ScreenTypes';
import { CopilotStepData } from '@customTypes/TutorialTypes';
import { TutorialTooltip } from '@components/molecules/TutorialTooltip';

interface TutorialProviderProps {
  children: React.ReactNode;
  onComplete: () => void;
}

function TutorialManager({ onComplete }: Pick<TutorialProviderProps, 'onComplete'>) {
  const navigation = useNavigation<TabScreenNavigation>();
  const { start, copilotEvents, visible } = useCopilot();

  const handleStart = () => {
    tutorialLogger.info('Tutorial started');
  };

  const handleStop = () => {
    tutorialLogger.info('Tutorial stopped');
    onComplete();
    // Navigate to Home after copilot cleanup completes
    setTimeout(() => {
      navigation.navigate('Home');
    }, 0);
  };

  const handleStepChange = (step: CopilotStepData) => {
    tutorialLogger.debug('Copilot step change', {
      name: step.name,
      order: step.order,
      text: step.text,
    });
  };

  // Auto-start tutorial when copilot is ready and not already visible
  useEffect(() => {
    if (copilotEvents && !visible) {
      tutorialLogger.info('Starting tutorial');
      start();
    }
  }, [copilotEvents, visible, start]);

  // Setup event listeners
  useEffect(() => {
    if (!copilotEvents) {
      return;
    }

    copilotEvents.on('stepChange', handleStepChange);
    copilotEvents.on('stop', handleStop);
    copilotEvents.on('start', handleStart);

    return () => {
      copilotEvents.off('stepChange', handleStepChange);
      copilotEvents.off('stop', handleStop);
      copilotEvents.off('start', handleStart);
    };
  }, [copilotEvents, navigation, onComplete]);

  return null;
}

export function TutorialProvider({ children, onComplete }: TutorialProviderProps) {
  return (
    <CopilotProvider overlay='view' animated={true} tooltipComponent={TutorialTooltip}>
      {children}
      <TutorialManager onComplete={onComplete} />
    </CopilotProvider>
  );
}
