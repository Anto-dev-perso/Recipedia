import { act, fireEvent, render } from '@testing-library/react-native';
import SimilarityDialog, { SimilarityDialogProps } from '@components/dialogs/SimilarityDialog';
import RecipeDatabase from '@utils/RecipeDatabase';
import React from 'react';
import { tagsDataset } from '@test-data/tagsDataset';
import { ingredientsDataset } from '@test-data/ingredientsDataset';
import { recipesDataset } from '@test-data/recipesDataset';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());

jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);
jest.mock(
  '@components/dialogs/ItemDialog',
  () => require('@mocks/components/dialogs/ItemDialog-mock').itemDialogMock
);

describe('SimilarityDialog', () => {
  const database = RecipeDatabase.getInstance();

  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnUseExisting = jest.fn();
  const mockOnDismiss = jest.fn();

  const sampleTag = tagsDataset[11];
  const sampleIngredient = ingredientsDataset[33];

  const renderTagDialog = (overrideProps: any = {}) => {
    const defaultProps = {
      testId: 'test-similarity',
      isVisible: true,
      onClose: mockOnClose,
      item: {
        type: 'Tag' as const,
        newItemName: 'New tag',
        similarItem: sampleTag,
        onConfirm: mockOnConfirm,
        onUseExisting: mockOnUseExisting,
        onDismiss: mockOnDismiss,
        ...overrideProps.item,
      },
      ...overrideProps,
    };

    return render(<SimilarityDialog {...defaultProps} />);
  };

  const renderIngredientDialog = (overrideProps: any = {}) => {
    const defaultProps: SimilarityDialogProps = {
      testId: 'test-similarity',
      isVisible: true,
      onClose: mockOnClose,
      item: {
        type: 'Ingredient' as const,
        newItemName: 'New ingredient',
        similarItem: sampleIngredient,
        onConfirm: mockOnConfirm,
        onUseExisting: mockOnUseExisting,
        onDismiss: mockOnDismiss,
        ...overrideProps.item,
      },
      ...overrideProps,
    };

    return render(<SimilarityDialog {...defaultProps} />);
  };

  const assertSimilarityFoundDialog = (getByTestId: any, itemType: 'Tag' | 'Ingredient') => {
    // TODO check values
    expect(getByTestId('test-similarity::SimilarityDialog::Title').props.children).toEqual(
      itemType === 'Tag'
        ? 'alerts.tagSimilarity.similarTagFound'
        : 'alerts.ingredientSimilarity.similarIngredientFound'
    );
    expect(getByTestId('test-similarity::SimilarityDialog::Content').props.children).toEqual(
      itemType === 'Tag'
        ? 'alerts.tagSimilarity.similarTagFoundContent'
        : 'alerts.ingredientSimilarity.similarIngredientFoundContent'
    );
    expect(getByTestId('test-similarity::SimilarityDialog::AddButton')).toBeTruthy();
    expect(getByTestId('test-similarity::SimilarityDialog::UseButton')).toBeTruthy();

    expect(() => getByTestId('test-similarity::SimilarityDialog::CancelButton')).toThrow();
    expect(() => getByTestId('test-similarity::ItemDialog::IsVisible')).toThrow();
  };

  const assertNewItemDialog = (getByTestId: any) => {
    // TODO check values
    expect(getByTestId('test-similarity::SimilarityDialog::Title')).toBeTruthy();
    expect(getByTestId('test-similarity::SimilarityDialog::Content')).toBeTruthy();
    expect(getByTestId('test-similarity::SimilarityDialog::AddButton')).toBeTruthy();
    expect(getByTestId('test-similarity::SimilarityDialog::CancelButton')).toBeTruthy();

    expect(() => getByTestId('test-similarity::SimilarityDialog::UseButton')).toThrow();
    expect(() => getByTestId('test-similarity::ItemDialog::IsVisible')).toThrow();
  };

  beforeEach(async () => {
    await database.init();
    await database.addMultipleIngredients(ingredientsDataset);
    await database.addMultipleTags(tagsDataset);
    await database.addMultipleRecipes(recipesDataset);
  });

  afterEach(() => {
    jest.clearAllMocks();
    database.reset();
  });

  test('renders tag similarity dialog correctly when similar item is found', () => {
    const { getByTestId } = renderTagDialog();

    assertSimilarityFoundDialog(getByTestId, 'Tag');
  });

  test('renders ingredient similarity dialog correctly when similar item is found', () => {
    const { getByTestId } = renderIngredientDialog();

    assertSimilarityFoundDialog(getByTestId, 'Ingredient');
  });

  test('renders new tag dialog correctly when no similar item is found', () => {
    const { getByTestId } = renderTagDialog({
      item: { similarItem: undefined },
    });

    assertNewItemDialog(getByTestId);
  });

  test('renders new ingredient dialog correctly when no similar item is found', () => {
    const { getByTestId } = renderIngredientDialog({
      item: { similarItem: undefined },
    });

    assertNewItemDialog(getByTestId);
  });

  test('does not render dialog when isVisible is false', () => {
    const { queryByTestId } = renderTagDialog({ isVisible: false });

    expect(queryByTestId('test-similarity::SimilarityDialog::Title')).toBeNull();
    expect(queryByTestId('test-similarity::SimilarityDialog::Content')).toBeNull();
    expect(queryByTestId('test-similarity::SimilarityDialog::AddButton')).toBeNull();
    expect(queryByTestId('test-similarity::SimilarityDialog::UseButton')).toBeNull();
    expect(queryByTestId('test-similarity::SimilarityDialog::CancelButton')).toBeNull();
  });

  test('calls onUseExisting and onClose when UseButton is pressed for tags', () => {
    const { getByTestId } = renderTagDialog();

    assertSimilarityFoundDialog(getByTestId, 'Tag');
    expect(mockOnUseExisting).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::UseButton'));

    expect(mockOnUseExisting).toHaveBeenCalledTimes(1);
    expect(mockOnUseExisting).toHaveBeenCalledWith(sampleTag);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  test('calls onUseExisting and onClose when UseButton is pressed for ingredients', () => {
    const { getByTestId } = renderIngredientDialog();

    assertSimilarityFoundDialog(getByTestId, 'Ingredient');
    expect(mockOnUseExisting).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::UseButton'));

    expect(mockOnUseExisting).toHaveBeenCalledTimes(1);
    expect(mockOnUseExisting).toHaveBeenCalledWith(sampleIngredient);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  test('shows ItemDialog when AddButton is pressed', () => {
    const { getByTestId } = renderTagDialog();

    assertSimilarityFoundDialog(getByTestId, 'Tag');

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::AddButton'));

    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy();

    expect(getByTestId('test-similarity::SimilarityDialog::Title')).toBeTruthy();
    expect(getByTestId('test-similarity::SimilarityDialog::Content')).toBeTruthy();

    expect(mockOnUseExisting).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test('calls onDismiss and onClose when dialog is dismissed', () => {
    // Create explicit props to ensure proper callback handling
    const testProps = {
      testId: 'test-similarity',
      isVisible: true,
      onClose: mockOnClose,
      item: {
        type: 'Tag' as const,
        newItemName: 'Vegeterian',
        // No similarItem means "new item" mode
        onConfirm: mockOnConfirm,
        onDismiss: mockOnDismiss,
      },
    };
    const { getByTestId } = render(<SimilarityDialog {...testProps} />);

    assertNewItemDialog(getByTestId);
    expect(mockOnDismiss).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    act(() => {
      fireEvent.press(getByTestId('test-similarity::SimilarityDialog::CancelButton'));
    });

    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnUseExisting).not.toHaveBeenCalled();
  });

  test('works correctly without optional onUseExisting callback', () => {
    // Create a tag item with similarItem but no onUseExisting callback
    const itemWithoutOnUseExisting = {
      type: 'Tag' as const,
      newItemName: 'Vegeterian',
      similarItem: sampleTag,
      onConfirm: mockOnConfirm,
      onDismiss: mockOnDismiss,
      // explicitly no onUseExisting
    };
    const { getByTestId } = render(
      <SimilarityDialog
        testId='test-similarity'
        isVisible={true}
        onClose={mockOnClose}
        item={itemWithoutOnUseExisting}
      />
    );

    assertSimilarityFoundDialog(getByTestId, 'Tag');
    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::UseButton'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnUseExisting).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  test('works correctly without optional onDismiss callback', () => {
    const { getByTestId } = renderTagDialog({
      item: { similarItem: undefined, onDismiss: undefined },
    });

    assertNewItemDialog(getByTestId);
    expect(mockOnClose).not.toHaveBeenCalled();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::CancelButton'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnDismiss).not.toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnUseExisting).not.toHaveBeenCalled();
  });

  test('handles tag creation through ItemDialog workflow', () => {
    const { getByTestId } = renderTagDialog();

    assertSimilarityFoundDialog(getByTestId, 'Tag');

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::AddButton'));

    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy();

    fireEvent.press(getByTestId('test-similarity::ItemDialog::Item::OnConfirm'));

    // TODO add expects here
    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy();
  });

  test('handles ingredient creation through ItemDialog workflow', () => {
    const { getByTestId } = renderIngredientDialog();

    assertSimilarityFoundDialog(getByTestId, 'Ingredient');

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::AddButton'));

    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy();

    fireEvent.press(getByTestId('test-similarity::ItemDialog::Item::OnConfirm'));

    // TODO add expects here
    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy();
  });

  test('uses different testId correctly for multiple instances', () => {
    const { getByTestId } = renderTagDialog({ testId: 'custom-similarity-id' });

    expect(getByTestId('custom-similarity-id::SimilarityDialog::Title')).toBeTruthy();
    expect(getByTestId('custom-similarity-id::SimilarityDialog::Content')).toBeTruthy();
    expect(getByTestId('custom-similarity-id::SimilarityDialog::AddButton')).toBeTruthy();
    expect(getByTestId('custom-similarity-id::SimilarityDialog::UseButton')).toBeTruthy();

    expect(() => getByTestId('test-similarity::SimilarityDialog::Title')).toThrow();
    expect(() => getByTestId('test-similarity::SimilarityDialog::Content')).toThrow();
    expect(() => getByTestId('test-similarity::SimilarityDialog::AddButton')).toThrow();
    expect(() => getByTestId('test-similarity::SimilarityDialog::UseButton')).toThrow();
  });

  test('maintains proper button layout in similarity found scenario', () => {
    const { getByTestId } = renderIngredientDialog();

    assertSimilarityFoundDialog(getByTestId, 'Ingredient');

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::AddButton'));
    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy(); // ItemDialog should appear

    // Reset for next test
    jest.clearAllMocks();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::UseButton'));
    expect(mockOnUseExisting).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('maintains proper button layout in new item scenario', () => {
    // Create explicit props to ensure proper callback handling
    const testProps = {
      testId: 'test-similarity',
      isVisible: true,
      onClose: mockOnClose,
      item: {
        type: 'Tag' as const,
        newItemName: 'Vegeterian',
        // No similarItem means "new item" mode
        onConfirm: mockOnConfirm,
        onDismiss: mockOnDismiss,
      },
    };
    const { getByTestId } = render(<SimilarityDialog {...testProps} />);

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::AddButton'));
    expect(getByTestId('test-similarity::ItemDialog::IsVisible')).toBeTruthy(); // ItemDialog should appear

    jest.clearAllMocks();

    fireEvent.press(getByTestId('test-similarity::SimilarityDialog::CancelButton'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
