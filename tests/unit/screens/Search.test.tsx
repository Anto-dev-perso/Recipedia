import {fireEvent, render} from '@testing-library/react-native';
import Search from '@screens/Search';
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';


jest.mock('expo-sqlite', () => require('@mocks/expo/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@components/organisms/FiltersSelection', () => require('@mocks/components/organisms/FiltersSelection-mock').filtersSelectionMock);
jest.mock('@components/organisms/SearchBar', () => require('@mocks/components/organisms/SearchBar-mock').searchBarMock);
jest.mock('@components/organisms/SearchResultDisplay', () => require('@mocks/components/organisms/SearchResultDisplay-test').searchResultDisplayMock);

jest.mock('react-native-gesture-handler', () => require('@mocks/expo/react-native-gesture-handler-mock').gestureHandlerMock());
const Stack = createStackNavigator();

describe('Search Screen', () => {
    const database: RecipeDatabase = RecipeDatabase.getInstance();

    beforeEach(async () => {

        await database.init();
        await database.addMultipleIngredients(ingredientsDataset);
        await database.addMultipleTags(tagsDataset);
        await database.addMultipleRecipes(recipesDataset);
    });
    afterEach(async () => await database.reset());

    test('initializes with database recipes', () => {
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);
        expect(getByTestId('SearchScreen')).toBeTruthy();

        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify(recipesDataset));
    });

    test('Add filter on child components update the React.useState', async () => {
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify(recipesDataset));

        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Nuts and Seeds":["Pine Nuts"]}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([recipesDataset[7]]));
        expect(getByTestId('FiltersSelection::IngredientsList').props.children).toEqual(JSON.stringify(recipesDataset[7].ingredients));
        expect(getByTestId('FiltersSelection::TagsList').props.children).toEqual(JSON.stringify(recipesDataset[7].tags.map(tag => tag.tagName)));

        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Nuts and Seeds":["Pine Nuts"],"Already purchased":["true"]}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([recipesDataset[7]]));
        expect(getByTestId('FiltersSelection::IngredientsList').props.children).toEqual(JSON.stringify(recipesDataset[7].ingredients));
        expect(getByTestId('FiltersSelection::TagsList').props.children).toEqual(JSON.stringify(recipesDataset[7].tags.map(tag => tag.tagName)));

        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Nuts and Seeds":["Pine Nuts"],"Already purchased":["true"],"Preparation Time":["25-30 min"]}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));
        expect(getByTestId('FiltersSelection::IngredientsList').props.children).toEqual(JSON.stringify([]));
        expect(getByTestId('FiltersSelection::TagsList').props.children).toEqual(JSON.stringify([]));
    });

    test('Remove filter on child components update the React.useState', () => {
        // @ts-ignore route and navigation are empty for unit testing
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify(recipesDataset));

        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));
        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));
        fireEvent.press(getByTestId('FilterSelection::AddFilterButton'));

        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Nuts and Seeds":["Pine Nuts"],"Already purchased":["true"],"Preparation Time":["25-30 min"]}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));
        expect(getByTestId('FiltersSelection::IngredientsList').props.children).toEqual(JSON.stringify([]));
        // expect(getByTestId('FiltersSelection::TagsList').props.children).toEqual(JSON.stringify([]));

        fireEvent.press(getByTestId('FilterSelection::RemoveFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Already purchased":["true"],"Preparation Time":["25-30 min"]}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([recipesDataset[2]]));
        // expect(getByTestId('FiltersSelection::IngredientsList').props.children).toEqual(JSON.stringify(recipesDataset[2].ingredients));
        // expect(getByTestId('FiltersSelection::TagsList').props.children).toEqual(JSON.stringify(recipesDataset[2].tags.map(tag => tag.tagName)));

        fireEvent.press(getByTestId('FilterSelection::RemoveFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{"Preparation Time":["25-30 min"]}');


        fireEvent.press(getByTestId('FilterSelection::RemoveFilterButton'));
        expect(getByTestId('FiltersSelection::FiltersState').props.children).toEqual('{}');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify(recipesDataset));
    });

    test('Click on section on child components update the React.useState', () => {
        // @ts-ignore route and navigation are empty for unit testing
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('FiltersSelection::SectionClickable').props.children).toEqual('false');

        fireEvent.press(getByTestId('FilterSelection::SectionClickButton'));
        expect(getByTestId('FiltersSelection::SectionClickable').props.children).toEqual('true');


        fireEvent.press(getByTestId('FilterSelection::SectionClickButton'));
        expect(getByTestId('FiltersSelection::SectionClickable').props.children).toEqual('false');

    });

    test('Click on search bar shall update the React.useState', () => {
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('SearchBar::Clicked').props.children).toEqual('false');

        fireEvent.press(getByTestId('SearchBar::SearchBarClicked'));
        expect(getByTestId('SearchBar::Clicked').props.children).toEqual('true');


        fireEvent.press(getByTestId('SearchBar::SearchBarClicked'));
        expect(getByTestId('SearchBar::Clicked').props.children).toEqual('false');
    });

    test('Edit search phrase shall update the React.useState', () => {
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Search"} component={Search}/>
            </Stack.Navigator></NavigationContainer>);

        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('""');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify(recipesDataset));

        fireEvent.press(getByTestId('SearchBar::SearchBarPhraseChange'));
        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('"S"');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([recipesDataset[0], recipesDataset[3], recipesDataset[5], recipesDataset[8]]));


        fireEvent.press(getByTestId('SearchBar::SearchBarPhraseChange'));
        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('"Se"');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));


        fireEvent.press(getByTestId('SearchBar::SearchBarPhraseChange'));
        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('"Sea"');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));

        fireEvent.press(getByTestId('SearchBar::SearchBarPhraseChange'));
        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('"Sear"');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));


        fireEvent.press(getByTestId('SearchBar::SearchBarPhraseChange'));
        expect(getByTestId('SearchBar::SectionClickable').props.children).toEqual('"Search"');
        expect(getByTestId('SearchResultDisplay::RecipesTitles').props.children).toEqual(JSON.stringify([]));
    });
});
