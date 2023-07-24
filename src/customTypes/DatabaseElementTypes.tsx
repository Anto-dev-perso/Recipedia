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
    { name: "INGREDIENTS", type: encodedType.TEXT},
    { name: "PREPARATION", type: encodedType.TEXT},
  ]

type recipeTableElement = {
    id? : number;
    image_Source: string;
    title: string;
    description: string;
    ingredients: string;
    preparation: string;
}

const convertQueryToElementOfTable = (queryResult: string) => {
    let result: recipeTableElement = { image_Source: "", title: "", description: "", ingredients: "", preparation: ""};
    const regExp = /["{}\\]+/g;
    let arrStr = queryResult.split(`","`);

    arrStr.forEach((str) => {
        let elem = str.split(`":`); // { "Column name" , "Value"}

        if(elem[0].search("ID") != -1){
            result.id = +elem[1].replace(regExp, "");
        }
        else if(elem[0].search(debugRecipeColNames[0].name) != -1) {
            result.image_Source = elem[1].replace(regExp, "");
        }
        else if(elem[0].search(debugRecipeColNames[1].name) != -1) {
            result.title = elem[1].replace(regExp, "");
        }
        else if(elem[0].search(debugRecipeColNames[2].name) != -1) {
            result.description = elem[1].replace(regExp, "");
        }
        else if(elem[0].search(debugRecipeColNames[3].name) != -1) {
            result.ingredients = elem[1].replace(regExp, "");
        }
        else if(elem[0].search(debugRecipeColNames[3].name) != -1) {
            result.preparation = elem[1].replace(regExp, "");
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
    // console.log("Array is : ", recipeTableElement);
    
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