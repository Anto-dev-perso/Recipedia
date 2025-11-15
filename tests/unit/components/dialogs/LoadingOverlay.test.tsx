import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingOverlay } from '@components/dialogs/LoadingOverlay';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

const defaultTestId = 'LoadingOverlay';
const overlayTestId = defaultTestId + '::Overlay';

describe('LoadingOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Visibility', () => {
    test('does not render when visible is false', () => {
      const { queryByTestId } = render(<LoadingOverlay visible={false} />);

      expect(queryByTestId(overlayTestId)).toBeNull();
    });

    test('renders when visible is true', () => {
      const { getByTestId } = render(<LoadingOverlay visible={true} />);

      expect(getByTestId(overlayTestId)).toBeTruthy();
    });
  });

  describe('Indeterminate loading (no progress)', () => {
    test('shows spinner when progress is undefined', () => {
      const { getByTestId, queryByTestId } = render(<LoadingOverlay visible={true} />);

      expect(getByTestId(overlayTestId + '::Spinner')).toBeTruthy();
      expect(queryByTestId(overlayTestId + '::ProgressBar')).toBeNull();
      expect(queryByTestId(overlayTestId + '::ProgressText')).toBeNull();
    });

    test('shows message with spinner when message is provided', () => {
      const message = 'Loading...';
      const { getByTestId } = render(<LoadingOverlay visible={true} message={message} />);

      expect(getByTestId(overlayTestId + '::Spinner')).toBeTruthy();
      expect(getByTestId(overlayTestId + '::Message').props.children).toBe(message);
    });
  });

  describe('Determinate loading (with progress)', () => {
    test('shows progress bar when progress is 0', () => {
      const { getByTestId, queryByTestId } = render(<LoadingOverlay visible={true} progress={0} />);

      expect(getByTestId(overlayTestId + '::ProgressBar')).toBeTruthy();
      expect(getByTestId(overlayTestId + '::ProgressText').props.children).toEqual([0, '%']);
      expect(queryByTestId(overlayTestId + '::Spinner')).toBeNull();
    });

    test('shows progress bar when progress is 50', () => {
      const { getByTestId, queryByTestId } = render(
        <LoadingOverlay visible={true} progress={50} />
      );

      expect(getByTestId(overlayTestId + '::ProgressBar')).toBeTruthy();
      expect(getByTestId(overlayTestId + '::ProgressText').props.children).toEqual([50, '%']);
      expect(queryByTestId(overlayTestId + '::Spinner')).toBeNull();
    });

    test('shows progress bar when progress is 100', () => {
      const { getByTestId, queryByTestId } = render(
        <LoadingOverlay visible={true} progress={100} />
      );

      expect(getByTestId(overlayTestId + '::ProgressBar')).toBeTruthy();
      expect(getByTestId(overlayTestId + '::ProgressText').props.children).toEqual([100, '%']);
      expect(queryByTestId(overlayTestId + '::Spinner')).toBeNull();
    });

    test('shows message with progress bar when message is provided', () => {
      const message = 'Scaling recipes...';
      const { getByTestId } = render(
        <LoadingOverlay visible={true} progress={75} message={message} />
      );

      expect(getByTestId(overlayTestId + '::ProgressBar')).toBeTruthy();
      expect(getByTestId(overlayTestId + '::ProgressText').props.children).toEqual([75, '%']);
      expect(getByTestId(overlayTestId + '::Message').props.children).toBe(message);
    });

    test('rounds decimal progress values', () => {
      const { getByTestId } = render(<LoadingOverlay visible={true} progress={33.7} />);

      expect(getByTestId(overlayTestId + '::ProgressText').props.children).toEqual([34, '%']);
    });

    test('progress bar receives correct progress value', () => {
      const { getByTestId } = render(<LoadingOverlay visible={true} progress={60} />);

      const progressBar = getByTestId(overlayTestId + '::ProgressBar');
      expect(progressBar.props.progress).toBe(0.6);
    });
  });

  describe('Custom testID', () => {
    test('uses custom testID when provided', () => {
      const customTestId = 'CustomLoader';
      const customOverlayTestId = customTestId + '::Overlay';

      const { getByTestId } = render(<LoadingOverlay visible={true} testID={customTestId} />);

      expect(getByTestId(customOverlayTestId)).toBeTruthy();
      expect(getByTestId(customOverlayTestId + '::Spinner')).toBeTruthy();
    });
  });

  describe('Message handling', () => {
    test('does not show message when message is undefined', () => {
      const { queryByTestId } = render(<LoadingOverlay visible={true} />);

      expect(queryByTestId(overlayTestId + '::Message')).toBeNull();
    });

    test('shows message when message is provided with spinner', () => {
      const message = 'Please wait...';
      const { getByTestId } = render(<LoadingOverlay visible={true} message={message} />);

      expect(getByTestId(overlayTestId + '::Message').props.children).toBe(message);
    });

    test('shows message when message is provided with progress', () => {
      const message = 'Processing...';
      const { getByTestId } = render(
        <LoadingOverlay visible={true} progress={45} message={message} />
      );

      expect(getByTestId(overlayTestId + '::Message').props.children).toBe(message);
    });
  });
});
