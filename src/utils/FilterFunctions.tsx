/**
 * FilterFunctions - Utility functions for recipe filtering and search operations
 *
 * This module provides comprehensive filtering capabilities for recipes based on various criteria
 * such as ingredients, tags, preparation time, and seasonal availability. It includes functions
 * for building filter categories, applying filters to recipe collections, and managing
 * filter state using Maps and multimaps.
 */

import {
  arrayOfType,
  ingredientTableElement,
  recipeTableElement,
} from '@customTypes/DatabaseElementTypes';
import {
  FiltersAppliedToDatabase,
  filtersCategories,
  listFilter,
  prepTimeValues,
  TListFilter,
} from '@customTypes/RecipeFiltersTypes';
import { TFunction } from 'i18next';
import { searchLogger } from '@utils/logger';

/**
 * Creates filter categories with available values for UI display
 *
 * Processes different filter types (tags, ingredients by type, prep time, seasonal)
 * and returns structured data for filter UI components.
 *
 * @param tagsList - Array of available tag names
 * @param ingredientsList - Array of available ingredients
 * @param t - Translation function for internationalization
 * @returns Array of filter categories with their available values
 *
 * @example
 * ```typescript
 * const filters = selectFilterCategoriesValuesToDisplay(
 *   ["Dessert", "Main Course"],
 *   ingredients,
 *   t
 * );
 * ```
 */
export function selectFilterCategoriesValuesToDisplay(
  tagsList: Array<string>,
  ingredientsList: Array<ingredientTableElement>,
  t: TFunction<'translation', undefined>
): Array<FiltersAppliedToDatabase> {
  return filtersCategories.map(category => {
    const filterApplyToDatabase: FiltersAppliedToDatabase = {
      title: category as TListFilter,
      data: [],
    };
    switch (category) {
      case listFilter.inSeason:
        filterApplyToDatabase.data = new Array<string>(t(listFilter.inSeason));
        break;
      case listFilter.tags:
        filterApplyToDatabase.data = tagsList;
        break;
      case listFilter.prepTime:
        filterApplyToDatabase.data = prepTimeValues.map(time => t(time));
        break;
      case listFilter.recipeTitleInclude:
      case listFilter.purchased:
      case listFilter.grainOrCereal:
      case listFilter.legumes:
      case listFilter.vegetable:
      case listFilter.plantProtein:
      case listFilter.condiment:
      case listFilter.sauce:
      case listFilter.meat:
      case listFilter.poultry:
      case listFilter.fish:
      case listFilter.seafood:
      case listFilter.dairy:
      case listFilter.cheese:
      case listFilter.sugar:
      case listFilter.spice:
      case listFilter.fruit:
      case listFilter.oilAndFat:
      case listFilter.nutsAndSeeds:
      case listFilter.sweetener:
      case listFilter.undefined:
        filterApplyToDatabase.data = arrayOfType(ingredientsList, category).map(ing => ing.name);
        break;
      default:
        searchLogger.warn('selectFilterValuesToDisplay:: default shall not be reach');
        filterApplyToDatabase.data = new Array<string>();
    }

    return filterApplyToDatabase;
  });
}

/**
 * Extracts unique ingredients, tags, and titles from a recipe collection
 *
 * Processes an array of recipes to extract all unique ingredients, tags, and titles
 * for use in filter dropdowns and search suggestions.
 *
 * @param recipeArray - Array of recipes to process
 * @returns Tuple containing [sorted titles, unique ingredients, sorted tags]
 *
 * @example
 * ```typescript
 * const [titles, ingredients, tags] = extractFilteredRecipeDatas(recipes);
 * console.log(`Found ${ingredients.length} unique ingredients`);
 * ```
 */
export function extractFilteredRecipeDatas(
  recipeArray: Array<recipeTableElement>
): [Array<string>, Array<ingredientTableElement>, Array<string>] {
  // TODO is set really faster in this case ? To profile
  const ingredientsUniqueCollection = new Array<ingredientTableElement>();
  const tagsUniqueCollection = new Set<string>();

  for (const element of recipeArray) {
    for (const ing of element.ingredients) {
      if (
        ingredientsUniqueCollection.find(ingredient => ingredient.name === ing.name) === undefined
      ) {
        ingredientsUniqueCollection.push(ing);
      }
    }
    for (const tag of element.tags) {
      tagsUniqueCollection.add(tag.name);
    }
  }

  const titleSortedArray = recipeArray.map(({ title }) => title).sort();

  return [
    titleSortedArray,
    ingredientsUniqueCollection.sort(),
    Array.from(tagsUniqueCollection).sort(),
  ];
}

/**
 * Filters recipes based on multiple criteria using a multimap structure
 *
 * Applies various filters to a recipe collection including preparation time,
 * title search, seasonal availability, tags, and ingredient types.
 *
 * @param recipeArray - Array of recipes to filter
 * @param filter - Map of filter criteria (multimap: filter type -> array of values)
 * @param t - Translation function for internationalization
 * @returns Filtered array of recipes that match ALL specified criteria
 *
 * @example
 * ```typescript
 * const filters = new Map();
 * filters.set(listFilter.tags, ["Dessert", "Quick"]);
 * filters.set(listFilter.prepTime, ["15-30"]);
 *
 * const filtered = filterFromRecipe(allRecipes, filters, t);
 * ```
 */
