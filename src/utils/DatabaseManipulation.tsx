/**
 * TODO fill this part
 * @format
 */

 // Largely inspired by https://blog.logrocket.com/using-sqlite-with-react-native/

import {openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

const openConnection = (dbName: string) => {
    console.log('Open connection for database', dbName);
    return openDatabase({ name: dbName, location: 'default'});
};

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    // image: string;
}

async function createTable(db: SQLiteDatabase) {
    const query = "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, ingredients TEXT NOT NULL, instructions TEXT NOT NULL);";

    console.log("Create table if not exist");

    db.transaction(tx => {
        tx.executeSql(query);
    });
}

const insertElement = async (db: SQLiteDatabase) => {
    const recipe: Recipe = {title: "Example recipe", ingredients: ["Ingredient 1", "Ingredient 2"], instructions: ["Instruction 1", "Instruction 2"]};
    const insertQuery= "INSERT INTO recipes (title, ingredients, instructions) VALUES (?, ?, ?);";
    db.transaction(tx => {
        tx.executeSql(insertQuery, [recipe.title, JSON.stringify(recipe.ingredients), JSON.stringify(recipe.instructions)]);   
    });
};  

async function deleteElementById(db: SQLiteDatabase, id: number) {
    const deleteQuery = `DELETE from recipes where rowid = ${id}`;
    db.transaction(tx => {
        tx.executeSql(deleteQuery);
    });
}

async function searchElement(db: SQLiteDatabase): Promise<Recipe[]> {

    await createTable(db);
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
            tx.executeSql("SELECT * FROM recipes", [], (_, { rows }) => {
                const recipes: Recipe[] = rows.raw().map((r) => ({
                    title: r.title,
                    ingredients: r.ingredients,
                    instructions: r.instructions
                }));
                resolve(recipes);
                console.log("Dump the recipes retrieve from table : ", recipes);
            },
                (_, error) => reject(error));
        });
    });
}

async function searchElementByIndex(db: SQLiteDatabase) {
}

async function deleteTable(db: SQLiteDatabase) {
    const query = "drop table recipes";
    db.transaction(tx => {
        tx.executeSql(query);
    });
    console.log('Delete table')
}
export {  createTable, deleteElementById, deleteTable, insertElement, openConnection, searchElement, searchElementByIndex }