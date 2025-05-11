import {ingredientType, shoppingListTableElement} from './DatabaseElementTypes';

export const currentMonth = new Date().getMonth() + 1;
export type filtersAccessAndModifiers = {
    filtersState: Map<TListFilter, Array<string>>,
    addFilter: (filter: TListFilter, value: string) => void,
    removeFilter: (filter: TListFilter, value: string) => void,
}

/**
 * Non-ingredient filters with values that match translation keys
 * The actual display values will come from translations
 */
export enum nonIngredientFilters {
    recipeTitleInclude = 'filterTypes.recipeTitleInclude',
    prepTime = 'filterTypes.prepTime',
    inSeason = 'filterTypes.inSeason',
    tags = 'filterTypes.tags',
    purchased = 'filterTypes.purchased',
    // calories: "filterTypes.calories",
}

// Combine all filters into a single object
export const listFilter = {...ingredientType, ...nonIngredientFilters} as const;

// Type for all filter values
export type TListFilter = typeof listFilter[keyof typeof listFilter];

// Array of all filter values for use in UI components
export const filtersCategories: Array<TListFilter> = Object.values(listFilter);

// Props for shopping-related components
export type propsForShopping = {
    ingList: Array<shoppingListTableElement>,
    updateIngredientFromShopping: (ingredientName: string) => void,
}

// Type for ingredient categories
export type TIngredientCategories = typeof ingredientType[keyof typeof ingredientType];

// Array of ingredient categories for use in UI components
export const shoppingCategories: Array<TIngredientCategories> = Object.values(ingredientType);

export const prepTimeValues = [
    'preparationTimes.noneToTen',
    'preparationTimes.tenToFifteen',
    'preparationTimes.FifteenToTwenty',
    'preparationTimes.twentyToTwentyFive',
    'preparationTimes.twentyFiveToThirty',
    'preparationTimes.thirtyToFourty',
    'preparationTimes.fourtyToFifty',
    'preparationTimes.oneHourPlus',
];
