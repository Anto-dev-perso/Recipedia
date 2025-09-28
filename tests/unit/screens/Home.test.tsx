import { render, waitFor } from '@testing-library/react-native';
import Home, { howManyItemInCarousel } from '@screens/Home';
import React from 'react';
import { testRecipes } from '@test-data/recipesDataset';
import { recipeTableElement } from '@customTypes/DatabaseElementTypes';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RecipeDatabase from '@utils/RecipeDatabase';
import { testIngredients } from '@test-data/ingredientsDataset';
import { testTags } from '@test-data/tagsDataset';
import { SeasonFilterProvider } from '@context/SeasonFilterContext';

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

jest.mock('@utils/i18n', () => {
  const originalModule = jest.requireActual('@utils/i18n');
  return {
    ...originalModule,
    useI18n: () => ({
      t: (key: string, params?: Record<string, any>) => key,
      getLocale: () => jest.fn().mockReturnValue('en'),
      setLocale: jest.fn(),
      getAvailableLocales: jest.fn().mockReturnValue(['en', 'fr']),
      getLocaleName: jest.fn().mockImplementation(() => 'locale name'),
    }),
  };
});

const Stack = createStackNavigator();

async function renderHomeAndWaitForRecommendations() {
  const result = render(
    <SeasonFilterProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </SeasonFilterProvider>
  );

  await waitFor(() =>
    expect(
      result.getByTestId('recommendations.randomSelection::CarouselProps').props.children.length
    ).toBeGreaterThan(2)
  );

  return result;
}

describe('Home Screen', () => {
  const database = RecipeDatabase.getInstance();
  const expectedRandomRecommendationLength = Math.min(testRecipes.length, howManyItemInCarousel);

  beforeEach(async () => {
    jest.clearAllMocks();
    await database.init();
    await database.addMultipleIngredients(testIngredients);
    await database.addMultipleTags(testTags);
    await database.addMultipleRecipes(testRecipes);
  });
  afterEach(async () => await database.reset());

  // -------- INITIAL RENDERING TESTS --------
  test('renders all navigation buttons correctly', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    expect(
      getByTestId('recommendations.randomSelection::Title::TitleRecommendation').props.children
    ).toEqual('recommendations.randomSelection');

    const reco1: Array<recipeTableElement> = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );

    expect(testRecipes).toEqual(expect.arrayContaining(reco1));
  });

  test('cleans up deleted recipes when screen gains focus', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const initialReco = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );

    expect(initialReco.length).toBeGreaterThan(0);
    expect(initialReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);

    const firstRecipeInReco1 = initialReco[0];

    await database.deleteRecipe(firstRecipeInReco1);

    expect(database.isRecipeExist(firstRecipeInReco1)).toBe(false);

    const { getByTestId: getByTestIdNew } = await renderHomeAndWaitForRecommendations();

    await waitFor(() => {
      const updatedReco = JSON.parse(
        getByTestIdNew('recommendations.randomSelection::CarouselProps').props.children
      );
      const updatedReco2 = JSON.parse(
        getByTestIdNew('recommendations.perfectForCurrentSeason::CarouselProps').props.children
      );

      expect(updatedReco.length).toBeGreaterThan(0);
      expect(updatedReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);
      expect(updatedReco2.length).toBeGreaterThan(0);
      expect(updatedReco2.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);
      expect(updatedReco.find((r: any) => r.id === firstRecipeInReco1.id)).toBeUndefined();
    });
  });

  test('replaces deleted recipes with new random ones when carousel becomes incomplete', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const initialReco = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );
    expect(initialReco.length).toBeGreaterThan(0);
    expect(initialReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);

    const recipesToDelete = [initialReco[0], initialReco[1]];
    await database.deleteRecipe(recipesToDelete[0]);
    await database.deleteRecipe(recipesToDelete[1]);

    const { getByTestId: getByTestIdNew } = await renderHomeAndWaitForRecommendations();

    await waitFor(() => {
      expect(getByTestIdNew('recommendations.randomSelection::CarouselProps')).toBeTruthy();
    });
    const updatedReco = JSON.parse(
      getByTestIdNew('recommendations.randomSelection::CarouselProps').props.children
    );
    expect(updatedReco.length).toBeGreaterThan(0);
    expect(updatedReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);
    expect(updatedReco.find((r: any) => r.id === recipesToDelete[0].id)).toBeUndefined();
    expect(updatedReco.find((r: any) => r.id === recipesToDelete[1].id)).toBeUndefined();
  });

  test('maintains proper rendering structure across re-renders', async () => {
    const { getByTestId, rerender } = await renderHomeAndWaitForRecommendations();

    expect(getByTestId('recommendations.randomSelection::Title::TitleRecommendation')).toBeTruthy();
    const initialRandomReco = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );
    expect(initialRandomReco.length).toBeGreaterThan(0);
    expect(initialRandomReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);

    rerender(
      <SeasonFilterProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={'Home'} component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </SeasonFilterProvider>
    );

    await waitFor(() => {
      expect(
        getByTestId('recommendations.randomSelection::Title::TitleRecommendation')
      ).toBeTruthy();
    });
    const updatedRandomReco = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );

    expect(updatedRandomReco.length).toBeGreaterThan(0);
    expect(updatedRandomReco.length).toBeLessThanOrEqual(expectedRandomRecommendationLength);
  });

  test('displays proper recommendation titles with translations', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const randomTitle = getByTestId('recommendations.randomSelection::Title::TitleRecommendation')
      .props.children;
    expect(randomTitle).toBe('recommendations.randomSelection');
  });

  test('handles empty database gracefully', async () => {
    await database.reset();
    await database.init();

    const { getByTestId } = render(
      <SeasonFilterProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={'Home'} component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </SeasonFilterProvider>
    );

    await waitFor(() => {
      expect(getByTestId('Home::EmptyState::Title')).toBeTruthy();
      expect(getByTestId('Home::EmptyState::Description')).toBeTruthy();
    });

    expect(getByTestId('Home::EmptyState::Title').props.children).toBe(
      'emptyState.noRecommendations.title'
    );
    expect(getByTestId('Home::EmptyState::Description').props.children).toBe(
      'emptyState.noRecommendations.description'
    );
  });

  test('recommendations contain recipes from test dataset', async () => {
    const { getByTestId } = await renderHomeAndWaitForRecommendations();

    const randomReco = JSON.parse(
      getByTestId('recommendations.randomSelection::CarouselProps').props.children
    );
    const testRecipeIds = testRecipes.map(recipe => recipe.id);

    randomReco.forEach((recipe: recipeTableElement) => {
      expect(testRecipeIds).toContain(recipe.id);
    });
  });
});
