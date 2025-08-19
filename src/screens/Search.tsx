/**
 * Search - Advanced recipe search screen with filtering and real-time results
 *
 * A comprehensive search interface featuring real-time text search, advanced filtering
 * by ingredients/tags/categories, seasonal filtering, and responsive results display.
 * Integrates multiple search modes and maintains state efficiently for optimal UX.
 *
 * Key Features:
 * - Real-time recipe search with autocomplete suggestions
 * - Advanced multi-category filtering (ingredients, tags, types, seasonality)
 * - Dynamic filter management with state persistence
 * - Seasonal filter integration from global context
 * - Responsive grid layout for search results
 * - Smart state management preventing unnecessary re-renders
 * - Automatic cleanup of deleted recipes
 * - Performance logging for search analytics
 *
 * Search Modes:
 * - Text search: Real-time filtering by recipe title
 * - Filter mode: Advanced filtering with accordion interface
 * - Combined mode: Text search + applied filters
 * - Seasonal mode: Automatic filtering by ingredient seasonality
 *
 * Performance Optimizations:
 * - Efficient filter state management with Maps
 * - Smart re-rendering based on state changes
 * - Focus-based data synchronization
 * - Debounced search operations
 *
 * @example
 * ```typescript
 * // Navigation integration (typically in tab navigator)
 * <Tab.Screen
 *   name="Search"
 *   component={Search}
 *   options={{
 *     tabBarIcon: ({ color }) => <Icon name="search" color={color} />
 *   }}
 * />
 *
 * // The Search screen automatically handles:
 * // - Real-time recipe searching and filtering
 * // - Filter state management and persistence
 * // - Results display with responsive layout
 * // - Integration with seasonal filtering context
 * ```
 */

import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, SafeAreaView, ScrollView, View } from 'react-native';
import { ingredientTableElement, recipeTableElement } from '@customTypes/DatabaseElementTypes';
import { listFilter, TListFilter } from '@customTypes/RecipeFiltersTypes';
import {
  addValueToMultimap,
  editTitleInMultimap,
  extractFilteredRecipeDatas,
  filterFromRecipe,
  removeTitleInMultimap,
  removeValueToMultimap,
  retrieveAllFilters,
} from '@utils/FilterFunctions';
import RecipeDatabase from '@utils/RecipeDatabase';
import { useFocusEffect } from '@react-navigation/native';
import { useI18n } from '@utils/i18n';
import { Divider, Text, useTheme } from 'react-native-paper';
import SearchBar from '@components/organisms/SearchBar';
import SearchBarResults from '@components/organisms/SearchBarResults';
import FiltersSelection from '@components/organisms/FiltersSelection';
import { padding } from '@styles/spacing';
import RecipeCard from '@components/molecules/RecipeCard';
import FilterAccordion from '@components/organisms/FilterAccordion';
import { useSeasonFilter } from '@context/SeasonFilterContext';
import { searchLogger } from '@utils/logger';

/**
 * Search screen component - Advanced recipe search with filtering
 *
 * @returns JSX element representing the comprehensive search interface
 */
