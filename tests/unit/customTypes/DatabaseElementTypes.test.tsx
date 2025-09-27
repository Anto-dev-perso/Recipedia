import {
  arrayOfType,
  extractIngredientsNameWithQuantity,
  extractTagsName,
  ingredientTableElement,
  ingredientType,
  isIngredientEqual,
  isRecipeEqual,
  isRecipePartiallyEqual,
  isShoppingEqual,
  isTagEqual,
  recipeTableElement,
  shoppingListTableElement,
  tagTableElement,
} from '@customTypes//DatabaseElementTypes';
import { testRecipes } from '@test-data/recipesDataset';
import { testIngredients } from '@test-data/ingredientsDataset';
import { testTags } from '@test-data/tagsDataset';
import { testShopping } from '@test-data/shoppingListsDataset';
import { nonIngredientFilters } from '@customTypes/RecipeFiltersTypes';

describe('DatabaseElementTypes Helper Functions', () => {
  test('arrayOfType filters ingredients by type', () => {
    const ingredients: Array<ingredientTableElement> = [
      { name: 'Sugar', unit: 'g', quantity: '100', type: ingredientType.sugar, season: ['*'] },
      {
        name: 'Flour',
        unit: 'g',
        quantity: '200',
        type: ingredientType.grainOrCereal,
        season: ['*'],
      },
      {
        name: 'Spaghetti',
        unit: 'g',
        quantity: '200',
        type: ingredientType.grainOrCereal,
        season: ['*'],
      },
    ];
    let filter = ingredientType.sugar;
    let result = arrayOfType(ingredients, filter);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(ingredients[0]);

    filter = ingredientType.grainOrCereal;
    result = arrayOfType(ingredients, filter);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
    expect(result).toEqual(Array<ingredientTableElement>(ingredients[1], ingredients[2]));

    filter = ingredientType.poultry;
    result = arrayOfType(ingredients, filter);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(0);
  });

  test('extractIngredientsNameWithQuantity formats ingredient names correctly', () => {
    const monoIngredient = new Array<ingredientTableElement>({
      name: 'Sugar',
      unit: 'g',
      quantity: '100',
      type: ingredientType.sugar,
      season: ['*'],
    });

    expect(extractIngredientsNameWithQuantity(monoIngredient)).toEqual(['100@@g--Sugar']);

    const multiIngredient = new Array<ingredientTableElement>(
      { name: 'Sugar', unit: 'g', quantity: '100', type: ingredientType.sugar, season: ['*'] },
      {
        name: 'Flour',
        unit: 'g',
        quantity: '200',
        type: ingredientType.grainOrCereal,
        season: ['*'],
      },
      {
        name: 'Spaghetti',
        unit: 'g',
        quantity: '200',
        type: ingredientType.grainOrCereal,
        season: ['*'],
      }
    );
    expect(extractIngredientsNameWithQuantity(multiIngredient)).toEqual([
      '100@@g--Sugar',
      '200@@g--Flour',
      '200@@g--Spaghetti',
    ]);
  });

  test('extractTagsName extracts tag names', () => {
    const tags = new Array<tagTableElement>({ name: 'Dessert' }, { name: 'Vegan' });
    expect(extractTagsName(tags)).toEqual(['Dessert', 'Vegan']);
  });

  test('isRecipePartiallyEqual correctly identifies closes enough recipes', () => {
    expect(isRecipePartiallyEqual(testRecipes[0], testRecipes[1])).toBe(false);
    expect(isRecipePartiallyEqual(testRecipes[0], testRecipes[0])).toBe(true);

    let expected: recipeTableElement = { ...testRecipes[0], id: 9999 };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], image_Source: 'Different Image' };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[1], image_Source: 'Different Image' };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], description: 'Different description' };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], tags: [] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], tags: [{ name: 'One' }, { name: 'Two' }] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], tags: [...testRecipes[0].tags, { name: 'Another one' }] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = {
      ...testRecipes[0],
      ingredients: [
        {
          name: 'New Ingredient',
          season: ['never mind'],
          type: ingredientType.undefined,
          quantity: '0',
          unit: 'unit',
        },
      ],
    };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], ingredients: [] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = {
      ...testRecipes[0],
      ingredients: [
        ...testRecipes[0].ingredients,
        {
          name: 'New Ingredient',
          season: ['never mind'],
          type: ingredientType.undefined,
          quantity: '0',
          unit: 'unit',
        },
      ],
    };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], persons: -1 };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], season: ['not season'] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = {
      ...testRecipes[0],
      preparation: [{ title: 'Different', description: 'A different preparation' }],
    };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], preparation: [] };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);

    expected = {
      ...testRecipes[0],
      preparation: [
        ...testRecipes[0].preparation,
        { title: 'New', description: 'A new element in preparation' },
      ],
    };
    expect(isRecipePartiallyEqual(testRecipes[0], expected)).toBe(true);
  });

  test('isRecipeEqual correctly identifies equal recipes', () => {
    expect(isRecipeEqual(testRecipes[0], testRecipes[1])).toBe(false);
    expect(isRecipeEqual(testRecipes[0], testRecipes[0])).toBe(true);

    let expected: recipeTableElement = { ...testRecipes[0], id: 9999 };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(true);

    expected = { ...testRecipes[0], image_Source: 'Different Image' };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[1], image_Source: 'Different Image' };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], description: 'Different description' };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], tags: [] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], tags: [{ name: 'One' }, { name: 'Two' }] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], tags: [...testRecipes[0].tags, { name: 'Another one' }] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = {
      ...testRecipes[0],
      ingredients: [
        {
          name: 'New Ingredient',
          season: ['never mind'],
          type: ingredientType.undefined,
          quantity: '0',
          unit: 'unit',
        },
      ],
    };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], ingredients: [] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = {
      ...testRecipes[0],
      ingredients: [
        ...testRecipes[0].ingredients,
        {
          name: 'New Ingredient',
          season: ['never mind'],
          type: ingredientType.undefined,
          quantity: '0',
          unit: 'unit',
        },
      ],
    };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], persons: -1 };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], season: ['not season'] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = {
      ...testRecipes[0],
      preparation: [{ title: 'Different', description: 'A different preparation' }],
    };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = { ...testRecipes[0], preparation: [] };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);

    expected = {
      ...testRecipes[0],
      preparation: [
        ...testRecipes[0].preparation,
        { title: 'New', description: 'A new element in preparation' },
      ],
    };
    expect(isRecipeEqual(testRecipes[0], expected)).toBe(false);
  });

  test('isIngredientEqual correctly identifies equal ingredients', () => {
    expect(isIngredientEqual(testIngredients[0], testIngredients[0])).toBe(true);
    expect(isIngredientEqual(testIngredients[0], testIngredients[1])).toBe(false);

    let expected: ingredientTableElement = { ...testIngredients[0], id: 9999 };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(true);

    expected = { ...testIngredients[0], name: 'New Ingredient' };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(false);

    expected = { ...testIngredients[0], quantity: '0' };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(true);
    expect(isIngredientEqual({ ...testIngredients[0], quantity: '50' }, expected)).toBe(true);

    expected = { ...testIngredients[0], season: ['other'] };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(true);

    expected = { ...testIngredients[0], type: ingredientType.poultry };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(false);

    expected = { ...testIngredients[0], unit: 'no unit' };
    expect(isIngredientEqual(testIngredients[0], expected)).toBe(false);
  });

  test('isTagEqual correctly identifies equal tags', () => {
    expect(isTagEqual(testTags[0], testTags[0])).toBe(true);
    expect(isTagEqual(testTags[0], testTags[1])).toBe(false);

    let expected: tagTableElement = { ...testTags[0], id: 9999 };
    expect(isTagEqual(testTags[0], expected)).toBe(true);
  });

  test('isShoppingEqual correctly identifies equal shopping items', () => {
    const firstShop: shoppingListTableElement = testShopping[0][0];
    const secondShop: shoppingListTableElement = testShopping[0][1];

    expect(isShoppingEqual(firstShop, firstShop)).toBe(true);
    expect(isShoppingEqual(firstShop, secondShop)).toBe(false);

    let expected: shoppingListTableElement = { ...firstShop, id: 9999 };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);

    expected = { ...firstShop, type: nonIngredientFilters.tags };
    expect(isShoppingEqual(firstShop, expected)).toBe(false);

    expected = { ...firstShop, name: 'A new name' };
    expect(isShoppingEqual(firstShop, expected)).toBe(false);

    expected = { ...firstShop, quantity: '-1' };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);

    expected = { ...firstShop, unit: '' };
    expect(isShoppingEqual(firstShop, expected)).toBe(false);

    expected = { ...firstShop, recipesTitle: [] };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);

    expected = {
      ...firstShop,
      recipesTitle: ['A new array of title', 'with unknown recipes'],
    };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);

    expected = {
      ...firstShop,
      recipesTitle: [...firstShop.recipesTitle, 'A new title'],
    };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);

    expected = { ...firstShop, purchased: true };
    expect(isShoppingEqual(firstShop, expected)).toBe(true);
  });
});
