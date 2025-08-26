import { fireEvent, render, waitFor } from '@testing-library/react-native';
import RecipeDatabase from '@utils/RecipeDatabase';
import { ingredientsDataset } from '@test-data/ingredientsDataset';
import { tagsDataset } from '@test-data/tagsDataset';
import { recipesDataset } from '@test-data/recipesDataset';
import React from 'react';
import { mockNavigationFunctions } from '@mocks/deps/react-navigation-mock';
import Shopping from '@screens/Shopping';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());

jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock(
  '@components/molecules/BottomTopButton',
  () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock
);
jest.mock(
  '@components/dialogs/Alert',
  () => require('@mocks/components/dialogs/Alert-mock').alertMock
);

jest.mock('@react-navigation/native', () => ({
  ...require('@mocks/deps/react-navigation-mock').reactNavigationMock(),
  useFocusEffect: jest.fn(callback => {
    const mockNavigation = {
      addListener: jest.fn((event, handler) => {
        if (event === 'focus') {
          handler();
        }
        return jest.fn();
      }),
    };
    callback(mockNavigation);
  }),
}));

const mockRoute = {
  key: 'Shopping',
  name: 'Shopping',
  params: {},
};

const defaultProps = {
  navigation: mockNavigationFunctions,
  route: mockRoute,
} as any;

describe('Shopping Screen', () => {
  const database: RecipeDatabase = RecipeDatabase.getInstance();

  beforeEach(async () => {
    jest.clearAllMocks();

    await database.init();
    await database.addMultipleIngredients(ingredientsDataset);
    await database.addMultipleTags(tagsDataset);
    await database.addMultipleRecipes(recipesDataset);
    await database.addMultipleShopping([recipesDataset[8], recipesDataset[3]]);
  });

  afterEach(async () => await database.reset());

  test('renders Shopping screen with proper components structure', () => {
    const { getByTestId, queryByTestId } = render(<Shopping {...defaultProps} />);

    expect(getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction')).toBeTruthy();
    expect(getByTestId('ShoppingScreen::Alert::IsVisible')).toBeTruthy();

    const hasEmptyState = queryByTestId('ShoppingScreen::TextNoItem');
    const hasSectionList = queryByTestId('ShoppingScreen::SectionList');

    // One of these should be present (not both, not neither)
    expect(hasEmptyState || hasSectionList).toBeTruthy();
    expect(!!(hasEmptyState && hasSectionList)).toBe(false);
  });

  test('renders empty state correctly when no shopping items', async () => {
    await database.resetShoppingList();

    const { getByTestId, queryByTestId } = render(<Shopping {...defaultProps} />);

    expect(getByTestId('ShoppingScreen::TextNoItem')).toBeTruthy();
    expect(getByTestId('ShoppingScreen::TextNoItem').props.children).toEqual(
      'noItemsInShoppingList'
    );
    expect(queryByTestId('ShoppingScreen::SectionList')).toBeNull();
  });

  test('clear shopping list functionality works', async () => {
    const { getByTestId } = render(<Shopping {...defaultProps} />);

    expect(database.get_shopping().length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction'));

    await waitFor(() => {
      expect(database.get_shopping().length).toBe(0);
    });
  });

  test('Alert dialog has correct props structure and values', () => {
    const { getByTestId } = render(<Shopping {...defaultProps} />);

    // Verify Alert dialog props exist and have correct values
    expect(getByTestId('ShoppingScreen::Alert::IsVisible').props.children).toEqual(false);
    expect(getByTestId('ShoppingScreen::Alert::TestId').props.children).toEqual('ShoppingScreen');
    expect(getByTestId('ShoppingScreen::Alert::Title').props.children).toEqual('recipeUsingTitle ');
    expect(getByTestId('ShoppingScreen::Alert::Content').props.children).toEqual(
      'recipeUsingMessage :'
    );
    expect(getByTestId('ShoppingScreen::Alert::ConfirmText').props.children).toEqual(
      'recipeUsingValidation'
    );

    // Verify function buttons exist
    expect(getByTestId('ShoppingScreen::Alert::OnClose')).toBeTruthy();

    // Verify no cancel text in this dialog (it's a simple confirmation dialog)
    expect(() => getByTestId('ShoppingScreen::Alert::CancelText')).toThrow();
    expect(() => getByTestId('ShoppingScreen::Alert::OnCancel')).toThrow();
  });
});
