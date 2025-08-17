/**
 * CustomTextInput - Enhanced text input component with improved editing behavior
 *
 * A wrapper around React Native Paper's TextInput that provides enhanced editing behavior.
 * Features include tap-to-edit functionality, automatic height adjustment for multiline inputs,
 * and proper theme integration. Designed to provide a consistent and user-friendly input
 * experience throughout the app.
 *
 * Key Features:
 * - Tap-to-edit behavior for better UX
 * - Automatic height adjustment for multiline text
 * - Full React Native Paper theme integration
 * - Comprehensive keyboard type support
 * - Enhanced accessibility with proper test IDs
 * - Visual feedback for non-editable states
 *
 * @example
 * ```typescript
 * <CustomTextInput
 *   testID="recipe-title"
 *   label="Recipe Title"
 *   value={title}
 *   onChangeText={setTitle}
 *   onEndEditing={() => console.log('Editing finished')}
 * />
 *
 * // Multiline example
 * <CustomTextInput
 *   testID="recipe-description"
 *   label="Description"
 *   value={description}
 *   multiline={true}
 *   onChangeText={setDescription}
 * />
 * ```
 */

import React, { useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInputContentSizeChangeEventData,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { screenHeight } from '@styles/spacing';

/**
 * Props for the CustomTextInput component
 */
export type CustomTextInputProps = {
  /** Unique identifier for testing and accessibility */
  testID: string;
  /** Whether the input can be edited (default: true) */
  editable?: boolean;
  /** Optional label displayed above the input */
  label?: string;
  /** Current text value */
  value?: string;
  /** Whether the input supports multiple lines (default: false) */
  multiline?: boolean;
  /** Type of keyboard to display (default: 'default') */
  keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad' | 'numeric' | 'url';
  /** Custom styles for the container view */
  style?: StyleProp<ViewStyle>;
  /** Custom styles for the text content */
  contentStyle?: StyleProp<TextStyle>;
  /** Callback fired when input gains focus */
  onFocus?: () => void;
  /** Callback fired when text changes */
  onChangeText?: (text: string) => void;
  /** Callback fired when editing ends */
  onEndEditing?: () => void;
  /** Callback fired when input loses focus */
  onBlur?: () => void;
  /** Callback fired when component layout changes */
  onLayout?: (event: LayoutChangeEvent) => void;
};

/**
 * CustomTextInput component with enhanced editing behavior
 *
 * @param props - The component props
 * @returns JSX element representing the enhanced text input
 */
export default function CustomTextInput({
  testID,
  editable = true,
  label,
  value,
  multiline = false,
  keyboardType = 'default',
  style,
  contentStyle,
  onFocus,
  onChangeText,
  onEndEditing,
  onBlur,
  onLayout,
}: CustomTextInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputHeight, setInputHeight] = React.useState(screenHeight * 0.08);

  const inputRef = useRef<any>(null);

  function handlePress() {
    if (editable && !isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  function handleOnFocus() {
    setIsEditing(true);
    onFocus?.();
  }

  function handleOnChangeText(text: string) {
    onChangeText?.(text);
  }

  function handleOnEndEditing() {
    setIsEditing(false);
    onEndEditing?.();
  }

  function handleOnBlur() {
    setIsEditing(false);
    onBlur?.();
  }

  function handleOnLayout(event: LayoutChangeEvent) {
    onLayout?.(event);
  }

  function handleOnContentSizeChange({
    nativeEvent: { contentSize },
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) {
    if (multiline) {
      const h = contentSize.height;
      if (inputHeight !== h) {
        setInputHeight(h);
      }
    }
  }

  const { colors } = useTheme();

  const inputStyle = [
    style as TextStyle,
    { height: inputHeight },
    editable ? {} : { backgroundColor: colors.backdrop },
  ];
  return (
    <View style={style} testID={testID + '::CustomTextInput'} pointerEvents={'box-none'}>
      <TextInput
        testID={testID + '::TextInput'}
        ref={inputRef}
        label={label}
        value={value ?? ''}
        style={inputStyle}
        contentStyle={contentStyle}
        onFocus={handleOnFocus}
        onChangeText={handleOnChangeText}
        onEndEditing={handleOnEndEditing}
        mode={'outlined'}
        multiline={multiline}
        editable={isEditing}
        keyboardType={keyboardType}
        onBlur={handleOnBlur}
        onLayout={handleOnLayout}
        onContentSizeChange={handleOnContentSizeChange}
      />
      {!isEditing ? (
        <TouchableOpacity
          testID={testID + '::TouchableOpacity'}
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handlePress}
        />
      ) : null}
    </View>
  );
}