export function filterFromRecipe(
  recipeArray: Array<recipeTableElement>,
  filter: Map<TListFilter, Array<string>>,
  t: TFunction<'translation', undefined>
): Array<recipeTableElement> {
  if (filter.size == 0) {
    return recipeArray;
  }
  return new Array<recipeTableElement>(
    ...recipeArray.filter(recipe => {
      let elementToKeep = true;
      for (const [key, value] of filter) {
        switch (key) {
          case listFilter.prepTime:
            elementToKeep = elementToKeep && applyToRecipeFilterPrepTime(recipe, value, t);
            break;
          case listFilter.recipeTitleInclude:
            elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.title, value);
            break;
          case listFilter.inSeason:
            elementToKeep = elementToKeep && isTheElementContainsTheFilter(recipe.season, value);
            break;
          case listFilter.tags:
            elementToKeep =
              elementToKeep &&
              isTheElementContainsTheFilter(
                recipe.tags.map(tag => tag.name),
                value
              );
            break;
          case listFilter.purchased:
            // Nothing to do so break
            break;
          case listFilter.grainOrCereal:
          case listFilter.legumes:
          case listFilter.vegetable:
          case listFilter.plantProtein:
          case listFilter.condiment:
          case listFilter.sauce:
          case listFilter.meat:
          case listFilter.poultry:
          case listFilter.fish:
          case listFilter.seafood:
          case listFilter.dairy:
          case listFilter.cheese:
          case listFilter.sugar:
          case listFilter.spice:
          case listFilter.fruit:
          case listFilter.oilAndFat:
          case listFilter.nutsAndSeeds:
          case listFilter.sweetener:
            elementToKeep =
              elementToKeep &&
              isTheElementContainsTheFilter(
                recipe.ingredients.map(ing => ing.name),
                value
              );
            break;
          case listFilter.undefined:
          default:
            searchLogger.error('filterFromRecipe:: Impossible to reach');
            break;
        }
      }
      return elementToKeep;
    })
  );
}

/**
 * Adds a value to a multimap (Map with Array values)
 *
 * Creates a new array for the key if it doesn't exist, or adds the value
 * to the existing array if the value isn't already present.
 *
 * @param multimap - The multimap to modify
 * @param key - The key to add the value under
 * @param value - The value to add
 *
 * @example
 * ```typescript
 * const filters = new Map();
 * addValueToMultimap(filters, listFilter.tags, "Dessert");
 * addValueToMultimap(filters, listFilter.tags, "Quick");
 * ```
 */
export function addValueToMultimap<TKey, TValue>(
  multimap: Map<TKey, Array<TValue>>,
  key: TKey,
  value: TValue
) {
  const values = multimap.get(key);
  if (values === undefined) {
    multimap.set(key, new Array<TValue>(value));
  } else {
    if (!values.includes(value)) {
      values.push(value);
    }
  }
}

/**
 * Removes a value from a multimap (Map with Array values)
 *
 * Removes the specified value from the array associated with the key.
 * If the array becomes empty, removes the key entirely.
 *
 * @param multimap - The multimap to modify
 * @param key - The key containing the value to remove
 * @param value - The value to remove
 *
 * @example
 * ```typescript
 * removeValueToMultimap(filters, listFilter.tags, "Dessert");
 * ```
 */
export function removeValueToMultimap<TKey, TValue>(
  multimap: Map<TKey, Array<TValue>>,
  key: TKey,
  value: TValue
) {
  const values = multimap.get(key);
  if (values !== undefined) {
    const valueIndex = values.indexOf(value);
    if (valueIndex != -1) {
      values.splice(valueIndex, 1);
      if (values.length == 0) {
        multimap.delete(key);
      }
    } else {
      searchLogger.warn(
        `removeValueFromMultimap: Trying to remove value ${value} at key ${key} from multimap but value finding fails`
      );
    }
  } else {
    searchLogger.warn(
      `removeValueFromMultimap: Trying to remove value ${value} at key ${key} from multimap but key finding fails`
    );
  }
}

/**
 * Updates the recipe title search filter in a multimap
 *
 * Sets or updates the title search string in the filter multimap.
 * Used for real-time search as the user types.
 *
 * @param multimap - The filter multimap to modify
 * @param newSearchString - The new search string for recipe titles
 *
 * @example
 * ```typescript
 * editTitleInMultimap(filters, "chocolate cake");
 * ```
 */
export function editTitleInMultimap(
  multimap: Map<TListFilter, Array<string>>,
  newSearchString: string
) {
  // TODO to refactor to a direct modification of the Multimap
  const value = multimap.get(listFilter.recipeTitleInclude);
  if (multimap.size == 0 || value === undefined) {
    multimap.set(listFilter.recipeTitleInclude, new Array<string>(newSearchString));
  } else {
    if (value.length > 1) {
      searchLogger.warn('updateSearchString:: Not possible');
    } else {
      value[0] = newSearchString;
    }
  }
}

