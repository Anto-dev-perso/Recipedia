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
    // Simulate the focus effect by calling the callback with a mock navigation object
    const mockNav = {
      addListener: jest.fn((event, handler) => {
        if (event === 'focus') {
          // Call the handler asynchronously to allow state updates to process
          setTimeout(() => handler(), 10);
        }
        return jest.fn();
      }),
    };
    callback(mockNav);
  }),
}));

const mockRoute = {
  key: 'Shopping',
  name: 'Shopping',
  params: {},
};

const mockNavigation = {
  ...mockNavigationFunctions,
  addListener: jest.fn((event, handler) => {
    if (event === 'focus') {
      // Store the handler and call it immediately for test purposes
      setTimeout(() => handler(), 0);
    }
    return jest.fn();
  }),
};

const defaultProps = {
  navigation: mockNavigation,
  route: mockRoute,
} as any;

async function renderShoppingAndWaitForButtons() {
  const result = render(<Shopping {...defaultProps} />);

  // Wait for focus effect to trigger and buttons to render if they should be present
  // This checks if shopping list has items, and if so, waits for the clear button
  const hasShoppingItems = RecipeDatabase.getInstance().get_shopping().length > 0;

  if (hasShoppingItems) {
    await waitFor(() => {
      expect(
        result.getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction')
      ).toBeTruthy();
    });
  }

  return result;
}

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

  test('renders Shopping screen with proper components structure', async () => {
    const { getByTestId, queryByTestId } = await renderShoppingAndWaitForButtons();

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
    expect(queryByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction')).toBeNull();
  });

  test('clear shopping list functionality works with confirmation', async () => {
    const { getByTestId } = await renderShoppingAndWaitForButtons();

    // Initially confirmation dialog should be hidden
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      false
    );

    fireEvent.press(getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction'));

    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      true
    );

    expect(database.get_shopping().length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('ShoppingScreen::ClearConfirmation::Alert::OnConfirm'));

    await waitFor(() => {
      expect(database.get_shopping().length).toBe(0);
      expect(
        getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children
      ).toBe(false);
    });
  });

  test('Recipe usage Alert dialog has correct props structure and values', () => {
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

  test('Clear confirmation Alert dialog has correct props structure and values', () => {
    const { getByTestId } = render(<Shopping {...defaultProps} />);

    expect(
      getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children
    ).toEqual(false);
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::TestId').props.children).toEqual(
      'ShoppingScreen::ClearConfirmation'
    );
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::Title').props.children).toEqual(
      'clearShoppingList'
    );
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::Content').props.children).toEqual(
      'confirmClearShoppingList'
    );
    expect(
      getByTestId('ShoppingScreen::ClearConfirmation::Alert::ConfirmText').props.children
    ).toEqual('confirm');
    expect(
      getByTestId('ShoppingScreen::ClearConfirmation::Alert::CancelText').props.children
    ).toEqual('cancel');

    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::OnConfirm')).toBeTruthy();
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::OnClose')).toBeTruthy();
  });

  test('clear button shows confirmation dialog when pressed', async () => {
    expect(database.get_shopping().length).toBeGreaterThan(0);

    const { getByTestId } = await renderShoppingAndWaitForButtons();

    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      false
    );

    fireEvent.press(getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction'));

    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      true
    );
  });

  test('cancel button in confirmation dialog hides the dialog', async () => {
    expect(database.get_shopping().length).toBeGreaterThan(0);

    const { getByTestId } = await renderShoppingAndWaitForButtons();

    fireEvent.press(getByTestId('ShoppingScreen::ClearShoppingListButton::OnPressFunction'));
    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      true
    );

    fireEvent.press(getByTestId('ShoppingScreen::ClearConfirmation::Alert::OnClose'));

    expect(getByTestId('ShoppingScreen::ClearConfirmation::Alert::IsVisible').props.children).toBe(
      false
    );

    expect(database.get_shopping().length).toBeGreaterThan(0);
  });

  test('clear button is only visible when shopping list has items', async () => {
    expect(database.get_shopping().length).toBeGreaterThan(0);
    const { getByTestId: getWithItems } = await renderShoppingAndWaitForButtons();
    expect(getWithItems('ShoppingScreen::ClearShoppingListButton::OnPressFunction')).toBeTruthy();

    await database.resetShoppingList();
    expect(database.get_shopping().length).toBe(0);
    const { queryByTestId: queryEmpty } = await renderShoppingAndWaitForButtons();
    expect(queryEmpty('ShoppingScreen::ClearShoppingListButton::OnPressFunction')).toBeNull();
  });
});
