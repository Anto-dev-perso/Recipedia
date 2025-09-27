import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import VerticalBottomButtons from '@components/organisms/VerticalBottomButtons';
import { mockNavigate } from '@mocks/deps/react-navigation-mock';
import { RecipePropType } from '@screens/Recipe';
import {
  getMockCopilotEvents,
  resetMockCopilot,
  setMockCopilotState,
} from '@mocks/deps/react-native-copilot-mock';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());

jest.mock('@react-navigation/native', () =>
  require('@mocks/deps/react-navigation-mock').reactNavigationMock()
);

jest.mock(
  '@components/molecules/BottomTopButton',
  () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock
);

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

describe('VerticalBottomButtons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders expand button in collapsed state', () => {
    //@ts-ignore navigation are not useful for UT
    const { getByTestId, queryByTestId } = render(<VerticalBottomButtons />);

    // Should show expand button
    expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();

    // Should not show any expanded buttons
    expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('EditButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('GalleryButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('CameraButton::OnPressFunction')).toBeNull();
  });
  test('renders all action buttons in expanded state', () => {
    //@ts-ignore navigation are not useful for UT
    const { queryByTestId, getByTestId } = render(<VerticalBottomButtons />);

    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

    // Should show all action buttons
    expect(getByTestId('ReduceButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('EditButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('GalleryButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('CameraButton::OnPressFunction')).toBeTruthy();

    // Should hide expand button
    expect(queryByTestId('ExpandButton::OnPressFunction')).toBeNull();
  });

  test('collapses menu when reduce button is pressed', () => {
    //@ts-ignore navigation are not useful for UT
    const { queryByTestId, getByTestId } = render(<VerticalBottomButtons />);

    // Expand the menu first
    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

    // Verify expanded state
    expect(getByTestId('ReduceButton::OnPressFunction')).toBeTruthy();

    // Collapse the menu
    fireEvent.press(getByTestId('ReduceButton::OnPressFunction'));

    // Should show expand button again
    expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();

    // Should hide all action buttons
    expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('EditButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('GalleryButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('CameraButton::OnPressFunction')).toBeNull();
  });

  test('navigates to manual recipe creation when edit button is pressed', async () => {
    //@ts-ignore navigation are not useful for UT
    const { getByTestId } = render(<VerticalBottomButtons />);

    // Expand menu first
    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

    // Verify edit button exists
    expect(getByTestId('EditButton::OnPressFunction')).toBeTruthy();

    // Press edit button
    fireEvent.press(getByTestId('EditButton::OnPressFunction'));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

    expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
      mode: 'addManually',
    } as RecipePropType);
  });

  test('picks image and navigates to recipe creation when gallery button is pressed', async () => {
    //@ts-ignore navigation are not useful for UT
    const { getByTestId } = render(<VerticalBottomButtons />);

    // Expand menu first
    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

    // Verify gallery button exists
    expect(getByTestId('GalleryButton::OnPressFunction')).toBeTruthy();

    // Press gallery button
    fireEvent.press(getByTestId('GalleryButton::OnPressFunction'));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

    expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
      mode: 'addFromPic',
      imgUri: '/path/to/picked/img',
    } as RecipePropType);
  });

  test('takes photo and navigates to recipe creation when camera button is pressed', async () => {
    //@ts-ignore navigation are not useful for UT
    const { getByTestId } = render(<VerticalBottomButtons />);

    // Expand menu first
    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

    // Verify camera button exists
    expect(getByTestId('CameraButton::OnPressFunction')).toBeTruthy();

    // Press camera button
    fireEvent.press(getByTestId('CameraButton::OnPressFunction'));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

    expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
      mode: 'addFromPic',
      imgUri: '/path/to/photo',
    } as RecipePropType);
  });

  test('handles state transitions correctly', () => {
    //@ts-ignore navigation are not useful for UT
    const { getByTestId, queryByTestId } = render(<VerticalBottomButtons />);

    // Initial state: collapsed
    expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();
    expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();

    // Expand
    fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
    expect(queryByTestId('ExpandButton::OnPressFunction')).toBeNull();
    expect(getByTestId('ReduceButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('EditButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('GalleryButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('CameraButton::OnPressFunction')).toBeTruthy();

    // Collapse
    fireEvent.press(getByTestId('ReduceButton::OnPressFunction'));
    expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();
    expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('EditButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('GalleryButton::OnPressFunction')).toBeNull();
    expect(queryByTestId('CameraButton::OnPressFunction')).toBeNull();
  });

  describe('In Tutorial Mode', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      resetMockCopilot();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    test('renders with tutorial wrapper when copilot is available', () => {
      setMockCopilotState({
        isActive: true,
        currentStep: { order: 1, name: 'Home', text: 'Test step' },
      });

      const { getByTestId } = render(<VerticalBottomButtons />);

      expect(getByTestId('CopilotStep::Home')).toBeTruthy();
      expect(getByTestId('HomeTutorial')).toBeTruthy();
      expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();
    });

    test('renders without tutorial wrapper when copilot is not available', () => {
      setMockCopilotState({ isActive: false });

      const { queryByTestId, getByTestId } = render(<VerticalBottomButtons />);

      expect(queryByTestId('CopilotStep::Home')).toBeNull();
      expect(queryByTestId('HomeTutorial')).toBeNull();
      expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();
    });

    test('handles tutorial demo when on Home step', async () => {
      const mockEvents = getMockCopilotEvents();
      setMockCopilotState({
        isActive: true,
        currentStep: { order: 1, name: 'Home', text: 'Home step' },
      });

      const { getByTestId, queryByTestId } = render(<VerticalBottomButtons />);

      await waitFor(() => {
        expect(mockEvents.on).toHaveBeenCalledWith('stepChange', expect.any(Function));
        expect(mockEvents.on).toHaveBeenCalledWith('stop', expect.any(Function));
      });

      expect(getByTestId('ExpandButton::OnPressFunction')).toBeTruthy();
      expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();

      expect(mockEvents.on).toHaveBeenCalledWith('stepChange', expect.any(Function));
      expect(mockEvents.on).toHaveBeenCalledWith('stop', expect.any(Function));
    });

    test('cleans up listeners and demo on unmount', async () => {
      const mockEvents = getMockCopilotEvents();
      setMockCopilotState({
        isActive: true,
        currentStep: { order: 1, name: 'Home', text: 'Home step' },
      });

      const { unmount, getByTestId } = render(<VerticalBottomButtons />);

      await waitFor(() => {
        expect(mockEvents.on).toHaveBeenCalled();
        expect(getByTestId('CopilotStep::Home')).toBeTruthy();
        expect(getByTestId('HomeTutorial')).toBeTruthy();
      });

      unmount();

      expect(mockEvents.off).toHaveBeenCalledWith('stepChange', expect.any(Function));
      expect(mockEvents.off).toHaveBeenCalledWith('stop', expect.any(Function));
    });
  });
});
