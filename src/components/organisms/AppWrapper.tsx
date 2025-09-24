import React, { useEffect, useState } from 'react';
import RootNavigator from '@navigation/RootNavigator';
import WelcomeScreen from '@screens/WelcomeScreen';
import { TutorialProvider } from './TutorialController';
import { isFirstLaunch, markAsLaunched } from '@utils/firstLaunch';
import { appLogger } from '@utils/logger';

enum AppMode {
  Loading = 'loading',
  Welcome = 'welcome',
  Tutorial = 'tutorial',
  Ready = 'ready',
}

export default function AppWrapper() {
  const [mode, setMode] = useState<AppMode>(AppMode.Loading);

  useEffect(() => {
    isFirstLaunch().then(isFirst => {
      if (isFirst) {
        appLogger.info('First launch detected - showing welcome screen');
        setMode(AppMode.Welcome);
      } else {
        appLogger.debug('Not first launch - proceeding to main app');
        setMode(AppMode.Ready);
      }
    });
  }, []);

  const handleAppLaunch = () => {
    setMode(AppMode.Ready);
    markAsLaunched();
  };

  const handleStartTutorial = () => {
    setMode(AppMode.Tutorial);
  };

  const handleSkipWelcome = () => {
    handleAppLaunch();
    appLogger.info('Welcome skipped - proceeding to main app');
  };

  const handleTutorialComplete = () => {
    handleAppLaunch();
    appLogger.info('Tutorial completed successfully');
  };

  switch (mode) {
    case AppMode.Welcome:
      return <WelcomeScreen onStartTutorial={handleStartTutorial} onSkip={handleSkipWelcome} />;

    case AppMode.Tutorial:
      return (
        <TutorialProvider onComplete={handleTutorialComplete}>
          <RootNavigator />
        </TutorialProvider>
      );

    case AppMode.Ready:
      return <RootNavigator />;

    case AppMode.Loading:
    default:
      return null;
  }
}
