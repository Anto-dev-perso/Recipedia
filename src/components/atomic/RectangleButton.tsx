/**
 * RectangleButton - Customizable rectangular button with flexible styling
 *
 * A themed button component built on React Native Paper's Button with customizable
 * alignment, border styling, and optional icon support. Perfect for list items,
 * settings options, and navigation buttons throughout the app.
 *
 * Key Features:
 * - Configurable text alignment (centered or left-aligned)
 * - Optional top border for visual separation
 * - Icon support with proper theme integration
 * - Consistent Material Design styling
 * - Theme-aware colors and typography
 *
 * @example
 * ```typescript
 * // Settings button with border
 * <RectangleButton
 *   text="Dark Mode"
 *   icon="theme-light-dark"
 *   centered={false}
 *   border={true}
 *   onPressFunction={() => toggleDarkMode()}
 *   testID="dark-mode-button"
 * />
 *
 * // Centered action button
 * <RectangleButton
 *   text="Save Recipe"
 *   centered={true}
 *   border={false}
 *   onPressFunction={() => saveRecipe()}
 *   testID="save-button"
 * />
 * ```
 */

import React from 'react';
import { Button, useTheme } from 'react-native-paper';
import { IconName } from '@assets/Icons';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the RectangleButton component
 */
export type RectangleButtonProps = {
  /** Text displayed on the button */
  text: string;
  /** Function called when button is pressed */
  onPressFunction?: () => void;
  /** Optional icon name to display */
  icon?: IconName;
  /** Whether text should be centered or left-aligned */
  centered: boolean;
  /** Whether to show a top border */
  border: boolean;
  /** Unique identifier for testing and accessibility */
  testID: string;
};

/**
 * RectangleButton component
 *
 * @param props - The component props
 * @returns JSX element representing a customizable rectangular button
 */
export function RectangleButton(props: RectangleButtonProps) {
  const { colors, fonts } = useTheme();

  const borderStyle: StyleProp<ViewStyle> = props.border
    ? { borderTopWidth: 1, borderColor: colors.outline }
    : null;

  return (
    <Button
      testID={props.testID}
      style={borderStyle}
      contentStyle={{
        flexDirection: 'row',
        justifyContent: props.centered ? 'center' : 'flex-start',
      }}
      labelStyle={{
        ...fonts.titleLarge,
        textAlign: props.centered ? 'center' : 'left',
      }}
      mode='contained'
      buttonColor={colors.primaryContainer}
      textColor={colors.onPrimaryContainer}
      icon={props.icon}
      onPress={props.onPressFunction}
    >
      {props.text}
    </Button>
  );
}

export default RectangleButton;
