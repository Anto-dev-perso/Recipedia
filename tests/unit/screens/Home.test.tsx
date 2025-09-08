import { render, waitFor } from '@testing-library/react-native';
import Home from '@screens/Home';
import React from 'react';
import { recipesDataset } from '@test-data/recipesDataset';
import { recipeTableElement } from '@customTypes/DatabaseElementTypes';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RecipeDatabase from '@utils/RecipeDatabase';
import { ingredientsDataset } from '@test-data/ingredientsDataset';
import { tagsDataset } from '@test-data/tagsDataset';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);

jest.mock(
  '@components/organisms/VerticalBottomButtons',
  () => require('@mocks/components/organisms/VerticalBottomButtons-mock').verticalBottomButtonsMock
);
jest.mock(
  '@components/organisms/RecipeRecommendation',
  () => require('@mocks/components/organisms/RecipeRecommendation-mock').recipeRecommendationMock
);
jest.mock(
  '@components/molecules/BottomTopButton',
  () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock
);

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()), // Mock as a resolved Promise
  useFonts: jest.fn(() => Promise.resolve()), // Mock as a resolved Promise
}));

const Stack = createStackNavigator();

async function renderHomeAndWaitForRecommendations() {
  const result = render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={'Home'} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  await waitFor(() =>
    expect(
      result.getByTestId('Recommendation 1::CarouselProps').props.children.length
    ).toBeGreaterThan(2)
  );

  return result;
}

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
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    expect(getByTestId('Recommendation 1::Title::TitleRecommendation').props.children).toEqual(
      'Recommendation 1'
    );
    expect(getByTestId('Recommendation 2::Title::TitleRecommendation').props.children).toEqual(
      'Recommendation 2'
    );
    expect(getByTestId('Recommendation 3::Title::TitleRecommendation').props.children).toEqual(
      'Recommendation 3'
    );

    const reco1: Array<recipeTableElement> = JSON.parse(
      getByTestId('Recommendation 1::CarouselProps').props.children
    );
    const reco2: Array<recipeTableElement> = JSON.parse(
      getByTestId('Recommendation 2::CarouselProps').props.children
    );
    const reco3: Array<recipeTableElement> = JSON.parse(
      getByTestId('Recommendation 3::CarouselProps').props.children
    );

    expect(recipesDataset).toEqual(expect.arrayContaining(reco1));
    expect(recipesDataset).toEqual(expect.arrayContaining(reco2));
    expect(recipesDataset).toEqual(expect.arrayContaining(reco3));

    expect(reco1).not.toEqual(reco2);
    expect(reco1).not.toEqual(reco3);
    expect(reco2).not.toEqual(reco3);
  });

  test('cleans up deleted recipes when screen gains focus', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const initialReco1 = JSON.parse(getByTestId('Recommendation 1::CarouselProps').props.children);
    const initialReco2 = JSON.parse(getByTestId('Recommendation 2::CarouselProps').props.children);

    expect(initialReco1.length).toBe(4);
    expect(initialReco2.length).toBe(4);

    const firstRecipeInReco1 = initialReco1[0];
    const firstRecipeInReco2 = initialReco2[0];

    await database.deleteRecipe(firstRecipeInReco1);
    await database.deleteRecipe(firstRecipeInReco2);

    expect(database.isRecipeExist(firstRecipeInReco1)).toBe(false);
    expect(database.isRecipeExist(firstRecipeInReco2)).toBe(false);

    const { getByTestId: getByTestIdNew } = await renderHomeAndWaitForRecommendations();

    await waitFor(() => {
      const updatedReco1 = JSON.parse(
        getByTestIdNew('Recommendation 1::CarouselProps').props.children
      );
      const updatedReco2 = JSON.parse(
        getByTestIdNew('Recommendation 2::CarouselProps').props.children
      );

      expect(updatedReco1.length).toBe(4);
      expect(updatedReco2.length).toBe(4);
      expect(updatedReco1.find((r: any) => r.id === firstRecipeInReco1.id)).toBeUndefined();
      expect(updatedReco2.find((r: any) => r.id === firstRecipeInReco2.id)).toBeUndefined();
    });
  });

  test('replaces deleted recipes with new random ones when carousel becomes incomplete', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const initialReco1 = JSON.parse(getByTestId('Recommendation 1::CarouselProps').props.children);
    expect(initialReco1.length).toBe(4);

    const recipesToDelete = [initialReco1[0], initialReco1[1]];
    await database.deleteRecipe(recipesToDelete[0]);
    await database.deleteRecipe(recipesToDelete[1]);

    const { getByTestId: getByTestIdNew } = await renderHomeAndWaitForRecommendations();

    await waitFor(() => {
      const updatedReco1 = JSON.parse(
        getByTestIdNew('Recommendation 1::CarouselProps').props.children
      );
      expect(updatedReco1.length).toBe(4);
      expect(updatedReco1.find((r: any) => r.id === recipesToDelete[0].id)).toBeUndefined();
      expect(updatedReco1.find((r: any) => r.id === recipesToDelete[1].id)).toBeUndefined();
    });
  });

  test('does not modify recommendations when no recipes are deleted', async () => {
    const { getByTestId, rerender } = await renderHomeAndWaitForRecommendations();

    const initialReco1 = JSON.parse(getByTestId('Recommendation 1::CarouselProps').props.children);
    const initialReco2 = JSON.parse(getByTestId('Recommendation 2::CarouselProps').props.children);

    rerender(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    await waitFor(() => {
      const updatedReco1 = JSON.parse(
        getByTestId('Recommendation 1::CarouselProps').props.children
      );
      const updatedReco2 = JSON.parse(
        getByTestId('Recommendation 2::CarouselProps').props.children
      );

      expect(updatedReco1).toEqual(initialReco1);
      expect(updatedReco2).toEqual(initialReco2);
    });
  });
});
