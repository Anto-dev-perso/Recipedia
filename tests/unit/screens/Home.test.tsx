import {render, waitFor} from '@testing-library/react-native';
import Home from "@screens/Home";
import React from 'react';
import {recipesDataset} from "@test-data/recipesDataset";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";


jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

jest.mock('@components/organisms/VerticalBottomButtons', () => require('@mocks/components/organisms/VerticalBottomButtons-mock').verticalBottomButtonsMock);
jest.mock('@components/organisms/RecipeRecommendation', () => require('@mocks/components/organisms/RecipeRecommendation-mock').recipeRecommendationMock);
jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(() => Promise.resolve()),  // Mock as a resolved Promise
    useFonts: jest.fn(() => Promise.resolve()),  // Mock as a resolved Promise
}));
jest.mock('react-native-gesture-handler', () => require('@mocks/deps/react-native-gesture-handler-mock').gestureHandlerMock());
const Stack = createStackNavigator();

describe('Home Screen', () => {
    const database = RecipeDatabase.getInstance();

    beforeEach(async () => {
        jest.clearAllMocks();
        await database.init();
        await database.addMultipleIngredients(ingredientsDataset);
        await database.addMultipleTags(tagsDataset);
        await database.addMultipleRecipes(recipesDataset);
    });
    afterEach(async () => await database.reset());

    // -------- INITIAL RENDERING TESTS --------
    test('renders all navigation buttons correctly', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Home"} component={Home}/>
            </Stack.Navigator></NavigationContainer>);

        await waitFor(() => expect(getByTestId('RecipeRecommendation1::CarouselProps').props.children.length).toBeGreaterThan(2));


        expect(getByTestId('RecipeRecommendation1::TitleRecommendation').props.children).toEqual('Recommendation 1');
        expect(getByTestId('RecipeRecommendation2::TitleRecommendation').props.children).toEqual('Recommendation 2');
        expect(getByTestId('RecipeRecommendation3::TitleRecommendation').props.children).toEqual('Recommendation 3');

        const reco1: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation1::CarouselProps').props.children);
        const reco2: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation2::CarouselProps').props.children);
        const reco3: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation3::CarouselProps').props.children);


        expect(recipesDataset).toEqual(expect.arrayContaining(reco1));
        expect(recipesDataset).toEqual(expect.arrayContaining(reco2));
        expect(recipesDataset).toEqual(expect.arrayContaining(reco3));

        expect(reco1).not.toEqual(reco2);
        expect(reco1).not.toEqual(reco3);
        expect(reco2).not.toEqual(reco3);
    });
});
