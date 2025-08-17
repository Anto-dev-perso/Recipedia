/**
 * DatabaseElementTypes - Comprehensive type definitions for Recipedia database schema
 * 
 * This module defines all TypeScript types, interfaces, and utility functions for
 * interacting with the SQLite database. Includes table schemas, encoding/decoding
 * functions, and type-safe database operations.
 * 
 * Key Features:
 * - Complete type safety for database operations
 * - Bi-directional encoding/decoding between TypeScript and SQLite
 * - Utility functions for data transformation and comparison
 * - Comprehensive schema definitions for all tables
 * - Type-safe ingredient categorization system
 * - Shopping list integration with recipe data
 * - Seasonal filtering type support
 * 
 * Database Schema:
 * - **Recipes**: Complete recipe data with relationships
 * - **Ingredients**: Ingredient master data with seasonality
 * - **Tags**: Recipe categorization system
 * - **Shopping List**: Dynamic shopping list with recipe tracking
 * - **Nutrition**: Nutritional information (future implementation)
 * 
 * Type Safety Patterns:
 * - Discriminated unions for ingredient types
 * - Optional ID fields for new vs existing records
 * - Encoded vs decoded types for database serialization
 * - Utility functions for type checking and comparison
 * 
 * @example
 * ```typescript
 * // Creating a new recipe
 * const newRecipe: recipeTableElement = {
 *   title: "Chocolate Chip Cookies",
 *   description: "Classic homemade cookies",
 *   image_Source: "/path/to/image.jpg",
 *   ingredients: [
 *     {
 *       name: "flour",
 *       quantity: "2",
 *       unit: "cups",
 *       type: ingredientType.grainOrCereal,
 *       season: []
 *     }
 *   ],
 *   tags: [{ name: "dessert" }],
 *   persons: 4,
 *   time: 30,
 *   preparation: ["Mix ingredients", "Bake for 12 minutes"],
 *   season: []
 * };
 * 
 * // Type-safe ingredient filtering
 * const vegetables = arrayOfType(ingredients, ingredientType.vegetable);
 * 
 * // Recipe comparison
 * const areEqual = isRecipeEqual(recipe1, recipe2);
 * ```
 */

import {textSeparator, unitySeparator} from "@styles/typography";
import {TListFilter} from "./RecipeFiltersTypes";

/** Database and table name constants */
export const recipeDatabaseName = "RecipesDatabase";
export const recipeTableName = "RecipesTable";
export const ingredientsTableName = "IngredientsTable";
export const tagTableName = "TagsTable";
export const nutritionTableName = "NutritionnalValueTable";
export const shoppingListTableName = "ShoppingListTable";

/** SQLite data type enumeration */
export enum encodedType {
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BLOB = "BLOB",
    TEXT = "TEXT",
}

/** Database column definition type */
export type databaseColumnType = {
    /** Column name in the database */
    colName: string,
    /** SQLite data type for the column */
    type: encodedType,
};

/** Recipe table column names for database operations */
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

/** 
 * Complete recipe data structure for application use
 * Represents a fully decoded recipe with all related data
 */
