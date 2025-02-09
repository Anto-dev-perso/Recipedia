import {fireEvent, render, waitFor} from '@testing-library/react-native';
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import Shopping from "@screens/Shopping";
import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";


jest.mock('expo-sqlite', () => require('@mocks/utils/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@components/molecules/SectionClickableList', () => require('@mocks/components/molecules/SectionClickableList-mock').sectionClickableListMock);

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
        expect(getByTestId('SectionClickableList::IngList').props.children).toEqual('[{"type":"Grain or Cereal","name":"Sushi Rice","purchased":false,"quantity":250,"recipesTitle":["Sushi Rolls"],"unit":"g","id":1},{"type":"Condiment","name":"Nori Sheets","purchased":false,"quantity":5,"recipesTitle":["Sushi Rolls"],"unit":"pieces","id":2},{"type":"Fish","name":"Salmon","purchased":false,"quantity":200,"recipesTitle":["Sushi Rolls"],"unit":"g","id":3},{"type":"Fruit","name":"Avocado","purchased":false,"quantity":100,"recipesTitle":["Sushi Rolls"],"unit":"g","id":4},{"type":"Condiment","name":"Soy Sauce","purchased":false,"quantity":50,"recipesTitle":["Sushi Rolls"],"unit":"ml","id":5},{"type":"Vegetable","name":"Romaine Lettuce","purchased":false,"quantity":100,"recipesTitle":["Caesar Salad"],"unit":"g","id":6},{"type":"Grain or Cereal","name":"Croutons","purchased":false,"quantity":50,"recipesTitle":["Caesar Salad"],"unit":"g","id":7},{"type":"Sauce","name":"Caesar Dressing","purchased":false,"quantity":50,"recipesTitle":["Caesar Salad"],"unit":"ml","id":8},{"type":"Cheese","name":"Parmesan","purchased":false,"quantity":30,"recipesTitle":["Caesar Salad"],"unit":"g","id":9}]');
        expect(getByTestId('SectionClickableList::SetterIngList').props.children).toBeTruthy();
    });
    test('section clickable shall update the purchased value', async () => {
        const dbInstance = RecipeDatabase.getInstance();
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Shopping"} component={Shopping}/>
            </Stack.Navigator></NavigationContainer>);

        const expected = JSON.parse('[{"type":"Grain or Cereal","name":"Sushi Rice","purchased":false,"quantity":250,"recipesTitle":["Sushi Rolls"],"unit":"g","id":1},{"type":"Condiment","name":"Nori Sheets","purchased":false,"quantity":5,"recipesTitle":["Sushi Rolls"],"unit":"pieces","id":2},{"type":"Fish","name":"Salmon","purchased":false,"quantity":200,"recipesTitle":["Sushi Rolls"],"unit":"g","id":3},{"type":"Fruit","name":"Avocado","purchased":false,"quantity":100,"recipesTitle":["Sushi Rolls"],"unit":"g","id":4},{"type":"Condiment","name":"Soy Sauce","purchased":false,"quantity":50,"recipesTitle":["Sushi Rolls"],"unit":"ml","id":5},{"type":"Vegetable","name":"Romaine Lettuce","purchased":false,"quantity":100,"recipesTitle":["Caesar Salad"],"unit":"g","id":6},{"type":"Grain or Cereal","name":"Croutons","purchased":false,"quantity":50,"recipesTitle":["Caesar Salad"],"unit":"g","id":7},{"type":"Sauce","name":"Caesar Dressing","purchased":false,"quantity":50,"recipesTitle":["Caesar Salad"],"unit":"ml","id":8},{"type":"Cheese","name":"Parmesan","purchased":false,"quantity":30,"recipesTitle":["Caesar Salad"],"unit":"g","id":9}]');

        for (let i = 0; i < expected.length; i++) {
            fireEvent.press(getByTestId('SectionClickableList::SetterIngList'));

            expected[i].purchased = true;
            await waitFor(() => expect(getByTestId('SectionClickableList::IngList').props.children).toEqual(JSON.stringify(expected)));
            expect(expected).toEqual(dbInstance.get_shopping());
        }
    });

});
