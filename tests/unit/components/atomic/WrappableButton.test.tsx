import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { WrappableButton } from '@components/atomic/WrappableButton';

describe('WrappableButton', () => {
  const mockOnPress = jest.fn();

  const testId = 'test';
  const defaultText = 'Button Text';

  test('renders with basic structure and children text', () => {
    const { getByTestId } = render(
      <WrappableButton onPress={mockOnPress} testID={testId}>
        {defaultText}
      </WrappableButton>
    );

    expect(getByTestId(testId)).toBeTruthy();
    expect(getByTestId(testId + '::Text').props.children).toBe('Button Text');
  });

  test('calls onPress when TouchableOpacity is pressed', () => {
    const { getByTestId } = render(
      <WrappableButton onPress={mockOnPress} testID={testId}>
        {defaultText}
      </WrappableButton>
    );

    fireEvent.press(getByTestId(testId));
    expect(mockOnPress).toHaveBeenCalled();
  });

  test('renders with long text content', () => {
    const longText =
      'This is a very long button text that should wrap to multiple lines without being truncated';

    const { getByTestId } = render(
      <WrappableButton onPress={mockOnPress} testID={testId}>
        {longText}
      </WrappableButton>
    );

    expect(getByTestId(testId)).toBeTruthy();
    expect(getByTestId(testId + '::Text').props.children).toBe(longText);
  });

  test('renders all elements with different testID', () => {
    const customId = 'customTest';
    const { getByTestId } = render(
      <WrappableButton onPress={mockOnPress} testID={customId}>
        Custom Text
      </WrappableButton>
    );

    expect(getByTestId(customId)).toBeTruthy();
    expect(getByTestId(customId + '::Text').props.children).toBe('Custom Text');
  });

  test('handles empty string children', () => {
    const { getByTestId } = render(
      <WrappableButton onPress={mockOnPress} testID={testId}>
        {''}
      </WrappableButton>
    );

    expect(getByTestId(testId)).toBeTruthy();
    expect(getByTestId(testId + '::Text').props.children).toBe('');
  });
});
