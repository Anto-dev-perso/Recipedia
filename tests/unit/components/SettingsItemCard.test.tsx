import { fireEvent, render } from '@testing-library/react-native';
import SettingsItemCard, { SettingsItemCardProps } from '@components/molecules/SettingsItemCard';
import { ingredientTableElement, tagTableElement } from '@customTypes/DatabaseElementTypes';
import { testIngredients } from '@test-data/ingredientsDataset';
import React from 'react';
import { testTags } from '@test-data/tagsDataset';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

jest.mock('@components/molecules/SeasonalityCalendar', () => ({
  SeasonalityCalendar: require('@mocks/components/molecules/SeasonalityCalendar-mock')
    .seasonalityCalendarMock,
}));

describe('SettingsItemCard Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  const testIDProp = 'SettingsItemCard';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ingredient', () => {
    const defaultProps: SettingsItemCardProps<ingredientTableElement> = {
      type: 'ingredient',
      index: 0,
      testIdPrefix: testIDProp,
      item: testIngredients[9],
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
    };
    test('renders without crashing', () => {
      const { getByTestId, queryByTestId } = render(<SettingsItemCard {...defaultProps} />);

      expect(queryByTestId(`${testIDProp}::0::TagName`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::Unsupported`)).toBeNull();

      expect(getByTestId(`${testIDProp}::0::IngredientName`).props.children).toEqual(
        defaultProps.item.name
      );
      expect(getByTestId(`${testIDProp}::0::IntroType`).props.children).toEqual(['type', ':']);
      expect(getByTestId(`${testIDProp}::0::Type`).props.children).toEqual(defaultProps.item.type);
      expect(getByTestId(`${testIDProp}::0::IntroUnit`).props.children).toEqual(['unit', ':']);
      expect(getByTestId(`${testIDProp}::0::Unit`).props.children).toEqual(defaultProps.item.unit);

      expect(
        getByTestId(`${testIDProp}::0::SeasonalityCalendar::SelectedMonths`).props.children
      ).toEqual(JSON.stringify(defaultProps.item.season));
      expect(getByTestId(`${testIDProp}::0::SeasonalityCalendar::ReadOnly`).props.children).toEqual(
        true
      );
      expect(getByTestId(`${testIDProp}::0::SeasonalityCalendar::OnMonthsChange`)).toBeTruthy();

      expect(getByTestId(`${testIDProp}::0::EditButton`)).toBeTruthy();
      expect(getByTestId(`${testIDProp}::0::DeleteButton`)).toBeTruthy();
    });

    test('edit button', () => {
      const { getByTestId } = render(<SettingsItemCard {...defaultProps} />);

      fireEvent.press(getByTestId(`${testIDProp}::0::EditButton`));

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(defaultProps.item);
    });

    test('delete button', () => {
      const { getByTestId } = render(<SettingsItemCard {...defaultProps} />);

      fireEvent.press(getByTestId(`${testIDProp}::0::DeleteButton`));

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.item);
    });
  });

  describe('tag', () => {
    const defaultProps: SettingsItemCardProps<tagTableElement> = {
      type: 'tag',
      index: 0,
      testIdPrefix: testIDProp,
      item: testTags[13],
      onEdit: mockOnEdit,
      onDelete: mockOnDelete,
    };

    test('renders', () => {
      const { getByTestId, queryByTestId } = render(<SettingsItemCard {...defaultProps} />);

      expect(getByTestId(`${testIDProp}::0::TagName`).props.children).toEqual(
        defaultProps.item.name
      );
      expect(queryByTestId(`${testIDProp}::0::Unsupported`)).toBeNull();

      expect(queryByTestId(`${testIDProp}::0::IngredientName`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::IntroType`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::Type`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::IntroUnit`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::Unit`)).toBeNull();

      expect(queryByTestId(`${testIDProp}::0::SeasonalityCalendar::SelectedMonths`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::SeasonalityCalendar::ReadOnly`)).toBeNull();
      expect(queryByTestId(`${testIDProp}::0::SeasonalityCalendar::OnMonthsChange`)).toBeNull();

      expect(queryByTestId(`${testIDProp}::0::EditButton`)).toBeTruthy();
      expect(queryByTestId(`${testIDProp}::0::DeleteButton`)).toBeTruthy();
    });

    test('edit button', () => {
      const { getByTestId } = render(<SettingsItemCard {...defaultProps} />);

      fireEvent.press(getByTestId(`${testIDProp}::0::EditButton`));

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(defaultProps.item);
    });

    test('delete button', () => {
      const { getByTestId } = render(<SettingsItemCard {...defaultProps} />);

      fireEvent.press(getByTestId(`${testIDProp}::0::DeleteButton`));

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(defaultProps.item);
    });
  });
});
