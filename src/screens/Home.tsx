/**
 * Home - Main dashboard screen with recipe recommendations and FAB menu
 *
 * The primary landing screen of the Recipedia app featuring multiple recommendation
 * carousels with random recipes and an expandable FAB menu for recipe creation.
 * Includes pull-to-refresh functionality and automatic cleanup of deleted recipes.
 *
 * Key Features:
 * - Four dynamic recommendation carousels with random recipes
 * - Pull-to-refresh functionality for fresh recommendations
 * - Automatic cleanup of deleted/missing recipes on focus
 * - Expandable FAB menu for recipe creation (camera, gallery, manual)
 * - Responsive layout with proper bottom padding
 * - Theme-aware styling and colors
 * - Comprehensive logging for debugging and analytics
 * - Real-time recipe existence validation
 *
 * Navigation Integration:
 * - Serves as the main entry point from bottom tab navigation
 * - Integrates with recipe creation flows via VerticalBottomButtons
 * - Handles navigation to individual recipe screens via RecipeCard interactions
 *
 * Performance Optimizations:
 * - Efficient random recipe loading with controlled batch sizes
 * - Focus-based cleanup prevents stale data display
 * - Smooth scroll performance with proper view sizing
 *
 * @example
 * ```typescript
 * // Navigation integration (typically in tab navigator)
 * <Tab.Screen
 *   name="Home"
 *   component={Home}
 *   options={{
 *     tabBarIcon: ({ color }) => <Icon name="home" color={color} />
 *   }}
 * />
 *
 * // The Home screen automatically handles:
 * // - Loading random recipe recommendations
 * // - Providing recipe creation entry points
 * // - Managing recipe data freshness
 * // - Responsive layout for different screen sizes
 * ```
 */

import RecipeRecommendation from '@components/organisms/RecipeRecommendation';

import { recipeTableElement } from '@customTypes/DatabaseElementTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import RecipeDatabase from '@utils/RecipeDatabase';
import VerticalBottomButtons from '@components/organisms/VerticalBottomButtons';
import { useFocusEffect } from '@react-navigation/native';
import { useI18n } from '@utils/i18n';
import { screenWidth } from '@styles/spacing';
import { HomeScreenProp } from '@customTypes/ScreenTypes';
import { homeLogger } from '@utils/logger';

/**
 * Home screen component - Main dashboard with recipe recommendations
 *
 * @param props - Navigation props for the Home screen
 * @returns JSX element representing the main home dashboard
 */
export default function Home({ navigation }: HomeScreenProp) {
  const { t } = useI18n();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const homeId = 'Home';
  const recommandationId = homeId + '::RecipeRecommendation';

  const howManyItemInCarousel = 4;
  // TODO name these recommendation (and maybe add more ?)
  const [elementsForRecommendation1, setElementsForRecommendation1] = useState(
    new Array<recipeTableElement>()
  );
  const [elementsForRecommendation2, setElementsForRecommendation2] = useState(
    new Array<recipeTableElement>()
  );
  const [elementsForRecommendation3, setElementsForRecommendation3] = useState(
    new Array<recipeTableElement>()
  );
  const [elementsForRecommendation4, setElementsForRecommendation4] = useState(
    new Array<recipeTableElement>()
  );

  function randomlySearchElements(databaseInstance: RecipeDatabase) {
    homeLogger.debug('Loading random recipe recommendations', {
      carouselSize: howManyItemInCarousel,
    });
    setElementsForRecommendation1(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
    setElementsForRecommendation2(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
    setElementsForRecommendation3(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
    setElementsForRecommendation4(databaseInstance.searchRandomlyRecipes(howManyItemInCarousel));
    homeLogger.debug('Random recipe recommendations loaded successfully');
  }

  const onRefresh = useCallback(() => {
    homeLogger.info('User refreshing home screen recommendations');
    setRefreshing(true);
    randomlySearchElements(RecipeDatabase.getInstance());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    randomlySearchElements(RecipeDatabase.getInstance());
  }, []);

  useFocusEffect(() => {
    const recipeDb = RecipeDatabase.getInstance();
    const recipeTitleDeleted = new Set<string>();
    const checkIfRecipeExistAndUpdateTitlesToDelete = (recipeArray: Array<recipeTableElement>) => {
      for (const recipe of recipeArray) {
        if (!recipeDb.isRecipeExist(recipe)) {
          recipeTitleDeleted.add(recipe.title);
        }
      }
    };
    checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation1);
    checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation2);
    checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation3);
    checkIfRecipeExistAndUpdateTitlesToDelete(elementsForRecommendation4);

    if (recipeTitleDeleted.size > 0) {
      const filterArrayAndUpdateState = (
        recipeArray: Array<recipeTableElement>,
        setState: React.Dispatch<React.SetStateAction<Array<recipeTableElement>>>
      ) => {
        const filteredArray = recipeArray.filter(recipe => !recipeTitleDeleted.has(recipe.title));
        if (filteredArray.length < howManyItemInCarousel) {
          setState([
            ...filteredArray,
            ...recipeDb.searchRandomlyRecipes(howManyItemInCarousel - filteredArray.length),
          ]);
        }
      };
      filterArrayAndUpdateState(elementsForRecommendation1, setElementsForRecommendation1);
      filterArrayAndUpdateState(elementsForRecommendation2, setElementsForRecommendation2);
      filterArrayAndUpdateState(elementsForRecommendation3, setElementsForRecommendation3);
      filterArrayAndUpdateState(elementsForRecommendation4, setElementsForRecommendation4);
    }
  });

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <ScrollView
        testID={'HomeScrollView'}
        refreshControl={
          <RefreshControl colors={[colors.primary]} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <RecipeRecommendation
          testId={recommandationId + '::1'}
          carouselProps={elementsForRecommendation1}
          titleRecommendation={`${t('recommendation')} 1`}
        />
        <RecipeRecommendation
          testId={recommandationId + '::2'}
          carouselProps={elementsForRecommendation2}
          titleRecommendation={`${t('recommendation')} 2`}
        />
        <RecipeRecommendation
          testId={recommandationId + '::3'}
          carouselProps={elementsForRecommendation3}
          titleRecommendation={`${t('recommendation')} 3`}
        />
        <RecipeRecommendation
          testId={recommandationId + '::4'}
          carouselProps={elementsForRecommendation4}
          titleRecommendation={`${t('recommendation')} 4`}
        />
        {/* Add padding to avoid having the last carousel item on buttons */}
        <View style={{ paddingBottom: screenWidth / 6 }} />
      </ScrollView>
      <VerticalBottomButtons />
    </SafeAreaView>
  );
}
