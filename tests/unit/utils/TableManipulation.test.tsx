import TableManipulation from '@utils/TableManipulation';
import {jest} from '@jest/globals';
import {databaseColumnType, encodedType} from '@customTypes/DatabaseElementTypes';

import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => require('@mocks/expo/expo-sqlite-mock').expoSqliteMock());

type TestDbType = { ID?: number, name: string, age: number };

describe('TableManipulation', () => {
    const memoryDb = ':memory';
    const mockColumns: Array<databaseColumnType> = [
        {colName: 'name', type: encodedType.TEXT},
        {colName: 'age', type: encodedType.INTEGER},
    ];
    const table = new TableManipulation('TestTable', mockColumns);

    let DB: SQLite.SQLiteDatabase;
    beforeEach(async () => {
        DB = await SQLite.openDatabaseAsync(memoryDb);
    });
    afterEach(async () => {
        await SQLite.deleteDatabaseAsync(memoryDb);
    });

    test('TableManipulation with empty parameter shall log an error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const consoleWarningSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        });


        new TableManipulation('', mockColumns);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'ERROR: Table name cannot be empty'
        );
        expect(consoleWarningSpy).toHaveBeenCalledTimes(1);

        new TableManipulation('test', new Array<databaseColumnType>());
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ERROR: No column names specified'
        );
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);

        new TableManipulation('', new Array<databaseColumnType>());
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'ERROR: No column names specified'
        );
        expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
        expect(consoleWarningSpy).toHaveBeenCalledWith(
            'ERROR: Table name cannot be empty'
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

        expect(await table.insertElement({}, DB)).toBeUndefined();
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

        const arrayInserted = new Array<TestDbType>({name: 'John Doe', age: 30}, {
            name: 'Toto',
            age: 8
        }, {name: 'Sparky', age: 7}, {name: 'CutyCat', age: 2});
        await table.insertArrayOfElement(arrayInserted, DB);

        expect(await table.searchElementById(2, DB)).toEqual({ID: 2, ...arrayInserted[1]});
        expect(await table.searchElementById(4, DB)).toEqual({ID: 4, ...arrayInserted[3]});
        expect(await table.searchElementById(1, DB)).toEqual({ID: 1, ...arrayInserted[0]});
        expect(await table.searchElementById(3, DB)).toEqual({ID: 3, ...arrayInserted[2]});

        expect(await table.searchElementById(-1, DB)).toBeUndefined();
        expect(await table.searchElementById(5, DB)).toBeUndefined();
    });

    test('searchRandomlyElement should return random element(s)', async () => {
        const elementsInTable = new Array<TestDbType>();
        await table.createTable(DB);

        expect(await table.searchRandomlyElement(1, DB)).toEqual([]);


        let newElem: TestDbType = {name: 'John Doe', age: 30};
        let elemCounter = 1;

        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;
        expect(await table.searchRandomlyElement(1, DB)).toEqual(elementsInTable);

        newElem = {name: 'Toto', age: 8};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;
        // @ts-ignore will always return an array
        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(2, DB)));

        newElem = {name: 'Titi', age: 3};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(3, DB) as Array<string>));

        newElem = {name: 'GrandMa', age: 91};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(4, DB) as Array<string>));

        newElem = {name: 'GrandPa', age: 84};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(5, DB) as Array<string>));

        newElem = {name: 'Papa', age: 43};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(6, DB) as Array<string>));

        newElem = {name: 'Mama', age: 41};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(7, DB) as Array<string>));

        newElem = {name: 'Sparky', age: 7};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(8, DB) as Array<string>));

        newElem = {name: 'CutyCat', age: 2};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(9, DB) as Array<string>));

        newElem = {name: 'Smith', age: 58};
        await table.insertElement(newElem, DB);
        elementsInTable.push({ID: elemCounter, ...newElem});
        elemCounter++;

        expect(elementsInTable).toEqual(expect.arrayContaining(await table.searchRandomlyElement(10, DB) as Array<string>));

        expect(await table.searchRandomlyElement(0, DB)).toBeUndefined();
        expect(await table.searchRandomlyElement(-1, DB)).toBeUndefined();

        const random1 = await table.searchRandomlyElement(2, DB) as Array<string>;
        expect(elementsInTable).toEqual(expect.arrayContaining(random1));

        const random2 = await table.searchRandomlyElement(2, DB) as Array<string>;
        expect(elementsInTable).toEqual(expect.arrayContaining(random2));

        expect(random1).not.toEqual(random2);
    });

    test('deleteElementById should delete only elements with theirs identifiers', async () => {
        const elementsInTable = new Array<TestDbType>({ID: 1, name: 'John Doe', age: 30},
            {ID: 2, name: 'Toto', age: 8},
            {ID: 3, name: 'Titi', age: 3},
            {ID: 4, name: 'GrandMa', age: 91},
            {ID: 5, name: 'GrandPa', age: 84},
            {ID: 6, name: 'Papa', age: 43},
            {ID: 7, name: 'Mama', age: 41},
            {ID: 8, name: 'Sparky', age: 7},
            {ID: 9, name: 'CutyCat', age: 2},
            {ID: 10, name: 'Smith', age: 58});
        await table.createTable(DB);

        expect(await table.deleteElementById(1, DB)).toEqual(false);
        expect(expect.arrayContaining(await table.searchRandomlyElement(elementsInTable.length, DB) as Array<string>)).toEqual([]);

        expect(await table.insertArrayOfElement(elementsInTable, DB)).toEqual(true);
        expect(expect.arrayContaining(await table.searchRandomlyElement(elementsInTable.length, DB) as Array<string>)).toEqual(elementsInTable);

        expect(await table.deleteElementById(11, DB)).toEqual(false);

        for (let i = elementsInTable.length; i > 0; i--) {

            expect(await table.deleteElementById(i, DB)).toEqual(true);
            elementsInTable.pop();
            if (elementsInTable.length > 0) {
                expect(expect.arrayContaining(await table.searchRandomlyElement(elementsInTable.length, DB) as Array<string>)).toEqual(elementsInTable);
            } else {
                expect(expect.arrayContaining(await table.searchRandomlyElement(1, DB) as Array<string>)).toEqual([]);
            }
        }

    });


// TODO
//     editElement
    // searchElement
    // deleteElement
});
