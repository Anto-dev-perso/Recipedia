/**
 * TableManipulation - Generic SQLite database table operations utility
 *
 * This class provides a generic interface for performing CRUD operations on SQLite tables.
 * It handles table creation, data insertion, querying, updating, and deletion with proper
 * error handling and logging. Designed to work with any table structure through generic types.
 *
 * Key Features:
 * - Generic CRUD operations
 * - Batch operations for better performance
 * - Transaction support for data consistency
 * - Parameterized queries for SQL injection prevention
 * - Comprehensive error handling and logging
 *
 * @example
 * ```typescript
 * const tableManipulation = new TableManipulation("recipes", [
 *   { colName: "title", type: "TEXT" },
 *   { colName: "description", type: "TEXT" }
 * ]);
 *
 * await tableManipulation.createTable(db);
 * const id = await tableManipulation.insertElement(recipe, db);
 * ```
 */

import { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { databaseColumnType } from '@customTypes/DatabaseElementTypes';
import { databaseLogger } from '@utils/logger';

export default class TableManipulation {
  protected m_tableName: string;
  protected m_columnsTable: Array<databaseColumnType>; // define all columns (except ID). All are not null
  protected m_idColumn = 'ID';

  /**
   * Creates a new TableManipulation instance
   *
   * @param tabName - Name of the database table
   * @param colNames - Array of column definitions (excluding the auto-increment ID column)
   *
   * @example
   * ```typescript
   * const table = new TableManipulation("users", [
   *   { colName: "name", type: "TEXT" },
   *   { colName: "email", type: "TEXT" },
   *   { colName: "age", type: "INTEGER" }
   * ]);
   * ```
   */
  constructor(tabName: string, colNames: Array<databaseColumnType>) {
    if (tabName.length <= 0) {
      databaseLogger.error('ERROR: Table name cannot be empty');
      this.m_tableName = '';
    } else {
      this.m_tableName = tabName;
    }
    if (colNames.length <= 0) {
      databaseLogger.error('ERROR: No column names specified');
      this.m_columnsTable = new Array<databaseColumnType>();
    } else {
      this.m_columnsTable = colNames;
    }
  }

  /**
   * Deletes the entire table from the database
   *
   * @param db - SQLite database connection
   * @returns Promise resolving to true if successful, false otherwise
   *
   * @example
   * ```typescript
   * const success = await table.deleteTable(db);
   * if (success) {
   *   console.log("Table deleted successfully");
   * }
   * ```
   */
  public async deleteTable(db: SQLiteDatabase): Promise<boolean> {
    const dropQuery = `DROP TABLE IF EXISTS ${this.m_tableName}`;
    try {
      await db.execAsync(dropQuery);
      return true;
    } catch (error: any) {
      databaseLogger.error('deleteTable: \nQuery: \"', dropQuery, '\"\nReceived error : ', error);
      return false;
    }
  }

  /**
   * Creates the table in the database if it doesn't exist
   *
   * Creates a table with an auto-increment ID column plus all specified columns.
   * All columns are marked as NOT NULL.
   *
   * @param db - SQLite database connection
   * @returns Promise resolving to true if successful, false otherwise
   *
   * @example
   * ```typescript
   * const success = await table.createTable(db);
   * if (success) {
   *   console.log("Table created successfully");
   * }
   * ```
   */
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
      databaseLogger.error('createTable: \nQuery: \"', createQuery, '\"\nReceived error : ', error);
      return false;
    }
  }

  /**
   * Deletes a single element from the table by its ID
   *
   * @param id - The ID of the element to delete
   * @param db - SQLite database connection
   * @returns Promise resolving to true if successful, false otherwise
   *
   * @example
   * ```typescript
   * const success = await table.deleteElementById(123, db);
   * if (success) {
   *   console.log("Element deleted successfully");
   * }
   * ```
   */
  public async deleteElementById(id: number, db: SQLiteDatabase): Promise<boolean> {
    const deleteQuery = `DELETE
                             FROM "${this.m_tableName}"
                             WHERE ${this.m_idColumn} = ?;`;
    try {
      const runRes = await db.runAsync(deleteQuery, [id]);
      if (runRes.changes == 0) {
        databaseLogger.error("deleteElementById: Can't delete element with id ", id);
        return false;
      } else {
        return true;
      }
    } catch (error: any) {
      databaseLogger.error(
        'deleteElementById: \nQuery: \"',
        deleteQuery,
        '\"\nReceived error : ',
        error
      );
      return false;
    }
  }

  public async deleteElement(
    db: SQLiteDatabase,
    elementToSearch?: Map<string, number | string>
  ): Promise<boolean> {
    let deleteQuery = `DELETE
                           FROM "${this.m_tableName}"`;

    if (elementToSearch) {
      deleteQuery += ' WHERE ' + this.prepareQueryFromMap(elementToSearch, `AND`) + ';';
    }

    try {
      const runRes = await db.runAsync(deleteQuery);
      if (runRes.changes == 0) {
        databaseLogger.error("deleteElement: Can't delete element with search: ", elementToSearch);
        return false;
      } else {
        return true;
      }
    } catch (error: any) {
      databaseLogger.error(
        'deleteElement: \nQuery: \"',
        deleteQuery,
        '\"\nReceived error : ',
        error
      );
      return false;
    }
  }

  /**
   * Inserts a single element into the table
   *
   * @param element - The element to insert (object with properties matching table columns)
   * @param db - SQLite database connection
   * @returns Promise resolving to the inserted element's ID, or undefined if failed
   *
   * @example
   * ```typescript
   * const user = { name: "John", email: "john@example.com", age: 30 };
   * const id = await table.insertElement(user, db);
   * if (id) {
   *   console.log(`User inserted with ID: ${id}`);
   * }
   * ```
   */
  public async insertElement<TElement>(
    element: TElement,
    db: SQLiteDatabase
  ): Promise<number | undefined> {
    const [insertQuery, params] = this.prepareInsertQuery(element);
    if (insertQuery.length == 0) {
      databaseLogger.error('Invalid insert query');
      return undefined;
    }
    if (params.length == 0) {
      databaseLogger.error('Empty values');
      return undefined;
    }

    try {
      const result: SQLiteRunResult = await db.runAsync(insertQuery, params);
      return result.lastInsertRowId;
    } catch (error: any) {
      databaseLogger.error(
        'insertElement: \nQuery: \"',
        insertQuery,
        '\"\nReceived error : ',
        error
      );
      return undefined;
    }
  }

  public async insertArrayOfElement<TElement>(
    arrayElements: Array<TElement>,
    db: SQLiteDatabase
  ): Promise<boolean> {
    const [insertQuery, params] = this.prepareInsertQuery(arrayElements);
    if (insertQuery.length == 0) {
      databaseLogger.error(
        'insertArrayOfElement<',
        typeof arrayElements[0],
        '>: query is empty due to an issue'
      );
      return false;
    }
    try {
      await db.runAsync(insertQuery, params);
      return true;
    } catch (error: any) {
      databaseLogger.error(
        'insertArrayOfElement<',
        typeof arrayElements[0],
        '>: \nQuery: \"',
        insertQuery,
        '\"\nReceived error : ',
        error
      );
      return false;
    }
  }

  public async editElementById(
    id: number,
    elementToUpdate: Map<string, number | string>,
    db: SQLiteDatabase
  ): Promise<boolean> {
    let updateQuery = `UPDATE "${this.m_tableName}"
                           SET `;
    // SET column1 = value1, column2 = value2...., columnN = valueN
    // WHERE [condition];
    const queryFromMap = this.prepareQueryFromMap(elementToUpdate, ',');
    if (queryFromMap.length === 0) {
      return false;
    }

    updateQuery += queryFromMap + ` WHERE ID = ${id};`;
    try {
      const result = await db.runAsync(updateQuery);
      return result.changes > 0;
    } catch (error: any) {
      databaseLogger.error('editElement: \nQuery: \"', updateQuery, '\"\nReceived error : ', error);
      return false;
    }
  }

  /**
   * Performs batch updates on multiple elements using a database transaction
   *
   * Updates multiple elements efficiently using a single transaction.
   * If any update fails, the entire transaction is rolled back.
   *
   * @param updates - Array of update objects containing ID and fields to update
   * @param db - SQLite database connection
   * @returns Promise resolving to true if all updates successful, false otherwise
   *
   * @example
   * ```typescript
   * const updates = [
   *   { id: 1, elementToUpdate: new Map([["name", "John Updated"]]) },
   *   { id: 2, elementToUpdate: new Map([["age", 31]]) }
   * ];
   * const success = await table.batchUpdateElementsById(updates, db);
   * ```
   */
  public async batchUpdateElementsById(
    updates: Array<{
      id: number;
      elementToUpdate: Map<string, number | string>;
    }>,
    db: SQLiteDatabase
  ): Promise<boolean> {
    if (updates.length === 0) {
      return true;
    }

    try {
      await db.withTransactionAsync(async () => {
        for (const update of updates) {
          const queryFromMap = this.prepareQueryFromMap(update.elementToUpdate, ',');
          if (queryFromMap.length === 0) {
            continue;
          }

          const updateQuery = `UPDATE "${this.m_tableName}"
                                         SET ${queryFromMap}
                                         WHERE ID = ${update.id};`;
          await db.runAsync(updateQuery);
        }
      });
      return true;
    } catch (error: any) {
      databaseLogger.warn('batchUpdateElementsById: \nReceived error : ', error);
      return false;
    }
  }

  /**
   * Searches for a single element by its ID
   *
   * @param elementId - The ID of the element to find
   * @param db - SQLite database connection
   * @returns Promise resolving to the found element or undefined if not found
   *
   * @example
   * ```typescript
   * const user = await table.searchElementById<User>(123, db);
   * if (user) {
   *   console.log(`Found user: ${user.name}`);
   * }
   * ```
   */
  public async searchElementById<T>(elementId: number, db: SQLiteDatabase): Promise<T | undefined> {
    if (isNaN(elementId)) {
      databaseLogger.error('searchElementById: Id use for search is null');
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
      databaseLogger.warn(
        'searchElementById: \nQuery: \"',
        searchQuery,
        '\"\nReceived error : ',
        error
      );
      return undefined;
    }
  }

  /**
   * Retrieves random elements from the table
   *
   * @param numOfElements - Number of random elements to retrieve
   * @param db - SQLite database connection
   * @param columns - Optional array of specific columns to select
   * @returns Promise resolving to array of random elements or undefined if failed
   *
   * @example
   * ```typescript
   * const randomUsers = await table.searchRandomlyElement<User>(5, db, ["name", "email"]);
   * console.log(`Got ${randomUsers?.length} random users`);
   * ```
   */
  public async searchRandomlyElement<T>(
    numOfElements: number,
    db: SQLiteDatabase,
    columns?: Array<string>
  ): Promise<Array<T> | undefined> {
    if (numOfElements <= 0) {
      return undefined;
    }

    let searchQuery = `SELECT `;
    if (columns && columns.length > 0) {
      searchQuery += columns.join(', ');
    } else {
      searchQuery += `*`;
    }
    searchQuery += ` FROM "${this.m_tableName}" ORDER BY RANDOM() LIMIT ?`;

    try {
      return await db.getAllAsync<T>(searchQuery, [numOfElements]);
    } catch (error: any) {
      databaseLogger.warn(
        'searchRandomlyElement: \nQuery: \"',
        searchQuery,
        '\"\nReceived error : ',
        error
      );
      return undefined;
    }
  }

  /**
   * Searches for elements matching specified criteria
   *
   * @param db - SQLite database connection
   * @param elementToSearch - Optional map of column-value pairs for filtering
   * @returns Promise resolving to matching element(s) or undefined if failed
   *
   * @example
   * ```typescript
   * // Get all elements
   * const allUsers = await table.searchElement<User>(db);
   *
   * // Search with criteria
   * const searchCriteria = new Map([["age", 25], ["city", "New York"]]);
   * const filteredUsers = await table.searchElement<User>(db, searchCriteria);
   * ```
   */
  public async searchElement<T>(
    db: SQLiteDatabase,
    elementToSearch?: Map<string, number | string>
  ): Promise<T | Array<T> | undefined> {
    let searchQuery = `SELECT *
                           FROM "${this.m_tableName}"`;

    if (elementToSearch) {
      searchQuery += ' WHERE ' + this.prepareQueryFromMap(elementToSearch, `AND`) + ';';
    }

    try {
      return await db.getAllAsync<T>(searchQuery);
    } catch (error: any) {
      databaseLogger.warn(
        'searchElement: \nQuery: \"',
        searchQuery,
        '\"\nReceived error : ',
        error
      );
      return undefined;
    }
  }

  /* PROTECTED METHODS */

  // TODO update this method to return query and params
  protected prepareQueryFromMap(map: Map<string, number | string>, separator?: string) {
    let result = '';
    let sepLen = 0;

    if (map.size <= this.m_columnsTable.length) {
      for (const [key, value] of map) {
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
      databaseLogger.warn(
        'ERROR: you try to update too much columns for this table. Size of column table to update is ',
        this.m_columnsTable.length,
        ' and size of columns to update for this element is ',
        map.size
      );
    }

    return result;
  }

  protected verifyLengthOfElement<TElement extends string>(element: Array<TElement>) {
    let isCheck: boolean = true;
    if (element.length > this.m_columnsTable.length + 1) {
      databaseLogger.warn(
        'ERROR: you try to add an element in a table that is not mapping. Impossible to add this. Size of column table is ',
        this.m_columnsTable.length,
        ' and size of element is ',
        element.length,
        '\n\nelement : ',
        element
      );
      isCheck = false;
    }
    return isCheck;
  }

  protected prepareInsertQuery<TElement>(
    elementToInsert: TElement | Array<TElement>
  ): [string, Array<string>] {
    type TElementKey = keyof TElement;

    let insertQuery =
      `INSERT INTO "${this.m_tableName}" ("` +
      this.m_columnsTable.map(col => col.colName).join('","') +
      '\") VALUES ';
    const returnValues = new Array<string>();

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
        insertQuery = '';
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
