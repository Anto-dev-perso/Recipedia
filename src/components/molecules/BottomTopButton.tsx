/**
 * BottomTopButton - Polymorphic positioned button wrapper component
 *
 * A versatile wrapper component that positions any button component at specific
 * locations on the screen (top/bottom edges with various alignments). Uses advanced
 * TypeScript polymorphic component patterns to accept any button-like component
 * while maintaining full type safety and prop forwarding.
 *
 * Key Features:
 * - Polymorphic design accepts any button component type
 * - Eight predefined positioning options (top/bottom + left/center/right/full)
 * - Configurable vertical offset for fine-tuning position
 * - Full prop forwarding to the wrapped component
 * - Type-safe generic implementation with proper constraints
 * - Consistent absolute positioning with app-wide button styles
 * - Error logging for invalid position configurations
 *
 * @example
 * ```typescript
 * // FAB positioned at bottom right
 * <BottomTopButton
 *   as={FAB}
 *   position={bottomTopPosition.bottom_right}
 *   buttonOffset={16}
 *   onPressFunction={() => addNewRecipe()}
 *   testID="add-recipe-fab"
 *   icon="plus"
 *   mode="elevated"
 * />
 *
 * // Full-width button at top
 * <BottomTopButton
 *   as={Button}
 *   position={bottomTopPosition.top_full}
 *   onPressFunction={() => saveChanges()}
 *   testID="save-button"
 *   mode="contained"
 * >
 *   Save Recipe
 * </BottomTopButton>
 *
 * // Custom button component at bottom center
 * <BottomTopButton
 *   as={CustomActionButton}
 *   position={bottomTopPosition.bottom_center}
 *   buttonOffset={24}
 *   onPressFunction={() => startCooking()}
 *   testID="start-cooking"
 *   variant="primary"
 *   size="large"
 * />
 * ```
 */

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  bottomCenterButton,
  bottomFullButton,
  bottomLeftButton,
  bottomRightButton,
  bottomTopPosition,
  topCenterButton,
  topFullButton,
  topLeftButton,
  topRightButton,
} from '@styles/buttons';
import { uiLogger } from '@utils/logger';

/**
 * Props for the BottomTopButton component
 * Uses polymorphic component pattern for maximum flexibility
 */
export type BottomTopButtonProps<T extends React.ElementType> = {
  /** The button component type to render */
  as: T;
  /** Position where the button should be placed */
  position: bottomTopPosition;
  /** Optional vertical offset in pixels for fine-tuning */
  buttonOffset?: number;
  /** Whether to apply safe area insets for edge-to-edge support */
  applyInsets?: boolean;
  /** Function called when button is pressed */
  onPressFunction(): void;
  /** Unique identifier for testing and accessibility */
  testID: string;
} & React.ComponentProps<T>;

/**
 * BottomTopButton component for positioned button wrapping
 *
 * @param props - The component props with polymorphic button type
 * @returns JSX element representing a positioned button wrapper
 */
export function BottomTopButton<T extends React.ElementType>({
  as,
  position,
  buttonOffset,
  applyInsets = false,
  ...restProps
}: BottomTopButtonProps<T>) {
  const Button = as;
  const insets = useSafeAreaInsets();
  const safeInsets = applyInsets ? insets : undefined;
  let buttonStyle: StyleProp<ViewStyle>;
  const offset = buttonOffset ? buttonOffset : 0;

  switch (position) {
    case bottomTopPosition.top_left:
      buttonStyle = topLeftButton(offset, safeInsets);
      break;
    case bottomTopPosition.top_right:
      buttonStyle = topRightButton(offset, safeInsets);
      break;
    case bottomTopPosition.top_center:
      buttonStyle = topCenterButton(offset, safeInsets);
      break;
    case bottomTopPosition.top_full:
      buttonStyle = topFullButton(offset, safeInsets);
      break;
    case bottomTopPosition.bottom_left:
      buttonStyle = bottomLeftButton(offset, safeInsets);
      break;
    case bottomTopPosition.bottom_right:
      buttonStyle = bottomRightButton(offset, safeInsets);
      break;
    case bottomTopPosition.bottom_center:
      buttonStyle = bottomCenterButton(offset, safeInsets);
      break;
    case bottomTopPosition.bottom_full:
      buttonStyle = bottomFullButton(offset, safeInsets);
      break;
    default:
      uiLogger.error('Unreachable code in BottomTopButton', { position });
      break;
  }

  return (
    <View style={buttonStyle}>
      <Button {...restProps} />
    </View>
  );
}

export default BottomTopButton;
