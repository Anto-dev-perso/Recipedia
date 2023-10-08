/**
 * TODO fill this part
 * @format
 */

import { textSeparator } from "@styles/typography";
import { listFilter } from "./RecipeFiltersTypes";

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

export type recipeTableElement = {
    id? : number;
    image_Source: string;
    title: string;
    description: string;
    tags: Array<string>;
    ingredients: Array<string>;
    season: string;
    preparation: Array<string>;
    time: number,
}

export type encodedRecipeElement = {
    id?: number,
    image: string,
    title: string,
    description: string,
    tags: string,
    ingredients: string,
    preparation: string,
    time: number,
}

export const recipeColumnsEncoding: Array<databaseColumnType> =  [
    { colName: "IMAGE_SOURCE", type: encodedType.TEXT},
    { colName: "TITLE", type: encodedType.TEXT},
    { colName: "DESCRIPTION", type: encodedType.TEXT},
    { colName: "TAGS", type: encodedType.TEXT},
    { colName: "INGREDIENTS", type: encodedType.TEXT},
    { colName: "PREPARATION", type: encodedType.TEXT},
    { colName: "TIME", type: encodedType.INTEGER},
  ]

  export function ingredientWithoutType(ingredient: string){
    let result = "";

    const splitIngredient = ingredient.split(textSeparator);
    result = splitIngredient[0] + textSeparator + splitIngredient[1];

    return result.replace(regExp, "");
  }

  export function ingredientWithoutTypeAndQuantity(ingredient: string){
    return ingredient.split(textSeparator)[0].replace(regExp, "");
  }

  export function arrayOfIngredientWithoutType(ingredients: Array<string>){
    let result = new Array<string>();
    ingredients.forEach(element => {
        result.push(ingredientWithoutType(element))
    });
    
    return result;
  }

  export function retrieveTypeFromIngredient(ingredient: string){
    return ingredient.split(textSeparator)[1].replace(regExp, "");
  }

  export function arrayOfType(ingredients: Array<string>, filter: string){
    let result = new Array<string>();
    ingredients.forEach(element => {
        if(element.includes(filter)){
            result.push(ingredientWithoutTypeAndQuantity(element))
        }
    });
    return result;
  }

export const recipeColumnsNames = {
    image: recipeColumnsEncoding[0].colName,
    title: recipeColumnsEncoding[1].colName,
    description: recipeColumnsEncoding[2].colName,
    tags: recipeColumnsEncoding[3].colName,
    ingredients: recipeColumnsEncoding[4].colName,
    preparation: recipeColumnsEncoding[5].colName,
    time: recipeColumnsEncoding[6].colName,
}

export enum ingredientType {
    base = "Cereal Product",
    vegetable = "Vegetable",
    condiment = "Condiment",
    sauce = "Sauce",
    meet = "Meet",
    poultry = "Poultry",
    fish = "Fish",
    tofu = "Tofu",
    dairy = "Dairy",
    sugar = "Sugar",
    spice = "Spice",
    fruit = "Fruit",
}
  
export type ingredientTableElement = {
    id?: number,
    ingName: string,
    unit: string,
    type: ingredientType,
    season: string,
}

export const ingredientsColumnsNames: Array<databaseColumnType> =  [
    { colName: "INGREDIENT", type: encodedType.TEXT},
    { colName: "UNIT", type: encodedType.TEXT},
    { colName: "TYPE", type: encodedType.TEXT},
    { colName: "SEASON", type: encodedType.TEXT},
  ]


export type nutritionTableElement = {
    id?: number,
    type: string,
    unit: string,
}

export const nutritionColumnsNames: Array<databaseColumnType> =  [
    { colName: "INGREDIENT", type: encodedType.TEXT},
    { colName: "UNIT", type: encodedType.TEXT}
  ]

export type tagTableElement = {
    id?: number,
    tagName: string,
}


export const tagsColumnsNames: Array<databaseColumnType> =  [
    { colName: "NAME", type: encodedType.TEXT},
  ]

  export type shoppingListTableElement = {
    id?: number,
    type: listFilter,
    name: string,
    quantity: number,
    unit: string,
    recipes: Array<string>,
    purchased: boolean,
}

export type encodedShoppingListElement = {
  id?: number,
  type: string,
  name: string,
  quantity: number,
  unit: string,
  recipes: string,
  purchased: boolean,
}

export const shoppingListColumnsEncoding: Array<databaseColumnType> =  [
  { colName: "TYPE", type: encodedType.TEXT},
  { colName: "INGREDIENT", type: encodedType.TEXT},
  { colName: "QUANTITY", type: encodedType.FLOAT},
  { colName: "UNIT", type: encodedType.TEXT},
  { colName: "RECIPES TITLES", type: encodedType.TEXT},
  { colName: "PURCHASED", type: encodedType.BLOB},
]

export const shoppingListColumnsNames = {
  type: shoppingListColumnsEncoding[0].colName,
  ingredient: shoppingListColumnsEncoding[1].colName,
  quantity: shoppingListColumnsEncoding[2].colName,
  unit: shoppingListColumnsEncoding[3].colName,
  recipeTitles: shoppingListColumnsEncoding[4].colName,
  purchased: shoppingListColumnsEncoding[5].colName,
}