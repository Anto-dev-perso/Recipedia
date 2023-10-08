/**
 * TODO fill this part
 * @format
 */

// import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import * as SQLite from 'expo-sqlite';
import { databaseColumnType } from '@customTypes/DatabaseElementTypes';
import RecipeDatabase from './RecipeDatabase';

export default class TableManipulation {


    /* ATTRIBUTES */
    protected _tableName: string;
    protected _columnsTable: Array<databaseColumnType>; // define all columns (except ID). All are not null
    protected _idColumn = "ID";


    /* METHODS */

    constructor(tabName: string, colNames: Array<databaseColumnType>) {
        this._tableName = tabName;
        if(colNames.length > 0){
            this._columnsTable = colNames;
        }else {
            console.error("ERROR when creating the table : No column names");
            this._columnsTable = new Array<databaseColumnType>();
        }
    }

    /* PROTECTED METHODS */
    protected prepareQueryFromMap(map: Map<string, number | string>, separator?: string){
        let result = "";
        let sepLen = 0;

        if(map.size <= this._columnsTable.length){
            for (let [key, value] of map) {
                if(typeof value === 'string'){
                    result += `\"${key}\" = \"${value}\" `;
                }else{
                    result += `\"${key}\" = ${value}`;
                }
                if(separator){
                    result += `${separator} `;
                    sepLen = separator.length;
                }
            }
    
            if(separator){
                result = result.slice(0, -2-sepLen); // Remove the separator of last element
            }
        } else {
            console.warn("ERROR: you try to update too much columns for this table. Size of column table to update is ", this._columnsTable.length, " and size of columns to update for this element is ", map.size)
        }

        return result;
    } 

    protected verifyLengthOfElement<TElement extends string>(element: Array<TElement>){
        let isCheck: boolean = true;
        if(element.length > this._columnsTable.length +1){
            console.warn("ERROR: you try to add an element in a table that is not mapping. Impossible to add this. Size of column table is ", this._columnsTable.length, " and size of element is ", element.length, "\n\nelement : ", element);
            isCheck = false;
        }
        return isCheck;
    }

    protected prepareInsertQuery<TElement>(elementToInsert: TElement | Array<TElement>) {
        
        let insertQuery = "";
        let valueString = `VALUES (`;
        let valueStringLength = valueString.length;
        
        type TElementKey = keyof TElement;
        let elementValues: string[];
        
        if(!(elementToInsert instanceof Array)){
            elementValues = Object.keys(elementToInsert as Object); // Store all keys to store the value
            if (this.verifyLengthOfElement(elementValues)){
                for (let index = 0; index < elementValues.length; index++) {
                    valueString += `\"${elementToInsert[elementValues[index] as TElementKey]}\", `;
                }
                valueString = valueString.slice(0, -2) + ")" ;
            }
        }else{
            elementToInsert.forEach(element => {
                elementValues = Object.keys(element as Object); // Store all keys to store the value
                for (let index = 0; index < elementValues.length; index++) {
                    valueString += `\"${element[elementValues[index] as TElementKey]}\", `;
                }
                valueString = valueString.slice(0, -2) + "), (" ;
                
            });
            valueString = valueString.slice(0, -3);
        }
        // If size has not raise, it means something bad happens
        if(valueString.length > valueStringLength){
            insertQuery = `INSERT INTO "${this._tableName}" (`;

            for (let index = 0; index < this._columnsTable.length; index++) {
                insertQuery += `\"${this._columnsTable[index].colName}\", `;
            }
            insertQuery = insertQuery.slice(0, -2) + ") " + valueString + ';'; // Remove the coma of last element
        }

        return insertQuery;
    }


    protected async executeQuery(query: string, db: SQLite.Database): Promise<string | Array<string> | void> {
        
        return new Promise(async (resolve, reject) => {
            await db.transaction(async (tx: any) => {
                await tx.executeSql(query, [], 
                    (tx: any, results: any) => {
                        if(results.rows.length == 1){ 
                            console.log("ExecuteQuery : returning a single value which is ", results.rows.item(0));
                            resolve(JSON.stringify(results.rows.item(0)));
                        }else if(results.rows.length > 1){
                            let promiseArrayReturn = new Array<string>();
                            for (let i = 0; i < results.rows.length; i++) {
                                promiseArrayReturn.push(JSON.stringify(results.rows.item(i)));
                            }
                            console.log("ExecuteQuery : returning an array of value which are ", promiseArrayReturn);
                            resolve(promiseArrayReturn);
                        }
                        else{
                            console.log("ExecuteQuery : return null", results);
                            resolve();
                        }
    
                    }, 
                    (error: any) => {
                        reject(error);
                        console.warn('Query received error : ', error);
                    });
            })
        })
        
    }

    

