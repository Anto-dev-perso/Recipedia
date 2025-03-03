import {fireEvent, render, waitFor} from '@testing-library/react-native';
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import Shopping from "@screens/Shopping";
import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";


jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@components/molecules/SectionClickableList', () => require('@mocks/components/molecules/SectionClickableList-mock').sectionClickableListMock);

jest.mock('react-native-gesture-handler', () => require('@mocks/deps/react-native-gesture-handler-mock').gestureHandlerMock());
const Stack = createStackNavigator();

describe('Shopping Screen', () => {

    const database: RecipeDatabase = RecipeDatabase.getInstance();


    beforeEach(async () => {

        await database.init();
        await database.addMultipleIngredients(ingredientsDataset);
        await database.addMultipleTags(tagsDataset);
        await database.addMultipleRecipes(recipesDataset);
        await database.addMultipleShopping([recipesDataset[8], recipesDataset[3]]);
    });
    afterEach(async () => await database.reset());

    test('renders shopping list correctly', () => {
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Shopping"} component={Shopping}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('ShoppingScreenTitle').props.children).toEqual('Shopping list');
        expect(getByTestId('SectionClickableList::IngList').props.children).toEqual('[{"id":1,"type":"Grain or Cereal","name":"Sushi Rice","quantity":250,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":2,"type":"Condiment","name":"Nori Sheets","quantity":5,"unit":"pieces","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":3,"type":"Fish","name":"Salmon","quantity":200,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":4,"type":"Fruit","name":"Avocado","quantity":100,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":5,"type":"Condiment","name":"Soy Sauce","quantity":50,"unit":"ml","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":6,"type":"Vegetable","name":"Romaine Lettuce","quantity":100,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false},{"id":7,"type":"Grain or Cereal","name":"Croutons","quantity":50,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false},{"id":8,"type":"Sauce","name":"Caesar Dressing","quantity":50,"unit":"ml","recipesTitle":["Caesar Salad"],"purchased":false},{"id":9,"type":"Cheese","name":"Parmesan","quantity":30,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false}]');
        expect(getByTestId('SectionClickableList::SetterIngList').props.children).toBeTruthy();
    });
    test('section clickable shall update the purchased value', async () => {
        const dbInstance = RecipeDatabase.getInstance();
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Shopping"} component={Shopping}/>
            </Stack.Navigator></NavigationContainer>);

        const expected = JSON.parse('[{"id":1,"type":"Grain or Cereal","name":"Sushi Rice","quantity":250,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":true},{"id":2,"type":"Condiment","name":"Nori Sheets","quantity":5,"unit":"pieces","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":3,"type":"Fish","name":"Salmon","quantity":200,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":4,"type":"Fruit","name":"Avocado","quantity":100,"unit":"g","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":5,"type":"Condiment","name":"Soy Sauce","quantity":50,"unit":"ml","recipesTitle":["Sushi Rolls"],"purchased":false},{"id":6,"type":"Vegetable","name":"Romaine Lettuce","quantity":100,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false},{"id":7,"type":"Grain or Cereal","name":"Croutons","quantity":50,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false},{"id":8,"type":"Sauce","name":"Caesar Dressing","quantity":50,"unit":"ml","recipesTitle":["Caesar Salad"],"purchased":false},{"id":9,"type":"Cheese","name":"Parmesan","quantity":30,"unit":"g","recipesTitle":["Caesar Salad"],"purchased":false}]');

        for (let i = 0; i < expected.length; i++) {
            fireEvent.press(getByTestId('SectionClickableList::SetterIngList'));

            expected[i].purchased = true;
            await waitFor(() => expect(getByTestId('SectionClickableList::IngList').props.children).toEqual(JSON.stringify(expected)));
            expect(expected).toEqual(dbInstance.get_shopping());
        }
    });

});
