import * as ExpoSQLite from 'expo-sqlite';

export function expoSqliteMock() {
    const Database = require('better-sqlite3');
    let dbInstance: any;

    return {
        openDatabase: jest.fn(() => {
            if (!dbInstance) {
                // Open an in-memory SQLite database for testing
                dbInstance = new Database(':memory:');
            }
            return {
                transaction: jest.fn((callback: ExpoSQLite.SQLTransactionCallback) => {
                    // Simulate `transaction` by calling the callback with a mocked `tx` object
                    const tx: ExpoSQLite.SQLTransaction = {
                        executeSql: async (query: string, params: Array<string>, success: ExpoSQLite.SQLStatementCallback, error: ExpoSQLite.SQLStatementErrorCallback) => {
                            try {
                                const statement = dbInstance.prepare(query);
                                let result: ExpoSQLite.SQLResultSet;
                                if (statement.reader) {
                                    // SELECT queries (reader queries return rows)
                                    const rows = statement.all(params);
                                    result = {
                                        rows: {
                                            length: rows.length,
                                            _array: rows,
                                            item: (index: number) => rows[index] || null
                                        }, rowsAffected: 0,
                                        insertId: undefined,
                                    }
                                } else {
                                    // INSERT, UPDATE, DELETE queries
                                    const runResult = statement.run(params);
                                    result = {
                                        rows: {length: 0, item: () => null, _array: [],},
                                        rowsAffected: runResult.changes,
                                        insertId: runResult.lastInsertRowid || undefined,
                                    }
                                }
                                success(tx, result);
                            } catch (err: any) {
                                error(tx, {code: 1, message: err.toString()});
                            }
                        },
                    };
                    callback(tx);
                }),
                deleteAsync: jest.fn(() => {
                    if (dbInstance) {
                        dbInstance.close();
                        dbInstance = null;
                    } else {
                        throw new Error('Database already deleted or not initialized');
                    }
                }),
            };
        }),

    };
}
