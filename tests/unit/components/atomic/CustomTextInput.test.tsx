import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CustomTextInput, { CustomTextInputProps } from '@components/atomic/CustomTextInput';

// Helpers for props
const baseProps: CustomTextInputProps = {
  testID: 'custom-input',
  value: 'initial',
};

describe('CustomTextInput', () => {
  test('renders with label and value', () => {
    const { getByTestId, getAllByText } = render(
      <CustomTextInput {...baseProps} label='Email' value='test@example.com' />
    );
    const input = getByTestId('custom-input::CustomTextInput');
    expect(input.props.value).toEqual('test@example.com');
    // expect(input.props.label).toEqual('Email');
    expect(getAllByText('Email').length).toBeGreaterThan(0);
  });

  test('fires onChangeText when text changes', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(<CustomTextInput {...baseProps} onChangeText={handleChange} />);

    const input = getByTestId('custom-input::CustomTextInput');
    const touchable = getByTestId('custom-input::TouchableOpacity');
    fireEvent.press(touchable);

    fireEvent(input, 'onFocus');
    fireEvent.changeText(input, 'hello');
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  test('calls onFocus and onBlur at appropriate times', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <CustomTextInput {...baseProps} onFocus={onFocus} onBlur={onBlur} />
    );
    const input = getByTestId('custom-input::CustomTextInput');
    const touchable = getByTestId('custom-input::TouchableOpacity');
    fireEvent.press(touchable);

    fireEvent(input, 'onFocus');
    expect(onFocus).toHaveBeenCalled();
    fireEvent(input, 'onBlur');
    expect(onBlur).toHaveBeenCalled();
  });

  test('calls onEndEditing when editing ends', () => {
    const onEndEditing = jest.fn();
    const { getByTestId } = render(<CustomTextInput {...baseProps} onEndEditing={onEndEditing} />);
    const input = getByTestId('custom-input::CustomTextInput');
    const touchable = getByTestId('custom-input::TouchableOpacity');
    fireEvent.press(touchable);
    fireEvent(input, 'onFocus');

    fireEvent(input, 'onEndEditing');
    expect(onEndEditing).toHaveBeenCalled();
  });

  test('is not editable when prop editable is false', () => {
    const { getByTestId } = render(<CustomTextInput {...baseProps} editable={false} />);
    const input = getByTestId('custom-input::CustomTextInput');
    expect(input.props.editable).toBe(false);
  });

  test('handles multiline and dynamic height', () => {
    const { getByTestId } = render(<CustomTextInput {...baseProps} multiline value={'abc\ndef'} />);
    const input = getByTestId('custom-input::CustomTextInput');
    expect(input.props.multiline).toBe(true);
    // Simulate content size change event
    fireEvent(input, 'onContentSizeChange', {
      nativeEvent: { contentSize: { height: 120 } },
    });
    // Optionally: re-render and check height if desired, or snapshot
  });

  test('focuses input when TouchableOpacity is pressed (if editable)', () => {
    const { getByTestId } = render(<CustomTextInput {...baseProps} editable />);
    const touchable = getByTestId('custom-input::TouchableOpacity');
    const input = getByTestId('custom-input::CustomTextInput');

    fireEvent.press(touchable);
    expect(input.props.editable).toBe(true);
  });
});
