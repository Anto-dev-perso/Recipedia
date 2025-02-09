import * as SQLite from 'expo-sqlite';
import {databaseColumnType} from '@customTypes/DatabaseElementTypes';

export default class TableManipulation {


    /* ATTRIBUTES */
    protected m_tableName: string;
    protected m_columnsTable: Array<databaseColumnType>; // define all columns (except ID). All are not null
    protected m_idColumn = "ID";


    /* METHODS */

    constructor(tabName: string, colNames: Array<databaseColumnType>) {


        if (tabName.length <= 0) {
            console.warn("ERROR when creating the table : No name for the table");
            this.m_tableName = "";
        } else {
            this.m_tableName = tabName;
        }
        if (colNames.length <= 0) {
            console.error("ERROR when creating the table : No column names");
            this.m_columnsTable = new Array<databaseColumnType>();
        }
        {
            this.m_columnsTable = colNames;
        }
    }

    public async deleteTable(db: SQLite.Database): Promise<boolean> {
        const dropQuery = `DROP TABLE IF EXISTS ${this.m_tableName}`;
        try {
            await this.executeQuery(dropQuery, db);
            return true;
        } catch (error) {
            console.warn('deleteTable: \nQuery: \"', dropQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async createTable(db: SQLite.Database): Promise<boolean> {
        let createQuery = `CREATE TABLE IF NOT EXISTS \"${this.m_tableName}\"
                           (
                               ${this.m_idColumn}
                               INTEGER
                               NOT
                               NULL
                               UNIQUE, `;
        // TODO find all forEach and refactor it
        this.m_columnsTable.forEach(element => {
            createQuery += `\"${element.colName}\" ${element.type} NOT NULL, `;
        });
        createQuery += `PRIMARY KEY(ID AUTOINCREMENT) );`;

        try {
            await this.executeQuery(createQuery, db);
            return true;
        } catch (error) {
            console.warn('createTable: \nQuery: \"', createQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async deleteElementById(id: number, db: SQLite.Database): Promise<boolean> {
        const deleteQuery = `DELETE
                             from "${this.m_tableName}"
                             where rowid = ${id};`;
        try {
            await this.executeQuery(deleteQuery, db);
            return true;
        } catch (error: any) {
            console.warn('deleteElementById: \nQuery: \"', deleteQuery, '\"\nReceived error : ', error);
            return false;
        }

    }

    public async insertElement<TElement>(element: TElement, db: SQLite.Database): Promise<string | number | undefined> {
        const [insertQuery, params] = this.prepareInsertQuery(element);
        if (insertQuery.length == 0) {
            return "Invalid insert query";
        }
        if (params.length == 0) {
            return "Empty values"
        }

        try {
            return await this.executeQuery(insertQuery, db, params) as string | number;
        } catch (error: any) {
            console.warn('insertElement: \nQuery: \"', insertQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    };

    public async insertArrayOfElement<TElement>(arrayElements: Array<TElement>, db: SQLite.Database): Promise<boolean> {
        let [insertQuery, params] = this.prepareInsertQuery(arrayElements);
        if (insertQuery.length == 0) {
            console.warn('insertArrayOfElement<', typeof arrayElements[0], '>: query is empty due to an issue');
            return false;
        }
        if (insertQuery.length == 0 || params.length == 0) {
            console.warn('insertArrayOfElement<', typeof arrayElements[0], '>: values are empty');
            return false;
        }

        try {
            await this.executeQuery(insertQuery, db, params);
            return true;
        } catch (error: any) {
            console.warn('insertArrayOfElement<', typeof arrayElements[0], '>: \nQuery: \"', insertQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async editElement(id: number, elementToUpdate: Map<string, number | string>, db: SQLite.Database): Promise<boolean> {
        let updateQuery = `UPDATE "${this.m_tableName}"
                           SET `;
        // SET column1 = value1, column2 = value2...., columnN = valueN
        // WHERE [condition];

        const queryFromMap = this.prepareQueryFromMap(elementToUpdate, ",");
        if (queryFromMap.length == 0) {
            return false;
        } else {
            updateQuery += queryFromMap + `   WHERE ID = ${id};`;
            try {
                await this.executeQuery(updateQuery, db);
                return true;
            } catch (error: any) {
                console.warn('editElement: \nQuery: \"', updateQuery, '\"\nReceived error : ', error);
                return false;
            }
        }
    };

    public async searchElementById(elementId: number, db: SQLite.Database): Promise<string> {
        if (isNaN(elementId)) {
            console.error('searchElementById: Id use for search is null');
            return "";
        }
        let searchQuery = `SELECT *
                           FROM "${this.m_tableName}"
                           WHERE ${this.m_idColumn} = ${elementId};`;

        try {
            return (await this.executeQuery(searchQuery, db) as string);
        } catch (error: any) {
            console.warn('searchElementById: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return "";
        }
    }

    public async searchRandomlyElement(numOfElements: number, db: SQLite.Database, columns?: Array<string>): Promise<Array<string> | undefined> {
        if (numOfElements <= 0) {
            return undefined;
        }

        let searchQuery = `SELECT `;
        if (columns) {
            columns.forEach(col => {
                searchQuery += `${col}, `;

            });
            searchQuery = searchQuery.slice(0, -2);
        } else {
            searchQuery += `*`
        }
        searchQuery += ` FROM "${this.m_tableName}" ORDER BY RANDOM() LIMIT ${numOfElements};`;

        try {
            console.log("Random search returned :", await this.executeQuery(searchQuery, db) as Array<string>)
            return (await this.executeQuery(searchQuery, db) as Array<string>);
        } catch (error: any) {
            console.warn('searchRandomlyElement: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    }

    // TODO replace Map by an Array
    public async searchElement(db: SQLite.Database, elementToSearch?: Map<string, number | string>): Promise<string | Array<string>> {

        let searchQuery = `SELECT *
                           FROM "${this.m_tableName}"`;

        if (elementToSearch) {
            searchQuery += " WHERE " + this.prepareQueryFromMap(elementToSearch, `AND`) + ";";
        }

        try {
            // console.log("Search query : ", searchQuery);
            return (await this.executeQuery(searchQuery, db) as string | Array<string>);
        } catch (error: any) {
            console.warn('searchElement: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return "";
        }
    }

    /* PROTECTED METHODS */
    protected prepareQueryFromMap(map: Map<string, number | string>, separator?: string) {
        let result = "";
        let sepLen = 0;

        if (map.size <= this.m_columnsTable.length) {
            for (let [key, value] of map) {
                if (typeof value === 'string') {
                    result += `\'${key}\' = \'${value}\' `;
                } else {
                    result += `\'${key}\' = ${value}`;
                }
                if (separator) {
                    result += `${separator} `;
                    sepLen = separator.length;
                }
            }

            if (separator) {
                result = result.slice(0, -2 - sepLen); // Remove the separator of last element
            }
        } else {
            console.warn("ERROR: you try to update too much columns for this table. Size of column table to update is ", this.m_columnsTable.length, " and size of columns to update for this element is ", map.size)
        }

        return result;
    }

    protected verifyLengthOfElement<TElement extends string>(element: Array<TElement>) {
        let isCheck: boolean = true;
        if (element.length > this.m_columnsTable.length + 1) {
            console.warn("ERROR: you try to add an element in a table that is not mapping. Impossible to add this. Size of column table is ", this.m_columnsTable.length, " and size of element is ", element.length, "\n\nelement : ", element);
            isCheck = false;
        }
        return isCheck;
    }

    protected prepareInsertQuery<TElement>(elementToInsert: TElement | Array<TElement>): [string, Array<string>] {
        type TElementKey = keyof TElement;


        let insertQuery = `INSERT INTO "${this.m_tableName}" ("` + this.m_columnsTable.map(col => col.colName).join("\",\"") + '\") VALUES ';
        let returnValues = new Array<string>();

        if (!(elementToInsert instanceof Array)) {

            for (const key of Object.keys(elementToInsert as Object).filter(key => key !== 'id')) {
                const valueToPush = (elementToInsert[key as TElementKey] as string).toString();
                if (valueToPush.toString() === 'false') {
                    returnValues.push('0');
                } else if (valueToPush == 'true') {
                    returnValues.push('1');
                } else {
                    returnValues.push(valueToPush);
                }
            }
            if (this.verifyLengthOfElement(returnValues)) {
                insertQuery += '(' + returnValues.map(() => '?').join(',') + ');';
            } else {
                insertQuery = "";
            }
        } else {
            const placeHolders = new Array<string>();

            for (const element of elementToInsert) {
                const elementValues = new Array<string>();

                for (const key of Object.keys(element as Object).filter(key => key !== 'id')) {
                    const valueToPush = (element[key as TElementKey] as TElementKey).toString();
                    if (valueToPush == 'false') {
                        elementValues.push('0');
                    } else if (valueToPush == 'true') {
                        elementValues.push('1');
                    } else {
                        elementValues.push(valueToPush);
                    }
                }
                if (this.verifyLengthOfElement(elementValues)) {
                    placeHolders.push('(' + elementValues.map(() => '?').join(',') + ')');
                    returnValues.push(...elementValues);
                }
            }
            insertQuery += placeHolders.join(',') + ';';
        }
        return [insertQuery, returnValues];
    }

    protected async executeQuery(query: string, db: SQLite.Database, args?: Array<string>): Promise<string | Array<string> | number> {
        return new Promise(async (resolve, reject) => {
            db.transaction(async (tx: SQLite.SQLTransaction) => {
                tx.executeSql(query, args ? args : [],
                    (_backTx: SQLite.SQLTransaction, results: SQLite.SQLResultSet) => {
                        // console.log("ExecuteQuery have as result: ", results, " with object[0]=", results.rows._array[0]);
                        if (results.rows.length == 1) {
                            // console.log("ExecuteQuery : returning a single value which is ", results.rows.item(0));
                            resolve(JSON.stringify(results.rows._array[0]));
                        } else if (results.rows.length > 1) {
                            let promiseArrayReturn = new Array<string>();
                            for (let i = 0; i < results.rows.length; i++) {
                                promiseArrayReturn.push(JSON.stringify(results.rows._array[i]));
                            }
                            // console.log("ExecuteQuery : returning an array of value which are ", promiseArrayReturn);
                            resolve(promiseArrayReturn);
                        } else {
                            // console.log("ExecuteQuery : return null", results);
                            resolve(results.insertId ? results.insertId : 0);
                        }

                    },
                    (_backTx: SQLite.SQLTransaction, error: SQLite.SQLError) => {
                        reject(error);
                        return false;
                    });
            })
        })
    }

}
