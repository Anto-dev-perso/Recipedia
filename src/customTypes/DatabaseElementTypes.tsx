

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
    id? : number;
    image_Source: string;
    title: string;
    description: string;
    tags: Array<string>;
    persons: number;
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
    persons: number,
    ingredients: string,
    preparation: string,
    time: number,
}

export const recipeColumnsEncoding: Array<databaseColumnType> =  [
    { colName: recipeColumnsNames.image, type: encodedType.TEXT},
    { colName: recipeColumnsNames.title, type: encodedType.TEXT},
    { colName: recipeColumnsNames.description, type: encodedType.TEXT},
    { colName: recipeColumnsNames.tags, type: encodedType.TEXT},
    { colName: recipeColumnsNames.persons, type: encodedType.INTEGER},
    { colName: recipeColumnsNames.ingredients, type: encodedType.TEXT},
    { colName: recipeColumnsNames.preparation, type: encodedType.TEXT},
    { colName: recipeColumnsNames.time, type: encodedType.INTEGER},
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
 
export enum shoppingListColumnsNames {
  type = "TYPE",
  ingredient = "INGREDIENT",
  quantity = "QUANTITY",
  unit = "UNIT",
  recipeTitles = "RECIPES TITLES",
  purchased = "PURCHASED"
}

export const shoppingListColumnsEncoding: Array<databaseColumnType> =  [
  { colName: shoppingListColumnsNames.type, type: encodedType.TEXT},
  { colName: shoppingListColumnsNames.ingredient, type: encodedType.TEXT},
  { colName: shoppingListColumnsNames.quantity, type: encodedType.FLOAT},
  { colName: shoppingListColumnsNames.unit, type: encodedType.TEXT},
  { colName: shoppingListColumnsNames.recipeTitles, type: encodedType.TEXT},
  { colName: shoppingListColumnsNames.purchased, type: encodedType.BLOB},
]