export function Search() {
  const { t } = useI18n();
  const { colors } = useTheme();

  const { seasonFilter } = useSeasonFilter();

  const [filtersState, setFiltersState] = useState(new Map<TListFilter, Array<string>>());
  const [filteredRecipes, setFilteredRecipes] = useState<Array<recipeTableElement>>(
    RecipeDatabase.getInstance().get_recipes()
  );
  const [filteredIngredients, setFilteredIngredients] = useState(
    new Array<ingredientTableElement>()
  );
  const [filteredTags, setFilteredTags] = useState(new Array<string>());
  const [filteredTitles, setFilteredTitles] = useState(new Array<string>());
  const [searchPhrase, setSearchPhrase] = useState('');
  const [searchBarClicked, setSearchBarClicked] = useState(false);
  const [addingFilterMode, setAddingFilterMode] = useState(false);

  /**
   * Updates the filtered recipes based on current filter state and triggers UI updates
   *
   * This is the core filtering function that applies all active filters to the recipe array,
   * updates the filtered results, and extracts relevant data for autocomplete/suggestions.
   * Includes performance logging for search analytics and optimization.
   *
   * @param recipeArray - Array of recipes to filter (usually all recipes or current subset)
   *
   * Side Effects:
   * - Updates filteredRecipes state with filtered results
   * - Calls extractTitleTagsAndIngredients to update suggestion data
   * - Logs performance metrics for search operations
   * - Triggers re-render of search results
   */
  const updateFilteredRecipes = useCallback(
    (recipeArray: Array<recipeTableElement>) => {
      searchLogger.debug('Filtering recipes', {
        totalRecipes: recipeArray.length,
        activeFilters: Array.from(filtersState.entries()).map(([key, values]) => ({
          filter: key,
          values,
        })),
        searchPhrase: searchPhrase || 'none',
      });
      const recipesFiltered = filterFromRecipe(recipeArray, filtersState, t);
      setFilteredRecipes([...recipesFiltered]);
      extractTitleTagsAndIngredients(recipesFiltered);
      searchLogger.debug('Recipe filtering completed', {
        resultCount: recipesFiltered.length,
        filteredPercentage: Math.round((recipesFiltered.length / recipeArray.length) * 100),
      });
    },
    [filtersState, searchPhrase, t]
  );

  /**
   * Extracts and updates searchable data from filtered recipes for UI suggestions
   *
   * Processes the filtered recipe array to extract titles, ingredients, and tags
   * for use in autocomplete suggestions and filter options. This data is used
   * by the SearchBarResults and FilterAccordion components.
   *
   * @param recipeArray - Array of filtered recipes to extract data from
   *
   * Side Effects:
   * - Updates filteredTitles state for search autocomplete
   * - Updates filteredIngredients state for ingredient filter options
   * - Updates filteredTags state for tag filter options
   *
   * Performance Note:
   * Currently processes data in memory. Future optimization could move this
   * to SQL queries for better performance with large datasets.
   */
  function extractTitleTagsAndIngredients(recipeArray: Array<recipeTableElement>) {
    const [titles, ingredients, tags] = extractFilteredRecipeDatas(recipeArray);
    setFilteredTitles(titles);
    setFilteredIngredients(ingredients);
    setFilteredTags(tags);
    // TODO maybe call the database with the filter in it so that we benefit of the SQL optimizations and we don't take too much RAM
  }

  /**
   * Manages seasonal filter state synchronization with global context
   *
   * This function handles the complex logic for automatically adding or removing
   * the seasonal filter based on the global seasonal filter context state.
   * It ensures the filter state stays synchronized without creating conflicts
   * with user-applied filters.
   *
   * Business Logic:
   * - Adds seasonal filter when: global seasonal filter is ON and no other filters are active
   * - Removes seasonal filter when: global seasonal filter is OFF and it's the only active filter
   * - Prevents interference with user-managed filters in other scenarios
   *
   * Side Effects:
   * - May call addAFilterToTheState() to add seasonal filter
   * - May call removeAFilterToTheState() to remove seasonal filter
   * - Triggers filter state updates and recipe re-filtering
   *
   * Context Integration:
   * This function bridges the global SeasonFilterContext with local filter state,
   * ensuring seasonal filtering works seamlessly with manual filter management.
   */
  const checkIfUpdateOfSeasonFilterIsPossible = useCallback(() => {
    const seasonFilterKey = listFilter.inSeason;
    const seasonFilterValue = t(listFilter.inSeason);

    // Add the filter if there is already no filter set
    if (seasonFilter && filtersState.size === 0) {
      addAFilterToTheState(seasonFilterKey, seasonFilterValue);
    }
    // Remove the filter if it is the only one left
    else if (!seasonFilter && filtersState.size === 1 && filtersState.has(seasonFilterKey)) {
      removeAFilterToTheState(seasonFilterKey, seasonFilterValue);
    }
  }, [seasonFilter, filtersState, t, addAFilterToTheState, removeAFilterToTheState]);

  useEffect(() => {
    checkIfUpdateOfSeasonFilterIsPossible();
    extractTitleTagsAndIngredients(filteredRecipes);
  }, [checkIfUpdateOfSeasonFilterIsPossible, filteredRecipes]);

  // TODO Double rendering can occur when filter update
  useEffect(() => {
    updateFilteredRecipes(filteredRecipes);
  }, [filtersState, filteredRecipes, updateFilteredRecipes]);

  useEffect(() => {
    checkIfUpdateOfSeasonFilterIsPossible();
  }, [seasonFilter, checkIfUpdateOfSeasonFilterIsPossible]);

  // TODO use a context instead
  // Update filtered recipes when a recipe is deleted
  useFocusEffect(() => {
    if (filteredRecipes.length === RecipeDatabase.getInstance().get_recipes().length) {
      return;
    }
    let recipeDeletedName = '';
    for (const recipe of filteredRecipes) {
      if (!RecipeDatabase.getInstance().isRecipeExist(recipe)) {
        recipeDeletedName = recipe.title;
        break;
      }
    }
    if (recipeDeletedName.length > 0) {
      updateFilteredRecipes(filteredRecipes.filter(recipe => recipe.title !== recipeDeletedName));
    }
  });

  /**
   * Updates search string with performance optimizations for text-based filtering
   *
   * This function manages the search string state and applies optimizations to prevent
   * unnecessary filtering operations. It handles both clearing and updating search terms
   * with intelligent recipe set resetting for better performance.
   *
   * @param newSearchString - The new search term entered by the user
   *
   * Performance Optimizations:
   * - Resets to full recipe set when search is cleared (prevents over-filtering)
   * - Resets to full recipe set when search term is shortened (expands results)
   * - Only applies incremental filtering when search term is extended
   *
   * Side Effects:
   * - Updates searchPhrase state for UI display
   * - Modifies filtersState to include/exclude title filter
   * - May reset filteredRecipes to full database set for optimization
   * - Triggers re-filtering through filtersState change
   *
   * Search Logic:
   * - Empty string: Removes title filter and resets to all recipes
   * - Shortened string: Resets to all recipes to expand search scope
   * - Extended string: Continues filtering from current set
   */
  function updateSearchString(newSearchString: string) {
    if (newSearchString === '') {
      removeTitleInMultimap(filtersState);
      setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
    } else {
      const previousTitle = filtersState.get(listFilter.recipeTitleInclude);
      if (
        previousTitle !== undefined &&
        previousTitle.length == 1 &&
        previousTitle[0].length > newSearchString.length
      ) {
        setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
      }
      editTitleInMultimap(filtersState, newSearchString);
    }
    setFiltersState(new Map(filtersState));
    setSearchPhrase(newSearchString);
  }

  function addAFilterToTheState(filterTitle: TListFilter, value: string) {
    addValueToMultimap(filtersState, filterTitle, value);
    setFiltersState(new Map(filtersState));
  }

  function removeAFilterToTheState(filterTitle: TListFilter, value: string) {
    removeValueToMultimap(filtersState, filterTitle, value);
    setFilteredRecipes(RecipeDatabase.getInstance().get_recipes());
    setFiltersState(new Map(filtersState));

    if (filterTitle == listFilter.recipeTitleInclude) {
      setSearchPhrase('');
    }
  }

  /**
   * Locates and removes a specific filter value from the filter state
   *
   * This function implements a search algorithm to find which filter category
   * contains a specific value and removes it. Used primarily by the filter
   * removal interface where users can remove filters without knowing their category.
   *
   * @param item - The filter value to locate and remove (e.g., "tomato", "vegetarian")
   *
   * Algorithm:
   * - Iterates through all filter categories in filtersState
   * - Checks if any category's value array includes the target item
   * - Removes the first match found and exits (prevents duplicate removal)
   *
   * Side Effects:
   * - Calls removeAFilterToTheState() for the matching filter
   * - Triggers filter state update and recipe re-filtering
   * - May reset search phrase if removing title filter
   *
   * Use Cases:
   * - Filter chip removal in FiltersSelection component
   * - Quick filter removal without category selection
   * - Cleanup operations for filter management
   */
  function findFilterStringAndRemove(item: string) {
    for (const [key, value] of filtersState) {
      if (value.includes(item)) {
        removeAFilterToTheState(key, item);
        break;
      }
    }
  }

  const screenId = 'SearchScreen';
  const recipeCardsId = screenId + '::RecipeCards';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} testID={screenId}>
      {/* When there are no recipes, put flex on scrollView to child view to take the whole screen*/}
      <ScrollView
        contentContainerStyle={filteredRecipes.length === 0 ? { flex: 1 } : {}}
        showsVerticalScrollIndicator={true}
      >
        <SearchBar
          testId={screenId + '::SearchBar'}
          searchPhrase={searchPhrase}
          setSearchBarClicked={setSearchBarClicked}
          updateSearchString={updateSearchString}
        />

        {searchBarClicked ? (
          <SearchBarResults
            testId={screenId + '::SearchBarResults'}
            filteredTitles={filteredTitles}
            setSearchBarClicked={setSearchBarClicked}
            updateSearchString={updateSearchString}
          />
        ) : (
          <View>
            <FiltersSelection
              testId={screenId}
              filters={retrieveAllFilters(filtersState)}
              addingFilterMode={addingFilterMode}
              setAddingAFilter={setAddingFilterMode}
              onRemoveFilter={findFilterStringAndRemove}
            />

            <Divider testID={screenId + '::Divider'} />

            {addingFilterMode && (
              <FilterAccordion
                testId={screenId + '::FilterAccordion'}
                tagsList={filteredTags}
                ingredientsList={filteredIngredients}
                filtersState={filtersState}
                addFilter={addAFilterToTheState}
                removeFilter={removeAFilterToTheState}
              />
            )}
          </View>
        )}

        {!addingFilterMode &&
          !searchBarClicked &&
          (filteredRecipes.length > 0 ? (
            <FlatList
              data={filteredRecipes}
              keyExtractor={item => item.id?.toString() || item.title}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={{ padding: padding.small }}
              renderItem={({ item, index }: ListRenderItemInfo<recipeTableElement>) => (
                <RecipeCard testId={recipeCardsId + `::${index}`} size={'medium'} recipe={item} />
              )}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text testID={screenId + '::TextWhenEmpty'} variant={'titleMedium'}>
                {t('noRecipesFound')}
              </Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Search;
