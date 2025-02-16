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

export type TIngredientCategories = typeof ingredientType[keyof typeof ingredientType];
export const shoppingCategories: Array<TIngredientCategories> = Object.values(ingredientType);


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
