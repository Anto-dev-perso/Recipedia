import React, { useEffect, useState } from 'react';
import RootNavigator from '@navigation/RootNavigator';
import WelcomeScreen from '@screens/WelcomeScreen';
import { TutorialProvider } from './TutorialController';
import { isFirstLaunch, markAsLaunched } from '@utils/firstLaunch';
import { appLogger, tutorialLogger } from '@utils/logger';
import { useRecipeDatabase } from '@context/RecipeDatabaseContext';

enum AppMode {
  Loading = 'loading',
  Welcome = 'welcome',
  Tutorial = 'tutorial',
  Ready = 'ready',
}

/**
 * AppWrapper - Root application component managing app initialization and modes
 *
 * Controls the main application flow including first-time user experience,
 * tutorial mode, and normal app operation. Handles state transitions between
 * different app modes based on user actions and first launch detection.
 *
 * App Modes:
 * - Loading: Initial state while checking first launch
 * - Welcome: First-time user onboarding screen
 * - Tutorial: Guided tutorial with sample data
 * - Ready: Normal app operation
 *
 * Features:
 * - First launch detection and onboarding
 * - Tutorial mode with pre-populated shopping list
 * - Shopping list reset on app launch
 * - State management for app flow
 *
 * @returns JSX element representing the current app mode
 */
export default function AppWrapper() {
  const { clearShoppingList, recipes, addRecipeToShopping } = useRecipeDatabase();
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

  /**
   * Handles normal app launch initialization
   *
   * Resets shopping list, marks app as launched, and transitions to ready mode.
   * This function is called both for normal app launch and after tutorial completion.
   */
  const handleAppLaunch = async () => {
    await clearShoppingList();
    tutorialLogger.info('App launch - resetting shopping list');
    setMode(AppMode.Ready);
    markAsLaunched();
  };

  /**
   * Handles tutorial mode initialization
   *
   * Prepares the app for tutorial by adding a sample recipe to the shopping list
   * and transitioning to tutorial mode. This ensures the tutorial has meaningful
   * data to demonstrate app features.
   */
  const handleStartTutorial = async () => {
    const recipeForTutorial = recipes[0];
    await addRecipeToShopping(recipeForTutorial);
    tutorialLogger.info('Added recipe to shopping list for tutorial', recipeForTutorial);
    setMode(AppMode.Tutorial);
  };

  /**
   * Handles welcome screen skip action
   *
   * Bypasses the tutorial and proceeds directly to normal app operation.
   * Calls handleAppLaunch to perform standard initialization.
   */
  const handleSkipWelcome = () => {
    handleAppLaunch();
    appLogger.info('Welcome skipped - proceeding to main app');
  };

  /**
   * Handles tutorial completion
   *
   * Transitions from tutorial mode to normal app operation after tutorial
   * is completed. Performs same initialization as normal app launch.
   */
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