    public async deleteTable(db: SQLite.Database): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            const dropQuery = `DROP TABLE IF EXISTS ${this._tableName}`;
            try {
                await this.executeQuery(dropQuery, db);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }

    public async createTable(db: SQLite.Database): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let createQuery = `CREATE TABLE IF NOT EXISTS \"${this._tableName}\" ( \"${this._idColumn}\" INTEGER NOT NULL UNIQUE, `
            this._columnsTable.forEach(element => {
                createQuery += `\"${element.colName}\" ${element.type} NOT NULL, `;
            });
            createQuery += `PRIMARY KEY(ID AUTOINCREMENT) );`;
        
            try {
                await this.executeQuery(createQuery, db);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }


    public async deleteElementById(id: number, db: SQLite.Database): Promise<boolean> {

        return new Promise(async(resolve, reject) => {
            const deleteQuery = `DELETE from "${this._tableName}" where rowid = ${id};`;
            try{
                await this.executeQuery(deleteQuery, db);
                resolve(true);
            }catch(error: any){
                reject(error);
            }
        })

    }


    public async insertElement<TElement>(element: TElement, db: SQLite.Database): Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let insertQuery = this.prepareInsertQuery(element);
                
            try{
                console.log("Insert query : ", insertQuery);
                
                await this.executeQuery(insertQuery, db);
                resolve(true);
            }catch(error: any){
                reject(error);
            }
        })
    }; 

    public async insertArrayOfElement<TElement>(arrayElements: Array<TElement>, db: SQLite.Database) : Promise<boolean> {
        return new Promise(async(resolve, reject) => {
            let insertQuery = this.prepareInsertQuery(arrayElements);
                
            try{
                console.log("Query for inserting array : ", insertQuery);
                
                await this.executeQuery(insertQuery, db);
                resolve(true);
            }catch(error: any){
                reject(error);
            }
        })


    }

    public async editElement(id: number, elementToUpdate: Map<string, number | string>, db: SQLite.Database) : Promise<boolean> {

        return new Promise(async(resolve, reject) => {
            let updateQuery = `UPDATE "${this._tableName}" SET `; 
            // SET column1 = value1, column2 = value2...., columnN = valueN
            // WHERE [condition];
    
            const queryFromMap = this.prepareQueryFromMap(elementToUpdate, ",");
            if(queryFromMap){
                updateQuery += queryFromMap + `   WHERE ID = ${id};` ;
                try{
                    await this.executeQuery(updateQuery, db);
                    resolve(true);
                }catch(error: any){
                    reject(error);
                }
            }
        })
    }; 
    

    public async searchElementById(elementId: number, db: SQLite.Database): Promise<string> {

        return new Promise(async(resolve, reject) => {
            let searchQuery = `SELECT * FROM "${this._tableName}" WHERE ${this._idColumn} = ${elementId};`;
    
            try{
                resolve(await this.executeQuery(searchQuery, db) as string);
            }catch(error){
                reject(error);
            }
        }
    )}

    public async searchRandomlyElement(numOfElements: number, db: SQLite.Database, columns?: Array<string>): Promise<Array<string>> {

        return new Promise(async(resolve, reject) => {
            let searchQuery = `SELECT `
            if(columns){
                columns.forEach(col => {
                    searchQuery += `${col}, `;
                    
                });
                searchQuery = searchQuery.slice(0, -2);
            }else{
                searchQuery += `*`
            }
            searchQuery += ` FROM "${this._tableName}" ORDER BY RANDOM() LIMIT ${numOfElements};`;
    
            try{
                resolve(await this.executeQuery(searchQuery, db) as Array<string>)
            }catch(error: any){
                reject(error)
            }

        })
    }

    public async searchElement(db: SQLite.Database, elementToSearch?: Map<string, number | string>): Promise<string | Array<string>> {

        return new Promise(async(resolve, reject) => {
            let searchQuery = `SELECT * FROM "${this._tableName}"`;
    
            if(elementToSearch){
                searchQuery += " WHERE " + this.prepareQueryFromMap(elementToSearch, `AND`) + ";";
            }
        
            try{
                console.log("Search query : ", searchQuery);
                
                const res = await this.executeQuery(searchQuery, db) as string | Array<string>;
                resolve(res);
            }catch(error: any){
                reject(error);
            }   
        })
    }

}
