/**
 * TODO fill this part
 * @format
 */

const recipedatabaseName = "RecipeDatabase";
const recipeTableName = "RecipeTable"; 
const ingredientsTableName = "IngredientsTable"; 
const tagTableName = "TagTable"; 
const nutritionTableName = "NutritionnalValueTable";

enum encodedType {
    INTEGER = "INTEGER",
    FLOAT = "FLOAT",
    BLOB = "BLOB",
    TEXT = "TEXT",
}

type databaseColumnType = {
    name: string,
    type: encodedType,
};

const debugRecipeColNames: Array<databaseColumnType> =  [
    { name: "IMAGE_SOURCE", type: encodedType.TEXT},
    { name: "TITLE", type: encodedType.TEXT},
    { name: "DESCRIPTION", type: encodedType.TEXT},
    { name: "TAGS", type: encodedType.TEXT},
    { name: "INGREDIENTS", type: encodedType.TEXT},
    { name: "PREPARATION", type: encodedType.TEXT},
  ]

type recipeTableElement = {
    id? : number;
    image_Source: string;
    title: string;
    description: string;
    tags: Array<string>;
    ingredients: Array<string>;
    preparation: Array<string>;
}

const convertQueryToElementOfTable = (queryResult: string) => {
    let result: recipeTableElement = { image_Source: "", title: "", description: "", tags: [""], ingredients: [""], preparation: [""]};
    const regExp = /["{}\\]+/g;

    let arrStr = queryResult.split(`","`);

    // console.log("Element to map is : ",arrStr);
    
    
    arrStr.forEach((str) => {
        let elem = str.split(`":`); // { "Column name" , "Value"}
        // console.log("elem : ",elem);
        
        if(elem[0].includes("ID")){
            result.id = +elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[0].name)) {
            result.image_Source = elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[1].name)) {
            result.title = elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[2].name)) {
            result.description = elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[3].name)) {
            result.tags[0] = elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[4].name)) {
            result.ingredients[0] = elem[1].replace(regExp, "");
        }
        else if(elem[0].includes(debugRecipeColNames[5].name)) {
            result.preparation[0] = elem[1].replace(regExp, "");
        }
        else{
            console.warn("NO SUCH COLUMNS FOUND FOR ELEMENT : ", elem);
            
        }
    })
    return result;
}

const convertQueryToArrayOfElementOfTable = (queryResult: Array<string>) => {
    let recipeTableElement = new Array<recipeTableElement>;

    queryResult.forEach(element => {
        recipeTableElement.push(convertQueryToElementOfTable(element))        
    });
    
    return recipeTableElement;
}

type ingredientTableElement = {
    id?: number,
}

type nutritionTableElement = {
    id?: number,
}

type tagTableElement = {
    id?: number,
}


export { recipedatabaseName, recipeTableName, ingredientsTableName, tagTableName, nutritionTableName, encodedType, databaseColumnType, recipeTableElement, ingredientTableElement, nutritionTableElement, tagTableElement, debugRecipeColNames, convertQueryToElementOfTable, convertQueryToArrayOfElementOfTable }