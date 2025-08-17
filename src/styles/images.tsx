/**
 * Image Styles - Styling system for image components and containers
 *
 * This module provides styling utilities for image display throughout the Recipedia app.
 * Includes responsive image containers, card layouts, and consistent image presentation
 * across different screen sizes and contexts.
 *
 * Key Features:
 * - Responsive image container sizing with rem units
 * - Consistent image card layouts for recipe galleries
 * - Themed background colors for image placeholders
 * - Scalable dimensions for different device screens
 * - Standardized margins and spacing for image layouts
 *
 * Usage Contexts:
 * - Recipe image cards in list and grid views
 * - Image placeholders during loading states
 * - Gallery view image containers
 * - Image picker interface layouts
 *
 * @example
 * ```typescript
 * import { imageStyle } from '@styles/images';
 *
 * // Using image container styles
 * <View style={imageStyle.containerCardStyle}>
 *   <Image
 *     source={{ uri: recipeImageUri }}
 *     style={{ width: '100%', height: '100%' }}
 *     resizeMode="cover"
 *   />
 * </View>
 *
 * // For recipe card layouts
 * <TouchableOpacity style={imageStyle.containerCardStyle}>
 *   <Image source={recipeImage} />
 *   <Text>Recipe Title</Text>
 * </TouchableOpacity>
 * ```
 */

import EStyleSheet from 'react-native-extended-stylesheet';
import { palette } from './colors';

/**
 * Image styling configurations for various image display contexts
 * Uses EStyleSheet for responsive design with rem units
 */
export const imageStyle = EStyleSheet.create({
  /**
   * Standard container styling for image cards
   * Responsive width and height with themed background color
   * Used for recipe image displays and gallery layouts
   */
  containerCardStyle: {
    width: '90%',
    height: '150rem',
    marginHorizontal: 10,
    backgroundColor: palette.secondary,
  },
});
