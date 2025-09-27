import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import WelcomeScreen from '@screens/WelcomeScreen';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

jest.mock('@components/atomic/CustomImage', () =>
  require('@mocks/components/atomic/CustomImage-mock').customImageMock()
);

jest.mock('expo-asset', () => require('@mocks/deps/expo-asset-mock').expoAssetMock());

jest.mock('expo-constants', () => require('@mocks/deps/expo-constants-mock').expoConstantsMock());

describe('WelcomeScreen Component', () => {
  const mockOnStartTutorial = jest.fn();
  const mockOnSkip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders branded header with app icon, title and subtitle', () => {
    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    expect(getByTestId('WelcomeScreen::AppIcon')).toBeTruthy();
    expect(getByTestId('WelcomeScreen::AppIcon::Uri')).toHaveTextContent('mocked-app-icon-uri');
    expect(getByTestId('WelcomeScreen::Title')).toHaveTextContent('Test Recipedia');
    expect(getByTestId('WelcomeScreen::Subtitle')).toHaveTextContent('welcome.subtitle');
  });

  test('renders features card with title and all feature items', () => {
    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    expect(getByTestId('WelcomeScreen::Card::Title')).toHaveTextContent('welcome.valueTitle');

    expect(getByTestId('WelcomeScreen::Card::FeaturesList::0::Icon::Icon')).toHaveTextContent(
      'magnify'
    );
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::0::Text')).toHaveTextContent(
      'welcome.features.find'
    );
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::1::Icon::Icon')).toHaveTextContent(
      'plus'
    );
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::1::Text')).toHaveTextContent(
      'welcome.features.add'
    );
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::2::Icon::Icon')).toHaveTextContent(
      'cart'
    );
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::2::Text')).toHaveTextContent(
      'welcome.features.shopping'
    );
  });

  test('renders action buttons with correct text', () => {
    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    expect(getByTestId('WelcomeScreen::StartTourButton')).toHaveTextContent('welcome.startTour');
    expect(getByTestId('WelcomeScreen::SkipButton')).toHaveTextContent('welcome.skip');
  });

  test('handles button interactions correctly', () => {
    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    fireEvent.press(getByTestId('WelcomeScreen::StartTourButton'));
    expect(mockOnStartTutorial).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('WelcomeScreen::SkipButton'));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  test('renders proper component structure with all required elements', () => {
    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    expect(getByTestId('WelcomeScreen::AppIcon')).toBeTruthy();
    expect(getByTestId('WelcomeScreen::AppIcon::Uri')).toHaveTextContent('mocked-app-icon-uri');
    expect(getByTestId('WelcomeScreen::Title')).toHaveTextContent('Test Recipedia');
    expect(getByTestId('WelcomeScreen::Subtitle')).toHaveTextContent('welcome.subtitle');
    expect(getByTestId('WelcomeScreen::Card')).toBeTruthy();
    expect(getByTestId('WelcomeScreen::Card::Title')).toHaveTextContent('welcome.valueTitle');
    expect(getByTestId('WelcomeScreen::StartTourButton')).toHaveTextContent('welcome.startTour');
    expect(getByTestId('WelcomeScreen::SkipButton')).toHaveTextContent('welcome.skip');

    expect(getByTestId('WelcomeScreen::Card::FeaturesList::0::Icon')).toBeTruthy();
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::1::Icon')).toBeTruthy();
    expect(getByTestId('WelcomeScreen::Card::FeaturesList::2::Icon')).toBeTruthy();
  });

  test('handles missing expo config gracefully', () => {
    const originalConstant = require('expo-constants').default;
    require('expo-constants').default = { expoConfig: null };

    const { getByTestId } = render(
      <WelcomeScreen onStartTutorial={mockOnStartTutorial} onSkip={mockOnSkip} />
    );

    expect(getByTestId('WelcomeScreen::Title')).toBeTruthy();

    require('expo-constants').default = originalConstant;
  });
});
