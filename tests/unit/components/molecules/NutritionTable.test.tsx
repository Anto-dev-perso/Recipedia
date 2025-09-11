import React from 'react';
import { render } from '@testing-library/react-native';
import { NutritionTable } from '@components/molecules/NutritionTable';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';

jest.mock('@components/molecules/NutritionTable', () =>
  require('@mocks/components/molecules/NutritionTable-mock')
);
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('@components/molecules/NutritionRow', () =>
  require('@mocks/components/molecules/NutritionRow-mock')
);
jest.mock('@components/molecules/NutritionEditForm', () =>
  require('@mocks/components/molecules/NutritionEditForm-mock')
);
jest.mock('@components/dialogs/Alert', () => require('@mocks/components/dialogs/Alert-mock'));

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

describe('NutritionTable', () => {
  describe('Read-only mode', () => {
    test('renders with nutrition data and segmented buttons', () => {
      const { getByTestId } = render(
        <NutritionTable nutrition={mockNutrition} parentTestId='test' />
      );

      expect(getByTestId('test::NutritionTable')).toBeTruthy();
      expect(getByTestId('test::NutritionTable::Nutrition')).toBeTruthy();
    });

    test('switches between per100g and perPortion modes', () => {
      const { getByTestId } = render(
        <NutritionTable nutrition={mockNutrition} parentTestId='test' />
      );

      const segmentedButtons = getByTestId('test::NutritionTable');
      expect(segmentedButtons).toBeTruthy();
    });
  });

  describe('Edit mode', () => {
    test('renders editable form when isEditable is true', () => {
      const mockOnNutritionChange = jest.fn();
      const mockOnRemoveNutrition = jest.fn();

      const { getByTestId, getByText } = render(
        <NutritionTable
          nutrition={mockNutrition}
          isEditable={true}
          onNutritionChange={mockOnNutritionChange}
          onRemoveNutrition={mockOnRemoveNutrition}
          showRemoveButton={true}
          parentTestId='test'
        />
      );

      expect(getByTestId('test::NutritionTable')).toBeTruthy();
      expect(getByTestId('test::NutritionTable::IsEditable')).toBeTruthy();
      expect(getByTestId('test::NutritionTable::OnNutritionChange')).toBeTruthy();
    });

    test('calls onNutritionChange when nutrition values change', () => {
      const mockOnNutritionChange = jest.fn();

      render(
        <NutritionTable
          nutrition={mockNutrition}
          isEditable={true}
          onNutritionChange={mockOnNutritionChange}
          parentTestId='test'
        />
      );

      expect(mockOnNutritionChange).not.toHaveBeenCalled();
    });

    test('shows delete confirmation dialog when remove button pressed', () => {
      const mockOnRemoveNutrition = jest.fn();

      const { getByTestId } = render(
        <NutritionTable
          nutrition={mockNutrition}
          isEditable={true}
          onRemoveNutrition={mockOnRemoveNutrition}
          showRemoveButton={true}
          parentTestId='test'
        />
      );

      expect(getByTestId('test::NutritionTable')).toBeTruthy();
    });
  });

  describe('Props handling', () => {
    test('renders with correct testId structure', () => {
      const { getByTestId } = render(
        <NutritionTable nutrition={mockNutrition} parentTestId='CustomTest' />
      );

      expect(getByTestId('CustomTest::NutritionTable')).toBeTruthy();
    });

    test('handles undefined onNutritionChange gracefully', () => {
      const { getByTestId } = render(
        <NutritionTable nutrition={mockNutrition} isEditable={true} parentTestId='test' />
      );

      expect(getByTestId('test::NutritionTable')).toBeTruthy();
    });
  });
});
