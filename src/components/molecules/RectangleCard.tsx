/**
 * RectangleCard - Large rectangular recipe card with detailed information
 *
 * A comprehensive recipe card component that displays detailed recipe information
 * in a vertical layout. Features a large image, recipe title, tags, and metadata
 * like preparation time and serving count. Designed for use in list views where
 * more information needs to be displayed compared to smaller card variants.
 *
 * Key Features:
 * - Large rectangular layout optimized for vertical scrolling lists
 * - Prominent recipe image display with fallback handling
 * - Complete recipe metadata (title, tags, prep time, servings)
 * - Navigation integration for seamless recipe viewing
 * - Consistent styling with app design system
 * - Tag list rendering with proper formatting
 *
 * @example
 * ```typescript
 * // Featured recipe in main list
 * <RectangleCard
 *   recipe={featuredRecipe}
 *   testID="featured-recipe-card"
 * />
 *
 * // Recipe in search results
 * <RectangleCard
 *   recipe={searchResult}
 *   testID="search-result-card"
 * />
 *
 * // Recipe in category listing
 * <RectangleCard
 *   recipe={categoryRecipe}
 *   testID="category-recipe-card"
 * />
 * ```
 */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { rectangleButtonStyles, viewButtonStyles } from '@styles/buttons';
import { rowTextStyle, typoRender, typoStyles } from '@styles/typography';
import { recipeTableElement } from '@customTypes/DatabaseElementTypes';
import { viewsSplitScreen } from '@styles/spacing';
import { useNavigation } from '@react-navigation/native';
import { StackScreenNavigation } from '@customTypes/ScreenTypes';
import { imageStyle } from '@styles/images';
import TextRender from '@components/molecules/TextRender';
import CustomImage from '@components/atomic/CustomImage';

/**
 * Props for the RectangleCard component
 */
export type RectangleCardProps = {
  /** Recipe data to display in the card */
  recipe: recipeTableElement;
  /** Unique identifier for testing and accessibility */
  testID: string;
};

/**
 * RectangleCard component for detailed recipe display
 *
 * @param props - The component props
 * @returns JSX element representing a large rectangular recipe card with detailed information
 */
export function RectangleCard(props: RectangleCardProps) {
  const { navigate } = useNavigation<StackScreenNavigation>();

  return (
    <Pressable
      style={rectangleButtonStyles(400).rectangleButton}
      onPress={() => navigate('Recipe', { mode: 'readOnly', recipe: props.recipe })}
    >
      <View style={viewButtonStyles.longVerticalButton}>
        <View style={imageStyle.containerCardStyle}>
          <CustomImage testID={props.testID + '::RectangleCard'} uri={props.recipe.image_Source} />
        </View>
        <Text style={typoStyles.paragraph}>{props.recipe.title}</Text>
        <TextRender text={props.recipe.tags.map(tag => tag.name)} render={typoRender.LIST} />

        <View style={viewsSplitScreen.viewInRow}>
          <Text style={rowTextStyle.leftText}>Prep. {props.recipe.time} min</Text>
          <Text style={rowTextStyle.rightText}>2 p.</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default RectangleCard;
