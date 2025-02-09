import TableManipulation from '@utils/TableManipulation';
import {jest} from '@jest/globals';
import {databaseColumnType, encodedType} from '@customTypes/DatabaseElementTypes';

// @ts-ignore
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => require('@mocks/utils/expo-sqlite-mock').expoSqliteMock());

describe('TableManipulation', () => {
    const mockColumns: Array<databaseColumnType> = [
        {colName: 'name', type: encodedType.TEXT},
        {colName: 'age', type: encodedType.INTEGER},
    ];
    const table = new TableManipulation('TestTable', mockColumns);

    let DB: SQLite.Database;
    beforeEach(() => {
        DB = SQLite.openDatabase('TestTable.db');
    });
    afterEach(async () => {
        // @ts-ignore deleteAsync exist thanks to the mock
        await DB.deleteAsync();
    });

    test('TableManipulation with empty parameter shall log an error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const consoleWarningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        });


        new TableManipulation('', mockColumns);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'ERROR when creating the table : No name for the table'
        );
        expect(consoleWarningSpy).toHaveBeenCalledTimes(1);

        new TableManipulation('test', new Array<databaseColumnType>());
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ERROR when creating the table : No column names'
        );
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

        new TableManipulation('', new Array<databaseColumnType>());
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ERROR when creating the table : No column names'
        );
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'ERROR when creating the table : No name for the table'
        );
        expect(consoleWarningSpy).toHaveBeenCalledTimes(2);

        // Restore the original implementation of console.error
        consoleErrorSpy.mockRestore();
        consoleWarningSpy.mockRestore();
    });

    test('createTable should generate a valid SQL query', async () => {
        expect(await table.createTable(DB)).toEqual(true);

    });

    test('deleteTable should generate a valid DROP TABLE query', async () => {
        await table.createTable(DB);
        expect(await table.deleteTable(DB)).toEqual(true);
    });

    test('insertElement should generate a valid INSERT query', async () => {
        await table.createTable(DB);


        expect(await table.insertElement({name: 'John Doe', age: 30}, DB)).toEqual(1);
        expect(await table.insertElement({name: 'Toto', age: 8}, DB)).toEqual(2);
        expect(await table.insertElement({name: '', age: 0}, DB)).toEqual(3);
        expect(await table.insertElement({name: 'Negative Number', age: -1}, DB)).toEqual(4);

        expect(await table.insertElement({}, DB)).toEqual("Empty values");
        expect(await table.insertElement({
            id: 5,
            name: 'Too much args',
            age: 70,
            country: "Mexico"
        }, DB)).toBeUndefined();
        expect(await table.insertElement({
            name: 'Too much args but less',
            age: 70,
            country: "Mexico"
        }, DB)).toBeUndefined();
    });

    test('insertArrayOfElement should add multiple elements at once', async () => {
        await table.createTable(DB);

        expect(await table.insertArrayOfElement(new Array<Object>({name: 'John Doe', age: 30}), DB)).toEqual(true);
        expect(await table.insertArrayOfElement(new Array<Object>({name: 'Toto', age: 8}, {
            name: 'Titi',
            age: 3
        }), DB)).toEqual(true);
        expect(await table.insertArrayOfElement(new Array<Object>({name: '', age: 0}, {
            name: 'Negative Number',
            age: -1
        }), DB)).toEqual(true);

        expect(await table.insertArrayOfElement(new Array<Object>({name: 'GrandMa', age: 91}, {
            name: 'GrandPa',
            age: 84
        }, {name: 'Papa', age: 43}, {name: 'Mama', age: 41}), DB)).toEqual(true);

        expect(await table.insertArrayOfElement(new Array<Object>({}), DB)).toEqual(false);
        expect(await table.insertArrayOfElement(new Array<Object>({
            id: 5,
            name: 'Too much args',
            age: 70,
            country: "Mexico"
        }), DB)).toEqual(false);
        expect(await table.insertArrayOfElement(new Array<Object>({
            name: 'Too much args but less',
            age: 70,
            country: "Mexico"
        }), DB)).toEqual(false);
    });

    test('searchElementById should generate a valid SELECT query', async () => {
        await table.createTable(DB);

        const arrayInserted = new Array<Object>({name: 'John Doe', age: 30}, {
            name: 'Toto',
            age: 8
        }, {name: 'Sparky', age: 7}, {name: 'CutyCat', age: 2});
        await table.insertArrayOfElement(arrayInserted, DB);

        expect(await table.searchElementById(2, DB)).toEqual(JSON.stringify({ID: 2, ...arrayInserted[1]}));
        expect(await table.searchElementById(4, DB)).toEqual(JSON.stringify({ID: 4, ...arrayInserted[3]}));
        expect(await table.searchElementById(1, DB)).toEqual(JSON.stringify({ID: 1, ...arrayInserted[0]}));
        expect(await table.searchElementById(3, DB)).toEqual(JSON.stringify({ID: 3, ...arrayInserted[2]}));

        expect(await table.searchElementById(-1, DB)).toEqual(0);
        expect(await table.searchElementById(5, DB)).toEqual(0);
    });

    test('searchRandomlyElement should return random element(s)', async () => {
        const elementsInTable = new Array<string>();
        await table.createTable(DB);

        expect(await table.searchRandomlyElement(1, DB)).toBe(0);


        await table.insertElement({name: 'John Doe', age: 30}, DB);
        elementsInTable.push(JSON.stringify({ID: 1, name: 'John Doe', age: 30}));
        expect(await table.searchRandomlyElement(1, DB)).toEqual(elementsInTable[0]);

        await table.insertElement({name: 'Toto', age: 8}, DB);
        elementsInTable.push(JSON.stringify({ID: 2, name: 'Toto', age: 8}));
        // @ts-ignore
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(2, DB)));

        await table.insertElement({name: 'Titi', age: 3}, DB);
        elementsInTable.push(JSON.stringify({ID: 3, name: 'Titi', age: 3}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(3, DB) as Array<string>));

        await table.insertElement({name: 'GrandMa', age: 91}, DB);
        elementsInTable.push(JSON.stringify({ID: 4, name: 'GrandMa', age: 91}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(4, DB) as Array<string>));

        await table.insertElement({name: 'GrandPa', age: 84}, DB);
        elementsInTable.push(JSON.stringify({ID: 5, name: 'GrandPa', age: 84}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(5, DB) as Array<string>));

        await table.insertElement({name: 'Papa', age: 43}, DB);
        elementsInTable.push(JSON.stringify({ID: 6, name: 'Papa', age: 43}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(6, DB) as Array<string>));

        await table.insertElement({name: 'Mama', age: 41}, DB);
        elementsInTable.push(JSON.stringify({ID: 7, name: 'Mama', age: 41}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(7, DB) as Array<string>));

        await table.insertElement({name: 'Sparky', age: 7}, DB);
        elementsInTable.push(JSON.stringify({ID: 8, name: 'Sparky', age: 7}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(8, DB) as Array<string>));

        await table.insertElement({name: 'CutyCat', age: 2}, DB);
        elementsInTable.push(JSON.stringify({ID: 9, name: 'CutyCat', age: 2}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(9, DB) as Array<string>));

        await table.insertElement({name: 'Smith', age: 58}, DB);
        elementsInTable.push(JSON.stringify({ID: 10, name: 'Smith', age: 58}));
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(10, DB) as Array<string>));

        expect(await table.searchRandomlyElement(0, DB)).toBeUndefined();
        expect(await table.searchRandomlyElement(-1, DB)).toBeUndefined();

        const random1 = await table.searchRandomlyElement(2, DB) as Array<string>;
        expect(elementsInTable).toEqual(expect.arrayContaining(random1));

        const random2 = await table.searchRandomlyElement(2, DB) as Array<string>;
        expect(elementsInTable).toEqual(expect.arrayContaining(random2));

        expect(random1).not.toEqual(random2);
    });


// TODO
// deleteElementById
//     editElement
    // searchElement
});
