/**
 * TODO fill this part
 * @format
 */

import {openDatabase} from 'react-native-sqlite-storage';

export const openTable = async() => {
    return openDatabase({ name: 'database.db', location: 'default'});
};

export interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    // image: string;
}

export const createTable = async () => {
    const query = "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, ingredients TEXT NOT NULL, instructions TEXT NOT NULL);";

    console.log("Create table if not exist");

    const db = await openTable();
    db.transaction(tx => {
        tx.executeSql(query);   
    });
};

export const insertRecipe = async () => {
    const recipe: Recipe = {title: "Example recipe", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Instruction 1", "Instruction 2"]};
    const db = await openTable();
    const insertQuery= "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?);";
    db.transaction(tx => {
        tx.executeSql(insertQuery, [recipe.title, JSON.stringify(recipe.ingredients), JSON.stringify(recipe.instructions)]);   
    });
};  

export const deleteRecipe = async (id: number) => {
    const db = await openTable();
    const deleteQuery = `DELETE from recipes where rowid = ${id}`;
    db.transaction(tx => {
        tx.executeSql(deleteQuery);   
    });
};

export const selectRecipes = async (): Promise<Recipe[]> => {
    
    const db = await openTable();
    await createTable();
    // db.transaction((tx) => {
        // tx.executeSql("SELECT * FROM recipes", [], (tx, results) => {
        //     const recipes: Recipe[] = [];

        //     const len = results.rows.length;
        //     for (let i = 0; i < len; i++) {
        //         let row = results.rows.item(i);
        //         console.log(`id: ${row.id}, title: ${row.title}, ingredients: ${row.ingredients},instructions: ${row.instructions}`);

        //         recipes.push({title: row.title, ingredients: row.ingredients, instructions: row.instructions});
        //     }
        //     console.log("Dump the recipes retrieve from table : ", recipes);
        // }); 
        // }   
        return new Promise<Recipe[]>((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM recipes", [], (_, {rows}) => {
                    const recipes: Recipe[] = rows.raw().map((r) => ({
                        title: r.title,
                        ingredients: r.ingredients,
                        instructions: r.instructions
                    }));
                    resolve(recipes);
                    console.log("Dump the recipes retrieve from table : ", recipes);
                },
                (_, error) => reject(error));  
            })
        });
};

export const deleteTable = async () => {
    const db = await openTable();
    const query = "drop table recipes";
    db.transaction(tx => {
        tx.executeSql(query);   
    });
};
