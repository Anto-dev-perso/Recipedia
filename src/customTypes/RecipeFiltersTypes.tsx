

import { ingredientType, shoppingListTableElement } from './DatabaseElementTypes';

export const currentMonth = new Date().getMonth() + 1;

export type propsForFilter = {
    sectionsState: Array<TListFilter>
    ingredientsState: Array<recipeFilterType>,
    tagsState: Array<recipeFilterType>,
    prepTimeState: Array<recipeFilterType>,

    sectionsSetter: React.Dispatch<React.SetStateAction<Array<TListFilter>>>,
    setterIngredients: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setterTags: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setterPrepTime: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
}

export enum nonIngredientFilters {
    prepTime = "Preparation Time",
    inSeason = "In-season",
    tags = "Tags",
    purchased = "Already purchased",
    // kalories: "Kalories",
}

export const listFilter = { ...ingredientType, ...nonIngredientFilters } as const;
export type TListFilter = typeof listFilter[keyof typeof listFilter];


// TODO can we get rid of this array ?
export const filtersCategories: Array<TListFilter> = [
    listFilter.inSeason,
    listFilter.prepTime,
    listFilter.tags,
    listFilter.cerealProduct,
    listFilter.condiment,
    listFilter.sauce,
    listFilter.vegetable,
    listFilter.meet,
    listFilter.poultry,
    listFilter.spice,
    listFilter.fish,
    listFilter.tofu,
    listFilter.dairy,
    listFilter.sugar,
    listFilter.fruit,
];


export type recipeFilterType = {
    title: TListFilter,
    value: string,
}

export type propsForShopping = {
    ingList: Array<shoppingListTableElement>,
    setterIngList: React.Dispatch<React.SetStateAction<Array<shoppingListTableElement>>>,
}

export const shoppingCategories: Array<TListFilter> = [
    listFilter.cerealProduct,
    listFilter.condiment,
    listFilter.sauce,
    listFilter.vegetable,
    listFilter.meet,
    listFilter.poultry,
    listFilter.spice,
    listFilter.fish,
    listFilter.tofu,
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
]