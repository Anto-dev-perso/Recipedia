import {
    arrayOfType,
    extractIngredientsNameWithQuantity,
    extractTagsName,
    ingredientTableElement,
    ingredientType,
    isIngredientEqual,
    isRecipeEqual,
    isShoppingEqual,
    isTagEqual,
    recipeTableElement,
    shoppingListTableElement,
    tagTableElement,
} from '@customTypes//DatabaseElementTypes';
import {recipesDataset} from "@test-data/recipesDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {shoppingDataset} from "@test-data/shoppingListsDataset";
import {nonIngredientFilters} from "@customTypes/RecipeFiltersTypes";

describe('DatabaseElementTypes Helper Functions', () => {

    test('arrayOfType filters ingredients by type', () => {
        const ingredients: Array<ingredientTableElement> = [
            {ingName: 'Sugar', unit: 'g', quantity: "100", type: ingredientType.sugar, season: ['*']},
            {ingName: 'Flour', unit: 'g', quantity: "200", type: ingredientType.grainOrCereal, season: ['*']},
            {ingName: 'Spaghetti', unit: 'g', quantity: "200", type: ingredientType.grainOrCereal, season: ['*']},
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
        const monoIngredient = [
            {ingName: 'Sugar', unit: 'g', quantity: "100", type: ingredientType.sugar, season: ['*']},
        ];
        expect(extractIngredientsNameWithQuantity(monoIngredient)).toEqual(['100@@g--Sugar']);

        const multiIngredient = [
            {ingName: 'Sugar', unit: 'g', quantity: "100", type: ingredientType.sugar, season: ['*']},
            {ingName: 'Flour', unit: 'g', quantity: "200", type: ingredientType.grainOrCereal, season: ['*']},
            {ingName: 'Spaghetti', unit: 'g', quantity: "200", type: ingredientType.grainOrCereal, season: ['*']},
        ];
        expect(extractIngredientsNameWithQuantity(multiIngredient)).toEqual(["100@@g--Sugar", "200@@g--Flour", "200@@g--Spaghetti"]);
    });

    test('extractTagsName extracts tag names', () => {
        const tags = [{tagName: 'Dessert'}, {tagName: 'Vegan'}];
        const result = extractTagsName(tags);
        expect(result).toEqual(['Dessert', 'Vegan']);
    });

    test('isRecipeEqual correctly identifies equal recipes', () => {
        expect(isRecipeEqual(recipesDataset[0], recipesDataset[1])).toBe(false);
        expect(isRecipeEqual(recipesDataset[0], recipesDataset[0])).toBe(true);


        let expected: recipeTableElement = {...recipesDataset[0], id: 9999};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(true);

        expected = {...recipesDataset[0], image_Source: 'Different Image'}
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[1], image_Source: 'Different Image'}
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], description: 'Different description'}
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], tags: []};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], tags: [{tagName: 'One'}, {tagName: 'Two'}]};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], tags: [...recipesDataset[0].tags, {tagName: 'Another one'}]};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);


        expected = {
            ...recipesDataset[0],
            ingredients: [{
                ingName: 'New Ingredient',
                season: ['never mind'],
                type: ingredientType.undefined,
                quantity: "0",
                unit: 'unit'
            }]
        };
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], ingredients: []};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {
            ...recipesDataset[0],
            ingredients: [...recipesDataset[0].ingredients, {
                ingName: 'New Ingredient',
                season: ['never mind'],
                type: ingredientType.undefined,
                quantity: "0",
                unit: 'unit'
            }]
        };
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);


        expected = {...recipesDataset[0], persons: -1};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], season: ['not season']};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], preparation: ['A different preparation']};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {...recipesDataset[0], preparation: []};
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);

        expected = {
            ...recipesDataset[0],
            preparation: [...recipesDataset[0].preparation, 'A new element in preparation']
        };
        expect(isRecipeEqual(recipesDataset[0], expected)).toBe(false);
    });

    test('isIngredientEqual correctly identifies equal ingredients', () => {
        expect(isIngredientEqual(ingredientsDataset[0], ingredientsDataset[0])).toBe(true);
        expect(isIngredientEqual(ingredientsDataset[0], ingredientsDataset[1])).toBe(false);

        let expected: ingredientTableElement = {...ingredientsDataset[0], id: 9999};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(true);

        expected = {...ingredientsDataset[0], ingName: 'New Ingredient'};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(false);

        expected = {...ingredientsDataset[0], quantity: "0"};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(true);
        expect(isIngredientEqual({...ingredientsDataset[0], quantity: "50"}, expected)).toBe(true);

        expected = {...ingredientsDataset[0], season: ['other']};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(true);

        expected = {...ingredientsDataset[0], type: ingredientType.poultry};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(false);

        expected = {...ingredientsDataset[0], unit: 'no unit'};
        expect(isIngredientEqual(ingredientsDataset[0], expected)).toBe(false);
    });

    test('isTagEqual correctly identifies equal tags', () => {
        expect(isTagEqual(tagsDataset[0], tagsDataset[0])).toBe(true);
        expect(isTagEqual(tagsDataset[0], tagsDataset[1])).toBe(false);

        let expected: tagTableElement = {...tagsDataset[0], id: 9999};
        expect(isTagEqual(tagsDataset[0], expected)).toBe(true);
    });

    test('isShoppingEqual correctly identifies equal shopping items', () => {
        const firstShop: shoppingListTableElement = shoppingDataset[0][0];
        const secondShop: shoppingListTableElement = shoppingDataset[0][1];

        expect(isShoppingEqual(firstShop, firstShop)).toBe(true);
        expect(isShoppingEqual(firstShop, secondShop)).toBe(false);

        let expected: shoppingListTableElement = {...firstShop, id: 9999};
        expect(isShoppingEqual(firstShop, expected)).toBe(true);

        expected = {...firstShop, type: nonIngredientFilters.tags};
        expect(isShoppingEqual(firstShop, expected)).toBe(false);

        expected = {...firstShop, name: 'A new name'};
        expect(isShoppingEqual(firstShop, expected)).toBe(false);

        expected = {...firstShop, quantity: "-1"};
        expect(isShoppingEqual(firstShop, expected)).toBe(true);

        expected = {...firstShop, unit: ''};
        expect(isShoppingEqual(firstShop, expected)).toBe(false);

        expected = {...firstShop, recipesTitle: []};
        expect(isShoppingEqual(firstShop, expected)).toBe(true);

        expected = {
            ...firstShop,
            recipesTitle: ['A new array of title', 'with unknown recipes']
        };
        expect(isShoppingEqual(firstShop, expected)).toBe(true);

        expected = {
            ...firstShop,
            recipesTitle: [...firstShop.recipesTitle, 'A new title']
        };
        expect(isShoppingEqual(firstShop, expected)).toBe(true);

        expected = {...firstShop, purchased: true};
        expect(isShoppingEqual(firstShop, expected)).toBe(true);
    });
});
