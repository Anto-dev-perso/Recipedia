import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { RecipeNutrition } from '@components/organisms/RecipeNutrition';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('@components/molecules/NutritionTable', () =>
  require('@mocks/components/molecules/NutritionTable-mock')
);
jest.mock('@components/molecules/NutritionEmptyState', () =>
  require('@mocks/components/molecules/NutritionEmptyState-mock')
);

const mockNutrition: nutritionTableElement = {
  id: 1,
  energyKcal: 250,
  energyKj: 1046,
  fat: 15.0,
  saturatedFat: 8.0,
  carbohydrates: 25.0,
  sugars: 12.0,
  fiber: 2.5,
  protein: 6.0,
  salt: 0.8,
  portionWeight: 100,
};

const defaultTestId = 'test';
const nutritionTableTestId = defaultTestId + '::RecipeNutrition::NutritionTable';
const nutritionEmptyStateTestId = defaultTestId + '::RecipeNutrition::NutritionEmptyState';

const mockOnChange = jest.fn();

describe('RecipeNutrition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Read-only mode', () => {
    test('renders nutrition table with basic structure', () => {
      const { getByTestId } = render(
        <RecipeNutrition nutrition={mockNutrition} mode='readOnly' parentTestId={defaultTestId} />
      );

      expect(getByTestId(nutritionTableTestId)).toBeTruthy();
      expect(getByTestId(nutritionTableTestId + '::IsEditable').props.children).toEqual(false);
      expect(getByTestId(nutritionTableTestId + '::ShowRemoveButton').props.children).toEqual(
        false
      );
      expect(JSON.parse(getByTestId(nutritionTableTestId + '::Nutrition').props.children)).toEqual(
        mockNutrition
      );
    });

    test('does not render when no nutrition data provided', () => {
      const { queryByTestId } = render(
        <RecipeNutrition nutrition={undefined} mode='readOnly' parentTestId={defaultTestId} />
      );

      expect(queryByTestId(nutritionTableTestId)).toBeNull();
      expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
    });

    test('renders with different portion weight', () => {
      const nutritionWithPortion: nutritionTableElement = {
        ...mockNutrition,
        portionWeight: 150,
      };

      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={nutritionWithPortion}
          mode='readOnly'
          parentTestId={defaultTestId}
        />
      );

      expect(getByTestId(nutritionTableTestId)).toBeTruthy();
      expect(getByTestId(nutritionTableTestId + '::IsEditable').props.children).toBe(false);
      expect(
        JSON.parse(getByTestId(nutritionTableTestId + '::Nutrition').props.children).portionWeight
      ).toBe(150);
    });

    test('renders with decimal nutrition values', () => {
      const nutritionWithDecimals: nutritionTableElement = {
        ...mockNutrition,
        energyKcal: 123.456,
        fat: 1.23,
        salt: 0.123,
      };

      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={nutritionWithDecimals}
          mode='readOnly'
          parentTestId={defaultTestId}
        />
      );

      const parsedData = JSON.parse(
        getByTestId(nutritionTableTestId + '::Nutrition').props.children
      );
      expect(parsedData.energyKcal).toBe(nutritionWithDecimals.energyKcal);
      expect(parsedData.fat).toBe(nutritionWithDecimals.fat);
      expect(parsedData.salt).toBe(nutritionWithDecimals.salt);
    });
  });

  describe('Add mode', () => {
    test('shows empty state when no nutrition data', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={undefined}
          mode='add'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      expect(getByTestId(nutritionEmptyStateTestId)).toBeTruthy();
      expect(getByTestId(nutritionEmptyStateTestId + '::ParentTestId').props.children).toBe(
        defaultTestId + '::RecipeNutrition'
      );
      expect(getByTestId(nutritionEmptyStateTestId + '::OnAddNutrition')).toBeTruthy();
    });

    test('calls onNutritionChange when adding nutrition', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={undefined}
          mode='add'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      fireEvent.press(getByTestId(nutritionEmptyStateTestId + '::OnAddNutrition'));

      expect(mockOnChange).toHaveBeenCalledWith({
        energyKcal: 0,
        energyKj: 0,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 0,
        salt: 0,
        portionWeight: 100,
      });
    });
  });

  describe('Edit mode', () => {
    test('renders editable table with remove button', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={mockNutrition}
          mode='edit'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      expect(getByTestId(nutritionTableTestId)).toBeTruthy();
      expect(getByTestId(nutritionTableTestId + '::IsEditable').props.children).toEqual(true);
      expect(getByTestId(nutritionTableTestId + '::ShowRemoveButton').props.children).toEqual(true);
      expect(getByTestId(nutritionTableTestId + '::OnRemoveNutrition')).toBeTruthy();
      expect(JSON.parse(getByTestId(nutritionTableTestId + '::Nutrition').props.children)).toEqual(
        mockNutrition
      );
    });

    test('calls onNutritionChange when nutrition values change', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={mockNutrition}
          mode='edit'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      fireEvent.press(getByTestId(nutritionTableTestId + '::OnNutritionChange'));

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockNutrition,
        energyKcal: 300,
      });
    });

    test('calls onNutritionChange when removing nutrition', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={mockNutrition}
          mode='edit'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      fireEvent.press(getByTestId(nutritionTableTestId + '::OnRemoveNutrition'));

      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });

    test('handles nutrition changes with partial updates', () => {
      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={mockNutrition}
          mode='edit'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      fireEvent.press(getByTestId(nutritionTableTestId + '::OnNutritionChange'));

      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockNutrition,
        energyKcal: 300,
      });
    });
  });

  describe('Component props and behavior', () => {
    test('renders with custom testID structure', () => {
      const customTestId = 'CustomNutritionTest';
      const { getByTestId } = render(
        <RecipeNutrition nutrition={mockNutrition} mode='readOnly' parentTestId={customTestId} />
      );

      const expectedTestId = customTestId + '::RecipeNutrition::NutritionTable';

      expect(getByTestId(expectedTestId)).toBeTruthy();
      expect(JSON.parse(getByTestId(expectedTestId + '::Nutrition').props.children)).toEqual(
        mockNutrition
      );
    });

    test('handles mode transitions correctly', () => {
      const mockOnChange = jest.fn();

      // Test add mode with no data shows empty state
      const { rerender, queryByTestId } = render(
        <RecipeNutrition
          nutrition={undefined}
          mode='add'
          onNutritionChange={mockOnChange}
          parentTestId={defaultTestId}
        />
      );

      expect(queryByTestId(nutritionEmptyStateTestId)).toBeTruthy();
      expect(queryByTestId(nutritionTableTestId)).toBeNull();

      // Test readOnly mode with data shows table
      rerender(
        <RecipeNutrition nutrition={mockNutrition} mode='readOnly' parentTestId={defaultTestId} />
      );

      expect(queryByTestId(nutritionEmptyStateTestId)).toBeNull();
      expect(queryByTestId(nutritionTableTestId)).toBeTruthy();
    });

    test('handles nutrition data with various portion weights', () => {
      const nutritionWith150gPortion: nutritionTableElement = {
        ...mockNutrition,
        portionWeight: 150,
      };

      const { getByTestId } = render(
        <RecipeNutrition
          nutrition={nutritionWith150gPortion}
          mode='readOnly'
          parentTestId={defaultTestId}
        />
      );

      const parsedData = JSON.parse(
        getByTestId(nutritionTableTestId + '::Nutrition').props.children
      );

      expect(parsedData.portionWeight).toBe(150);
      expect(parsedData.energyKcal).toBe(mockNutrition.energyKcal);
    });
  });
});
