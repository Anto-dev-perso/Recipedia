import {ingredientType, shoppingListTableElement} from './DatabaseElementTypes';

export const currentMonth = new Date().getMonth() + 1;
export type filtersAccessAndModifiers = {
    filtersState: Map<TListFilter, Array<string>>,
    addFilter: (filter: TListFilter, value: string) => void,
    removeFilter: (filter: TListFilter, value: string) => void,
}


export enum nonIngredientFilters {
    recipeTitleInclude = "recipeTitleInclude",
    prepTime = "Preparation Time",
    inSeason = "In-season",
    tags = "Tags",
    purchased = "Already purchased",
    // calories: "Calories",
}

export const listFilter = {...ingredientType, ...nonIngredientFilters} as const;

export type TListFilter = typeof listFilter[keyof typeof listFilter];
export const filtersCategories: Array<TListFilter> = Object.values(listFilter);


export type propsForShopping = {
    ingList: Array<shoppingListTableElement>,
    updateIngredientFromShopping: (ingredientName: string) => void,
}

export const shoppingCategories: Array<TListFilter> = [
    listFilter.grainOrCereal,
    listFilter.condiment,
    listFilter.sauce,
    listFilter.vegetable,
    listFilter.meat,
    listFilter.poultry,
    listFilter.spice,
    listFilter.fish,
    listFilter.plantProtein,
    listFilter.dairy,
    listFilter.purchased,
    listFilter.sugar,
    listFilter.fruit,
];

export const prepTimeValues = [
    "0-10 min",
    "10-15 min",
    "15-20 min",
    "20-25 min",
    "25-30 min",
    "30-40 min",
    "40-50 min",
    "+60 min",
];
