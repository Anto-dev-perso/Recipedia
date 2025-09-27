import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SettingsItemList, { SettingsItemListProps } from '@components/organisms/SettingsItemList';
import { testTags } from '@test-data/tagsDataset';
import { testIngredients } from '@test-data/ingredientsDataset';
import { ingredientTableElement, tagTableElement } from '@customTypes/DatabaseElementTypes';

// Mock dependencies
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

// Mock SettingsItemCard component
jest.mock(
  '@components/molecules/SettingsItemCard',
  () => require('@mocks/components/molecules/SettingsItemCard-mock').settingsItemCardMock
);

describe('SettingsItemList Component', () => {
  const mockTags = [testTags[7], testTags[0], testTags[8]];

  const mockIngredients = [testIngredients[1], testIngredients[4]];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAddPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ingredient', () => {
    const defaultProps: SettingsItemListProps<ingredientTableElement> = {
      testIdPrefix: 'IngredientList',
      type: 'ingredient',
      items: mockIngredients,
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
      onAddPress: mockOnAddPress,
    };

    test('renders', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      expect(getByTestId(`${defaultProps.testIdPrefix}::Title`).props.children).toEqual(
        'ingredients'
      );

      let index = 0;
      for (const ingredient of defaultProps.items) {
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::Type`).props
            .children
        ).toEqual('ingredient');
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::Item`).props
            .children
        ).toEqual(JSON.stringify(ingredient));
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::OnEdit`)
        ).toBeTruthy();
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::OnDelete`)
        ).toBeTruthy();
        ++index;
      }

      expect(getByTestId(`${defaultProps.testIdPrefix}::AddButton`)).toBeTruthy();
    });

    test('calls onAddPress when add button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::AddButton`));

      expect(mockOnAddPress).toHaveBeenCalled();
    });

    test('calls onEditPress when edit button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::0::OnEdit`));

      expect(mockOnEdit).toHaveBeenCalledWith(defaultProps.items[0]);
    });

    test('calls onDeletePress when delete button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::0::OnDelete`));

      expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.items[0]);
    });
  });

  describe('tag', () => {
    const defaultProps: SettingsItemListProps<tagTableElement> = {
      testIdPrefix: 'TagList',
      type: 'tag',
      items: mockTags,
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
      onAddPress: mockOnAddPress,
    };

    test('renders', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      expect(getByTestId(`${defaultProps.testIdPrefix}::Title`).props.children).toEqual(
        'filters.tags'
      );

      let index = 0;
      for (const tag of defaultProps.items) {
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::Type`).props
            .children
        ).toEqual('tag');
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::Item`).props
            .children
        ).toEqual(JSON.stringify(tag));
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::OnEdit`)
        ).toBeTruthy();
        expect(
          getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::${index}::OnDelete`)
        ).toBeTruthy();
        ++index;
      }

      expect(getByTestId(`${defaultProps.testIdPrefix}::AddButton`)).toBeTruthy();
    });

    test('calls onAddPress when add button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::AddButton`));

      expect(mockOnAddPress).toHaveBeenCalled();
    });

    test('calls onEditPress when edit button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::0::OnEdit`));

      expect(mockOnEdit).toHaveBeenCalledWith(defaultProps.items[0]);
    });

    test('calls onDeletePress when delete button is pressed', () => {
      const { getByTestId } = render(<SettingsItemList {...defaultProps} />);

      fireEvent.press(getByTestId(`${defaultProps.testIdPrefix}::SettingsItemCard::0::OnDelete`));

      expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.items[0]);
    });
  });
});
