/**
 * TODO fill this part
 * @format
 */

export const recipeDatabaseName = "RecipesDatabase";
export const recipeTableName = "RecipesTable"; 
export const ingredientsTableName = "IngredientsTable"; 
export const tagTableName = "TagsTable"; 
export const nutritionTableName = "NutritionnalValueTable";

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

export const recipeColumnsNames = {
    image: recipeColumnsEncoding[0].colName,
    title: recipeColumnsEncoding[1].colName,
    description: recipeColumnsEncoding[2].colName,
    tags: recipeColumnsEncoding[3].colName,
    ingredients: recipeColumnsEncoding[4].colName,
    preparation: recipeColumnsEncoding[5].colName,
    time: recipeColumnsEncoding[6].colName,
}
  
export type ingredientTableElement = {
    id?: number,
    ingName: string,
    unit: string,
    // season: string,
}

export const ingredientsColumnsNames: Array<databaseColumnType> =  [
    { colName: "INGREDIENT", type: encodedType.TEXT},
    { colName: "UNIT", type: encodedType.TEXT}
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