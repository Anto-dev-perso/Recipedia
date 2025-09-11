import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { NutritionEmptyState } from '@components/molecules/NutritionEmptyState';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock(
  '@components/atomic/RoundButton',
  () => require('@mocks/components/atomic/RoundButton-mock').roundButtonMock
);

const defaultTestId = 'test';
const expectationTestId = defaultTestId + '::NutritionEmptyState::';
const mockOnAddNutrition = jest.fn();

describe('NutritionEmptyState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with title and add button', () => {
    const { getByTestId } = render(
      <NutritionEmptyState onAddNutrition={mockOnAddNutrition} parentTestId={defaultTestId} />
    );

    expect(getByTestId(expectationTestId + 'Title').props.children).toEqual(
      'recipe.nutrition.titleSimple'
    );
    expect(getByTestId(expectationTestId + 'AddButton::RoundButton::OnPressFunction')).toBeTruthy();
  });

  test('calls onAddNutrition when add button is pressed', () => {
    const localMockOnAddNutrition = jest.fn();

    const { getByTestId } = render(
      <NutritionEmptyState onAddNutrition={localMockOnAddNutrition} parentTestId={defaultTestId} />
    );

    fireEvent.press(getByTestId(expectationTestId + 'AddButton::RoundButton::OnPressFunction'));
    expect(localMockOnAddNutrition).toHaveBeenCalled();
  });

  test('renders with custom parentTestId', () => {
    const customTestId = 'CustomTest';
    const { getByTestId } = render(
      <NutritionEmptyState onAddNutrition={mockOnAddNutrition} parentTestId={customTestId} />
    );

    const customExpectation = customTestId + '::NutritionEmptyState::';
    expect(getByTestId(customExpectation + 'Title').props.children).toEqual(
      'recipe.nutrition.titleSimple'
    );
    expect(getByTestId(customExpectation + 'AddButton::RoundButton::OnPressFunction')).toBeTruthy();
  });
});
