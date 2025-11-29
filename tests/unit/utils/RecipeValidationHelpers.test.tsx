import {
  processIngredientsForValidation,
  processTagsForValidation,
} from '@utils/RecipeValidationHelpers';
import {
  ingredientTableElement,
  ingredientType,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';

describe('RecipeValidationHelpers', () => {
  describe('processTagsForValidation', () => {
    const mockFindSimilarTags = jest.fn();

    const dbTags: tagTableElement[] = [
      { id: 1, name: 'Vegetarian' },
      { id: 2, name: 'Italian' },
      { id: 3, name: 'Quick Meal' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('returns exact match in exactMatches and empty needsValidation for exact match tag', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'Vegetarian' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags);

      expect(result.exactMatches).toEqual([dbTags[0]]);
      expect(result.needsValidation).toEqual([]);
      expect(mockFindSimilarTags).toHaveBeenCalledWith('Vegetarian');
    });

    test('returns tag in needsValidation and empty exactMatches for non-exact match', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'Vegan' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual(inputTags);
      expect(mockFindSimilarTags).toHaveBeenCalledWith('Vegan');
    });

    test('handles exact match case-insensitively', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'VEGETARIAN' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags);

      expect(result.exactMatches).toEqual([dbTags[0]]);
      expect(result.needsValidation).toEqual([]);
    });

    test('correctly filters mixed tags (exact and non-exact)', () => {
      mockFindSimilarTags
        .mockReturnValueOnce([dbTags[0]])
        .mockReturnValueOnce([dbTags[1]])
        .mockReturnValueOnce([]);

      const inputTags: tagTableElement[] = [
        { name: 'Vegetarian' },
        { name: 'Vegan' },
        { name: 'Gluten-Free' },
      ];

      const result = processTagsForValidation(inputTags, mockFindSimilarTags);

      expect(result.exactMatches).toEqual([dbTags[0]]);
      expect(result.needsValidation).toEqual([{ name: 'Vegan' }, { name: 'Gluten-Free' }]);
    });

    test('returns empty arrays for empty input', () => {
      const result = processTagsForValidation([], mockFindSimilarTags);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual([]);
      expect(mockFindSimilarTags).not.toHaveBeenCalled();
    });

    test('handles no similar tags found', () => {
      mockFindSimilarTags.mockReturnValue([]);

      const inputTags: tagTableElement[] = [{ name: 'NewTag' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual(inputTags);
    });
  });

  describe('processIngredientsForValidation', () => {
    const mockFindSimilarIngredients = jest.fn();

    const dbIngredients: ingredientTableElement[] = [
      {
        id: 1,
        name: 'Tomato Sauce',
        type: ingredientType.sauce,
        unit: 'ml',
        quantity: '200',
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      },
      {
        id: 2,
        name: 'Parmesan',
        type: ingredientType.cheese,
        unit: 'g',
        quantity: '50',
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('returns exact match in exactMatches with merged quantity/unit', () => {
      mockFindSimilarIngredients.mockReturnValue([dbIngredients[0]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Tomato Sauce',
          quantity: '300',
          unit: 'ml',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          ...dbIngredients[0],
          quantity: '300',
          unit: 'ml',
        },
      ]);
      expect(result.needsValidation).toEqual([]);
    });

    test('preserves OCR quantity and unit for exact match', () => {
      mockFindSimilarIngredients.mockReturnValue([dbIngredients[1]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Parmesan',
          quantity: '100',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          id: 2,
          name: 'Parmesan',
          type: ingredientType.cheese,
          unit: 'g',
          quantity: '100',
          season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        },
      ]);
      expect(result.needsValidation).toEqual([]);
    });

    test('uses database defaults when OCR quantity/unit are missing', () => {
      mockFindSimilarIngredients.mockReturnValue([dbIngredients[1]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Parmesan',
          quantity: '',
          unit: '',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          ...dbIngredients[1],
          quantity: '50',
          unit: 'g',
        },
      ]);
      expect(result.needsValidation).toEqual([]);
    });

    test('returns ingredient in needsValidation for non-exact match', () => {
      mockFindSimilarIngredients.mockReturnValue([dbIngredients[0]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Tomato',
          quantity: '100',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual(inputIngredients);
    });

    test('handles exact match case-insensitively', () => {
      mockFindSimilarIngredients.mockReturnValue([dbIngredients[0]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'TOMATO SAUCE',
          quantity: '250',
          unit: 'ml',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          ...dbIngredients[0],
          quantity: '250',
          unit: 'ml',
        },
      ]);
      expect(result.needsValidation).toEqual([]);
    });

    test('correctly filters mixed ingredients (exact and non-exact)', () => {
      mockFindSimilarIngredients
        .mockReturnValueOnce([dbIngredients[0]])
        .mockReturnValueOnce([dbIngredients[1]])
        .mockReturnValueOnce([]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Tomato Sauce',
          quantity: '150',
          unit: 'ml',
          type: ingredientType.undefined,
          season: [],
        },
        {
          name: 'Tomato',
          quantity: '100',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
        {
          name: 'DragonFruit',
          quantity: '200',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          ...dbIngredients[0],
          quantity: '150',
          unit: 'ml',
        },
      ]);
      expect(result.needsValidation).toEqual([inputIngredients[1], inputIngredients[2]]);
    });

    test('returns empty arrays for empty input', () => {
      const result = processIngredientsForValidation([], mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual([]);
      expect(mockFindSimilarIngredients).not.toHaveBeenCalled();
    });

    test('handles no similar ingredients found', () => {
      mockFindSimilarIngredients.mockReturnValue([]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'NewIngredient',
          quantity: '100',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([]);
      expect(result.needsValidation).toEqual(inputIngredients);
    });

    test('handles multiple exact matches in sequence', () => {
      mockFindSimilarIngredients
        .mockReturnValueOnce([dbIngredients[0]])
        .mockReturnValueOnce([dbIngredients[1]]);

      const inputIngredients: ingredientTableElement[] = [
        {
          name: 'Tomato Sauce',
          quantity: '150',
          unit: 'ml',
          type: ingredientType.undefined,
          season: [],
        },
        {
          name: 'Parmesan',
          quantity: '75',
          unit: 'g',
          type: ingredientType.undefined,
          season: [],
        },
      ];

      const result = processIngredientsForValidation(inputIngredients, mockFindSimilarIngredients);

      expect(result.exactMatches).toEqual([
        {
          ...dbIngredients[0],
          quantity: '150',
          unit: 'ml',
        },
        {
          ...dbIngredients[1],
          quantity: '75',
          unit: 'g',
        },
      ]);
      expect(result.needsValidation).toEqual([]);
    });
  });
});
