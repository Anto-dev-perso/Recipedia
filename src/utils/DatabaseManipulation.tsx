/**
 * TODO fill this part
 * @format
 */

import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import { databaseColumnType, ITableElement, recipeTableElement } from '@customTypes/DatabaseElementTypes'


// TODO to deactivate for release
SQLite.DEBUG(true);
SQLite.enablePromise(true);



export default class DatabaseManipulation {


    /* ATTRIBUTES */
    protected _dbConnection: SQLiteDatabase;
    protected _databaseName: string;
    protected _tableName: string;
    protected _columnsTable: Array<databaseColumnType>; // define all columns (except ID). All are not null
    protected _idColumn = "ID";


    /* METHODS */

    constructor(dbname: string, tabName: string, colNames: Array<databaseColumnType>) {
        this._databaseName = dbname;
        this._tableName = tabName;
        if(colNames.length > 0){
            this._columnsTable = colNames;
        }else {
            console.error("ERROR when creating the table : No column names");
        }
    }

    /* PROTECTED METHODS */
    protected prepareQueryFromMap(map: Map<string, number | string>, separator?: string){
        let result = "";
        let sepLen = 0;

        if(map.size <= this._columnsTable.length){
            for (let [key, value] of map) {
                if(typeof value === 'string'){
                    result += `${key} = \"${value}\" `;
                }else{
                    result += `${key} = ${value}${separator} `;
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
        if(element.length != this._columnsTable.length){
            console.warn("ERROR: you try to add an element in a table that is not mapping. Impossible to add this. Size of column table is ", this._columnsTable.length, " and size of element is ", element.length);
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
            elementValues = Object.keys(elementToInsert); // Store all keys to store the value
            if (this.verifyLengthOfElement(elementValues)){
                for (let index = 0; index < elementValues.length; index++) {
                    valueString += `\"${elementToInsert[elementValues[index] as TElementKey]}\", `;
                }
                valueString = valueString.slice(0, -2) + ")" ;
            }
        }else{
            elementToInsert.forEach(element => {
                elementValues = Object.keys(element); // Store all keys to store the value
                for (let index = 0; index < elementValues.length; index++) {
                    valueString += `\"${element[elementValues[index] as TElementKey]}\", `;
                }
                valueString = valueString.slice(0, -2) + "), (" ;
                
            });
            valueString = valueString.slice(0, -3);
        }
        // If size has not raise, it means something bad happens
        if(valueString.length > valueStringLength){
            insertQuery = `INSERT INTO ${this._tableName} (`;

            for (let index = 0; index < this._columnsTable.length; index++) {
                insertQuery += `\"${this._columnsTable[index].name}\", `;
            }
            insertQuery = insertQuery.slice(0, -2) + ") " + valueString; // Remove the coma of last element
        }

        return insertQuery;
    }


    protected async executeQuery(query: string): Promise<string | Array<string> | void> {
        return new Promise(async (resolve, reject) => {
            await this._dbConnection.transaction(async (tx) => {
                await tx.executeSql(query, [], 
                    (tx, results) => {
                        console.log("\n\n----------------------------------------\n\n");
                        console.info("Query successfully executed");

                        if(results.rows.length == 1){ 
                            console.log("ExecuteQuery : returning a single value which is ", results.rows.item(0));
                            resolve(JSON.stringify(results.rows.item(0)));
                        }else if(results.rows.length > 1){
                            let promiseArrayReturn = new Array<string>();
                            results.rows.raw().forEach(element => {
                                promiseArrayReturn.push(JSON.stringify(element));                                
                            });
                            console.log("ExecuteQuery : returning an array of value which are ", promiseArrayReturn);
                            resolve(promiseArrayReturn);
                        }
                        else{
                            console.log("ExecuteQuery : return null", results);
                            resolve();
                        }
    
                    }, 
                    (error) => {
                        reject(error);
                        console.warn('Query received error : ', error);
                    });
            })
        })
        
    }

    /* PUBLIC METHODS */

    public async openDatabase() {
        console.log("Connect to database"); 
        try {
            this._dbConnection = await SQLite.openDatabase({ name: this._databaseName, location: 'default'})
            console.log("Connection OK");
            
        } catch (error) {
            console.warn("ERROR during opening of the database : ", error);
        }
    };

    public async deleteDatabase() {
        console.log('Delete database');
        try{
            await SQLite.deleteDatabase({name: this._databaseName, location: 'default'});
            console.log("Delete database successfully")
        }catch(error){
            console.warn('Delete : received error ', error.code, " : ", error.message);
        }
    }

    public async deleteTable() {
        const db = await this.openDatabase();
        const dropQuery = `DROP TABLE IF EXISTS ${this._tableName}`;
        console.log("Delete table", this._tableName);
        await this.executeQuery(dropQuery);
    }

    public async createTable() {
        let createQuery = `CREATE TABLE IF NOT EXISTS \"${this._tableName}\" ( \"${this._idColumn}\" INTEGER NOT NULL UNIQUE, `
        this._columnsTable.forEach(element => {
            createQuery += `\"${element.name}\" ${element.type} NOT NULL, `;
        });
        createQuery += `PRIMARY KEY(ID AUTOINCREMENT) );`;
    
        console.log("Create table if not exist. Query is ", createQuery);
        await this.executeQuery(createQuery);
    }


    public async deleteElementById(id: number) {

        const deleteQuery = `DELETE from ${this._tableName} where rowid = ${id};`;
        console.log("Delete element with id ", id);

        await this.executeQuery(deleteQuery);
    }


    public async insertElement<TElement>(element: TElement) {
        let insertQuery = this.prepareInsertQuery(element);
            
        console.log("Insert in table. Query is ", insertQuery);
        await this.executeQuery(insertQuery);
    }; 

    public async insertArrayOfElement<TElement>(arrayElements: Array<TElement>) {

        let insertQuery = this.prepareInsertQuery(arrayElements);
            
        console.log("Insert multiple elements in table. Query is ", insertQuery);
        await this.executeQuery(insertQuery);


    }

    public async editElement(id: number, elementToUpdate: Map<string, number | string>) {

        let updateQuery = `UPDATE ${this._tableName} SET `; 
        // SET column1 = value1, column2 = value2...., columnN = valueN
        // WHERE [condition];

        const queryFromMap = this.prepareQueryFromMap(elementToUpdate, ",");
        if(queryFromMap){
            updateQuery += queryFromMap + `   WHERE ID = ${id}` ;
            console.log("Update in table. Query is ", updateQuery);
            await this.executeQuery(updateQuery);
        }
    }; 
    

    public async searchElementById(elementId: number): Promise<string> {

        let searchQuery = `SELECT * FROM ${this._tableName} WHERE ${this._idColumn} = ${elementId}`;

        console.log("Search by id in table. Query is ", searchQuery);

        return await this.executeQuery(searchQuery);
    }

    public async searchRandomlyElement(numOfElements: number, columns?: Array<string>): Promise<Array<string>> {

        let searchQuery = `SELECT `
        if(columns){
            columns.forEach(col => {
                searchQuery += `${col}, `;
                
            });
            searchQuery = searchQuery.slice(0, -2);
        }else{
            searchQuery += `*`
        }
        searchQuery += ` FROM ${this._tableName} ORDER BY RANDOM() LIMIT ${numOfElements}`;

        console.log("Search by id in table. Query is ", searchQuery);

        return await this.executeQuery(searchQuery);
    }

    public async searchElement(elementToSearch: Map<string, number | string>): Promise<string | Array<string>> {

        let searchQuery = `SELECT * FROM ${this._tableName} WHERE `;

        searchQuery += this.prepareQueryFromMap(elementToSearch, `AND`);
    
        console.log("Search in table. Query is ", searchQuery);

        return await this.executeQuery(searchQuery);
    }

}
