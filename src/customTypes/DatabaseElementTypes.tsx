import {textSeparator, unitySeparator} from "@styles/typography";
import {TListFilter} from "./RecipeFiltersTypes";

export const recipeDatabaseName = "RecipesDatabase";
export const recipeTableName = "RecipesTable";
export const ingredientsTableName = "IngredientsTable";
export const tagTableName = "TagsTable";
export const nutritionTableName = "NutritionnalValueTable";

export const shoppingListTableName = "ShoppingListTable";

export const regExp = /["{}\\]+/g;

export enum encodedType {
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BLOB = "BLOB",
    TEXT = "TEXT",
}

export type databaseColumnType = {
    colName: string,
    type: encodedType,
};

export enum recipeColumnsNames {
    image = "IMAGE_SOURCE",
    title = "TITLE",
    description = "DESCRIPTION",
    tags = "TAGS",
    persons = "PERSONS",
    ingredients = "INGREDIENTS",
    preparation = "PREPARATION",
    time = "TIME",
}

export type recipeTableElement = {
    id?: number;
    image_Source: string;
    title: string;
    description: string;
    tags: Array<tagTableElement>;
    persons: number;
    ingredients: Array<ingredientTableElement>;
    season: Array<string>;
    preparation: Array<string>;
    time: number,
}

export type encodedRecipeElement = {
    ID: number,
    IMAGE_SOURCE: string,
    TITLE: string,
    DESCRIPTION: string,
    TAGS: string,
    PERSONS: number,
    INGREDIENTS: string,
    PREPARATION: string,
    TIME: number,
}

export const recipeColumnsEncoding: Array<databaseColumnType> = [
    {colName: recipeColumnsNames.image, type: encodedType.TEXT},
    {colName: recipeColumnsNames.title, type: encodedType.TEXT},
    {colName: recipeColumnsNames.description, type: encodedType.TEXT},
    {colName: recipeColumnsNames.tags, type: encodedType.TEXT},
    {colName: recipeColumnsNames.persons, type: encodedType.INTEGER},
    {colName: recipeColumnsNames.ingredients, type: encodedType.TEXT},
    {colName: recipeColumnsNames.preparation, type: encodedType.TEXT},
    {colName: recipeColumnsNames.time, type: encodedType.INTEGER},
];


export type ingredientTableElement = {
    id?: number,
    ingName: string,
    unit: string,
    quantity?: number,
    type: ingredientType,
    season: Array<string>,
}
export type encodedIngredientElement = {
    ID: number,
    INGREDIENT: string,
    UNIT: string,
    TYPE: string,
    SEASON: string,
};

export const ingredientsColumnsNames: Array<databaseColumnType> = [
    {colName: "INGREDIENT", type: encodedType.TEXT},
    {colName: "UNIT", type: encodedType.TEXT},
    {colName: "TYPE", type: encodedType.TEXT},
    {colName: "SEASON", type: encodedType.TEXT},
];


export type nutritionTableElement = {
    id?: number,
    type: string,
    unit: string,
}

export const nutritionColumnsNames: Array<databaseColumnType> = [
    {colName: "INGREDIENT", type: encodedType.TEXT},
    {colName: "UNIT", type: encodedType.TEXT}
];
export type tagTableElement = {
    id?: number,
    tagName: string,
}

export const tagsColumnsNames: Array<databaseColumnType> = [
    {colName: "NAME", type: encodedType.TEXT},
];

export type encodedTagElement = {
    ID: number,
    NAME: string;
};


export type shoppingListTableElement = {
    id?: number,
    type: TListFilter,
    name: string,
    quantity: number,
    unit: string,
    recipesTitle: Array<string>, // TODO how to encode when we add multiple times the same recipe ?
    purchased: boolean,
}

export type encodedShoppingListElement = {
    ID: number,
    TYPE: string,
    INGREDIENT: string,
    QUANTITY: number,
    UNIT: string,
    TITLES: string,
    PURCHASED: number,
}

export enum shoppingListColumnsNames {
    type = "TYPE",
    ingredient = "INGREDIENT",
    quantity = "QUANTITY",
    unit = "UNIT",
    recipeTitles = "TITLES",
    purchased = "PURCHASED"
}

export const shoppingListColumnsEncoding: Array<databaseColumnType> = [
    {colName: shoppingListColumnsNames.type, type: encodedType.TEXT},
    {colName: shoppingListColumnsNames.ingredient, type: encodedType.TEXT},
    {colName: shoppingListColumnsNames.quantity, type: encodedType.FLOAT},
    {colName: shoppingListColumnsNames.unit, type: encodedType.TEXT},
    {colName: shoppingListColumnsNames.recipeTitles, type: encodedType.TEXT},
    {colName: shoppingListColumnsNames.purchased, type: encodedType.BLOB},
];


export function arrayOfType(ingredients: Array<ingredientTableElement>, filter: string): Array<ingredientTableElement> {
    return ingredients.filter(ingredient => ingredient.type == filter)
}

// TODO use more this function
export function extractIngredientsNameWithQuantity(ingredients: Array<ingredientTableElement>): Array<string> {
    return ingredients.map(ingredient => ingredient.quantity + unitySeparator + ingredient.unit + textSeparator + ingredient.ingName);
}

export function extractTagsName(tags: Array<tagTableElement>): Array<string> {
    let result = new Array<string>();
    tags.forEach(element => {
        result.push(element.tagName)
    });

    return result;
}

export function isRecipeEqual(recipe1: recipeTableElement, recipe2: recipeTableElement): boolean {
    return ((recipe1.image_Source == recipe2.image_Source)
        && (recipe1.image_Source == recipe2.image_Source)
        && (recipe1.title == recipe2.title)
        && (recipe1.description == recipe2.description)
        && (JSON.stringify(recipe1.tags) == JSON.stringify(recipe2.tags))
        && (recipe1.persons == recipe2.persons)
        && (JSON.stringify(recipe1.ingredients) == JSON.stringify(recipe2.ingredients))
        && (JSON.stringify(recipe1.season) == JSON.stringify(recipe2.season))
        && (JSON.stringify(recipe1.preparation) == JSON.stringify(recipe2.preparation))
        && (recipe1.time == recipe2.time)
    )
}

export function isIngredientEqual(ingredient1: ingredientTableElement, ingredient2: ingredientTableElement): boolean {
    return ((ingredient1.ingName == ingredient2.ingName)
        && (ingredient1.unit == ingredient2.unit)
        && ((ingredient1.type == ingredientType.undefined) || (ingredient2.type == ingredientType.undefined) || (ingredient1.type == ingredient2.type))
    )
}

export function isTagEqual(tag1: tagTableElement, tag2: tagTableElement): boolean {
    return (tag1.tagName == tag2.tagName)
}

export function isShoppingEqual(shop1: shoppingListTableElement, shop2: shoppingListTableElement): boolean {
    return ((shop1.type == shop2.type) && (shop1.name == shop2.name) && (shop1.unit == shop2.unit))
}

export enum ingredientType {
    grainOrCereal = "Grain or Cereal",
    legumes = "Legumes",
    vegetable = "Vegetable",
    plantProtein = "Plant Protein",
    condiment = "Condiment",
    sauce = "Sauce",
    meat = "Meat",
    poultry = "Poultry",
    fish = "Fish",
    seafood = "Seafood",
    dairy = "Dairy",
    cheese = "Cheese",
    sugar = "Sugar",
    spice = "Spice",
    fruit = "Fruit",
    oilAndFat = "Oil and Fat",
    nutsAndSeeds = "Nuts and Seeds",
    sweetener = "Sweetener",
    undefined = "Undefined", // TODO get rid of this undefined value
}
