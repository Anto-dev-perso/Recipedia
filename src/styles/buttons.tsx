/**
 * Button Styles - Comprehensive button styling system for all button components
 *
 * This module provides a complete styling system for all button types used throughout
 * the Recipedia app. Includes responsive sizing, positioning utilities, and
 * multiple button shapes and variants with consistent theming.
 *
 * Key Features:
 * - Responsive button sizing with device scaling
 * - Multiple button shapes (round, square, rectangle, rounded rectangle)
 * - Flexible positioning system for overlay buttons
 * - Press state styling with visual feedback
 * - Consistent color palette integration
 * - Layout utilities for button groupings
 * - Extensible design for new button variants
 *
 * Button Types:
 * - **Round Buttons**: Circular buttons for actions and navigation
 * - **Square Buttons**: Fixed aspect ratio buttons for grid layouts
 * - **Rectangle Buttons**: Standard rectangular buttons for forms
 * - **Rounded Rectangle**: Modern rounded buttons for primary actions
 *
 * Positioning System:
 * - **Corner Positioning**: Top/bottom + left/right/center/full width
 * - **Overlay Buttons**: Floating buttons over content
 * - **Split Layouts**: Multi-column button arrangements
 * - **Responsive Offsets**: Dynamic positioning based on screen size
 *
 * @example
 * ```typescript
 * import {
 *   roundButtonStyles,
 *   bottomRightButton,
 *   viewButtonStyles,
 *   pressButtonStyle
 * } from '@styles/buttons';
 *
 * // Using round button styles
 * const buttonStyle = roundButtonStyles(mediumButtonDiameter);
 * <TouchableOpacity style={buttonStyle.roundButton}>
 *   <Icon name="plus" />
 * </TouchableOpacity>
 *
 * // Using positioned overlay button
 * const overlayStyle = bottomRightButton(BottomTopButtonOffset);
 * <View style={overlayStyle}>
 *   <RoundButton icon="add" />
 * </View>
 *
 * // Using press state styling
 * const [isPressed, setIsPressed] = useState(false);
 * const pressStyle = pressButtonStyle(isPressed);
 * <Pressable
 *   style={[viewButtonStyles.viewContainingButton, pressStyle.pressButton]}
 *   onPressIn={() => setIsPressed(true)}
 *   onPressOut={() => setIsPressed(false)}
 * >
 *   <Text>Button</Text>
 * </Pressable>
 * ```
 */

import { palette } from './colors';
import { padding, remValue } from './spacing';
import EStyleSheet from 'react-native-extended-stylesheet';

/** Border width for button shapes */
const shapeWidth: number = 1;

/** @deprecated Legacy opacity values - no longer used in current implementation */
const opacityRound: number = 0.7;
const opacitySquare: number = 0.9;
const opacityRectangleRounded: number = 1;

/** Responsive width for medium-sized card buttons */
export const mediumCardWidth = 120 * remValue;

/** Responsive width for small-sized card buttons */
export const smallCardWidth = 85 * remValue;

/**
 * Enumeration for button positioning options
 * Used with overlay and floating button positioning system
 */
export const enum bottomTopPosition {
  top_left = 0,
  top_right = 1,
  top_center = 2,
  top_full = 3,
  bottom_left = 4,
  bottom_right = 5,
  bottom_center = 6,
  bottom_full = 7,
}

/** Responsive diameter for small round buttons */
export const smallButtonDiameter = 40 * remValue;

/** Responsive diameter for medium round buttons */
export const mediumButtonDiameter = 50 * remValue;

/** Responsive diameter for large round buttons */
export const LargeButtonDiameter = 60 * remValue;

/** Calculated offset for overlay button positioning */
export const BottomTopButtonOffset = LargeButtonDiameter + 10 * remValue;

/**
 * Creates responsive round button styles with specified diameter
 *
 * @param circleDiameter - Button diameter in pixels (will be scaled with remValue)
 * @returns EStyleSheet object with round button styling
 */
