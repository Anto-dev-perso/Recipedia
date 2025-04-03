import RecipeDatabase from '@utils/RecipeDatabase';
import {recipesDataset} from '@test-data/recipesDataset';
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {isRecipeEqual, recipeTableElement, shoppingListTableElement} from "@customTypes/DatabaseElementTypes";
import {shoppingAddedMultipleTimes, shoppingDataset} from "@test-data/shoppingListsDataset";
import {listFilter} from "@customTypes/RecipeFiltersTypes";

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());

jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

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
            expect(db.searchRandomlyRecipes(1)).toEqual([]);
        });

        test('Find functions return undefined when the array are empty', () => {
            expect(db.find_recipe(recipesDataset[0])).toBeUndefined();
            expect(db.find_ingredient(ingredientsDataset[0])).toBeUndefined();
            expect(db.find_tag(tagsDataset[0])).toBeUndefined();
            expect(db.find_tag(tagsDataset[0])).toBeUndefined();
        });

        test('Add and retrieve a single tag', async () => {
            for (let i = 0; i < tagsDataset.length; i++) {
                const newTag = tagsDataset[i];
                await db.addTag(newTag);
                const tags = db.get_tags();

                expect(tags.length).toBe(i + 1);
                expect(tags[i]).toEqual(newTag);
            }

            await db.addTag({tagName: "Tag with a' inside it"});
            const tags = db.get_tags();

            expect(tags.length).toBe(tagsDataset.length + 1);
            expect(tags[tags.length - 1].tagName).toEqual("Tag with a' inside it");
            // TODO found a test where the insertion fails
            // TODO found a test where the insertion worked but don't return a number
            // TODO found a test where the encodeTag is call without an id

            // TODO found a test for update

            // TODO test decodeArrayOfTags normal case (return the real decodedTags)
        });

        test('Add and retrieve a multiplicity of tags', async () => {

            await db.addMultipleTags(tagsDataset);
            const tags = db.get_tags();

            expect(tags.length).toBe(tagsDataset.length);
            expect(tags).toEqual(tagsDataset);
        });

        test('Add and retrieve a single ingredient', async () => {
            for (let i = 0; i < ingredientsDataset.length; i++) {
                const newIngredient = ingredientsDataset[i];
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

            await db.addMultipleIngredients(ingredientsDataset);
            const ingredient = db.get_ingredients();

            expect(ingredient.length).toBe(ingredientsDataset.length);
            expect(ingredient).toEqual(ingredientsDataset);
        });
    });


    describe('RecipeDatabase recipe adding tests', () => {
        const db = RecipeDatabase.getInstance();

        beforeEach(async () => {
            await db.init();
            await db.addMultipleIngredients(ingredientsDataset);
            await db.addMultipleTags(tagsDataset);
        });

        afterEach(async () => {
            await db.reset();
        });


        test('Add and retrieve a single recipe', async () => {
            for (let i = 0; i < recipesDataset.length; i++) {
                await db.addRecipe(recipesDataset[i]);
                const recipes = db.get_recipes();

                expect(recipes.length).toBe(i + 1);
                expect(recipes[i]).toEqual(recipesDataset[i]);
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
            await db.addMultipleRecipes(recipesDataset);

            const recipes = db.get_recipes();
            expect(recipes.length).toBe(recipesDataset.length);
            expect(recipes).toEqual(recipesDataset);
        });

        test('Performance: Insert and retrieve 10 000 recipes', async () => {
            const largeDataset = Array<recipeTableElement>(10000)
                .fill({...recipesDataset[0]})
                .map((_, i) => ({
                    ...recipesDataset[0],
                    title: `Recipe ${i + 1}`,
                }));

            const startMultiInsert = Date.now();
            for (const recipe of largeDataset) {
                await db.addRecipe(recipe);
            }
            const multiInsertDuration = Date.now() - startMultiInsert;

            // Reset between the 2 tests
            await db.reset();
            await db.init();
            await db.addMultipleIngredients(ingredientsDataset);
            await db.addMultipleTags(tagsDataset);


            const startMonoInsert = Date.now();
            await db.addMultipleRecipes(largeDataset);
            const monoInsertDuration = Date.now() - startMonoInsert;

            const startMonoSearch = Date.now();
            db.searchRandomlyRecipes(1);
            const monoSearchDuration = Date.now() - startMonoSearch;

            const startSearchAll = Date.now();
            db.searchRandomlyRecipes(largeDataset.length);
            const allSearchDuration = Date.now() - startSearchAll;


            console.log(`Insert Duration multi query: ${monoInsertDuration}ms\nInsert Duration mono query: ${multiInsertDuration}ms\n\nSearch one element Duration : ${monoSearchDuration}ms\nSearch all elements Duration : ${allSearchDuration}ms`);
        });

    });

    describe('RecipeDatabase tests with all recipes already in the database', () => {
        const db = RecipeDatabase.getInstance();


        beforeEach(async () => {
            await db.init();
            await db.addMultipleIngredients(ingredientsDataset);
            await db.addMultipleTags(tagsDataset);
            await db.addMultipleRecipes(recipesDataset);
        });

        afterEach(async () => {
            await db.reset();
        });

        test('Add a recipe to the shoppingList shall update accordingly the database', async () => {
            for (let i = 0; i < recipesDataset.length; i++) {
                await db.addRecipeToShopping(recipesDataset[i]);
                expect(db.get_shopping()).toEqual(shoppingDataset[i]);
            }
        });

        test('Add a recipe to the shoppingList twice shall update accordingly the database', async () => {
            await db.addRecipeToShopping(recipesDataset[0]);
            expect(db.get_shopping()).toEqual(shoppingDataset[0]);

            await db.addRecipeToShopping(recipesDataset[0]);
            expect(db.get_shopping()).toEqual(shoppingAddedMultipleTimes);
        });

        test('Adding an array a recipe to the shoppingList shall update accordingly the database', async () => {
            await db.addMultipleShopping(recipesDataset);
            expect(db.get_shopping()).toEqual(shoppingDataset[shoppingDataset.length - 1]);
        });

        test('Adding a purchased information for a recipe shall update the shopping list accordingly', async () => {
            // TODO ...
            await db.addMultipleShopping(recipesDataset);
            expect(db.get_shopping()).toEqual(shoppingDataset[shoppingDataset.length - 1]);
        });

        test('Remove a recipe from shopping and ensure it is deleted', async () => {
            expect(expect.arrayContaining(db.get_shopping())).toEqual([]);
            let expected = new Array<shoppingListTableElement>(
                {
                    id: 1,
                    name: "Pasta",
                    purchased: false,
                    quantity: "200",
                    recipesTitle: ["Pesto Pasta"],
                    type: listFilter.grainOrCereal,
                    unit: "g"
                },
                {
                    id: 2,
                    name: "Basil Leaves",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Pesto Pasta"],
                    type: listFilter.spice,
                    unit: "g"
                },
                {
                    id: 3,
                    name: "Parmesan",
                    purchased: false,
                    quantity: "60",
                    recipesTitle: ["Pesto Pasta", "Caesar Salad"],
                    type: listFilter.cheese,
                    unit: "g"
                },
                {
                    id: 4,
                    name: "Olive Oil",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Pesto Pasta"],
                    type: listFilter.oilAndFat,
                    unit: "ml"
                },
                {
                    id: 5,
                    name: "Pine Nuts",
                    purchased: false,
                    quantity: "20",
                    recipesTitle: ["Pesto Pasta"],
                    type: listFilter.nutsAndSeeds,
                    unit: "g"
                },
                {
                    id: 6,
                    name: "Taco Shells",
                    purchased: false,
                    quantity: "6",
                    recipesTitle: ["Chicken Tacos"],
                    type: listFilter.grainOrCereal,
                    unit: "pieces"
                },
                {
                    id: 7,
                    name: "Chicken Breast",
                    purchased: false,
                    quantity: "300",
                    recipesTitle: ["Chicken Tacos"],
                    type: listFilter.poultry,
                    unit: "g"
                },
                {
                    id: 8,
                    name: "Lettuce",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Chicken Tacos"],
                    type: listFilter.vegetable,
                    unit: "g"
                },
                {
                    id: 9,
                    name: "Cheddar",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Chicken Tacos"],
                    type: listFilter.cheese,
                    unit: "g"
                },
                {
                    id: 10,
                    name: "Romaine Lettuce",
                    purchased: false,
                    quantity: "100",
                    recipesTitle: ["Caesar Salad"],
                    type: listFilter.vegetable,
                    unit: "g"
                },
                {
                    id: 11,
                    name: "Croutons",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Caesar Salad"],
                    type: listFilter.grainOrCereal,
                    unit: "g"
                },
                {
                    id: 12,
                    name: "Caesar Dressing",
                    purchased: false,
                    quantity: "50",
                    recipesTitle: ["Caesar Salad"],
                    type: listFilter.sauce,
                    unit: "ml"
                });

            await db.addRecipeToShopping(recipesDataset[7]);
            await db.addRecipeToShopping(recipesDataset[1]);
            await db.addRecipeToShopping(recipesDataset[3]);

            expect(await db.deleteRecipe(recipesDataset[0])).toEqual(true);
            expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);


            expect(await db.deleteRecipe(recipesDataset[7])).toEqual(true);
            expected = expected.filter(shop => !(shop.name === "Pasta") && !(shop.name === "Basil Leaves") && !(shop.name === "Olive Oil") && !(shop.name === "Pine Nuts"));
            expected.map(shop => {
                if (shop.name.includes("Parmesan")) {
                    shop.recipesTitle = ["Caesar Salad"];
                    shop.quantity = "30";
                }
            });
            expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);

            expect(await db.deleteRecipe({...recipesDataset[1], id: undefined})).toEqual(true);
            expected = expected.filter(shop => !(shop.name === "Taco Shells") && !(shop.name === "Chicken Breast") && !(shop.name === "Lettuce") && !(shop.name === "Cheddar"));

            expect(expect.arrayContaining(db.get_shopping())).toEqual(expected);

            expect(await db.deleteRecipe(recipesDataset[3])).toEqual(true);
            expect(expect.arrayContaining(db.get_shopping())).toEqual([]);
        });

        // TODO found a test where the insertion fails
        // TODO found a test where the insertion worked but don't return a number
        // TODO found a test where the encodeShopping is call without an id

        // TODO found a test for update

        // TODO test decodeArrayOfTags normal case (return the real decodedTags)

        // TODO test function purchaseIngredientOfShoppingList
        // TODO test function setPurchasedOfShopping

    });

    describe('RecipeDatabase tests with database completely filled', () => {
        const db = RecipeDatabase.getInstance();

        beforeEach(async () => {
            await db.init();
            await db.addMultipleIngredients(ingredientsDataset);
            await db.addMultipleTags(tagsDataset);
            await db.addMultipleRecipes(recipesDataset);
            await db.addMultipleShopping(recipesDataset);
        });

        afterEach(async () => {
            await db.reset();
        });

        test('isRecipeExist return true if the recipe is in the database', () => {
            expect(db.isRecipeExist({
                description: "",
                image_Source: "",
                ingredients: new Array(),
                persons: 0,
                preparation: new Array(),
                season: new Array(),
                tags: new Array(),
                time: 0,
                title: ""
            })).toBe(false);
            expect(db.isRecipeExist({
                description: "A real description",
                image_Source: "/path/to/an/image",
                ingredients: new Array(),
                persons: 2,
                preparation: new Array(),
                season: ['*'],
                tags: new Array(tagsDataset[3]),
                time: 20,
                title: "A real title"
            })).toBe(false);

            expect(db.isRecipeExist({...recipesDataset[7], title: "", id: undefined})).toBe(false);

            expect(db.isRecipeExist({...recipesDataset[5], id: undefined})).toBe(true);
            expect(db.isRecipeExist(recipesDataset[0])).toBe(true);

        });

        test('ResetShoppingList reset the table of shopping elements', async () => {
            const ingredientsInDatabase = [...db.get_ingredients()];

            await db.resetShoppingList();

            expect(db.get_recipes()).toEqual(recipesDataset);
            expect(db.get_tags()).toEqual(tagsDataset);
            expect(db.get_ingredients()).toEqual(ingredientsInDatabase);
            expect(db.get_shopping()).toEqual([]);
        });

        test('Delete database reset everything', async () => {
            // TODO deleteDatabase to call at exit ?
            // @ts-ignore deleteDatabase should not been called but still be tested
            await db.deleteDatabase();

            expect(db.get_recipes()).toEqual([]);
            expect(db.get_tags()).toEqual([]);
            expect(db.get_ingredients()).toEqual([]);
            expect(db.get_shopping()).toEqual([]);
        });

        test('Remove a recipe and ensure it is deleted', async () => {
            const recipesBefore = new Array(...db.get_recipes());

            expect(await db.deleteRecipe(recipesDataset[4])).toEqual(true);
            recipesBefore.filter(recipe => !isRecipeEqual(recipe, recipesDataset[4]));

            expect(expect.arrayContaining(db.get_recipes())).toEqual(recipesBefore);

            expect(await db.deleteRecipe(recipesDataset[4])).toEqual(false);

            expect(await db.deleteRecipe({...recipesDataset[9], id: undefined})).toEqual(true);
            recipesBefore.filter(recipe => !isRecipeEqual(recipe, recipesDataset[9]));

            expect(expect.arrayContaining(db.get_recipes())).toEqual(recipesBefore);

            expect(await db.deleteRecipe({...recipesDataset[2], id: undefined, title: ""})).toEqual(false);
            expect(await db.deleteRecipe({...recipesDataset[2], id: undefined, description: ""})).toEqual(false);
            expect(await db.deleteRecipe({...recipesDataset[2], id: undefined, image_Source: ""})).toEqual(false);
            expect(await db.deleteRecipe({...recipesDataset[2], id: undefined, season: []})).toEqual(true);
            recipesBefore.filter(recipe => !isRecipeEqual(recipe, recipesDataset[2]));

            expect(expect.arrayContaining(db.get_recipes())).toEqual(recipesBefore);
        });

        // TODO to be upgrade with database deleting (not implemented yet)
        test('delete tmp', async () => {
            const oldTags = [...db.get_tags()]; // TODO to replace by getAll ...
            db.remove_tag(tagsDataset[0]);
            const newTags = db.get_tags(); // TODO to replace by getAll ...
            expect(newTags).not.toContain(tagsDataset[0]);
            expect(newTags).not.toEqual(oldTags);
            expect(oldTags).toEqual(expect.arrayContaining(newTags));

            const oldIngredients = [...db.get_ingredients()]; // TODO to replace by getAll ...
            db.remove_ingredient(ingredientsDataset[0]);
            const newIngredients = db.get_ingredients(); // TODO to replace by getAll ...
            expect(newIngredients).not.toContain(ingredientsDataset[0]);
            expect(newIngredients).not.toEqual(oldIngredients);
            expect(oldIngredients).toEqual(expect.arrayContaining(newIngredients));

            const oldRecipes = [...db.get_recipes()]; // TODO to replace by getAll ...
            db.remove_recipe(recipesDataset[0]);
            const newRecipes = db.get_recipes(); // TODO to replace by getAll ...
            expect(newRecipes).not.toContain(recipesDataset[0]);
            expect(newRecipes).not.toEqual(oldRecipes);
            expect(oldRecipes).toEqual(expect.arrayContaining(newRecipes));

            const oldShopping = [...db.get_shopping()]; // TODO to replace by getAll ...
            db.remove_shopping(shoppingDataset[0][0]);
            const newShopping = db.get_shopping(); // TODO to replace by getAll ...
            expect(newShopping).not.toContain(shoppingDataset[0][0]);
            expect(newShopping).not.toEqual(oldShopping);
            expect(oldShopping).toEqual(expect.arrayContaining(newShopping));
        });

        // TODO test searchRandomlyTags

        // TODO test decodeArrayOfShopping normal case (return the real decodedShopping)

        // TODO implement and test cases where we verify a tag but it doesn't exist (yet)
        // TODO implement and test cases where we verify an ingredient but it doesn't exist (yet)

        // TODO implement first then test it
        // test('Remove a recipe and ensure it is deleted', async () => {
        //     const recipesBefore = await db.getAllRecipes();
        //
        //     // Arbitrary take one recipe from the dataset and remove it
        //     const recipeToDelete=recipesDataset[4];
        //     await db.removeRecipe(recipeToDelete);
        //     const recipesAfter = await db.getAllRecipes();
        //
        //     expect(recipesAfter.length).toEqual(recipesBefore.length - 1);
        //     expect(recipesBefore).toContain(recipesAfter);
        //     expect(recipesAfter).not.toContain(recipeToDelete);
        // });


        test('Randomly select recipes', async () => {

            const allRecipes = db.get_recipes();

            {
                const randomRecipe = db.searchRandomlyRecipes(1);
                expect(randomRecipe.length).toBe(1);
                // @ts-ignore id shall always been defined now
                expect(randomRecipe[0]).toEqual(allRecipes[randomRecipe[0].id - 1]);

                const anotherRandomRecipeWithoutId = db.searchRandomlyRecipes(1);
                expect(anotherRandomRecipeWithoutId.length).toBe(1);
                expect(anotherRandomRecipeWithoutId).not.toEqual(randomRecipe[0]);
                // @ts-ignore id shall always been defined now
                expect(anotherRandomRecipeWithoutId[0]).toEqual(allRecipes[anotherRandomRecipeWithoutId[0].id - 1]);
            }
            {
                const multipleRecipes = db.searchRandomlyRecipes(5);
                const uniqueRecipe = new Set(multipleRecipes);
                expect(multipleRecipes.length).toBe(5);
                expect(uniqueRecipe.size).toEqual(multipleRecipes.length);
                for (let i = 0; i < multipleRecipes.length; i++) {
                    // @ts-ignore id shall always been defined now
                    expect(multipleRecipes[i]).toEqual(allRecipes[multipleRecipes[i].id - 1]);
                }
            }

            {
                const searchAll = db.searchRandomlyRecipes(allRecipes.length);
                expect(searchAll.length).toBe(allRecipes.length);
                for (let i = 0; i < searchAll.length; i++) {
                    // @ts-ignore id shall always been defined now
                    expect(searchAll[i]).toEqual(allRecipes[searchAll[i].id - 1]);
                }
                expect(searchAll).not.toEqual(allRecipes); // not equal because all elements should not be in the same order

                const searchAllAgain = db.searchRandomlyRecipes(allRecipes.length);
                expect(searchAllAgain.length).toBe(allRecipes.length);
                for (let i = 0; i < searchAllAgain.length; i++) {
                    // @ts-ignore id shall always been defined now
                    expect(searchAllAgain[i]).toEqual(allRecipes[searchAllAgain[i].id - 1]);
                }
                expect(searchAllAgain).not.toEqual(allRecipes);
                expect(searchAllAgain).not.toEqual(searchAll);
            }

        });

    });
});