/**
 * Removes the recipe title search filter from a multimap
 *
 * @param multimap - The filter multimap to modify
 *
 * @example
 * ```typescript
 * removeTitleInMultimap(filters); // Clear search text
 * ```
 */
export function removeTitleInMultimap(multimap: Map<TListFilter, Array<string>>) {
  multimap.delete(listFilter.recipeTitleInclude);
}

// TODO in case of creating a multimap
/*
        const tmp = new Map<string, Array<string>>();
        for (const filter of filterMultimap) {
            switch (filter.title) {
                case listFilter.prepTime:
                    addValueToMultimap(tmp, listFilter.prepTime, filter.value);
                    break;
                case listFilter.recipeTitleInclude:
                    addValueToMultimap(tmp, listFilter.recipeTitleInclude, filter.value);
                    break;
                case listFilter.inSeason:
                    addValueToMultimap(tmp, listFilter.inSeason, filter.value);
                    break;
                case listFilter.tags:
                    addValueToMultimap(tmp, listFilter.tags, filter.value);
                    break;
                case listFilter.grainOrCereal:
                case listFilter.legumes:
                case listFilter.vegetable:
                case listFilter.plantProtein:
                case listFilter.condiment:
                case listFilter.sauce:
                case listFilter.meat:
                case listFilter.poultry:
                case listFilter.fish:
                case listFilter.seafood:
                case listFilter.dairy:
                case listFilter.cheese:
                case listFilter.sugar:
                case listFilter.spice:
                case listFilter.fruit:
                case listFilter.oilAndFat:
                case listFilter.nutsAndSeeds:
                case listFilter.sweetener:
                    // TODO for now use grainOrCereal but not that a good idea
                    addValueToMultimap(tmp, listFilter.grainOrCereal, filter.value);
                    break;
                case listFilter.undefined:
                default:
                    searchLogger.error(`filterFromRecipe:: Unknown type `, filter.title);
            }
        }
        */

/**
 * Retrieves all filter values from a multimap as a flat array
 *
 * Extracts all values from all filter categories and combines them
 * into a single array for display or processing.
 *
 * @param filters - The filter multimap
 * @returns Flat array of all filter values
 *
 * @example
 * ```typescript
 * const allValues = retrieveAllFilters(filters);
 * console.log(`Total active filters: ${allValues.length}`);
 * ```
 */
export function retrieveAllFilters(filters: Map<TListFilter, Array<string>>): Array<string> {
  const allFilters = new Array<string>();
  for (const value of filters.values()) {
    allFilters.push(...value);
  }
  return allFilters;
}

/**
 * Checks if an element (string or array) contains any of the specified filter values
 *
 * Handles both string and array inputs with different matching logic:
 * - For arrays: Uses strict equality for element matching
 * - For strings: Uses substring matching (includes)
 *
 * @param elementToTest - The element to test (recipe title, tags array, etc.)
 * @param filters - The filter values to search for
 * @returns True if any filter value is found in the element
 */
function isTheElementContainsTheFilter(
  elementToTest: string | Array<string>,
  filters: Array<string> | string
): boolean {
  if (filters instanceof Array) {
    for (const filterValue of filters) {
      if (filterValue == '*') {
        return true;
      }
      // Careful here because includes does not lean the same for array and string
      // For array, we want s strict equality while a string not
      // string case will happen on title only and we won't have strict equality here
      if (elementToTest.includes(filterValue)) {
        return true;
      }
    }
  } else {
    return elementToTest.includes(filters);
  }

  return false;
}

/**
 * Applies preparation time filters to a recipe
 *
 * Checks if a recipe's preparation time falls within any of the specified time intervals.
 * Handles both range intervals (e.g., "15-30") and open-ended intervals (e.g., "60+").
 *
 * @param recipe - The recipe to test
 * @param filterTimeIntervals - Array of time interval strings to check against
 * @param t - Translation function for internationalization
 * @returns True if recipe time matches any of the filter intervals
 */
function applyToRecipeFilterPrepTime(
  recipe: recipeTableElement,
  filterTimeIntervals: Array<string>,
  t: TFunction<'translation', undefined>
): boolean {
  for (const curFilter of filterTimeIntervals) {
    const translatedTimeFilter = t(curFilter);
    const minutesTranslated = t('timeSuffixEdit');
    if (curFilter == prepTimeValues[prepTimeValues.length - 1]) {
      if (
        Number(translatedTimeFilter.replace(minutesTranslated, '').replace('+', '')) <= recipe.time
      ) {
        return true;
      }
    } else {
      const [beginTime, endTime] = translatedTimeFilter.replace(minutesTranslated, '').split(`-`);
      if (Number(beginTime) <= recipe.time && recipe.time <= Number(endTime)) {
        return true;
      }
    }
  }
  return false;
}
