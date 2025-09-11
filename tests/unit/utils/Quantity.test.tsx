import { calculateNutritionPerPortion, scaleQuantityForPersons } from '@utils/Quantity';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';

describe('scaleQuantityForPersons', () => {
  test('returns original when persons are equal', () => {
    expect(scaleQuantityForPersons('200', 4, 4)).toBe('200');
  });

  test('scales integers up and down', () => {
    expect(scaleQuantityForPersons('200', 2, 4)).toBe('400');
    expect(scaleQuantityForPersons('200', 4, 2)).toBe('100');
  });

  test('scales decimals with dot and outputs comma', () => {
    expect(scaleQuantityForPersons('0.5', 2, 3)).toBe('0,75');
  });

  test('scales decimals with comma and outputs comma', () => {
    expect(scaleQuantityForPersons('1,5', 6, 4)).toBe('1');
  });

  test('preserves non-numeric strings', () => {
    expect(scaleQuantityForPersons('some salt', 2, 4)).toBe('some salt');
  });

  test('does not scale ranges (multiple numbers)', () => {
    expect(scaleQuantityForPersons('1à3', 2, 4)).toBe('1à3');
    expect(scaleQuantityForPersons('1 - 3', 2, 4)).toBe('1 - 3');
  });

  test('preserves surrounding text and unit', () => {
    expect(scaleQuantityForPersons('200 g', 2, 3)).toBe('300 g');
    expect(scaleQuantityForPersons('1,5 cup', 3, 2)).toBe('1 cup');
  });
});

describe('calculateNutritionPerPortion', () => {
  const mockNutrition: nutritionTableElement = {
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

  test('calculates nutrition per portion for 100g portion', () => {
    const result = calculateNutritionPerPortion(mockNutrition);

    expect(result.energyKcal).toBe(250);
    expect(result.energyKj).toBe(1046);
    expect(result.fat).toBe(15.0);
    expect(result.saturatedFat).toBe(8.0);
    expect(result.carbohydrates).toBe(25.0);
    expect(result.sugars).toBe(12.0);
    expect(result.fiber).toBe(2.5);
    expect(result.protein).toBe(6.0);
    expect(result.salt).toBe(0.8);
  });

  test('calculates nutrition per portion for 150g portion', () => {
    const nutritionWith150g = { ...mockNutrition, portionWeight: 150 };
    const result = calculateNutritionPerPortion(nutritionWith150g);

    expect(result.energyKcal).toBe(375);
    expect(result.energyKj).toBe(1569);
    expect(result.fat).toBe(22.5);
    expect(result.saturatedFat).toBe(12.0);
    expect(result.carbohydrates).toBe(37.5);
    expect(result.sugars).toBe(18.0);
    expect(result.fiber).toBe(3.8);
    expect(result.protein).toBe(9.0);
    expect(result.salt).toBe(1.2);
  });

  test('calculates nutrition per portion for 50g portion', () => {
    const nutritionWith50g = { ...mockNutrition, portionWeight: 50 };
    const result = calculateNutritionPerPortion(nutritionWith50g);

    expect(result.energyKcal).toBe(125);
    expect(result.energyKj).toBe(523);
    expect(result.fat).toBe(7.5);
    expect(result.saturatedFat).toBe(4.0);
    expect(result.carbohydrates).toBe(12.5);
    expect(result.sugars).toBe(6.0);
    expect(result.fiber).toBe(1.3);
    expect(result.protein).toBe(3.0);
    expect(result.salt).toBe(0.4);
  });

  test('handles decimal portion weights correctly', () => {
    const nutritionWith75g = { ...mockNutrition, portionWeight: 75 };
    const result = calculateNutritionPerPortion(nutritionWith75g);

    expect(result.energyKcal).toBe(187.5);
    expect(result.energyKj).toBe(785);
    expect(result.fat).toBe(11.3);
    expect(result.saturatedFat).toBe(6.0);
    expect(result.carbohydrates).toBe(18.8);
    expect(result.sugars).toBe(9.0);
    expect(result.fiber).toBe(1.9);
    expect(result.protein).toBe(4.5);
    expect(result.salt).toBe(0.6);
  });

  test('handles zero values correctly', () => {
    const zeroNutrition = {
      energyKcal: 0,
      energyKj: 0,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
      portionWeight: 150,
    };
    const result = calculateNutritionPerPortion(zeroNutrition);

    expect(result.energyKcal).toBe(0);
    expect(result.energyKj).toBe(0);
    expect(result.fat).toBe(0);
    expect(result.saturatedFat).toBe(0);
    expect(result.carbohydrates).toBe(0);
    expect(result.sugars).toBe(0);
    expect(result.fiber).toBe(0);
    expect(result.protein).toBe(0);
    expect(result.salt).toBe(0);
  });

  test('rounds values according to function specifications', () => {
    const nutritionWithDecimals = {
      energyKcal: 123.456,
      energyKj: 456.789,
      fat: 7.123,
      saturatedFat: 3.456,
      carbohydrates: 12.789,
      sugars: 5.123,
      fiber: 1.456,
      protein: 4.789,
      salt: 0.123,
      portionWeight: 133,
    };
    const result = calculateNutritionPerPortion(nutritionWithDecimals);

    expect(result.energyKcal).toBe(164.2);
    expect(result.energyKj).toBe(608);
    expect(result.fat).toBe(9.5);
    expect(result.saturatedFat).toBe(4.6);
    expect(result.carbohydrates).toBe(17.0);
    expect(result.sugars).toBe(6.8);
    expect(result.fiber).toBe(1.9);
    expect(result.protein).toBe(6.4);
    expect(result.salt).toBe(0.16);
  });
});
