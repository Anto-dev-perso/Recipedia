import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NutritionEditForm } from '@components/molecules/NutritionEditForm';
import { defaultValueNumber } from '@utils/Constants';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('@components/atomic/WrappableButton', () =>
  require('@mocks/components/atomic/WrappableButton-mock')
);

const defaultTestId = 'test';
const defaultPortionWeight = 150;
const mockOnPortionWeightChange = jest.fn();
const mockOnRemoveNutrition = jest.fn();

describe('NutritionEditForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with portion weight input', () => {
    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={defaultPortionWeight}
        onPortionWeightChange={mockOnPortionWeightChange}
        testId={defaultTestId}
      />
    );

    expect(getByTestId(defaultTestId)).toBeTruthy();
    expect(getByTestId(defaultTestId + '::PortionWeightText').props.children).toEqual(
      'recipe.nutrition.portionWeight'
    );
    expect(getByTestId(defaultTestId + '::PortionWeightNumericTextInput').props.value).toEqual(
      defaultPortionWeight.toString()
    );
  });

  test('calls onPortionWeightChange when weight input changes', () => {
    const localMockOnChange = jest.fn();

    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={100}
        onPortionWeightChange={localMockOnChange}
        testId={defaultTestId}
      />
    );

    const newWeight = 200;
    const input = getByTestId(defaultTestId + '::PortionWeightNumericTextInput');
    fireEvent.changeText(input, newWeight.toString());
    fireEvent(input, 'onBlur');
    expect(localMockOnChange).toHaveBeenCalledWith(newWeight);
  });

  test('handles invalid input gracefully', () => {
    const localMockOnChange = jest.fn();

    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={100}
        onPortionWeightChange={localMockOnChange}
        testId={defaultTestId}
      />
    );

    const input = getByTestId(defaultTestId + '::PortionWeightNumericTextInput');
    fireEvent.changeText(input, 'invalid');
    fireEvent(input, 'onBlur');

    expect(localMockOnChange).toHaveBeenCalledWith(defaultValueNumber);
  });

  test('shows remove button when showRemoveButton is true', () => {
    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={defaultPortionWeight}
        onPortionWeightChange={mockOnPortionWeightChange}
        onRemoveNutrition={mockOnRemoveNutrition}
        showRemoveButton={true}
        testId={defaultTestId}
      />
    );

    expect(getByTestId(defaultTestId)).toBeTruthy();
    expect(getByTestId(defaultTestId + '::PortionWeightText').props.children).toEqual(
      'recipe.nutrition.portionWeight'
    );
    expect(getByTestId(defaultTestId + '::PortionWeightNumericTextInput').props.value).toEqual(
      defaultPortionWeight.toString()
    );
    expect(getByTestId(defaultTestId + '::RemoveButton')).toBeTruthy();
  });

  test('does not show remove button when showRemoveButton is false', () => {
    const { queryByTestId } = render(
      <NutritionEditForm
        portionWeight={defaultPortionWeight}
        onPortionWeightChange={mockOnPortionWeightChange}
        showRemoveButton={false}
        testId={defaultTestId}
      />
    );

    expect(queryByTestId(defaultTestId + '::RemoveButton')).toBeNull();
  });

  test('calls onRemoveNutrition when remove button pressed', () => {
    const localMockOnRemove = jest.fn();

    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={defaultPortionWeight}
        onPortionWeightChange={mockOnPortionWeightChange}
        onRemoveNutrition={localMockOnRemove}
        showRemoveButton={true}
        testId={defaultTestId}
      />
    );

    fireEvent.press(getByTestId(defaultTestId + '::RemoveButton'));
    expect(localMockOnRemove).toHaveBeenCalled();
  });

  test('renders with custom testId', () => {
    const customTestId = 'CustomTest';
    const { getByTestId } = render(
      <NutritionEditForm
        portionWeight={defaultPortionWeight}
        onPortionWeightChange={mockOnPortionWeightChange}
        testId={customTestId}
      />
    );

    expect(getByTestId(customTestId)).toBeTruthy();
    expect(getByTestId(customTestId + '::PortionWeightText').props.children).toEqual(
      'recipe.nutrition.portionWeight'
    );
    expect(getByTestId(customTestId + '::PortionWeightNumericTextInput').props.value).toEqual(
      defaultPortionWeight.toString()
    );
  });
});
