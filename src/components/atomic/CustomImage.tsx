/**
 * CustomImage - Themed image component with enhanced loading handling
 *
 * A wrapper around Expo Image that provides consistent theming, loading states,
 * and error handling. Features automatic background color from the current theme
 * and flexible content fitting options for different image display needs.
 *
 * Key Features:
 * - Theme-integrated background color during loading
 * - Flexible content fitting options (cover, contain, fill, etc.)
 * - Load success and error callbacks for state management
 * - Consistent styling and behavior across the app
 * - Built on Expo Image for better performance and caching
 *
 * @example
 * ```typescript
 * // Basic usage
 * <CustomImage
 *   uri="path/to/image.jpg"
 *   testID="recipe-image"
 * />
 *
 * // With custom content fit and callbacks
 * <CustomImage
 *   uri={imageUri}
 *   contentFit="contain"
 *   onLoadSuccess={() => setImageLoaded(true)}
 *   onLoadError={() => setImageError(true)}
 *   testID="profile-image"
 * />
 * ```
 */

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from 'react-native-paper';

/**
 * Props for the CustomImage component
 */
export type CustomImageProps = {
  /** URI or path to the image to display */
  uri?: string;
  /** How the image should be resized to fit its container (default: 'cover') */
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Custom background color (defaults to theme.colors.tertiary) */
  backgroundColor?: string;
  /** Size for width and height (if provided, overrides flex: 1) */
  size?: number;
  /** Whether to make the image circular (applies size/2 as border radius) */
  circular?: boolean;
  /** Callback fired when image loads successfully */
  onLoadSuccess?: () => void;
  /** Callback fired when image fails to load */
  onLoadError?: () => void;
  /** Unique identifier for testing and accessibility */
  testID: string;
};

/**
 * CustomImage component with theme integration
 *
 * @param props - The component props
 * @returns JSX element representing a themed image with loading handling
 */
export function CustomImage({
  uri,
  contentFit = 'cover',
  backgroundColor,
  size,
  circular,
  onLoadSuccess,
  onLoadError,
  testID,
}: CustomImageProps) {
  const { colors } = useTheme();

  const dimensions: StyleProp<ViewStyle> = size ? { width: size, height: size } : { flex: 1 };
  const borderRadius = circular && size ? size / 2 : 0;

  return (
    <View style={dimensions}>
      <Image
        style={{
          flex: 1,
          backgroundColor: backgroundColor || colors.tertiary,
          borderRadius: borderRadius,
          width: size,
          height: size,
        }}
        testID={testID + '::Image'}
        source={uri}
        contentFit={contentFit}
        onError={onLoadError}
        onLoad={onLoadSuccess}
      />
    </View>
  );
}

export default CustomImage;