export type recipeTableElement = {
    /** Optional database ID (undefined for new recipes) */
    id?: number;
    /** Path or URI to recipe image */
    image_Source: string;
    /** Recipe title/name */
    title: string;
    /** Recipe description */
    description: string;
    /** Array of associated tags */
    tags: Array<tagTableElement>;
    /** Number of servings */
    persons: number;
    /** Array of recipe ingredients with quantities */
    ingredients: Array<ingredientTableElement>;
    /** Seasonal availability data */
    season: Array<string>;
    /** Step-by-step preparation instructions */
    preparation: Array<string>;
    /** Total preparation time in minutes */
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


/** 
 * Ingredient data structure with complete metadata
 * Supports both database storage and recipe usage
 */
export type ingredientTableElement = {
    /** Optional database ID (undefined for new ingredients) */
    id?: number,
    /** Ingredient name */
    name: string,
    /** Unit of measurement (cups, grams, pieces, etc.) */
    unit: string,
    /** Quantity as string to support fractional and textual amounts */
    quantity?: string,
    /** Categorization type for organization and shopping */
    type: ingredientType,
    /** Array of month numbers when ingredient is in season */
    season: Array<string>,
}

export type coreIngredientElement = Pick<ingredientTableElement, 'name'> & {
    quantityPerPerson: number | undefined;
};

export type encodedIngredientElement = {
    ID: number,
    INGREDIENT: string,
    UNIT: string,
    TYPE: string,
    SEASON: string,
};


export enum ingredientsColumnsNames {
    ingredient = "INGREDIENT",
    unit = "UNIT",
    type = "TYPE",
    season = "SEASON",
}

export const ingredientColumnsEncoding: Array<databaseColumnType> = [
    {colName: ingredientsColumnsNames.ingredient, type: encodedType.TEXT},
    {colName: ingredientsColumnsNames.unit, type: encodedType.TEXT},
    {colName: ingredientsColumnsNames.type, type: encodedType.TEXT},
    {colName: ingredientsColumnsNames.season, type: encodedType.TEXT},
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

/** 
 * Simple tag data structure for recipe categorization
 */
export type tagTableElement = {
    /** Optional database ID (undefined for new tags) */
    id?: number,
    /** Tag name/label */
    name: string,
}

export enum tagsColumnsNames {
    name = "NAME",
}

export const tagColumnsEncoding: Array<databaseColumnType> = [
    {colName: tagsColumnsNames.name, type: encodedType.TEXT},
];

export type encodedTagElement = {
    ID: number,
    NAME: string;
};


/** 
 * Shopping list item with recipe tracking and purchase status
 */
export type shoppingListTableElement = {
    /** Optional database ID (undefined for new items) */
    id?: number,
    /** Ingredient category for organization */
    type: TListFilter,
    /** Ingredient name */
    name: string,
    /** Combined quantity from all recipes using this ingredient */
    quantity: string,
    /** Unit of measurement */
    unit: string,
    /** Array of recipe titles that use this ingredient */
    recipesTitle: Array<string>,
    /** Whether the item has been purchased */
    purchased: boolean,
}

export type encodedShoppingListElement = {
    ID: number,
    TYPE: string,
    INGREDIENT: string,
    QUANTITY: string,
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
    return ingredients.map(ingredient => ingredient.quantity + unitySeparator + ingredient.unit + textSeparator + ingredient.name);
}

export function extractTagsName(tags: Array<tagTableElement>): Array<string> {
    let result = new Array<string>();
    tags.forEach(element => {
        result.push(element.name)
    });

    return result;
}

export function isRecipePartiallyEqual(recipe1: recipeTableElement, recipe2: recipeTableElement): boolean {
    return ((recipe1.image_Source == recipe2.image_Source)
        && (recipe1.title == recipe2.title)
        && (recipe1.description == recipe2.description)
    )
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
    return ((ingredient1.name == ingredient2.name)
        && (ingredient1.unit == ingredient2.unit)
        && ((ingredient1.type == ingredientType.undefined) || (ingredient2.type == ingredientType.undefined) || (ingredient1.type == ingredient2.type))
    )
}

export function isTagEqual(tag1: tagTableElement, tag2: tagTableElement): boolean {
    return (tag1.name == tag2.name)
}

export function isShoppingEqual(shop1: shoppingListTableElement, shop2: shoppingListTableElement): boolean {
    return ((shop1.type == shop2.type) && (shop1.name == shop2.name) && (shop1.unit == shop2.unit))
}

/** 
 * Comprehensive ingredient categorization system
 * Values map to translation keys for internationalization
 */
export enum ingredientType {
    /** Grains, cereals, rice, pasta, bread */
    grainOrCereal = 'ingredientTypes.grainOrCereal',
    /** Beans, lentils, chickpeas, peas */
    legumes = 'ingredientTypes.legumes',
    /** Fresh and preserved vegetables */
    vegetable = 'ingredientTypes.vegetable',
    /** Tofu, tempeh, plant-based proteins */
    plantProtein = 'ingredientTypes.plantProtein',
    /** Herbs, spices, seasonings, vinegars */
    condiment = 'ingredientTypes.condiment',
    /** Prepared sauces, dressings, marinades */
    sauce = 'ingredientTypes.sauce',
    /** Beef, pork, lamb, game meat */
    meat = 'ingredientTypes.meat',
    /** Chicken, turkey, duck, poultry */
    poultry = 'ingredientTypes.poultry',
    /** Fresh and preserved fish */
    fish = 'ingredientTypes.fish',
    /** Shellfish, mollusks, seafood */
    seafood = 'ingredientTypes.seafood',
    /** Milk, yogurt, cream, butter */
    dairy = 'ingredientTypes.dairy',
    /** All varieties of cheese */
    cheese = 'ingredientTypes.cheese',
    /** Granulated and powdered sugars */
    sugar = 'ingredientTypes.sugar',
    /** Individual spices and spice blends */
    spice = 'ingredientTypes.spice',
    /** Fresh, dried, and preserved fruits */
    fruit = 'ingredientTypes.fruit',
    /** Cooking oils, fats, shortening */
    oilAndFat = 'ingredientTypes.oilAndFat',
    /** Nuts, seeds, nut butters */
    nutsAndSeeds = 'ingredientTypes.nutsAndSeeds',
    /** Honey, maple syrup, artificial sweeteners */
    sweetener = 'ingredientTypes.sweetener',
    /** Fallback category for uncategorized ingredients */
    undefined = 'ingredientTypes.undefined',
}
