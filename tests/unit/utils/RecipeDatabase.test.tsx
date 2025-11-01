import RecipeDatabase from '@utils/RecipeDatabase';
import { testRecipes } from '@test-data/recipesDataset';
import { testTags } from '@test-data/tagsDataset';
import { testIngredients } from '@test-data/ingredientsDataset';
import {
  ingredientTableElement,
  ingredientType,
  nutritionTableElement,
  recipeTableElement,
  shoppingListTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import { shoppingAddedMultipleTimes, testShopping } from '@test-data/shoppingListsDataset';
import { listFilter } from '@customTypes/RecipeFiltersTypes';
import { getRandomRecipes } from '@utils/FilterFunctions';

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());

jest.mock('@utils/FileGestion', () =>
  require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock()
);

describe('RecipeDatabase', () => {
  describe('RecipeDatabase basic tests', () => {
    const db = RecipeDatabase.getInstance();

    beforeEach(async () => {
      await db.init();
    });

    afterEach(async () => {
      await db.reset();
    });

    // Initialization Tests
    test('Database initialization creates all tables', async () => {
      const recipes = db.get_recipes();
      const tags = db.get_tags();
      const ingredients = db.get_ingredients();

      expect(recipes).toEqual([]);
      expect(tags).toEqual([]);
      expect(ingredients).toEqual([]);
    });
    // TODO found a test where the openDatabase fails

    test('Database initialization creates all tables', async () => {
      expect(getRandomRecipes(db.get_recipes(), 1)).toEqual([]);
    });

    describe('isDatabaseEmpty', () => {
      test('should return true when all tables are empty', () => {
        expect(db.isDatabaseEmpty()).toBe(true);
      });

      test('should return false when only recipes table has data', async () => {
        await db.addMultipleIngredients(testIngredients);
        await db.addMultipleTags(testTags);
        await db.addRecipe(testRecipes[0]);

        expect(db.isDatabaseEmpty()).toBe(false);
      });

      test('should return false when only ingredients table has data', async () => {
        await db.addIngredient(testIngredients[0]);

        expect(db.isDatabaseEmpty()).toBe(false);
      });

      test('should return false when only tags table has data', async () => {
        await db.addTag(testTags[0]);

        expect(db.isDatabaseEmpty()).toBe(false);
      });

      test('should return false when all tables have data', async () => {
        await db.addMultipleIngredients(testIngredients);
        await db.addMultipleTags(testTags);
        await db.addMultipleRecipes(testRecipes);

        expect(db.isDatabaseEmpty()).toBe(false);
      });

      test('should return true after database reset', async () => {
        await db.addMultipleIngredients(testIngredients);
        await db.addMultipleTags(testTags);
        await db.addMultipleRecipes(testRecipes);

        expect(db.isDatabaseEmpty()).toBe(false);

        await db.reset();

        expect(db.isDatabaseEmpty()).toBe(true);
      });

      test('should return false when only two tables have data', async () => {
        await db.addIngredient(testIngredients[0]);
        await db.addTag(testTags[0]);

        expect(db.isDatabaseEmpty()).toBe(false);
      });

      test('should return true for fresh database instance', async () => {
        await db.reset();
        await db.init();

        expect(db.isDatabaseEmpty()).toBe(true);
      });
    });

    test('Find functions return undefined when the array are empty', () => {
      expect(db.find_recipe(testRecipes[0])).toBeUndefined();
      expect(db.find_ingredient(testIngredients[0])).toBeUndefined();
      expect(db.find_tag(testTags[0])).toBeUndefined();
      expect(db.find_tag(testTags[0])).toBeUndefined();
    });

    test('Add and retrieve a single tag', async () => {
      for (let i = 0; i < testTags.length; i++) {
        const newTag = testTags[i];
        await db.addTag(newTag);
        const tags = db.get_tags();

        expect(tags.length).toBe(i + 1);
        expect(tags[i]).toEqual(newTag);
      }

      await db.addTag({ name: "Tag with a' inside it" });
      const tags = db.get_tags();

      expect(tags.length).toBe(testTags.length + 1);
      expect(tags[tags.length - 1].name).toEqual("Tag with a' inside it");
      // TODO found a test where the insertion fails
      // TODO found a test where the insertion worked but don't return a number
      // TODO found a test where the encodeTag is call without an id

      // TODO found a test for update

      // TODO test decodeArrayOfTags normal case (return the real decodedTags)
    });

    test('Add and retrieve a multiplicity of tags', async () => {
      await db.addMultipleTags(testTags);
      const tags = db.get_tags();

      expect(tags.length).toBe(testTags.length);
      expect(tags).toEqual(testTags);
    });

    test('Add and retrieve a single ingredient', async () => {
      for (let i = 0; i < testIngredients.length; i++) {
        const newIngredient = testIngredients[i];
        await db.addIngredient(newIngredient);
        const ingredient = db.get_ingredients();

        expect(ingredient.length).toEqual(i + 1);
        expect(ingredient[i]).toEqual(newIngredient);
      }
      // TODO when quantity is set, encoding don't work. To check
      // TODO found a test where the insertion fails

      // TODO found a test where we want to encode ingredient that doesn't have id preset
      // TODO found a test where we want to decode an ingredient that have type seeafood, sweetener and undefined

      // TODO found a test for update

      // TODO test decodeArrayOfIngredients normal case (return the real decodedIngredients)

      // TODO found a test where the insertion worked but don't return a number
    });

    test('Add and retrieve a multiplicity of in', async () => {
      await db.addMultipleIngredients(testIngredients);
      const ingredient = db.get_ingredients();

      expect(ingredient.length).toBe(testIngredients.length);
      expect(ingredient).toEqual(testIngredients);
    });
  });

  describe('RecipeDatabase recipe adding tests', () => {
    const db = RecipeDatabase.getInstance();

    beforeEach(async () => {
      await db.init();
      await db.addMultipleIngredients(testIngredients);
      await db.addMultipleTags(testTags);
    });

    afterEach(async () => {
      await db.reset();
    });

    test('Add and retrieve a single recipe', async () => {
      for (let i = 0; i < testRecipes.length; i++) {
        await db.addRecipe(testRecipes[i]);
        const recipes = db.get_recipes();

        expect(recipes.length).toBe(i + 1);
        expect(recipes[i]).toEqual(testRecipes[i]);
      }
      // TODO check season

      // TODO found a test where the insertion fails
      // TODO found a test where the insertion worked but don't return a number
      // TODO found a test where we decodeRecipe but the query doesn't contain any of the expected string values

      // TODO found a test for update

      // TODO found a test where we want to decode an ingredient that doesn't have the separator (error handling)
      // TODO found a test where we want to decode an ingredient but the search by id returns empty (error handling)

      // TODO found a test where we want to decode a tag that doesn't have the separator (error handling)
      // TODO found a test where we want to decode a tag but the search by id returns empty (error handling)

      // TODO found a test that cover all else if cases of decodeSeason (currently, only the if is tested)
    });

    test('Add multiple recipes and retrieve all', async () => {
      await db.addMultipleRecipes(testRecipes);

      const recipes = db.get_recipes();
      expect(recipes.length).toBe(testRecipes.length);
      expect(recipes).toEqual(testRecipes);
    });
  });

  describe('RecipeDatabase tests with all recipes already in the database', () => {
    const db = RecipeDatabase.getInstance();

    beforeEach(async () => {
      await db.init();
      await db.addMultipleIngredients(testIngredients);
      await db.addMultipleTags(testTags);
      await db.addMultipleRecipes(testRecipes);
    });

    afterEach(async () => {
      await db.reset();
    });

    test('Add a recipe to the shoppingList shall update accordingly the database', async () => {
      for (let i = 0; i < testRecipes.length; i++) {
        await db.addRecipeToShopping(testRecipes[i]);
        expect(db.get_shopping()).toEqual(testShopping[i]);
      }
    });

    test('Add a recipe to the shoppingList twice shall update accordingly the database', async () => {
      await db.addRecipeToShopping(testRecipes[0]);
      expect(db.get_shopping()).toEqual(testShopping[0]);

      await db.addRecipeToShopping(testRecipes[0]);
      expect(db.get_shopping()).toEqual(shoppingAddedMultipleTimes);
    });

    test('Adding an array a recipe to the shoppingList shall update accordingly the database', async () => {
      await db.addMultipleShopping(testRecipes);
      expect(db.get_shopping()).toEqual(testShopping[testShopping.length - 1]);
    });

    test('Adding a purchased information for a recipe shall update the shopping list accordingly', async () => {
      // TODO ...
      await db.addMultipleShopping(testRecipes);
      expect(db.get_shopping()).toEqual(testShopping[testShopping.length - 1]);
    });

    test('Remove a recipe from shopping and ensure it is deleted', async () => {
      expect(expect.arrayContaining(db.get_shopping())).toEqual([]);
      let expected = new Array<shoppingListTableElement>(
        {
          id: 1,
          name: 'Pasta',
          purchased: false,
          quantity: '200',
          recipesTitle: ['Pesto Pasta'],
          type: listFilter.grainOrCereal,
          unit: 'g',
        },
        {
          id: 2,
          name: 'Basil Leaves',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Pesto Pasta'],
          type: listFilter.spice,
          unit: 'g',
        },
        {
          id: 3,
          name: 'Parmesan',
          purchased: false,
          quantity: '60',
          recipesTitle: ['Pesto Pasta', 'Caesar Salad'],
          type: listFilter.cheese,
          unit: 'g',
        },
        {
          id: 4,
          name: 'Olive Oil',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Pesto Pasta'],
          type: listFilter.oilAndFat,
          unit: 'ml',
        },
        {
          id: 5,
          name: 'Pine Nuts',
          purchased: false,
          quantity: '20',
          recipesTitle: ['Pesto Pasta'],
          type: listFilter.nutsAndSeeds,
          unit: 'g',
        },
        {
          id: 6,
          name: 'Taco Shells',
          purchased: false,
          quantity: '6',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.grainOrCereal,
          unit: 'pieces',
        },
        {
          id: 7,
          name: 'Chicken Breast',
          purchased: false,
          quantity: '300',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.poultry,
          unit: 'g',
        },
        {
          id: 8,
          name: 'Lettuce',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.vegetable,
          unit: 'g',
        },
        {
          id: 9,
          name: 'Cheddar',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Chicken Tacos'],
          type: listFilter.cheese,
          unit: 'g',
        },
        {
          id: 10,
          name: 'Romaine Lettuce',
          purchased: false,
          quantity: '100',
          recipesTitle: ['Caesar Salad'],
          type: listFilter.vegetable,
          unit: 'g',
        },
        {
          id: 11,
          name: 'Croutons',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Caesar Salad'],
          type: listFilter.grainOrCereal,
          unit: 'g',
        },
        {
          id: 12,
          name: 'Caesar Dressing',
          purchased: false,
          quantity: '50',
          recipesTitle: ['Caesar Salad'],
          type: listFilter.sauce,
          unit: 'ml',
        }
      );

      await db.addRecipeToShopping(testRecipes[7]);
      await db.addRecipeToShopping(testRecipes[1]);
      await db.addRecipeToShopping(testRecipes[3]);

      expect(await db.deleteRecipe(testRecipes[0])).toEqual(true);
      expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);

      expect(await db.deleteRecipe(testRecipes[7])).toEqual(true);
      expected = expected.filter(
        shop =>
          !(shop.name === 'Pasta') &&
          !(shop.name === 'Basil Leaves') &&
          !(shop.name === 'Olive Oil') &&
          !(shop.name === 'Pine Nuts')
      );
      expected.map(shop => {
        if (shop.name.includes('Parmesan')) {
          shop.recipesTitle = ['Caesar Salad'];
          shop.quantity = '30';
        }
      });
      expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);

      expect(await db.deleteRecipe({ ...testRecipes[1], id: undefined })).toEqual(true);
      expected = expected.filter(
        shop =>
          !(shop.name === 'Taco Shells') &&
          !(shop.name === 'Chicken Breast') &&
          !(shop.name === 'Lettuce') &&
          !(shop.name === 'Cheddar')
      );

      expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);

      expect(await db.deleteRecipe(testRecipes[3])).toEqual(true);
      expect(expect.arrayContaining(db.get_shopping())).toEqual([]);
    });

    test('Edit a recipe in shopping list updates shopping ingredients', async () => {
      await db.addRecipeToShopping(testRecipes[0]);

      const shoppingBefore = db.get_shopping();
      expect(shoppingBefore.length).toBeGreaterThan(0);

      const editedRecipe = {
        ...testRecipes[0],
        title: 'Updated Spaghetti',
        ingredients: [testIngredients[0]],
      };

      await db.editRecipe(editedRecipe);

      const shoppingAfter = db.get_shopping();

      shoppingAfter.forEach(shop => {
        expect(shop.recipesTitle).not.toContain(testRecipes[0].title);
        if (shop.recipesTitle.includes(editedRecipe.title)) {
          expect(shop.recipesTitle).toContain(editedRecipe.title);
        }
      });

      const originalIngredientInShopping = shoppingAfter.find(
        shop => shop.name === testIngredients[0].name
      );
      expect(originalIngredientInShopping).toBeDefined();
    });

    test('Edit a recipe not in shopping list does not affect shopping', async () => {
      const shoppingBefore = db.get_shopping();

      const editedRecipe = {
        ...testRecipes[0],
        title: 'Updated Recipe Not In Shopping',
        ingredients: [testIngredients[0]],
      };

      await db.editRecipe(editedRecipe);

      const shoppingAfter = db.get_shopping();
      expect(shoppingAfter).toEqual(shoppingBefore);
    });

    describe('Shopping list management with recipe operations', () => {
      test('Delete recipe with unique ingredients removes all shopping items', async () => {
        await db.addRecipeToShopping(testRecipes[0]);

        const shoppingBefore = db.get_shopping();
        expect(shoppingBefore.length).toBeGreaterThan(0);

        const allIngredientsUnique = shoppingBefore.every(
          shop => shop.recipesTitle.length === 1 && shop.recipesTitle[0] === testRecipes[0].title
        );
        expect(allIngredientsUnique).toBe(true);

        await db.deleteRecipe(testRecipes[0]);

        const shoppingAfter = db.get_shopping();
        expect(shoppingAfter).toEqual([]);
      });

      test('Delete recipe removes ingredient when it was the last recipe using it', async () => {
        await db.addRecipeToShopping(testRecipes[7]);
        await db.addRecipeToShopping(testRecipes[3]);

        const shoppingBefore = db.get_shopping();
        const pastaItem = shoppingBefore.find(shop => shop.name === 'Pasta');
        expect(pastaItem).toBeDefined();
        expect(pastaItem?.recipesTitle).toEqual(['Pesto Pasta']);

        await db.deleteRecipe(testRecipes[7]);

        const shoppingAfter = db.get_shopping();
        const pastaAfter = shoppingAfter.find(shop => shop.name === 'Pasta');
        expect(pastaAfter).toBeUndefined();
      });

      test('Delete recipe removes ingredient with empty recipesTitle even if quantity mismatch', async () => {
        await db.addRecipeToShopping(testRecipes[7]);

        const shoppingBefore = db.get_shopping();
        const oliveOil = shoppingBefore.find(shop => shop.name === 'Olive Oil');
        expect(oliveOil).toBeDefined();
        expect(oliveOil?.recipesTitle).toEqual(['Pesto Pasta']);
        expect(oliveOil?.quantity).toBe('50');

        await db.deleteRecipe(testRecipes[7]);

        const shoppingAfter = db.get_shopping();
        const oliveOilAfter = shoppingAfter.find(shop => shop.name === 'Olive Oil');
        expect(oliveOilAfter).toBeUndefined();
      });

      test('Delete recipe with shared ingredients updates quantities correctly', async () => {
        await db.addRecipeToShopping(testRecipes[7]);
        await db.addRecipeToShopping(testRecipes[3]);

        const shopping = db.get_shopping();
        const parmesanItem = shopping.find(shop => shop.name === 'Parmesan');
        expect(parmesanItem).toBeDefined();
        expect(parmesanItem?.quantity).toBe('60');
        expect(parmesanItem?.recipesTitle).toEqual(['Pesto Pasta', 'Caesar Salad']);

        await db.deleteRecipe(testRecipes[7]);

        const shoppingAfter = db.get_shopping();
        const parmesanAfter = shoppingAfter.find(shop => shop.name === 'Parmesan');

        expect(parmesanAfter).toBeDefined();
        expect(parmesanAfter?.quantity).toBe('30');
        expect(parmesanAfter?.recipesTitle.length).toBe(1);
        expect(parmesanAfter?.recipesTitle[0]).toBe('Caesar Salad');
      });

      test('Delete recipe removes title from shopping item recipesTitle array', async () => {
        await db.addRecipeToShopping(testRecipes[0]);

        const shoppingBefore = db.get_shopping();
        expect(shoppingBefore.length).toBeGreaterThan(0);
        shoppingBefore.forEach(shop => {
          expect(shop.recipesTitle).toContain(testRecipes[0].title);
        });

        await db.deleteRecipe(testRecipes[0]);

        const shoppingAfter = db.get_shopping();
        shoppingAfter.forEach(shop => {
          expect(shop.recipesTitle).not.toContain(testRecipes[0].title);
        });
      });

      test('Edit recipe quantity updates shopping list correctly', async () => {
        const recipe = {
          ...testRecipes[0],
          ingredients: [{ ...testIngredients[0], quantity: '200' }],
        };

        await db.addRecipe(recipe);
        await db.addRecipeToShopping(recipe);

        const shoppingBefore = db.get_shopping();
        const pastaItemBefore = shoppingBefore.find(shop => shop.name === testIngredients[0].name);
        expect(pastaItemBefore).toBeDefined();
        expect(pastaItemBefore?.quantity).toBe('200');

        const editedRecipe = {
          ...recipe,
          ingredients: [{ ...testIngredients[0], quantity: '300' }],
        };

        await db.editRecipe(editedRecipe);

        const shoppingAfter = db.get_shopping();
        const pastaItemAfter = shoppingAfter.find(shop => shop.name === testIngredients[0].name);
        expect(pastaItemAfter).toBeDefined();
        expect(pastaItemAfter?.quantity).toBe('300');
        expect(pastaItemAfter?.recipesTitle).toContain(editedRecipe.title);
      });

      test('Edit recipe ingredient quantities when multiple recipes share ingredients', async () => {
        await db.addRecipeToShopping(testRecipes[7]);
        await db.addRecipeToShopping(testRecipes[3]);

        const shopping = db.get_shopping();
        const parmesanBefore = shopping.find(shop => shop.name === 'Parmesan');
        expect(parmesanBefore).toBeDefined();
        expect(parmesanBefore?.quantity).toBe('60');

        const editedRecipe = {
          ...testRecipes[7],
          ingredients: testRecipes[7].ingredients.map(ing =>
            ing.name === 'Parmesan' ? { ...ing, quantity: '60' } : ing
          ),
        };

        await db.editRecipe(editedRecipe);

        const shoppingAfter = db.get_shopping();
        const parmesanAfter = shoppingAfter.find(shop => shop.name === 'Parmesan');
        expect(parmesanAfter).toBeDefined();
        expect(parmesanAfter?.quantity).toBe('90');
        expect(parmesanAfter?.recipesTitle.length).toBe(2);
        expect(parmesanAfter?.recipesTitle).toContain('Pesto Pasta');
        expect(parmesanAfter?.recipesTitle).toContain('Caesar Salad');
      });
    });

    test('Remove a tag and ensure it is deleted', async () => {
      expect(await db.deleteTag(testTags[12])).toEqual(true);
      expect(db.get_tags()).not.toContainEqual(testTags[12]);

      expect(await db.deleteTag(testTags[12])).toEqual(false);

      expect(await db.deleteTag({ ...testTags[15], id: undefined })).toEqual(true);
      expect(db.get_tags()).not.toContainEqual(testTags[15]);

      expect(await db.deleteTag({ ...testTags[2], id: undefined, name: '' })).toEqual(false);

      expect(db.get_tags()).toContainEqual(testTags[2]);
    });

    test('Remove an ingredient and ensure it is deleted', async () => {
      expect(await db.deleteIngredient(testIngredients[30])).toEqual(true);
      expect(db.get_ingredients()).not.toContainEqual(testIngredients[30]);

      expect(await db.deleteIngredient(testIngredients[30])).toEqual(false);

      expect(await db.deleteIngredient({ ...testIngredients[21], id: undefined })).toEqual(true);
      expect(db.get_ingredients()).not.toContainEqual(testIngredients[21]);

      expect(
        await db.deleteIngredient({ ...testIngredients[11], id: undefined, name: '' })
      ).toEqual(false);
      expect(
        await db.deleteIngredient({ ...testIngredients[11], id: undefined, unit: '' })
      ).toEqual(false);
      expect(
        await db.deleteIngredient({
          ...testIngredients[11],
          id: undefined,
          type: ingredientType.undefined,
        })
      ).toEqual(false);
      expect(
        await db.deleteIngredient({
          ...testIngredients[11],
          id: undefined,
          name: '',
          unit: '',
          type: ingredientType.undefined,
        })
      ).toEqual(false);
      // Ingredient should still be in the list since delete returned false

      expect(
        await db.deleteIngredient({ ...testIngredients[11], id: undefined, quantity: '' })
      ).toEqual(true);
      expect(db.get_ingredients()).not.toContainEqual(testIngredients[11]);

      expect(
        await db.deleteIngredient({ ...testIngredients[32], id: undefined, season: [] })
      ).toEqual(true);
      expect(db.get_ingredients()).not.toContainEqual(testIngredients[32]);
    });

    test('editTag should update tag', async () => {
      const tagToEdit = { ...testTags[0], name: 'UpdatedTag' };
      expect(await db.editTag(tagToEdit)).toBe(true);

      const updated = db.get_tags().find(t => t.id === tagToEdit.id);
      expect(updated).toEqual(tagToEdit);
    });

    test('editTag with missing ID should return false and not update', async () => {
      const tagToEdit = { ...testTags[0], id: undefined, name: 'ShouldNotUpdate' };

      expect(await db.editTag(tagToEdit)).toBe(false);

      const notUpdated = db.get_tags().find(t => t.name === 'ShouldNotUpdate');
      expect(notUpdated).toBeUndefined();
    });

    test('editIngredient should update ingredient', async () => {
      const ingredientToEdit = { ...testIngredients[0], name: 'UpdatedIngredient' };

      expect(await db.editIngredient(ingredientToEdit)).toBe(true);

      const updated = db.get_ingredients().find(i => i.id === ingredientToEdit.id);
      expect(updated).toEqual(ingredientToEdit);
    });

    test('editIngredient with missing ID should return false and not update', async () => {
      const ingredientToEdit = { ...testIngredients[0], id: undefined, name: 'ShouldNotUpdate' };

      expect(await db.editIngredient(ingredientToEdit)).toBe(false);

      const notUpdated = db.get_ingredients().find(i => i.name === 'ShouldNotUpdate');
      expect(notUpdated).toBeUndefined();
    });

    describe('Recipe refresh after tag/ingredient operations', () => {
      test('editTag should refresh recipes from database', async () => {
        const recipesBefore = db.get_recipes();
        const firstRecipe = recipesBefore[0];
        const tagToEdit = { ...testTags[0], name: 'UpdatedTagName' };

        await db.editTag(tagToEdit);

        const recipesAfter = db.get_recipes();
        expect(recipesAfter).not.toBe(recipesBefore);
        expect(recipesAfter.length).toBe(recipesBefore.length);

        const updatedRecipe = recipesAfter.find(r => r.id === firstRecipe.id);
        expect(updatedRecipe).toBeDefined();
        if (updatedRecipe && updatedRecipe.tags.some(t => t.id === tagToEdit.id)) {
          const updatedTag = updatedRecipe.tags.find(t => t.id === tagToEdit.id);
          expect(updatedTag?.name).toBe('UpdatedTagName');
        }
      });

      test('deleteTag should refresh recipes from database', async () => {
        const recipesBefore = db.get_recipes();
        const tagToDelete = testTags[0];

        await db.deleteTag(tagToDelete);

        const recipesAfter = db.get_recipes();
        expect(recipesAfter).not.toBe(recipesBefore);

        recipesAfter.forEach(recipe => {
          const hasDeletedTag = recipe.tags.some(t => t.id === tagToDelete.id);
          expect(hasDeletedTag).toBe(false);
        });
      });

      test('editIngredient should refresh recipes from database', async () => {
        const recipesBefore = db.get_recipes();
        const firstRecipe = recipesBefore[0];
        const ingredientToEdit = { ...testIngredients[0], name: 'UpdatedIngredientName' };

        await db.editIngredient(ingredientToEdit);

        const recipesAfter = db.get_recipes();
        expect(recipesAfter).not.toBe(recipesBefore);
        expect(recipesAfter.length).toBe(recipesBefore.length);

        const updatedRecipe = recipesAfter.find(r => r.id === firstRecipe.id);
        expect(updatedRecipe).toBeDefined();
        if (updatedRecipe && updatedRecipe.ingredients.some(i => i.id === ingredientToEdit.id)) {
          const updatedIngredient = updatedRecipe.ingredients.find(
            i => i.id === ingredientToEdit.id
          );
          expect(updatedIngredient?.name).toBe('UpdatedIngredientName');
        }
      });

      test('deleteIngredient should refresh recipes from database', async () => {
        const recipesBefore = db.get_recipes();
        const ingredientToDelete = testIngredients[0];

        await db.deleteIngredient(ingredientToDelete);

        const recipesAfter = db.get_recipes();
        expect(recipesAfter).not.toBe(recipesBefore);

        recipesAfter.forEach(recipe => {
          const hasDeletedIngredient = recipe.ingredients.some(i => i.id === ingredientToDelete.id);
          expect(hasDeletedIngredient).toBe(false);
        });
      });

      test('deleteTag should update recipes in database (not just cache)', async () => {
        const tagToDelete = testTags[0];
        const recipeWithTag = db.get_recipes().find(r => r.tags.some(t => t.id === tagToDelete.id));

        expect(recipeWithTag).toBeDefined();

        await db.deleteTag(tagToDelete);

        const recipesReloaded = await db['getAllRecipes']();

        recipesReloaded.forEach(recipe => {
          const hasDeletedTag = recipe.tags.some(t => t.id === tagToDelete.id);
          expect(hasDeletedTag).toBe(false);
        });
      });

      test('deleteIngredient should update recipes in database (not just cache)', async () => {
        const ingredientToDelete = testIngredients[0];
        const recipeWithIngredient = db
          .get_recipes()
          .find(r => r.ingredients.some(i => i.id === ingredientToDelete.id));

        expect(recipeWithIngredient).toBeDefined();

        await db.deleteIngredient(ingredientToDelete);

        const recipesReloaded = await db['getAllRecipes']();

        recipesReloaded.forEach(recipe => {
          const hasDeletedIngredient = recipe.ingredients.some(i => i.id === ingredientToDelete.id);
          expect(hasDeletedIngredient).toBe(false);
        });
      });
    });

    test('editRecipe should update recipe', async () => {
      const recipeToEdit = { ...testRecipes[0], title: 'UpdatedRecipe' };

      expect(await db.editRecipe(recipeToEdit)).toBe(true);

      const updated = db.get_recipes().find(r => r.id === recipeToEdit.id);
      expect(updated).toEqual(recipeToEdit);
    });

    test('editRecipe with missing ID should return false and not update', async () => {
      const recipeToEdit = { ...testRecipes[0], id: undefined, title: 'ShouldNotUpdate' };

      expect(await db.editRecipe(recipeToEdit)).toBe(false);

      const notUpdated = db.get_recipes().find(r => r.title === 'ShouldNotUpdate');
      expect(notUpdated).toBeUndefined();
    });

    describe('update_multiple_recipes', () => {
      test('should update multiple recipes in internal state', () => {
        const originalRecipes = [...db.get_recipes()];

        const updatedRecipes = [
          { ...testRecipes[0], title: 'Updated Spaghetti Bolognese' },
          { ...testRecipes[1], title: 'Updated Chicken Tacos' },
          { ...testRecipes[2], title: 'Updated Classic Pancakes' },
        ];

        db.update_multiple_recipes(updatedRecipes);

        const currentRecipes = db.get_recipes();

        expect(currentRecipes[0].title).toEqual('Updated Spaghetti Bolognese');
        expect(currentRecipes[1].title).toEqual('Updated Chicken Tacos');
        expect(currentRecipes[2].title).toEqual('Updated Classic Pancakes');

        for (let i = 3; i < currentRecipes.length; i++) {
          expect(currentRecipes[i]).toEqual(originalRecipes[i]);
        }
      });

      test('should handle non-existent recipe IDs gracefully', () => {
        const updatedRecipes = [
          { ...testRecipes[0], title: 'Updated Existing Recipe' },
          { ...testRecipes[0], id: 999, title: 'Non-existent Recipe' },
        ];

        db.update_multiple_recipes(updatedRecipes);

        expect(db.get_recipes()[0].title).toBe('Updated Existing Recipe');
        // Non-existent recipe should be ignored without throwing
      });

      test('with empty array should do nothing', () => {
        const originalRecipes = [...db.get_recipes()];

        db.update_multiple_recipes([]);

        expect(db.get_recipes()).toEqual(originalRecipes);
      });
    });

    describe('scaleAllRecipesForNewDefaultPersons', () => {
      test('should scale all recipe quantities and update persons count', async () => {
        const originalRecipes = [...db.get_recipes()];
        const newPersonsCount = 6;

        await db.scaleAllRecipesForNewDefaultPersons(newPersonsCount);

        const scaledRecipes = db.get_recipes();

        expect(scaledRecipes.length).toBe(originalRecipes.length);

        for (let i = 0; i < scaledRecipes.length; i++) {
          const original = originalRecipes[i];
          const scaled = scaledRecipes[i];

          expect(scaled.persons).toEqual(newPersonsCount);
          expect(scaled.ingredients.length).toEqual(original.ingredients.length);

          for (let j = 0; j < scaled.ingredients.length; j++) {
            const originalIng = original.ingredients[j];
            const scaledIng = scaled.ingredients[j];

            expect(scaledIng.id).toEqual(originalIng.id);
            expect(scaledIng.name).toEqual(originalIng.name);
            expect(scaledIng.unit).toEqual(originalIng.unit);
            expect(scaledIng.type).toEqual(originalIng.type);

            const scaleFactor = newPersonsCount / original.persons;
            const expectedQuantity = (parseFloat(originalIng.quantity as string) * scaleFactor)
              .toString()
              .replace('.', ',');
            expect(scaledIng.quantity).toBe(expectedQuantity);
          }

          expect(scaled.id).toBe(original.id);
          expect(scaled.title).toBe(original.title);
          expect(scaled.description).toBe(original.description);
          expect(scaled.tags).toEqual(original.tags);
          expect(scaled.season).toEqual(original.season);
          expect(scaled.preparation).toEqual(original.preparation);
          expect(scaled.time).toBe(original.time);
        }
      });

      test(' should skip recipes with invalid persons count', async () => {
        const invalidRecipe = {
          ...testRecipes[0],
          id: 100,
          persons: 0,
          title: 'Invalid Recipe',
        };

        db.add_recipes(invalidRecipe);
        const originalCount = db.get_recipes().length;

        await db.scaleAllRecipesForNewDefaultPersons(4);

        const recipes = db.get_recipes();
        expect(recipes.length).toBe(originalCount);

        const invalidRecipeAfter = recipes.find(r => r.id === 100);
        expect(invalidRecipeAfter).toEqual(invalidRecipe);
      });

      test(' should handle recipes without ingredients', async () => {
        const noIngredientsRecipe = {
          ...testRecipes[0],
          id: 101,
          persons: 2,
          ingredients: [],
          title: 'No Ingredients Recipe',
        };

        db.add_recipes(noIngredientsRecipe);

        await db.scaleAllRecipesForNewDefaultPersons(4);

        const updatedRecipe = db.get_recipes().find(r => r.id === 101);
        expect(updatedRecipe?.persons).toBe(4);
        expect(updatedRecipe?.ingredients).toEqual([]);
      });

      test('should handle non-numeric quantities', async () => {
        const nonNumericRecipe = {
          ...testRecipes[0],
          id: 102,
          persons: 2,
          ingredients: [
            {
              ...testRecipes[0].ingredients[0],
              quantity: 'a pinch',
            },
          ],
          title: 'Non-numeric Quantity Recipe',
        };

        db.add_recipes(nonNumericRecipe);

        await db.scaleAllRecipesForNewDefaultPersons(4);

        const updatedRecipe = db.get_recipes().find(r => r.id === 102);
        expect(updatedRecipe?.persons).toBe(4);
        expect(updatedRecipe?.ingredients[0].quantity).toBe('a pinch');
      });

      test('should skip recipes that already have the target persons count', async () => {
        const targetPersons = 4;

        const alreadyCorrectRecipe = {
          ...testRecipes[0],
          id: 103,
          persons: targetPersons,
          title: 'Already Correct Recipe',
        };

        db.add_recipes(alreadyCorrectRecipe);
        const originalRecipe = { ...alreadyCorrectRecipe };

        await db.scaleAllRecipesForNewDefaultPersons(targetPersons);

        const unchangedRecipe = db.get_recipes().find(r => r.id === 103);
        expect(unchangedRecipe).toEqual(originalRecipe);
      });

      test('scaleAllRecipesForNewDefaultPersons should handle empty database gracefully', async () => {
        await db.reset();
        await db.init();

        await db.scaleAllRecipesForNewDefaultPersons(4);

        expect(db.get_recipes()).toEqual([]);
      });
    });

    // TODO found a test where the insertion fails
    // TODO found a test where the insertion worked but don't return a number
    // TODO found a test where the encodeShopping is call without an id

    // TODO found a test for update

    // TODO test decodeArrayOfTags normal case (return the real decodedTags)

    // TODO test function purchaseIngredientOfShoppingList
    // TODO test function setPurchasedOfShopping

    describe('RecipeDatabase findSimilarRecipes tests', () => {
      // Change the id just like we would add a recipe in a new id
      const datasetRecipe = testRecipes[0];
      const baseRecipe: recipeTableElement = {
        ...datasetRecipe,
        id: testRecipes.length + 2,
      } as const;

      function createCopyOfBaseRecipe() {
        const copyIngredients = new Array<ingredientTableElement>();
        for (const ing of datasetRecipe.ingredients) {
          copyIngredients.push({ ...ing });
        }
        return { ...baseRecipe, ingredients: copyIngredients };
      }

      test('should find an exact duplicate recipe', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toEqual(1);
        expect(similar[0]).toEqual(datasetRecipe);
      });

      test('should find a recipe with a very similar title and ingredients', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        recipeToTest.title = 'Spageti Carbonara'; // Typo in title
        recipeToTest.ingredients[1].quantity = (
          Number(recipeToTest.ingredients[1].quantity) - 1
        ).toString(); // Slightly less

        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toEqual(1);
        expect(similar[0]).toEqual(datasetRecipe);
      });

      test('should not find a recipe with a different title', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        recipeToTest.title = testRecipes[1].title;

        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toBe(0);
      });

      test('should not find a recipe with different ingredients', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        recipeToTest.ingredients = testRecipes[6].ingredients;

        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toBe(0);
      });

      test('should find a similar recipe regardless of serving size (persons)', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        recipeToTest.persons = 2 * baseRecipe.persons;

        for (const ing of recipeToTest.ingredients) {
          ing.quantity = (Number(ing.quantity) * 2).toString();
        }

        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toEqual(1);
        expect(similar[0]).toEqual(testRecipes[0]);
      });

      test('should not return the same recipe instance when comparing', () => {
        const similar = db.findSimilarRecipes(testRecipes[0]);
        expect(similar.length).toBe(0);
      });

      test('should ignore condiments and fats in comparison', () => {
        const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
        recipeToTest.ingredients.push({
          id: 5,
          name: 'Condiment ingredient',
          type: ingredientType.condiment,
          quantity: '',
          unit: '',
          season: [],
        });
        recipeToTest.ingredients.push({
          id: 5,
          name: 'Oil and Fat ingredient',
          type: ingredientType.oilAndFat,
          quantity: '',
          unit: '',
          season: [],
        });
        const similar = db.findSimilarRecipes(recipeToTest);
        expect(similar.length).toEqual(1);
        expect(similar[0]).toEqual(testRecipes[0]);
      });

      test('should not find a recipe with ingredient quantities outside the tolerance', () => {
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons *
            (quantityPerPerson * 1.2 + 1)
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(0);
        }
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons *
            (Math.round(quantityPerPerson / 1.2) - 1)
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(0);
        }
      });

      test('should not find a recipe with ingredient quantities at the tolerance', () => {
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons *
            (quantityPerPerson * 1.2 - 1)
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(1);
          expect(similar[0]).toEqual(datasetRecipe);
        }
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons *
            quantityPerPerson *
            1.2
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(1);
          expect(similar[0]).toEqual(datasetRecipe);
        }
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons * Math.round(quantityPerPerson / 1.2)
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(1);
          expect(similar[0]).toEqual(datasetRecipe);
        }
        {
          const recipeToTest: recipeTableElement = createCopyOfBaseRecipe();
          const quantityPerPerson =
            Number(recipeToTest.ingredients[0].quantity) / recipeToTest.persons;
          recipeToTest.ingredients[0].quantity = (
            recipeToTest.persons *
            (Math.round(quantityPerPerson / 1.2) + 1)
          ).toString();

          const similar = db.findSimilarRecipes(recipeToTest);
          expect(similar.length).toEqual(1);
          expect(similar[0]).toEqual(datasetRecipe);
        }
      });
    });
  });

  describe('RecipeDatabase tests with database completely filled', () => {
    const db = RecipeDatabase.getInstance();

    beforeEach(async () => {
      await db.init();
      await db.addMultipleIngredients(testIngredients);
      await db.addMultipleTags(testTags);
      await db.addMultipleRecipes(testRecipes);
      await db.addMultipleShopping(testRecipes);
    });

    afterEach(async () => {
      await db.reset();
    });

    test('isRecipeExist return true if the recipe is in the database', () => {
      expect(
        db.isRecipeExist({
          description: '',
          image_Source: '',
          ingredients: new Array(),
          persons: 0,
          preparation: new Array(),
          season: new Array(),
          tags: new Array(),
          time: 0,
          title: '',
        })
      ).toBe(false);
      expect(
        db.isRecipeExist({
          description: 'A real description',
          image_Source: '/path/to/an/image',
          ingredients: new Array(),
          persons: 2,
          preparation: new Array(),
          season: ['*'],
          tags: new Array(testTags[3]),
          time: 20,
          title: 'A real title',
        })
      ).toBe(false);

      expect(db.isRecipeExist({ ...testRecipes[7], title: '', id: undefined })).toBe(false);

      expect(db.isRecipeExist({ ...testRecipes[5], id: undefined })).toBe(true);
      expect(db.isRecipeExist(testRecipes[0])).toBe(true);
    });

    test('ResetShoppingList reset the table of shopping elements', async () => {
      const ingredientsInDatabase = [...db.get_ingredients()];

      await db.resetShoppingList();

      expect(db.get_recipes()).toEqual(testRecipes);
      expect(db.get_tags()).toEqual(testTags);
      expect(db.get_ingredients()).toEqual(ingredientsInDatabase);
      expect(db.get_shopping()).toEqual([]);
    });

    test('Reset database clears all data', async () => {
      await db.reset();

      expect(db.get_recipes()).toEqual([]);
      expect(db.get_tags()).toEqual([]);
      expect(db.get_ingredients()).toEqual([]);
      expect(db.get_shopping()).toEqual([]);
    });

    test('Remove a recipe and ensure it is deleted', async () => {
      expect(await db.deleteRecipe(testRecipes[4])).toEqual(true);
      expect(db.get_recipes()).not.toContainEqual(testRecipes[4]);

      expect(await db.deleteRecipe(testRecipes[4])).toEqual(false);

      expect(await db.deleteRecipe({ ...testRecipes[9], id: undefined })).toEqual(true);
      expect(db.get_recipes()).not.toContainEqual(testRecipes[9]);

      expect(await db.deleteRecipe({ ...testRecipes[2], id: undefined, image_Source: '' })).toEqual(
        false
      );
      expect(await db.deleteRecipe({ ...testRecipes[2], id: undefined, title: '' })).toEqual(false);
      expect(await db.deleteRecipe({ ...testRecipes[2], id: undefined, description: '' })).toEqual(
        false
      );
      expect(db.get_recipes()).toContainEqual(testRecipes[2]);

      expect(await db.deleteRecipe({ ...testRecipes[2], id: undefined, tags: [] })).toEqual(true);
      expect(db.get_recipes()).not.toContainEqual(testRecipes[2]);

      expect(await db.deleteRecipe({ ...testRecipes[3], id: undefined, persons: -1 })).toEqual(
        true
      );
      expect(db.get_recipes()).not.toContainEqual(testRecipes[3]);
      expect(await db.deleteRecipe({ ...testRecipes[5], id: undefined, ingredients: [] })).toEqual(
        true
      );
      expect(db.get_recipes()).not.toContainEqual(testRecipes[5]);
      expect(await db.deleteRecipe({ ...testRecipes[6], id: undefined, season: [] })).toEqual(true);
      expect(db.get_recipes()).not.toContainEqual(testRecipes[6]);
      expect(await db.deleteRecipe({ ...testRecipes[7], id: undefined, preparation: [] })).toEqual(
        true
      );
      expect(db.get_recipes()).not.toContainEqual(testRecipes[7]);
      expect(await db.deleteRecipe({ ...testRecipes[8], id: undefined, time: -1 })).toEqual(true);
      expect(db.get_recipes()).not.toContainEqual(testRecipes[8]);
    });

    // TODO to be upgrade with database deleting (not implemented yet)
    test('delete tmp', async () => {
      const oldTags = [...db.get_tags()]; // TODO to replace by getAll ...
      db.remove_tag(testTags[0]);
      const newTags = db.get_tags(); // TODO to replace by getAll ...
      expect(newTags).not.toContain(testTags[0]);
      expect(newTags).not.toEqual(oldTags);
      expect(oldTags).toEqual(expect.arrayContaining(newTags));

      const oldIngredients = [...db.get_ingredients()]; // TODO to replace by getAll ...
      db.remove_ingredient(testIngredients[0]);
      const newIngredients = db.get_ingredients(); // TODO to replace by getAll ...
      expect(newIngredients).not.toContain(testIngredients[0]);
      expect(newIngredients).not.toEqual(oldIngredients);
      expect(oldIngredients).toEqual(expect.arrayContaining(newIngredients));

      const oldRecipes = [...db.get_recipes()]; // TODO to replace by getAll ...
      db.remove_recipe(testRecipes[0]);
      const newRecipes = db.get_recipes(); // TODO to replace by getAll ...
      expect(newRecipes).not.toContain(testRecipes[0]);
      expect(newRecipes).not.toEqual(oldRecipes);
      expect(oldRecipes).toEqual(expect.arrayContaining(newRecipes));

      const oldShopping = [...db.get_shopping()]; // TODO to replace by getAll ...
      db.remove_shopping(testShopping[0][0]);
      const newShopping = db.get_shopping(); // TODO to replace by getAll ...
      expect(newShopping).not.toContain(testShopping[0][0]);
      expect(newShopping).not.toEqual(oldShopping);
      expect(oldShopping).toEqual(expect.arrayContaining(newShopping));
    });

    // TODO test searchRandomlyTags

    // TODO test decodeArrayOfShopping normal case (return the real decodedShopping)

    // TODO implement and test cases where we verify a tag but it doesn't exist (yet)
    // TODO implement and test cases where we verify an ingredient but it doesn't exist (yet)

    test('getRandomIngredientsByType returns correct number of ingredients', () => {
      const grainIngredients = db.getRandomIngredientsByType(ingredientType.grainOrCereal, 2);
      expect(grainIngredients.length).toBeLessThanOrEqual(2);

      grainIngredients.forEach(ingredient => {
        expect(ingredient.type).toBe(ingredientType.grainOrCereal);
      });

      const uniqueIngredients = new Set(grainIngredients.map(ingredient => ingredient.id));
      expect(uniqueIngredients.size).toBe(grainIngredients.length);
    });

    test('getRandomIngredientsByType handles edge cases', () => {
      const zeroIngredients = db.getRandomIngredientsByType(ingredientType.grainOrCereal, 0);
      expect(zeroIngredients).toEqual([]);

      const meatIngredients = db.getRandomIngredientsByType(ingredientType.meat, 1000);
      expect(meatIngredients.length).toBeGreaterThan(0);
      expect(meatIngredients.length).toBeLessThan(1000);
      expect(meatIngredients.length).toBeLessThanOrEqual(db.get_ingredients().length);

      meatIngredients.forEach(ingredient => {
        expect(ingredient.type).toBe(ingredientType.meat);
      });

      const uniqueMeatIngredients = new Set(meatIngredients.map(ingredient => ingredient.id));
      expect(uniqueMeatIngredients.size).toBe(meatIngredients.length);
    });

    test('getRandomIngredientsByType returns empty array for non-existent type', () => {
      const nonExistentType = 'nonExistentType' as ingredientType;
      const result = db.getRandomIngredientsByType(nonExistentType, 5);
      expect(result).toEqual([]);
    });

    test('getRandomTags returns correct number of tags', () => {
      const randomTags = db.getRandomTags(3);
      expect(randomTags.length).toBeLessThanOrEqual(3);

      const uniqueTags = new Set(randomTags.map(tag => tag.id));
      expect(uniqueTags.size).toBe(randomTags.length);
    });

    test('getRandomTags handles edge cases', () => {
      const zeroTags = db.getRandomTags(0);
      expect(zeroTags).toEqual([]);

      const allTags = db.get_tags();
      const manyTags = db.getRandomTags(1000);
      expect(manyTags.length).toBeGreaterThan(0);
      expect(manyTags.length).toBeLessThan(1000);
      expect(manyTags.length).toBeLessThanOrEqual(allTags.length);

      manyTags.forEach(tag => {
        expect(allTags).toContainEqual(tag);
      });

      const uniqueManyTags = new Set(manyTags.map(tag => tag.id));
      expect(uniqueManyTags.size).toBe(manyTags.length);
    });

    describe('findSimilarTags', () => {
      test('should return empty array for empty or null input', () => {
        expect(db.findSimilarTags('')).toEqual([]);
        expect(db.findSimilarTags('   ')).toEqual([]);
      });

      test('should return exact match first when tag name matches exactly', () => {
        const expected = testTags[0];
        const result = db.findSimilarTags(expected.name);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expected);
      });

      test('should return exact match case-insensitively', () => {
        {
          const expected = testTags[1];

          const result = db.findSimilarTags(expected.name.toLowerCase());
          expect(result).toHaveLength(1);
          expect(result[0]).toEqual(expected);
        }

        {
          const expected = testTags[2];
          const result = db.findSimilarTags(expected.name.toUpperCase());
          expect(result).toHaveLength(1);
          expect(result[0]).toEqual(expected);
        }
      });

      test('should return exact match even with extra whitespace', () => {
        const expected = testTags[3];

        const result = db.findSimilarTags(` ${expected.name} `);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(expected);
      });

      test('should find similar tags using fuzzy search when no exact match', () => {
        const expected = testTags[0];

        const result = db.findSimilarTags('Italien');
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(expected);
      });

      test('should find similar tags for partial matches', () => {
        const expected = testTags[4];

        const result = db.findSimilarTags(expected.name.slice(0, -2));
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);
      });

      test('should handle typos in tag names', () => {
        const expected = testTags[5];

        const result = db.findSimilarTags(expected.name.slice(0, -1));
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);
      });

      test('should handle multiple word tags correctly', () => {
        const expected = testTags[8];

        const result = db.findSimilarTags(expected.name.split(' ')[0]);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);

        const result2 = db.findSimilarTags(expected.name.split(' ')[0]);
        expect(result2.length).toBe(1);
        expect(result2[0]).toEqual(expected);
      });

      test('should handle tags with spaces', () => {
        const expected = testTags[15];

        const result = db.findSimilarTags(expected.name);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);

        const result2 = db.findSimilarTags('space');
        expect(result2.length).toBe(1);
        expect(result2[0]).toEqual(expected);
      });

      test('should return results sorted by relevance score', () => {
        const expected = testTags[0];

        const result = db.findSimilarTags(expected.name.slice(0, 2));
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toEqual(expected);
      });

      test('should return empty array when no similar tags found', () => {
        const result = db.findSimilarTags('NonExistentCuisineType');
        expect(result).toEqual([]);
      });

      test('should find similar tags with different similarity thresholds', () => {
        const expected = testTags[0];

        // Close match should return results
        const closeMatch = db.findSimilarTags(expected.name.slice(0, -2));
        expect(closeMatch.length).toBeGreaterThan(0);

        // Very different string should return empty
        const noMatch = db.findSimilarTags('xyz123');
        expect(noMatch).toEqual([]);
      });

      test('should work with database containing single tag', async () => {
        const tag: tagTableElement = { id: 1, name: 'SingleTag' };
        await db.reset();
        await db.init();
        await db.addTag(tag);

        const exactMatch = db.findSimilarTags(tag.name);
        expect(exactMatch).toHaveLength(1);
        expect(exactMatch[0]).toEqual(tag);

        const similarMatch = db.findSimilarTags(tag.name.slice(0, -3));
        expect(similarMatch.length).toBeGreaterThan(0);
        expect(similarMatch[0]).toEqual(tag);
      });

      test('should handle empty database gracefully', async () => {
        await db.reset();
        await db.init();

        const result = db.findSimilarTags('AnyTag');
        expect(result).toEqual([]);
      });
    });

    describe('findSimilarIngredients', () => {
      test('should return empty array for empty input', () => {
        const resultEmpty = db.findSimilarIngredients('');
        expect(resultEmpty).toEqual([]);

        const resultWhitespaces = db.findSimilarIngredients('   ');
        expect(resultWhitespaces).toEqual([]);
      });

      test('should return exact match when ingredient exists', () => {
        const expected = testIngredients[0];

        const result = db.findSimilarIngredients(expected.name);
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);
      });

      test('should return exact match case insensitive', () => {
        const expected = testIngredients[1];

        const result = db.findSimilarIngredients(expected.name.toUpperCase());
        expect(result.length).toBe(1);
        expect(result[0]).toEqual(expected);
      });

      test('should find similar ingredients with typos', () => {
        const expected = testIngredients[2];

        const result = db.findSimilarIngredients(expected.name.slice(0, -3));
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toEqual(expected);
      });

      test('should clean ingredient names by removing parentheses', () => {
        const expected = testIngredients[3];

        const result = db.findSimilarIngredients(expected.name + ' (fresh)');
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toEqual(expected);
      });

      test('should return multiple similar ingredients sorted by relevance', () => {
        const expected = testIngredients[36];

        const result = db.findSimilarIngredients(expected.name.slice(0, 3));
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].name).toMatch(/tom/i);
      });

      test('should return empty array for completely unmatched ingredient', () => {
        const result = db.findSimilarIngredients('XYZNonExistentIngredient123');
        expect(result).toEqual([]);
      });

      test('should handle special characters and spaces in ingredient names', () => {
        // Test with special characters if any exist in test data
        const result = db.findSimilarIngredients('Pâte');
        // Should not crash and return appropriate results
        expect(Array.isArray(result)).toBe(true);
      });

      test('should handle empty database gracefully', async () => {
        await db.reset();
        await db.init();

        const result = db.findSimilarIngredients('AnyIngredient');
        expect(result).toEqual([]);
      });
    });
  });

  describe('RecipeDatabase nutrition tests', () => {
    const db = RecipeDatabase.getInstance();

    beforeEach(async () => {
      await db.init();
      await db.addMultipleIngredients(testIngredients);
      await db.addMultipleTags(testTags);
    });

    afterEach(async () => {
      await db.reset();
    });

    describe('Nutrition', () => {
      const testNutrition: nutritionTableElement = {
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

      test('should store and retrieve recipes with nutrition data correctly', async () => {
        const recipeWithNutrition: recipeTableElement = {
          ...testRecipes[0],
          nutrition: testNutrition,
        };

        await db.addRecipe(recipeWithNutrition);
        const retrievedRecipes = db.get_recipes();
        const addedRecipe = retrievedRecipes.find(r => r.title === recipeWithNutrition.title);

        expect(addedRecipe).toBeDefined();
        expect(addedRecipe?.nutrition).toEqual(testNutrition);
      });

      test('should store and retrieve recipes without nutrition data correctly', async () => {
        const recipeWithoutNutrition: recipeTableElement = {
          ...testRecipes[1],
          nutrition: undefined,
        };

        await db.addRecipe(recipeWithoutNutrition);
        const retrievedRecipes = db.get_recipes();
        const addedRecipe = retrievedRecipes.find(r => r.title === recipeWithoutNutrition.title);

        expect(addedRecipe).toBeDefined();
        expect(addedRecipe?.nutrition).toBeUndefined();
      });

      test('should update recipe nutrition data correctly', async () => {
        const originalRecipe: recipeTableElement = {
          ...testRecipes[2],
          nutrition: undefined,
        };

        await db.addRecipe(originalRecipe);
        const addedRecipe = db.get_recipes().find(r => r.title === originalRecipe.title);
        expect(addedRecipe?.nutrition).toBeUndefined();

        const updatedRecipe = {
          ...addedRecipe!,
          nutrition: testNutrition,
        };

        const updateSuccess = await db.editRecipe(updatedRecipe);
        expect(updateSuccess).toBe(true);

        const finalRecipe = db.get_recipes().find(r => r.title === updatedRecipe.title);
        expect(finalRecipe?.nutrition).toEqual(testNutrition);
      });

      test('should remove nutrition data when updated to undefined', async () => {
        const recipeWithNutrition: recipeTableElement = {
          ...testRecipes[0],
          nutrition: testNutrition,
        };

        await db.addRecipe(recipeWithNutrition);
        const addedRecipe = db.get_recipes().find(r => r.title === recipeWithNutrition.title);
        expect(addedRecipe?.nutrition).toEqual(testNutrition);

        const updatedRecipe = {
          ...addedRecipe!,
          nutrition: undefined,
        };

        const updateSuccess = await db.editRecipe(updatedRecipe);
        expect(updateSuccess).toBe(true);

        const finalRecipe = db.get_recipes().find(r => r.title === recipeWithNutrition.title);
        expect(finalRecipe?.nutrition).toBeUndefined();
      });

      test('should preserve nutrition data through database operations', async () => {
        const recipeWithNutrition: recipeTableElement = {
          ...testRecipes[0],
          nutrition: testNutrition,
        };

        await db.addRecipe(recipeWithNutrition);

        // Simulate database restart
        await db.reset();
        await db.init();
        await db.addMultipleIngredients(testIngredients);
        await db.addMultipleTags(testTags);
        await db.addRecipe(recipeWithNutrition);

        const retrievedRecipe = db.get_recipes().find(r => r.title === recipeWithNutrition.title);
        expect(retrievedRecipe?.nutrition).toEqual(testNutrition);
      });

      test('should handle nutrition data with decimal values correctly', async () => {
        const precisionNutrition: nutritionTableElement = {
          energyKcal: 123.456,
          energyKj: 987.654,
          fat: 1.23,
          saturatedFat: 0.45,
          carbohydrates: 67.89,
          sugars: 12.34,
          fiber: 5.67,
          protein: 8.9,
          salt: 0.123,
          portionWeight: 150.5,
        };

        const recipeWithPrecisionNutrition: recipeTableElement = {
          ...testRecipes[0],
          nutrition: precisionNutrition,
        };

        await db.addRecipe(recipeWithPrecisionNutrition);
        const retrievedRecipe = db
          .get_recipes()
          .find(r => r.title === recipeWithPrecisionNutrition.title);

        expect(retrievedRecipe?.nutrition).toEqual(precisionNutrition);
      });
    });
  });

  describe('Image URI handling', () => {
    let db: RecipeDatabase = RecipeDatabase.getInstance();
    const FileGestion = require('@utils/FileGestion');
    const fileGestionInstance = FileGestion.getInstance();

    beforeEach(async () => {
      await db.init();
      jest.clearAllMocks();
      fileGestionInstance.get_directoryUri.mockReturnValue('file:///documents/Recipedia/');
    });

    describe('addRecipe', () => {
      it('saves temporary image to permanent storage when adding recipe', async () => {
        fileGestionInstance.saveRecipeImage.mockResolvedValue(
          'file:///documents/Recipedia/test_recipe.jpg'
        );

        const recipeWithTempImage = {
          ...testRecipes[0],
          id: undefined,
          image_Source: 'file:///cache/ImageManipulator/temp-image.jpg',
        };

        await db.addRecipe(recipeWithTempImage);

        expect(fileGestionInstance.saveRecipeImage).toHaveBeenCalledWith(
          'file:///cache/ImageManipulator/temp-image.jpg',
          testRecipes[0].title
        );
      });

      it('does not save permanent URI image when adding recipe', async () => {
        const initialCallCount = fileGestionInstance.saveRecipeImage.mock.calls.length;

        const recipeWithPermanentImage = {
          ...testRecipes[0],
          id: undefined,
          image_Source: 'file:///documents/Recipedia/existing_image.jpg',
        };

        await db.addRecipe(recipeWithPermanentImage);

        const finalCallCount = fileGestionInstance.saveRecipeImage.mock.calls.length;
        expect(finalCallCount).toBe(initialCallCount);
      });
    });

    describe('editRecipe', () => {
      it('saves temporary image to permanent storage when editing recipe', async () => {
        await db.addRecipe({ ...testRecipes[0], id: undefined });
        const addedRecipe = db.get_recipes()[0];

        jest.clearAllMocks();
        fileGestionInstance.saveRecipeImage.mockResolvedValue(
          'file:///documents/Recipedia/edited_recipe.jpg'
        );

        const editedRecipe = {
          ...addedRecipe,
          image_Source: 'file:///cache/ImageManipulator/new-image.jpg',
        };

        await db.editRecipe(editedRecipe);

        expect(fileGestionInstance.saveRecipeImage).toHaveBeenCalledWith(
          'file:///cache/ImageManipulator/new-image.jpg',
          editedRecipe.title
        );
      });

      it('does not save permanent URI image when editing recipe', async () => {
        await db.addRecipe({ ...testRecipes[0], id: undefined });
        const addedRecipe = db.get_recipes()[0];

        jest.clearAllMocks();
        const initialCallCount = fileGestionInstance.saveRecipeImage.mock.calls.length;

        const editedRecipe = {
          ...addedRecipe,
          description: 'Updated description',
        };

        await db.editRecipe(editedRecipe);

        const finalCallCount = fileGestionInstance.saveRecipeImage.mock.calls.length;
        expect(finalCallCount).toBe(initialCallCount);
      });
    });

    describe('Recipe search by image', () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        fileGestionInstance.saveRecipeImage.mockReset();
        fileGestionInstance.saveRecipeImage.mockResolvedValue('/mock/directory/saved_image.jpg');
        await db.addMultipleIngredients(testIngredients);
        await db.addMultipleTags(testTags);
      });

      afterEach(async () => {
        await db.reset();
      });

      it('deletes recipe correctly when image URI is provided as full path', async () => {
        const recipeToAdd = {
          ...testRecipes[0],
          id: undefined,
        };
        await db.addRecipe(recipeToAdd);

        const addedRecipe = db.get_recipes()[0];
        expect(addedRecipe).toBeDefined();
        expect(addedRecipe.image_Source).toContain('file:///');

        const initialRecipeCount = db.get_recipes().length;
        const deleteSuccess = await db.deleteRecipe(addedRecipe);

        expect(deleteSuccess).toBe(true);
        expect(db.get_recipes().length).toBe(initialRecipeCount - 1);
      });

      it('deletes recipe correctly when searching with filename instead of full URI', async () => {
        const recipeToAdd = {
          ...testRecipes[0],
          id: undefined,
        };
        await db.addRecipe(recipeToAdd);

        const addedRecipe = db.get_recipes()[0];
        const initialRecipeCount = db.get_recipes().length;

        const recipeWithFilename = {
          ...addedRecipe,
          image_Source: testRecipes[0].image_Source,
        };

        const deleteSuccess = await db.deleteRecipe(recipeWithFilename);

        expect(deleteSuccess).toBe(true);
        expect(db.get_recipes().length).toBe(initialRecipeCount - 1);
      });

      it('correctly handles image search when recipe has full URI in memory', async () => {
        fileGestionInstance.saveRecipeImage
          .mockResolvedValueOnce('file:///documents/Recipedia/recipe1.jpg')
          .mockResolvedValueOnce('file:///documents/Recipedia/recipe2.jpg');

        const recipe1 = { ...testRecipes[0], id: undefined };
        const recipe2 = { ...testRecipes[1], id: undefined };

        await db.addRecipe(recipe1);
        await db.addRecipe(recipe2);

        const recipes = db.get_recipes();
        expect(recipes.length).toBe(2);
        expect(recipes[0].image_Source).toContain('file:///');
        expect(recipes[1].image_Source).toContain('file:///');

        const recipeToDelete = recipes[0];
        const deleteSuccess = await db.deleteRecipe(recipeToDelete);

        expect(deleteSuccess).toBe(true);
        const remainingRecipes = db.get_recipes();
        expect(remainingRecipes.length).toBe(1);
        expect(remainingRecipes[0].title).toBe(recipe2.title);
        expect(remainingRecipes[0].image_Source).not.toBe(recipeToDelete.image_Source);
      });
    });
  });
});
