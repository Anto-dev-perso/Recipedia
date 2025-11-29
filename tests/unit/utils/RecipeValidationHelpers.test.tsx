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
    const mockOnExactMatch = jest.fn();

    const dbTags: tagTableElement[] = [
      { id: 1, name: 'Vegetarian' },
      { id: 2, name: 'Italian' },
      { id: 3, name: 'Quick Meal' },
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('returns empty array and calls onExactMatch for exact match tag', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'Vegetarian' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual([]);
      expect(mockOnExactMatch).toHaveBeenCalledTimes(1);
      expect(mockOnExactMatch).toHaveBeenCalledWith(dbTags[0]);
      expect(mockFindSimilarTags).toHaveBeenCalledWith('Vegetarian');
    });

    test('returns tag in array and does not call onExactMatch for non-exact match', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'Vegan' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual(inputTags);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
      expect(mockFindSimilarTags).toHaveBeenCalledWith('Vegan');
    });

    test('handles exact match case-insensitively', () => {
      mockFindSimilarTags.mockReturnValue([dbTags[0]]);

      const inputTags: tagTableElement[] = [{ name: 'VEGETARIAN' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual([]);
      expect(mockOnExactMatch).toHaveBeenCalledWith(dbTags[0]);
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

      const result = processTagsForValidation(inputTags, mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual([{ name: 'Vegan' }, { name: 'Gluten-Free' }]);
      expect(mockOnExactMatch).toHaveBeenCalledTimes(1);
      expect(mockOnExactMatch).toHaveBeenCalledWith(dbTags[0]);
    });

    test('returns empty array for empty input', () => {
      const result = processTagsForValidation([], mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual([]);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
      expect(mockFindSimilarTags).not.toHaveBeenCalled();
    });

    test('handles no similar tags found', () => {
      mockFindSimilarTags.mockReturnValue([]);

      const inputTags: tagTableElement[] = [{ name: 'NewTag' }];
      const result = processTagsForValidation(inputTags, mockFindSimilarTags, mockOnExactMatch);

      expect(result).toEqual(inputTags);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
    });
  });

  describe('processIngredientsForValidation', () => {
    const mockFindSimilarIngredients = jest.fn();
    const mockOnExactMatch = jest.fn();

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

    test('returns empty array and calls onExactMatch for exact match ingredient', () => {
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual([]);
      expect(mockOnExactMatch).toHaveBeenCalledTimes(1);
      expect(mockOnExactMatch).toHaveBeenCalledWith({
        ...dbIngredients[0],
        quantity: '300',
        unit: 'ml',
      });
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

      processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(mockOnExactMatch).toHaveBeenCalledWith({
        id: 2,
        name: 'Parmesan',
        type: ingredientType.cheese,
        unit: 'g',
        quantity: '100',
        season: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      });
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

      processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(mockOnExactMatch).toHaveBeenCalledWith({
        ...dbIngredients[1],
        quantity: '50',
        unit: 'g',
      });
    });

    test('returns ingredient in array and does not call onExactMatch for non-exact match', () => {
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual(inputIngredients);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual([]);
      expect(mockOnExactMatch).toHaveBeenCalledWith({
        ...dbIngredients[0],
        quantity: '250',
        unit: 'ml',
      });
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual([inputIngredients[1], inputIngredients[2]]);
      expect(mockOnExactMatch).toHaveBeenCalledTimes(1);
      expect(mockOnExactMatch).toHaveBeenCalledWith({
        ...dbIngredients[0],
        quantity: '150',
        unit: 'ml',
      });
    });

    test('returns empty array for empty input', () => {
      const result = processIngredientsForValidation(
        [],
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual([]);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual(inputIngredients);
      expect(mockOnExactMatch).not.toHaveBeenCalled();
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

      const result = processIngredientsForValidation(
        inputIngredients,
        mockFindSimilarIngredients,
        mockOnExactMatch
      );

      expect(result).toEqual([]);
      expect(mockOnExactMatch).toHaveBeenCalledTimes(2);
      expect(mockOnExactMatch).toHaveBeenNthCalledWith(1, {
        ...dbIngredients[0],
        quantity: '150',
        unit: 'ml',
      });
      expect(mockOnExactMatch).toHaveBeenNthCalledWith(2, {
        ...dbIngredients[1],
        quantity: '75',
        unit: 'g',
      });
    });
  });
});
