import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Home from "@screens/Home";
import React from 'react';
import {recipesDataset} from "@test-data/recipesDataset";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {TabScreenParamList} from "@customTypes/ScreenTypes";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";


jest.mock('expo-sqlite', () => require('@mocks/expo/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

jest.mock('@components/organisms/VerticalBottomButtons', () => require('@mocks/components/organisms/VerticalBottomButtons-mock').verticalBottomButtonsMock);
jest.mock('@components/organisms/RecipeRecommendation', () => require('@mocks/components/organisms/RecipeRecommendation-mock').recipeRecommendationMock);
jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(() => Promise.resolve()),  // Mock as a resolved Promise
}));

describe('Home Screen', () => {
    const mockNavigation: Partial<BottomTabNavigationProp<TabScreenParamList, 'Home'>> = {
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: jest.fn(),
        dispatch: jest.fn(),
        canGoBack: jest.fn(),
        getId: jest.fn(),
        getParent: jest.fn(),
        isFocused: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    // -------- INITIAL RENDERING TESTS --------
    test('renders all navigation buttons correctly', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<Home navigation={mockNavigation}/>);

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

    // --------  INTERACTION TESTS --------
    test('navigates to Add Recipe screen on button press', () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<Home navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('SearchButton::OnPressFunction'));

        // Verify navigation was triggered
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Search');
    });
    test('refresh the screen', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<Home navigation={mockNavigation}/>);

        const reco1: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation1::CarouselProps').props.children);
        const reco2: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation2::CarouselProps').props.children);
        const reco3: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation3::CarouselProps').props.children);

        fireEvent(getByTestId('HomeScrollView'), 'onRefresh');

        await waitFor(() => expect(getByTestId('RecipeRecommendation1::CarouselProps').props.children).not.toEqual(reco1));

        const refreshReco1: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation1::CarouselProps').props.children);
        const refreshReco2: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation2::CarouselProps').props.children);
        const refreshReco3: Array<recipeTableElement> = JSON.parse(getByTestId('RecipeRecommendation3::CarouselProps').props.children);

        expect(recipesDataset).toEqual(expect.arrayContaining(refreshReco1));
        expect(recipesDataset).toEqual(expect.arrayContaining(refreshReco2));
        expect(recipesDataset).toEqual(expect.arrayContaining(refreshReco3));

        expect(refreshReco1).not.toEqual(refreshReco2);
        expect(refreshReco1).not.toEqual(refreshReco3);
        expect(refreshReco2).not.toEqual(refreshReco3);

        expect(refreshReco1).not.toEqual(reco1);
        expect(refreshReco1).not.toEqual(reco2);
        expect(refreshReco2).not.toEqual(reco3);
    });
});
