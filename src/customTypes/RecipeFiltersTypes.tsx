/**
 * TODO fill this part
 * @format
 */

export const currentMonth = new Date().getMonth() + 1;

export type propsForFilter = {
    sectionsState: Array<listFilter>
    ingredientsState: Array<recipeFilterType>,
    tagsState: Array<recipeFilterType>,
    prepTimeState: Array<recipeFilterType>,

    sectionsSetter: React.Dispatch<React.SetStateAction<Array<listFilter>>>,
    setterIngredients: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setterTags: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setterPrepTime: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
}

export enum listFilter {
    prepTime = "Preparation Time",
    tags = "Tags",
    inSeason = "In-season",
    cerealProduct = "Cereal Product",
    vegetable = "Vegetable",
    meet = "Meet",
    poultry = "Poutry",
    spice = "Spice",
    // kalories: "Kalories",
}

export const filtersCategories: Array<listFilter> = [
    listFilter.inSeason,
    listFilter.prepTime,
    listFilter.tags,
    listFilter.cerealProduct,
    listFilter.vegetable,
    listFilter.meet,
    listFilter.poultry,
    listFilter.spice,
];

export type recipeFilterType = {
    title: listFilter,
    value: string,
}

export const isSeasonValue = ["Only in-season ingredients"];

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