export const roundButtonStyles = (circleDiameter: number) =>
  EStyleSheet.create({
    roundButton: {
      backgroundColor: palette.primary,
      overflow: 'hidden',
      borderRadius: circleDiameter / 2,
      width: circleDiameter,
      height: circleDiameter,
      borderWidth: shapeWidth,
      padding: padding.medium,
      borderColor: palette.bonusColor2,
    },
  });

/**
 * Creates responsive square button styles with specified side length
 *
 * @param side - Square side length in pixels
 * @returns EStyleSheet object with square button styling
 */
export const squareButtonStyles = (side: number) =>
  EStyleSheet.create({
    squareButton: {
      backgroundColor: palette.secondary,
      borderWidth: shapeWidth,
      borderColor: palette.bonusColor2,
      width: side,
      height: side,
      marginHorizontal: padding.small,
    },
  });

/**
 * Creates responsive rectangle button styles with specified height
 *
 * @param rectHeight - Button height in pixels (will be scaled with remValue)
 * @returns EStyleSheet object with rectangle button styling
 */
export const rectangleButtonStyles = (rectHeight: number) =>
  EStyleSheet.create({
    rectangleButton: {
      backgroundColor: palette.primary,
      borderWidth: shapeWidth,
      borderColor: palette.borderColor,
      height: rectHeight * remValue,
    },
  });

/** Standard height for rectangle buttons in pixels */
export const rectangleButtonHeight = 75;

/**
 * Common view and layout styles for button containers and content
 * Provides consistent styling for button groupings and internal layouts
 */
export const viewButtonStyles = EStyleSheet.create({
  viewContainingButton: {
    padding: padding.small,
  },
  viewInsideButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  imageInsideButton: {
    width: '100%',
    height: '100%',
    contentFit: 'cover',
  },
  wrappingListOfButton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  longVerticalButton: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  longHorizontalButton: {
    paddingLeft: padding.extraLarge,
    paddingVertical: padding.medium,
    flexWrap: 'wrap',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const pressButtonStyle = (pressed: boolean) =>
  EStyleSheet.create({
    pressButton: {
      backgroundColor: pressed ? palette.progressGrey : palette.backgroundColor,
    },
  });

export const wrappingButtonWithPressed = (pressed: boolean) =>
  EStyleSheet.flatten([
    viewButtonStyles.wrappingListOfButton,
    pressButtonStyle(pressed).pressButton,
  ]);

export const viewInsideButtonCentered = EStyleSheet.flatten([
  viewButtonStyles.viewInsideButtons,
  viewButtonStyles.centeredView,
]);

const viewBottomTopButton = (offset: number) =>
  EStyleSheet.create({
    bottomButton: {
      position: 'absolute',
      bottom: offset,
      padding: padding.small,
    },
    topButton: {
      position: 'absolute',
      top: -offset,
      padding: padding.small,
    },
  });

export const viewPosition = EStyleSheet.create({
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  centerButton: {
    width: '100%',
    alignItems: 'center',
    justifyCOntent: 'center',
  },
  fullButton: {
    width: '100%',
    padding: 0, // overload padding because we won't it for a full width button
  },
  splitVerticallyIn2: {
    width: '50%',
    padding: padding.small,
  },
});

export const bottomLeftButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.leftButton]);
export const bottomRightButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.rightButton]);
export const bottomCenterButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.centerButton]);
export const bottomFullButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.fullButton]);
export const topLeftButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.leftButton]);
export const topRightButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.rightButton]);
export const topCenterButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.centerButton]);
export const topFullButton = (offset: number) =>
  EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.fullButton]);

export const rectangleRoundedButtonStyles = (rectRoundHeight: number) =>
  EStyleSheet.create({
    rectangleRoundedButton: {
      backgroundColor: palette.accent,
      borderWidth: shapeWidth,
      borderColor: palette.bonusColor2,
      height: rectRoundHeight * remValue,
      borderRadius: (rectRoundHeight / 2) * remValue,
    },
  });
