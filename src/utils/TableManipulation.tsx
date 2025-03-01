import {SQLiteDatabase, SQLiteRunResult} from 'expo-sqlite';
import {databaseColumnType} from '@customTypes/DatabaseElementTypes';

export default class TableManipulation {

    protected m_tableName: string;
    protected m_columnsTable: Array<databaseColumnType>; // define all columns (except ID). All are not null
    protected m_idColumn = "ID";

    constructor(tabName: string, colNames: Array<databaseColumnType>) {
        if (tabName.length <= 0) {
            console.warn("ERROR: Table name cannot be empty");
            this.m_tableName = "";
        } else {
            this.m_tableName = tabName;
        }
        if (colNames.length <= 0) {
            console.error("ERROR: No column names specified");
            this.m_columnsTable = new Array<databaseColumnType>();
        } else {
            this.m_columnsTable = colNames;
        }
    }

    public async deleteTable(db: SQLiteDatabase): Promise<boolean> {
        const dropQuery = `DROP TABLE IF EXISTS ${this.m_tableName}`;
        try {
            await db.execAsync(dropQuery);
            return true;
        } catch (error: any) {
            console.warn('deleteTable: \nQuery: \"', dropQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    // TODO for multiple queries with different parameters, we can use prepareAsync
    public async createTable(db: SQLiteDatabase): Promise<boolean> {
        let createQuery = `CREATE TABLE IF NOT EXISTS "${this.m_tableName}"
                           (
                               ${this.m_idColumn}
                               INTEGER
                               PRIMARY
                               KEY
                               AUTOINCREMENT, `;
        // TODO find all forEach and refactor it
        this.m_columnsTable.forEach(element => {
            createQuery += `\"${element.colName}\" ${element.type} NOT NULL, `;
        });
        createQuery = createQuery.slice(0, -2) + `);`;
        try {
            await db.execAsync(createQuery);
            return true;
        } catch (error: any) {
            console.warn('createTable: \nQuery: \"', createQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async deleteElementById(id: number, db: SQLiteDatabase): Promise<boolean> {
        const deleteQuery = `DELETE
                             FROM "${this.m_tableName}"
                             WHERE ${this.m_idColumn} = ?;`;
        try {
            const runRes = await db.runAsync(deleteQuery, [id]);
            if (runRes.changes == 0) {
                console.warn("deleteElementById: Can't delete element with id ", id);
                return false;
            } else {
                return true;
            }
        } catch (error: any) {
            console.warn('deleteElementById: \nQuery: \"', deleteQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async deleteElement(db: SQLiteDatabase, elementToSearch?: Map<string, number | string>): Promise<boolean> {

        let deleteQuery = `DELETE
                           FROM "${this.m_tableName}"`;

        if (elementToSearch) {
            deleteQuery += " WHERE " + this.prepareQueryFromMap(elementToSearch, `AND`) + ";";
        }

        try {
            const runRes = await db.runAsync(deleteQuery);
            if (runRes.changes == 0) {
                console.warn("deleteElement: Can't delete element with search: ", elementToSearch);
                return false;
            } else {
                return true;
            }
        } catch (error: any) {
            console.warn('deleteElement: \nQuery: \"', deleteQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async insertElement<TElement>(element: TElement, db: SQLiteDatabase): Promise<string | number | undefined> {
        const [insertQuery, params] = this.prepareInsertQuery(element);
        if (insertQuery.length == 0) {
            console.warn("Invalid insert query");
            return undefined;
        }
        if (params.length == 0) {
            console.warn("Empty values");
            return undefined;
        }

        try {
            const result: SQLiteRunResult = await db.runAsync(insertQuery, params);
            return result.lastInsertRowId;
        } catch (error: any) {
            console.warn('insertElement: \nQuery: \"', insertQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    }

    public async insertArrayOfElement<TElement>(arrayElements: Array<TElement>, db: SQLiteDatabase): Promise<boolean> {
        const [insertQuery, params] = this.prepareInsertQuery(arrayElements);
        if (insertQuery.length == 0) {
            console.warn('insertArrayOfElement<', typeof arrayElements[0], '>: query is empty due to an issue');
            return false;
        }
        try {
            await db.runAsync(insertQuery, params);
            return true;
        } catch (error: any) {
            console.warn('insertArrayOfElement<', typeof arrayElements[0], '>: \nQuery: \"', insertQuery, '\"\nReceived error : ', error);
            return false;
        }
    }

    public async editElementById(id: number, elementToUpdate: Map<string, number | string>, db: SQLiteDatabase): Promise<boolean> {
        let updateQuery = `UPDATE "${this.m_tableName}"
                           SET `;
        // SET column1 = value1, column2 = value2...., columnN = valueN
        // WHERE [condition];
        const queryFromMap = this.prepareQueryFromMap(elementToUpdate, ",");
        if (queryFromMap.length === 0) {
            return false;
        }

        updateQuery += queryFromMap + ` WHERE ID = ${id};`;
        try {
            await db.runAsync(updateQuery);
            return true;
        } catch (error: any) {
            console.warn('editElement: \nQuery: \"', updateQuery, '\"\nReceived error : ', error);
            return false;
        }
    };


    public async searchElementById<T>(elementId: number, db: SQLiteDatabase): Promise<T | undefined> {
        if (isNaN(elementId)) {
            console.error('searchElementById: Id use for search is null');
            return undefined;
        }
        const searchQuery = `SELECT *
                             FROM "${this.m_tableName}"
                             WHERE ${this.m_idColumn} = ?`;

        try {
            const result = await db.getFirstAsync<T>(searchQuery, elementId);
            if (result === null) {
                return undefined;
            }
            return result;
        } catch (error: any) {
            console.warn('searchElementById: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    }

    public async searchRandomlyElement<T>(numOfElements: number, db: SQLiteDatabase, columns?: Array<string>): Promise<Array<T> | undefined> {
        if (numOfElements <= 0) {
            return undefined;
        }

        let searchQuery = `SELECT `;
        if (columns && columns.length > 0) {
            searchQuery += columns.join(", ");
        } else {
            searchQuery += `*`;
        }
        searchQuery += ` FROM "${this.m_tableName}" ORDER BY RANDOM() LIMIT ?`;

        try {
            return await db.getAllAsync<T>(searchQuery, [numOfElements]);

        } catch (error: any) {
            console.warn('searchRandomlyElement: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    }

    // TODO replace Map by an Array
    public async searchElement<T>(db: SQLiteDatabase, elementToSearch?: Map<string, number | string>): Promise<T | Array<T> | undefined> {

        let searchQuery = `SELECT *
                           FROM "${this.m_tableName}"`;

        if (elementToSearch) {
            searchQuery += " WHERE " + this.prepareQueryFromMap(elementToSearch, `AND`) + ";";
        }

        try {
            return await db.getAllAsync<T>(searchQuery);
        } catch (error: any) {
            console.warn('searchElement: \nQuery: \"', searchQuery, '\"\nReceived error : ', error);
            return undefined;
        }
    }

    /* PROTECTED METHODS */

    // TODO update this method to return query and params
    protected prepareQueryFromMap(map: Map<string, number | string>, separator?: string) {
        let result = "";
        let sepLen = 0;

        if (map.size <= this.m_columnsTable.length) {
            for (let [key, value] of map) {
                if (typeof value === 'string') {
                    result += `\"${key}\" = \'${value}\' `;
                } else {
                    result += `\"${key}\" = ${value} `;
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

            for (const key of Object.keys(elementToInsert as Object).filter(key => key !== 'ID')) {
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

                for (const key of Object.keys(element as Object).filter(key => key !== 'ID')) {
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

}
