import * as SQLite from 'expo-sqlite';
import {
  coreIngredientElement,
  encodedIngredientElement,
  encodedRecipeElement,
  encodedShoppingListElement,
  encodedTagElement,
  ingredientColumnsEncoding,
  ingredientsColumnsNames,
  ingredientsTableName,
  ingredientTableElement,
  ingredientType,
  isIngredientEqual,
  isRecipePartiallyEqual,
  isShoppingEqual,
  isTagEqual,
  nutritionTableElement,
  preparationStepElement,
  recipeColumnsEncoding,
  recipeColumnsNames,
  recipeDatabaseName,
  recipeTableElement,
  recipeTableName,
  shoppingListColumnsEncoding,
  shoppingListColumnsNames,
  shoppingListTableElement,
  shoppingListTableName,
  tagColumnsEncoding,
  tagsColumnsNames,
  tagTableElement,
  tagTableName,
} from '@customTypes/DatabaseElementTypes';
import TableManipulation from './TableManipulation';
import { EncodingSeparator, textSeparator } from '@styles/typography';
import { TListFilter } from '@customTypes/RecipeFiltersTypes';
import FileGestion from '@utils/FileGestion';
import { isNumber, subtractNumberInString, sumNumberInString } from '@utils/TypeCheckingFunctions';
import Fuse from 'fuse.js/dist/fuse.js';
import { scaleQuantityForPersons } from '@utils/Quantity';
import { databaseLogger } from '@utils/logger';
import { fisherYatesShuffle } from './FilterFunctions';

/**
 * RecipeDatabase - Singleton class for managing recipe data storage and operations
 *
 * This class provides a comprehensive interface for managing recipes, ingredients, tags,
 * and shopping lists using SQLite database. It implements the singleton pattern to ensure
 * a single database instance throughout the application lifecycle.
 *
 * Key Features:
 * - Recipe CRUD operations with ingredient and tag relationships
 * - Fuzzy search capabilities using Fuse.js
 * - Shopping list generation from recipes
 * - Quantity scaling for different serving sizes
 * - Similar recipe detection
 * - Local caching for improved performance
 *
 * @example
 * ```typescript
 * const db = RecipeDatabase.getInstance();
 * await db.init();
 *
 * const recipe = await db.addRecipe({
 *   title: "Chocolate Cake",
 *   ingredients: [...],
 *   tags: [...]
 * });
 * ```
 */
export class RecipeDatabase {
  static #instance: RecipeDatabase;

  protected _databaseName: string;
  protected _dbConnection: SQLite.SQLiteDatabase;

  protected _recipesTable: TableManipulation;
  protected _ingredientsTable: TableManipulation;
  protected _tagsTable: TableManipulation;

  protected _shoppingListTable: TableManipulation;

  protected _recipes: Array<recipeTableElement>;
  protected _ingredients: Array<ingredientTableElement>;
  protected _tags: Array<tagTableElement>;
  // protected _nutrition: Array<>;

  protected _shopping: Array<shoppingListTableElement>;

  /*    PRIVATE METHODS     */
  private constructor() {
    this._databaseName = recipeDatabaseName;

    this._recipesTable = new TableManipulation(recipeTableName, recipeColumnsEncoding);
    this._ingredientsTable = new TableManipulation(ingredientsTableName, ingredientColumnsEncoding);
    this._tagsTable = new TableManipulation(tagTableName, tagColumnsEncoding);

    this._shoppingListTable = new TableManipulation(
      shoppingListTableName,
      shoppingListColumnsEncoding
    );

    this._recipes = new Array<recipeTableElement>();
    this._ingredients = new Array<ingredientTableElement>();
    this._tags = new Array<tagTableElement>();
    // this._nutrition = new Array<>();

    this._shopping = new Array<shoppingListTableElement>();
  }

  /* PUBLIC METHODS */

  /**
   * Gets the singleton instance of RecipeDatabase
   *
   * @returns The singleton RecipeDatabase instance
   *
   * @example
   * ```typescript
   * const db = RecipeDatabase.getInstance();
   * ```
   */
  public static getInstance(): RecipeDatabase {
    if (!RecipeDatabase.#instance) {
      RecipeDatabase.#instance = new RecipeDatabase();
    }

    return RecipeDatabase.#instance;
  }

  /**
   * Resets the database by deleting all tables and clearing local cache
   *
   * This operation completely removes all data and recreates empty tables.
   * Use with caution as this action is irreversible.
   *
   * @returns Promise that resolves when reset is complete
   */
  public async reset() {
    databaseLogger.info('Resetting database - deleting all tables and data');

    await this.openDatabase();
    await this._recipesTable.deleteTable(this._dbConnection);
    await this._ingredientsTable.deleteTable(this._dbConnection);
    await this._tagsTable.deleteTable(this._dbConnection);
    await this._shoppingListTable.deleteTable(this._dbConnection);

    this._recipes = new Array<recipeTableElement>();
    this._ingredients = new Array<ingredientTableElement>();
    this._tags = new Array<tagTableElement>();
    this._shopping = new Array<shoppingListTableElement>();

    databaseLogger.info('Database reset completed');
  }

  /**
   * Initializes the database by creating tables and loading data into local cache
   *
   * This method must be called before using any other database operations.
   * It creates the necessary tables if they don't exist and loads all data
   * into memory for faster access.
   *
   * @returns Promise that resolves when initialization is complete
   *
   * @example
   * ```typescript
   * const db = RecipeDatabase.getInstance();
   * await db.init();
   * console.log('Database ready for use');
   * ```
   */
  public async init() {
    databaseLogger.info('Initializing database', { databaseName: this._databaseName });

    await this.openDatabase();

    // TODO can we create multiple table in a single query ?
    await this._recipesTable.createTable(this._dbConnection);
    await this._ingredientsTable.createTable(this._dbConnection);
    await this._tagsTable.createTable(this._dbConnection);
    await this._shoppingListTable.createTable(this._dbConnection);

    this._ingredients = await this.getAllIngredients();
    this._tags = await this.getAllTags();
    this._recipes = await this.getAllRecipes();
    this._shopping = await this.getAllShopping();

    databaseLogger.info('Database initialization completed', {
      recipesCount: this._recipes.length,
      ingredientsCount: this._ingredients.length,
      tagsCount: this._tags.length,
      shoppingItemsCount: this._shopping.length,
    });
  }

  /**
   * Adds a new ingredient to the database
   *
   * @param ingredient - The ingredient object to add
   * @returns Promise resolving to the added ingredient with database ID, or undefined if failed
   *
   * @example
   * ```typescript
   * const ingredient = await db.addIngredient({
   *   name: "Flour",
   *   unit: "cups",
   *   type: ingredientType.grain,
   *   season: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
   * });
   * ```
   */
  public async addIngredient(
    ingredient: ingredientTableElement
  ): Promise<ingredientTableElement | undefined> {
    const ingToAdd: encodedIngredientElement = {
      ID: ingredient.id ? ingredient.id : 0,
      INGREDIENT: ingredient.name,
      UNIT: ingredient.unit,
      TYPE: ingredient.type,
      SEASON: ingredient.season.join(EncodingSeparator),
    };
    databaseLogger.debug('Adding ingredient to database', {
      ingredientName: ingredient.name,
      type: ingredient.type,
    });
    const dbRes = await this._ingredientsTable.insertElement(ingToAdd, this._dbConnection);
    if (dbRes === undefined) {
      databaseLogger.warn('Failed to add ingredient - database insertion failed', {
        ingredientName: ingredient.name,
      });
      return undefined;
    }
    const dbIngredient = await this._ingredientsTable.searchElementById<encodedIngredientElement>(
      dbRes,
      this._dbConnection
    );

    if (dbIngredient === undefined) {
      databaseLogger.error('Failed to find ingredient after insertion', {
        ingredientName: ingredient.name,
        dbResult: dbRes,
      });
      return undefined;
    }
    const decodedIng = this.decodeIngredient(dbIngredient);
    this.add_ingredient(decodedIng);
    return decodedIng;
  }

  /**
   * Adds a new tag to the database
   *
   * @param newTag - The tag object to add
   * @returns Promise that resolves when the tag is added
   *
   * @example
   * ```typescript
   * await db.addTag({
   *   name: "Dessert"
   * });
   * ```
   */
  public async addTag(newTag: tagTableElement) {
    const tagToAdd: encodedTagElement = { ID: newTag.id ? newTag.id : 0, NAME: newTag.name };
    databaseLogger.debug('Adding tag to database', { tagName: newTag.name });
    const dbRes = await this._tagsTable.insertElement(tagToAdd, this._dbConnection);
    if (dbRes === undefined) {
      databaseLogger.error('Failed to add tag - database insertion failed', {
        tagName: newTag.name,
      });
      return;
    }

    const dbTag = await this._tagsTable.searchElementById<encodedTagElement>(
      dbRes,
      this._dbConnection
    );
    if (dbTag === undefined) {
      databaseLogger.error('Failed to find tag after insertion', {
        tagName: newTag.name,
        dbResult: dbRes,
      });
    } else {
      this.add_tags(this.decodeTag(dbTag));
    }
  }

  // TODO make a single call to SQL
  public async addMultipleIngredients(ingredients: Array<ingredientTableElement>) {
    for (const ing of ingredients) {
      await this.addIngredient(ing);
    }
  }

  // TODO make a single call to SQL
  public async addMultipleTags(tags: Array<tagTableElement>) {
    for (const tag of tags) {
      await this.addTag(tag);
    }
  }

  /**
   * Adds a new recipe to the database
   *
   * This method verifies that all ingredients and tags exist in the database,
   * adding them automatically if they don't exist.
   *
   * @param rec - The recipe object to add
   * @returns Promise that resolves when the recipe is added
   *
   * @example
   * ```typescript
   * await db.addRecipe({
   *   title: "Chocolate Cake",
   *   description: "Delicious chocolate cake",
   *   ingredients: [
   *     { name: "Flour", quantity: "2 cups", unit: "cups", type: "grain" }
   *   ],
   *   tags: [{ name: "Dessert" }],
   *   persons: 8,
   *   time: 45,
   *   preparation: ["Mix ingredients", "Bake for 30 minutes"]
   * });
   * ```
   */
  public async addRecipe(rec: recipeTableElement) {
    const recipe = { ...rec };
    // TODO can we verify both in the same query ?
    recipe.tags = await this.verifyTagsExist(rec.tags);
    recipe.ingredients = await this.verifyIngredientsExist(rec.ingredients);

    const recipeConverted = this.encodeRecipe(recipe);

    databaseLogger.debug('Adding recipe to database', {
      recipeTitle: recipe.title,
      ingredientsCount: recipe.ingredients.length,
      tagsCount: recipe.tags.length,
    });
    const dbRes = await this._recipesTable.insertElement(recipeConverted, this._dbConnection);
    if (dbRes === undefined) {
      databaseLogger.error('Failed to add recipe - database insertion failed', {
        recipeTitle: recipe.title,
      });
      return;
    }
    const dbRecipe = await this._recipesTable.searchElementById<encodedRecipeElement>(
      dbRes,
      this._dbConnection
    );
    if (dbRecipe === undefined) {
      databaseLogger.error('Failed to find recipe after insertion', {
        recipeTitle: recipeConverted.TITLE,
        dbResult: dbRes,
      });
    } else {
      this.add_recipes(await this.decodeRecipe(dbRecipe));
    }
  }

  // TODO make a single call to SQL
  public async addMultipleRecipes(recs: Array<recipeTableElement>) {
    for (const recipe of recs) {
      await this.addRecipe(recipe);
    }
  }

  public async editRecipe(rec: recipeTableElement) {
    if (rec.id === undefined) {
      databaseLogger.warn('Cannot edit recipe - missing ID', { recipeTitle: rec.title });
      return false;
    }
    const updateMap = this.constructUpdateRecipeStructure(this.encodeRecipe(rec));
    databaseLogger.debug('Editing recipe', { recipeId: rec.id, recipeTitle: rec.title });
    const success = await this._recipesTable.editElementById(rec.id, updateMap, this._dbConnection);
    if (success) {
      this.update_recipe(rec);
      databaseLogger.debug('Recipe edited successfully', { recipeId: rec.id });
    } else {
      databaseLogger.warn('Failed to edit recipe', { recipeId: rec.id, recipeTitle: rec.title });
    }
    return success;
  }

  public async editIngredient(ingredient: ingredientTableElement) {
    if (ingredient.id === undefined) {
      databaseLogger.warn('Cannot edit ingredient - missing ID', {
        ingredientName: ingredient.name,
      });
      return false;
    }
    const updateMap = this.constructUpdateIngredientStructure(ingredient);
    const success = await this._ingredientsTable.editElementById(
      ingredient.id,
      updateMap,
      this._dbConnection
    );
    if (success) {
      this.update_ingredient(ingredient);
    }
    return success;
  }

  public async editTag(tag: tagTableElement) {
    if (tag.id === undefined) {
      databaseLogger.warn('Cannot edit tag - missing ID', { tagName: tag.name });
      return false;
    }
    const updateMap = this.constructUpdateTagStructure(tag);
    const success = await this._tagsTable.editElementById(tag.id, updateMap, this._dbConnection);
    if (success) {
      this.update_tag(tag);
    }
    return success;
  }

  public async addRecipeToShopping(recipe: recipeTableElement) {
    const shopElement = recipe.ingredients.map(ing => {
      return {
        type: ing.type as TListFilter,
        name: ing.name,
        quantity: ing.quantity ? ing.quantity : '0',
        unit: ing.unit,
        recipesTitle: Array<string>(recipe.title),
        purchased: false,
      } as shoppingListTableElement;
    });

    // TODO make this a single query
    for (const shopToAdd of shopElement) {
      const foundShopping = this.find_shopping(shopToAdd);
      if (foundShopping === undefined) {
        await this.addShoppingList(shopToAdd);
      } else {
        await this.updateIngredientInShoppingList(shopToAdd, foundShopping);
      }
    }
  }

  public async updateIngredientInShoppingList(
    shopToAdd: shoppingListTableElement,
    previousShop: shoppingListTableElement
  ) {
    if (previousShop.id === undefined) {
      databaseLogger.error('Cannot update shopping element - missing ID', {
        ingredient: shopToAdd.name,
      });
      return false;
    }

    const shopToAddIsNumber = isNumber(shopToAdd.quantity);
    const oldShopIsNumber = isNumber(previousShop.quantity);
    if (shopToAddIsNumber && oldShopIsNumber) {
      previousShop.quantity = (
        Number(shopToAdd.quantity) + Number(previousShop.quantity)
      ).toString();
    } else if (!shopToAddIsNumber && !shopToAddIsNumber) {
      previousShop.quantity = sumNumberInString(shopToAdd.quantity, previousShop.quantity);
    } else {
      // TODO to test
      databaseLogger.error('Quantity type mismatch in shopping list', {
        newQuantity: shopToAdd.quantity,
        existingQuantity: previousShop.quantity,
        ingredient: shopToAdd.name,
      });
      return false;
    }

    previousShop.recipesTitle = [...previousShop.recipesTitle, ...shopToAdd.recipesTitle];

    if (
      await this._shoppingListTable.editElementById(
        previousShop.id,
        new Map<string, number | string>([
          [shoppingListColumnsNames.quantity, previousShop.quantity],
          [
            shoppingListColumnsNames.recipeTitles,
            previousShop.recipesTitle.join(EncodingSeparator),
          ],
        ]),
        this._dbConnection
      )
    ) {
      this.update_shopping(previousShop);
      return true;
    }
    return false;
  }

  public async purchaseIngredientOfShoppingList(ingredientId: number, newPurchasedValue: boolean) {
    if (
      await this._shoppingListTable.editElementById(
        ingredientId,
        new Map<string, number | string>([
          [shoppingListColumnsNames.purchased, newPurchasedValue.toString()],
        ]),
        this._dbConnection
      )
    ) {
      this.setPurchasedOfShopping(ingredientId, newPurchasedValue);
      return true;
    }
    return false;
  }

  public async addMultipleShopping(recipes: Array<recipeTableElement>) {
    for (const recEl of recipes) {
      //TODO single query
      await this.addRecipeToShopping(recEl);
    }
  }

  public searchRandomlyTags(numOfElements: number): Array<tagTableElement> {
    if (this._tags.length == 0) {
      databaseLogger.error('Cannot get random tags - tag table is empty');
      return new Array<tagTableElement>();
    } else {
      if (this._tags.length <= numOfElements) {
        databaseLogger.debug('Returning all tags - requested count equals available tags', {
          requestedCount: numOfElements,
          availableCount: this._tags.length,
        });
        return this._tags;
      } else {
        // TODO can find a better random function
        // TODO this can be abstract in a function so that it is also used for other searchRandom
        const res = new Array<tagTableElement>();
        while (res.length < numOfElements) {
          let skipElem = false;
          const randomId = Math.floor(Math.random() * this._recipes.length);

          for (let i = 0; i < res.length && !skipElem; i++) {
            if (isTagEqual(res[i], this._tags[randomId])) {
              skipElem = true;
            }
          }
          if (!skipElem) {
            res.push(this._tags[randomId]);
          }
        }
        return res;
      }
    }
  }

  /**
   * Gets random ingredients of a specific type
   *
   * @param type - The ingredient type to filter by
   * @param count - Number of random ingredients to return
   * @returns Array of random ingredients of the specified type
   */
  public getRandomIngredientsByType(
    type: ingredientType,
    count: number
  ): Array<ingredientTableElement> {
    if (this._ingredients.length === 0) {
      return [];
    }

    const ingredientsOfType = this._ingredients.filter(ingredient => ingredient.type === type);

    if (ingredientsOfType.length === 0) {
      databaseLogger.debug('No ingredients found for type', { ingredientType: type });
      return [];
    }

    return fisherYatesShuffle(ingredientsOfType, count);
  }

  /**
   * Gets random tags from the database
   *
   * @param count - Number of random tags to return
   * @returns Array of random tags
   */
  public getRandomTags(count: number): Array<tagTableElement> {
    if (this._tags.length === 0) {
      return [];
    }

    return fisherYatesShuffle(this._tags, count);
  }

  public async deleteRecipe(recipe: recipeTableElement): Promise<boolean> {
    let recipeDeleted: boolean;
    if (recipe.id !== undefined) {
      recipeDeleted = await this._recipesTable.deleteElementById(recipe.id, this._dbConnection);
    } else {
      recipeDeleted = await this._recipesTable.deleteElement(
        this._dbConnection,
        this.constructSearchRecipeStructure(recipe)
      );
    }
    if (recipeDeleted) {
      await this.removeRecipeFromShopping(recipe);
      this.remove_recipe(recipe);
    }
    return recipeDeleted;
  }

  public async deleteIngredient(ingredient: ingredientTableElement): Promise<boolean> {
    let ingredientDeleted: boolean;
    if (ingredient.id !== undefined) {
      ingredientDeleted = await this._ingredientsTable.deleteElementById(
        ingredient.id,
        this._dbConnection
      );
    } else {
      ingredientDeleted = await this._ingredientsTable.deleteElement(
        this._dbConnection,
        this.constructSearchIngredientStructure(ingredient)
      );
    }
    if (ingredientDeleted) {
      this.remove_ingredient(ingredient);
    }
    return ingredientDeleted;
  }

  public async deleteTag(tag: tagTableElement): Promise<boolean> {
    let tagDeleted: boolean;
    if (tag.id !== undefined) {
      tagDeleted = await this._tagsTable.deleteElementById(tag.id, this._dbConnection);
    } else {
      tagDeleted = await this._tagsTable.deleteElement(
        this._dbConnection,
        this.constructSearchTagStructure(tag)
      );
    }
    if (tagDeleted) {
      this.remove_tag(tag);
    }
    return tagDeleted;
  }

  /**
   * Gets all recipes from the local cache
   *
   * @returns Array of all recipes
   */
  public get_recipes(): Array<recipeTableElement> {
    return this._recipes;
  }

  /**
   * Checks if a recipe exists in the database
   *
   * @param recipeToSearch - Recipe to search for
   * @returns True if recipe exists, false otherwise
   */
  public isRecipeExist(recipeToSearch: recipeTableElement): boolean {
    return this.find_recipe(recipeToSearch) !== undefined;
  }

  /**
   * Gets all ingredients from the local cache
   *
   * @returns Array of all ingredients
   */
  public get_ingredients() {
    return this._ingredients;
  }

  /**
   * Gets all tags from the local cache
   *
   * @returns Array of all tags
   */
  public get_tags(): Array<tagTableElement> {
    return this._tags;
  }

  /**
   * Gets all shopping list items from the local cache
   *
   * @returns Array of all shopping list items
   */
  public get_shopping(): Array<shoppingListTableElement> {
    return this._shopping;
  }

  public add_recipes(recipe: recipeTableElement) {
    this._recipes.push(recipe);
  }

  public add_ingredient(ingredient: ingredientTableElement) {
    this._ingredients.push(ingredient);
  }

  public add_tags(tag: tagTableElement) {
    this._tags.push(tag);
  }

  public add_shopping(shop: shoppingListTableElement) {
    this._shopping.push(shop);
  }

  public remove_recipe(recipe: recipeTableElement) {
    const foundRecipe = this.find_recipe(recipe);
    if (foundRecipe !== undefined) {
      this._recipes.splice(this._recipes.indexOf(foundRecipe), 1);
    } else {
      databaseLogger.warn('Cannot remove recipe - not found in local cache', {
        recipeTitle: recipe.title,
      });
    }
  }

  public remove_ingredient(ingredient: ingredientTableElement) {
    const foundIngredient = this.find_ingredient(ingredient);
    if (foundIngredient !== undefined) {
      this._ingredients.splice(this._ingredients.indexOf(foundIngredient), 1);
    } else {
      databaseLogger.warn('Cannot remove ingredient - not found in local cache', {
        ingredientName: ingredient.name,
      });
    }
  }

  public remove_tag(tag: tagTableElement) {
    const foundTag = this.find_tag(tag);
    if (foundTag !== undefined) {
      this._tags.splice(this._tags.indexOf(foundTag), 1);
    } else {
      databaseLogger.warn('Cannot remove tag - not found in local cache', { tagName: tag.name });
    }
  }

  public remove_shopping(shop: shoppingListTableElement) {
    const foundShopping = this.find_shopping(shop);
    if (foundShopping !== undefined) {
      this._shopping.splice(this._shopping.indexOf(foundShopping), 1);
    } else {
      databaseLogger.warn('Cannot remove shopping item - not found in local cache', {
        itemName: shop.name,
      });
    }
  }

  public update_recipe(newRecipe: recipeTableElement) {
    const foundRecipe = this._recipes.findIndex(recipe => recipe.id === newRecipe.id);
    if (foundRecipe !== -1) {
      this._recipes[foundRecipe] = newRecipe;
    }
  }

  public update_multiple_recipes(updatedRecipes: Array<recipeTableElement>) {
    const recipeMap = new Map(this._recipes.map((recipe, index) => [recipe.id, index]));

    for (const updatedRecipe of updatedRecipes) {
      const idOfRecipeToUpdate = recipeMap.get(updatedRecipe.id);
      if (idOfRecipeToUpdate !== undefined) {
        this._recipes[idOfRecipeToUpdate] = updatedRecipe;
      } else {
        databaseLogger.warn('Cannot find recipe to update', {
          recipeId: updatedRecipe.id,
          title: updatedRecipe.title,
        });
      }
    }
  }

  public update_ingredient(newIngredient: ingredientTableElement) {
    const foundIngredient = this._ingredients.findIndex(
      ingredient => ingredient.id === newIngredient.id
    );
    if (foundIngredient !== -1) {
      this._ingredients[foundIngredient] = newIngredient;
    }
  }

  public update_tag(newTag: tagTableElement) {
    const foundTag = this._tags.findIndex(tag => tag.id === newTag.id);
    if (foundTag !== -1) {
      this._tags[foundTag] = newTag;
    }
  }

  public find_recipe(recipeToFind: recipeTableElement): recipeTableElement | undefined {
    let findFunc: (element: recipeTableElement) => boolean;
    if (recipeToFind.id !== undefined) {
      findFunc = (element: recipeTableElement) => element.id === recipeToFind.id;
    } else {
      findFunc = (element: recipeTableElement) => isRecipePartiallyEqual(element, recipeToFind);
    }
    return this._recipes.find(element => findFunc(element));
  }

  public find_ingredient(ingToFind: ingredientTableElement): ingredientTableElement | undefined {
    let findFunc: (element: ingredientTableElement) => boolean;
    if (ingToFind.id !== undefined) {
      findFunc = (element: ingredientTableElement) => element.id === ingToFind.id;
    } else {
      findFunc = (element: ingredientTableElement) => isIngredientEqual(element, ingToFind);
    }
    return this._ingredients.find(element => findFunc(element));
  }

  public find_tag(tagToSearch: tagTableElement): tagTableElement | undefined {
    let findFunc: (element: tagTableElement) => boolean;
    if (tagToSearch.id !== undefined) {
      findFunc = (element: tagTableElement) => element.id === tagToSearch.id;
    } else {
      findFunc = (element: tagTableElement) => isTagEqual(element, tagToSearch);
    }
    return this._tags.find(element => findFunc(element));
  }

  public find_shopping(toSearch: shoppingListTableElement): shoppingListTableElement | undefined {
    let findFunc: (element: shoppingListTableElement) => boolean;
    if (toSearch.id !== undefined) {
      findFunc = (element: shoppingListTableElement) => element.id === toSearch.id;
    } else {
      findFunc = (element: shoppingListTableElement) => isShoppingEqual(element, toSearch);
    }
    return this._shopping.find(element => findFunc(element));
  }

  // TODO to test
  public setPurchasedOfShopping(ingredientId: number, newPurchasedValue: boolean) {
    if (ingredientId > 0 && ingredientId <= this._shopping.length) {
      this._shopping[ingredientId - 1].purchased = newPurchasedValue;
      return;
    } else {
      databaseLogger.error('Shopping item ID out of bounds', {
        ingredientId,
        maxId: this._shopping.length,
      });
    }
  }

  // TODO to test
  public update_shopping(shop: shoppingListTableElement) {
    if (shop.id !== undefined) {
      this._shopping[shop.id - 1] = shop;
      return;
    }
    const foundShopping = this._shopping.findIndex(element => element.name == shop.name);
    if (foundShopping !== -1) {
      this._shopping[foundShopping] = shop;
      return;
    }
    databaseLogger.error('Cannot update shopping item - not found', {
      itemName: shop.name,
      itemId: shop.id,
    });
  }

  public async resetShoppingList() {
    this._shopping.length = 0;
    await this._shoppingListTable.deleteTable(this._dbConnection);
    await this._shoppingListTable.createTable(this._dbConnection);
  }

  /**
   * Updates all recipes in the database to use a new default persons count,
   * scaling ingredient quantities proportionally.
   * This operation runs asynchronously and does not block the caller.
   */
  public async scaleAllRecipesForNewDefaultPersons(newDefaultPersons: number): Promise<void> {
    try {
      databaseLogger.info('Starting to scale all recipes for new default persons', {
        newDefaultPersons,
        totalRecipes: this.get_recipes().length,
      });
      const updatedRecipes: Array<recipeTableElement> = [];

      for (const recipe of this.get_recipes()) {
        if (recipe.persons && recipe.persons > 0 && recipe.id !== undefined) {
          // Skip recipes that already have the target persons count
          if (recipe.persons === newDefaultPersons) {
            continue;
          }

          const oldPersons = recipe.persons;

          const updatedIngredients = recipe.ingredients.map(ingredient => ({
            ...ingredient,
            quantity: ingredient.quantity
              ? scaleQuantityForPersons(ingredient.quantity, oldPersons, newDefaultPersons)
              : ingredient.quantity,
          }));

          updatedRecipes.push({
            ...recipe,
            persons: newDefaultPersons,
            ingredients: updatedIngredients,
          });
        } else {
          databaseLogger.error('Cannot scale recipe - invalid data', {
            recipeId: recipe.id,
            persons: recipe.persons,
            title: recipe.title,
          });
        }
      }

      if (updatedRecipes.length > 0) {
        databaseLogger.info('Batch updating scaled recipes', {
          recipesToUpdate: updatedRecipes.length,
          newDefaultPersons,
        });
        const batchUpdates = updatedRecipes.map(recipe => ({
          id: recipe.id!,
          elementToUpdate: this.constructUpdateRecipeStructure(this.encodeRecipe(recipe)),
        }));

        const success = await this._recipesTable.batchUpdateElementsById(
          batchUpdates,
          this._dbConnection
        );

        if (success) {
          this.update_multiple_recipes(updatedRecipes);
          databaseLogger.info('Recipe scaling completed successfully', {
            updatedCount: updatedRecipes.length,
            newDefaultPersons,
          });
        } else {
          databaseLogger.error('Failed to update scaled recipes', {
            recipesToUpdate: updatedRecipes.length,
            newDefaultPersons,
          });
        }
      } else {
        databaseLogger.info('No recipes needed scaling', { newDefaultPersons });
      }
    } catch (error) {
      databaseLogger.error('Failed to update recipes for new default persons count', { error });
    }
  }

  /**
   * Finds recipes with similar ingredients and quantities
   *
   * Uses ingredient comparison and fuzzy text matching to find recipes
   * that share similar ingredients and cooking methods.
   *
   * @param recipeToCompare - The recipe to find similarities for
   * @returns Array of similar recipes
   *
   * @example
   * ```typescript
   * const similar = db.findSimilarRecipes(myRecipe);
   * console.log(`Found ${similar.length} similar recipes`);
   * ```
   */
  public findSimilarRecipes(recipeToCompare: recipeTableElement): recipeTableElement[] {
    const ingredientTypesToIgnore: ingredientType[] = [
      ingredientType.condiment,
      ingredientType.oilAndFat,
    ];

    const processIngredients = (recipe: recipeTableElement) => {
      if (recipe.persons === undefined || recipe.persons === 0) {
        return [];
      }
      const persons = recipe.persons as number;
      return recipe.ingredients
        .filter(ing => !ingredientTypesToIgnore.includes(ing.type))
        .map(ing => {
          return {
            name: ing.name.toLowerCase(),
            quantityPerPerson:
              ing.quantity && !isNaN(parseFloat(ing.quantity))
                ? parseFloat(ing.quantity) / persons
                : undefined,
          } as coreIngredientElement;
        })
        .filter(ing => ing.quantityPerPerson !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    const processedRecipeToCompareIngredients = processIngredients(recipeToCompare);

    if (processedRecipeToCompareIngredients.length === 0) {
      return [];
    }

    const recipesWithSimilarIngredients = this._recipes.filter(existingRecipe => {
      if (existingRecipe.id !== undefined && existingRecipe.id === recipeToCompare.id) {
        return false;
      }
      const processedExistingRecipeIngredients = processIngredients(existingRecipe);
      return this.areIngredientsSimilar(
        processedRecipeToCompareIngredients,
        processedExistingRecipeIngredients
      );
    });

    if (recipesWithSimilarIngredients.length === 0) {
      return [];
    }

    const fuse = new Fuse(recipesWithSimilarIngredients, {
      keys: ['title'],
      threshold: 0.6,
    });
    return fuse.search(recipeToCompare.title).map(fuseResult => fuseResult.item);
  }

  /**
   * Finds tags with similar names using fuzzy matching
   *
   * @param tagName - The tag name to search for
   * @returns Array of similar tags, sorted by relevance
   *
   * @example
   * ```typescript
   * const similarTags = db.findSimilarTags("dessrt"); // Finds "Dessert"
   * ```
   */
  public findSimilarTags(tagName: string): tagTableElement[] {
    if (!tagName || tagName.trim().length === 0) {
      return [];
    }

    const exactMatch = this._tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    if (exactMatch) {
      return [exactMatch];
    }

    const fuse = new Fuse(this._tags, {
      keys: ['name'],
      threshold: 0.4,
      includeScore: true,
    });

    return fuse
      .search(tagName)
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map(result => result.item);
  }

  /**
   * Finds ingredients with similar names using fuzzy matching
   *
   * Cleans ingredient names by removing parenthetical content and
   * uses fuzzy search to find similar ingredients.
   *
   * @param ingredientName - The ingredient name to search for
   * @returns Array of similar ingredients, sorted by relevance
   *
   * @example
   * ```typescript
   * const similar = db.findSimilarIngredients("tomatoe"); // Finds "Tomato"
   * ```
   */
  public findSimilarIngredients(ingredientName: string): ingredientTableElement[] {
    if (!ingredientName || ingredientName.trim().length === 0) {
      return [];
    }

    const exactMatch = this._ingredients.find(
      ingredient => ingredient.name.toLowerCase() === ingredientName.toLowerCase()
    );
    if (exactMatch) {
      return [exactMatch];
    }

    const cleanedName = this.cleanIngredientName(ingredientName);

    const fuse = new Fuse(this._ingredients, {
      keys: [
        {
          name: 'name',
          getFn: ingredient => this.cleanIngredientName(ingredient.name),
        },
      ],
      threshold: 0.6,
      includeScore: true,
    });

    return fuse
      .search(cleanedName)
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .map(result => result.item);
  }

  /**
   * Constructs a Map structure for updating recipe data in the database
   *
   * Converts an encoded recipe element into a Map structure suitable for
   * database update operations, mapping column names to their corresponding values.
   *
   * @private
   * @param encodedRecipe - The encoded recipe data to construct update structure from
   * @returns Map with column names as keys and recipe data as values
   */
  private constructUpdateRecipeStructure(
    encodedRecipe: encodedRecipeElement
  ): Map<string, string | number> {
    return new Map<string, string | number>([
      [recipeColumnsNames.image, encodedRecipe.IMAGE_SOURCE],
      [recipeColumnsNames.title, encodedRecipe.TITLE],
      [recipeColumnsNames.description, encodedRecipe.DESCRIPTION],
      [recipeColumnsNames.tags, encodedRecipe.TAGS],
      [recipeColumnsNames.persons, encodedRecipe.PERSONS],
      [recipeColumnsNames.ingredients, encodedRecipe.INGREDIENTS],
      [recipeColumnsNames.preparation, encodedRecipe.PREPARATION],
      [recipeColumnsNames.time, encodedRecipe.TIME],
      [recipeColumnsNames.nutrition, encodedRecipe.NUTRITION],
    ]);
  }

  /**
   * Constructs a Map structure for updating ingredient data in the database
   *
   * Converts an ingredient element into a Map structure suitable for database
   * update operations, properly encoding seasonal data with separators.
   *
   * @private
   * @param ingredient - The ingredient data to construct update structure from
   * @returns Map with column names as keys and ingredient data as values
   */
  private constructUpdateIngredientStructure(
    ingredient: ingredientTableElement
  ): Map<string, string | number> {
    return new Map<string, string | number>([
      [ingredientsColumnsNames.ingredient, ingredient.name],
      [ingredientsColumnsNames.unit, ingredient.unit],
      [ingredientsColumnsNames.type, ingredient.type],
      [ingredientsColumnsNames.season, ingredient.season.join(EncodingSeparator)],
    ]);
  }

  /**
   * Constructs a Map structure for updating tag data in the database
   *
   * Converts a tag element into a Map structure suitable for database
   * update operations.
   *
   * @private
   * @param tag - The tag data to construct update structure from
   * @returns Map with column names as keys and tag data as values
   */
  private constructUpdateTagStructure(tag: tagTableElement): Map<string, string | number> {
    return new Map<string, string | number>([[tagsColumnsNames.name, tag.name]]);
  }

  /* PRIVATE METHODS */

  /**
   * Opens a connection to the SQLite database
   *
   * Creates and establishes a connection to the SQLite database using the configured
   * database name. Logs success/failure for debugging purposes.
   *
   * @private
   * @throws Will log error if database connection fails
   */
  private async openDatabase() {
    try {
      databaseLogger.debug('Opening database connection', { databaseName: this._databaseName });
      this._dbConnection = await SQLite.openDatabaseAsync(this._databaseName);
      databaseLogger.debug('Database connection opened successfully');
    } catch (error) {
      databaseLogger.error('Failed to open database connection', {
        databaseName: this._databaseName,
        error,
      });
    }
  }

  /**
   * Completely removes the database file and resets the instance
   *
   * Closes the current database connection, deletes the database file from storage,
   * and resets all internal data structures to their initial state.
   *
   * @private
   * @throws Will log error if database deletion fails
   */
  private async deleteDatabase() {
    try {
      await this._dbConnection.closeAsync();
      await SQLite.deleteDatabaseAsync(this._databaseName);
      await this.reset();
    } catch (error: unknown) {
      databaseLogger.error('Failed to delete database', {
        databaseName: this._databaseName,
        error,
      });
    }
  }

  /**
   * Verifies that all provided tags exist in the database, creating them if necessary
   *
   * Checks each tag against the local cache and database. If a tag doesn't exist,
   * it automatically adds it to maintain data integrity. Returns the complete
   * array of tags with database IDs assigned.
   *
   * @private
   * @param tags - Array of tags to verify and potentially create
   * @returns Promise resolving to array of verified tags with database IDs
   */
  private async verifyTagsExist(tags: Array<tagTableElement>): Promise<Array<tagTableElement>> {
    // TODO is it really useful to return a new Array ?
    // isn't it better to simply return eventually the array to push ?
    const result = new Array<tagTableElement>();
    for (const tag of tags) {
      const elemFound = this.find_tag(tag);
      if (elemFound) {
        result.push(elemFound);
      } else {
        // TODO
        // result.push(await AsyncAlert(`TAG "${tags[i].tagName.toUpperCase()}" NOT FOUND.`, "Do you want to add it ?", 'OK', 'Cancel', 'Edit before add', tags[i].tagName));
        // console.error("TODO")
        await this.addTag(tag);
        result.push(this.find_tag(tag) as tagTableElement);
      }
    }
    return result;
  }

  /**
   * Verifies that all provided ingredients exist in the database, creating them if necessary
   *
   * Checks each ingredient against the local cache and database. For existing ingredients,
   * preserves the original quantity while using the database ingredient metadata.
   * For missing ingredients, automatically adds them to maintain data integrity.
   *
   * @private
   * @param ingredients - Array of ingredients to verify and potentially create
   * @returns Promise resolving to array of verified ingredients with quantities preserved
   */
  private async verifyIngredientsExist(
    ingredients: Array<ingredientTableElement>
  ): Promise<Array<ingredientTableElement>> {
    // TODO is it really useful to return a new Array ?
    // isn't it better to simply return eventually the array to push ?
    const result = new Array<ingredientTableElement>();
    const newIngredients = new Array<ingredientTableElement>();

    for (const ing of ingredients) {
      const elemFound = this.find_ingredient(ing);
      if (elemFound !== undefined) {
        result.push({ ...elemFound, quantity: ing.quantity });
      } else {
        // TODO Check for similar names ?
        newIngredients.push(ing);
      }
    }

    // TODO what to do when ingredients doesn't exist ?
    /*
                                                                if (newIngredients.length > 0) {
                                                                    let alertTitle: string;
                                                                    let alertMessage = "Do you want to add or edit it before  ?";
                                                                    const alertOk = "OK";
                                                                    const alertCancel = "Cancel";
                                                                    const alertEdit = "Edit before add";
                                                                    if (newIngredients.length > 1) {
                                                                        // Plural
                                                                        alertTitle = "INGREDIENTS NOT FOUND";
                                                                        alertMessage = `Following ingredients were not found in database :  \n`;
                                                                        newIngredients.forEach(ing => {
                                                                            alertMessage += "\t- " + ing.ingName + "\n";
                                                                        });
                                                                        alertMessage += `Do you want to add these as is or edit them before adding ?`;
    
                                                                    } else {
                                                                        alertTitle = `INGREDIENT NOT FOUND`;
                                                                        alertMessage = `Do you want to add this as is or edit it before adding ?`;
                                                                    }
    
    
                                                                    switch (await AsyncAlert(alertTitle, alertMessage, alertOk, alertCancel, alertEdit)) {
                                                                        case alertUserChoice.neutral:
                                                                            // TODO edit before add
                                                                            break;
                                                                        case alertUserChoice.ok:
                                                                            await this.addMultipleIngredients(newIngredients);
                                                                            result = result.concat(newIngredients);
                                                                            break;
                                                                        case alertUserChoice.cancel:
                                                                        default:
                                                                            databaseLogger.debug("User canceled adding ingredient");
                                                                            break;
                                                                    }
                                                                }
                                                                 */
    // TODO for now, just add the ingredients so that we can move on
    await this.addMultipleIngredients(newIngredients);
    result.push(...newIngredients);
    return result;
  }

  /**
   * Constructs a Map structure for searching recipes in the database
   *
   * Creates a search criteria Map using key recipe fields (title, description, image)
   * for database query operations when searching without an ID.
   *
   * @private
   * @param recipe - The recipe data to construct search criteria from
   * @returns Map with column names as keys and search values
   */
  private constructSearchRecipeStructure(recipe: recipeTableElement): Map<string, string | number> {
    return new Map<string, string | number>([
      [recipeColumnsNames.title, recipe.title],
      [recipeColumnsNames.description, recipe.description],
      [recipeColumnsNames.image, recipe.image_Source],
    ]);
  }

  /**
   * Constructs a Map structure for searching ingredients in the database
   *
   * Creates a search criteria Map using key ingredient fields (name, unit, type)
   * for database query operations when searching without an ID.
   *
   * @private
   * @param ingredient - The ingredient data to construct search criteria from
   * @returns Map with column names as keys and search values
   */
  private constructSearchIngredientStructure(
    ingredient: ingredientTableElement
  ): Map<string, string | number> {
    return new Map<string, string>([
      [ingredientsColumnsNames.ingredient, ingredient.name],
      [ingredientsColumnsNames.unit, ingredient.unit],
      [ingredientsColumnsNames.type, ingredient.type],
    ]);
  }

  /**
   * Constructs a Map structure for searching tags in the database
   *
   * Creates a search criteria Map using the tag name for database query
   * operations when searching without an ID.
   *
   * @private
   * @param tag - The tag data to construct search criteria from
   * @returns Map with column names as keys and search values
   */
  private constructSearchTagStructure(tag: tagTableElement): Map<string, string | number> {
    return new Map<string, string | number>([[tagsColumnsNames.name, tag.name]]);
  }

  /**
   * Encodes a recipe object for database storage
   *
   * Converts a recipe from the application format to the database storage format,
   * encoding all nested objects (tags, ingredients, preparation steps, nutrition)
   * into string representations using appropriate separators.
   *
   * @private
   * @param recToEncode - The recipe object to encode for database storage
   * @returns Encoded recipe element ready for database insertion/update
   */
  private encodeRecipe(recToEncode: recipeTableElement): encodedRecipeElement {
    return {
      ID: recToEncode.id ? recToEncode.id : 0,
      IMAGE_SOURCE: recToEncode.image_Source,
      TITLE: recToEncode.title,
      DESCRIPTION: recToEncode.description,
      TAGS: recToEncode.tags.map(tag => this.encodeTag(tag)).join(EncodingSeparator),
      PERSONS: recToEncode.persons,
      INGREDIENTS: recToEncode.ingredients
        .map(ing => this.encodeIngredient(ing))
        .join(EncodingSeparator),
      PREPARATION: recToEncode.preparation
        .map(step => step.title + textSeparator + step.description)
        .join(EncodingSeparator),
      TIME: recToEncode.time,
      NUTRITION: recToEncode.nutrition ? this.encodeNutrition(recToEncode.nutrition) : '',
    };
  }

  /**
   * Decodes a recipe from database storage format to application format
   *
   * Converts an encoded recipe element from the database into the full application
   * format, decoding all nested data structures (ingredients, tags, preparation, nutrition)
   * and resolving file paths and database references.
   *
   * @private
   * @param encodedRecipe - The encoded recipe data from database
   * @returns Promise resolving to fully decoded recipe object
   */
  private async decodeRecipe(encodedRecipe: encodedRecipeElement): Promise<recipeTableElement> {
    const [decodedIngredients, decodedSeason] = await this.decodeIngredientFromRecipe(
      encodedRecipe.INGREDIENTS
    );
    return {
      id: encodedRecipe.ID,
      image_Source: FileGestion.getInstance().get_directoryUri() + encodedRecipe.IMAGE_SOURCE,
      title: encodedRecipe.TITLE,
      description: encodedRecipe.DESCRIPTION,
      tags: await this.decodeTagFromRecipe(encodedRecipe.TAGS),
      persons: encodedRecipe.PERSONS,
      ingredients: decodedIngredients,
      season: decodedSeason,
      preparation: this.decodePreparation(encodedRecipe.PREPARATION),
      time: encodedRecipe.TIME,
      nutrition: this.decodeNutrition(encodedRecipe.NUTRITION),
    };
  }

  /**
   * Decodes an array of recipes from database storage format
   *
   * Processes multiple encoded recipe elements from database queries,
   * decoding each one into the full application format.
   *
   * @private
   * @param queryResult - Array of encoded recipe elements from database
   * @returns Promise resolving to array of fully decoded recipe objects
   */
  private async decodeArrayOfRecipe(
    queryResult: Array<encodedRecipeElement>
  ): Promise<Array<recipeTableElement>> {
    const returnRecipes = new Array<recipeTableElement>();
    if (queryResult.length > 0) {
      for (const recipeEncoded of queryResult) {
        returnRecipes.push(await this.decodeRecipe(recipeEncoded));
      }
    }
    return returnRecipes;
  }

  /**
   * Encodes an ingredient for storage within a recipe's ingredients list
   *
   * Converts an ingredient to a string representation containing the ingredient's
   * database ID and quantity, separated by a text separator. Used when storing
   * ingredient references within recipe data.
   *
   * @private
   * @param ingredientToEncode - The ingredient object to encode
   * @returns String representation in format "ID--quantity", or empty string if ingredient not found
   */
  private encodeIngredient(ingredientToEncode: ingredientTableElement): string {
    // To encode : ID--quantity
    const quantity = ingredientToEncode.quantity ? ingredientToEncode.quantity.toString() : '';
    let idForEncoding: number;
    if (ingredientToEncode.id === undefined) {
      const foundIngredient = this.find_ingredient(ingredientToEncode);
      if (foundIngredient == undefined || foundIngredient.id == undefined) {
        databaseLogger.warn('Cannot encode ingredient - not found in database', {
          ingredientName: ingredientToEncode.name,
        });
        return '';
      } else {
        idForEncoding = foundIngredient.id;
      }
    } else {
      idForEncoding = ingredientToEncode.id;
    }
    return idForEncoding + textSeparator + quantity;
  }

  /**
   * Decodes ingredients from a recipe's encoded ingredient string
   *
   * Parses the encoded ingredient string from a recipe, looking up each ingredient
   * by ID in the database and combining it with the recipe-specific quantities.
   * Also calculates the combined seasonal availability based on all ingredients.
   *
   * @private
   * @param encodedIngredient - Encoded string containing ingredient IDs and quantities
   * @returns Promise resolving to tuple of [decoded ingredients array, combined season array]
   *
   * @example
   * Input: "1--250__2--100__3--0.5"
   * Output: [[ingredient1 with quantity 250, ingredient2 with quantity 100, ...], ["5","6","7"]]
   */
  private async decodeIngredientFromRecipe(
    encodedIngredient: string
  ): Promise<[Array<ingredientTableElement>, Array<string>]> {
    const arrDecoded = new Array<ingredientTableElement>();
    let recipeSeason = new Array<string>(
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12'
    );
    let firstSeasonFound = true;

    // Ex : 1--250__2--100__3--0.5__4--200__5--1__6--250
    const ingSplit = encodedIngredient.includes(EncodingSeparator)
      ? encodedIngredient.split(EncodingSeparator)
      : new Array<string>(encodedIngredient);

    for (const ingredient of ingSplit) {
      const id = Number(ingredient.split(textSeparator)[0]);
      const ingQuantity = ingredient.split(textSeparator)[1];

      const tableIngredient =
        await this._ingredientsTable.searchElementById<encodedIngredientElement>(
          id,
          this._dbConnection
        );
      if (tableIngredient === undefined) {
        databaseLogger.warn('Failed to find ingredient during recipe decoding', {
          ingredientId: id,
        });
      } else {
        const decodedIngredient = this.decodeIngredient(tableIngredient);
        decodedIngredient.quantity = ingQuantity;
        arrDecoded.push(decodedIngredient);

        // In case of *, nothing to do
        if (!decodedIngredient.season.includes('*')) {
          // For the first element, store directly the value
          if (firstSeasonFound) {
            recipeSeason = decodedIngredient.season;
            firstSeasonFound = false;
          } else {
            recipeSeason = this.decodeSeason(recipeSeason, decodedIngredient.season);
          }
        }
      }
    }
    return [arrDecoded, recipeSeason];
  }

  /**
   * Decodes a single ingredient from database storage format
   *
   * Converts an encoded ingredient element from the database into the application
   * format, parsing the seasonal data from its encoded string representation.
   *
   * @private
   * @param dbIngredient - The encoded ingredient data from database
   * @returns Decoded ingredient object in application format
   *
   * @example
   * Input: {"ID":1,"INGREDIENT":"Flour","UNIT":"g", "TYPE":"grain", "SEASON":"1__2__3__12"}
   * Output: {id: 1, name: "Flour", unit: "g", type: "grain", season: ["1","2","3","12"]}
   */
  private decodeIngredient(dbIngredient: encodedIngredientElement): ingredientTableElement {
    // Ex :  {"ID":1,"INGREDIENT":"INGREDIENT NAME","UNIT":"g", "TYPE":"BASE", "SEASON":"*"}
    return {
      id: dbIngredient.ID,
      name: dbIngredient.INGREDIENT,
      unit: dbIngredient.UNIT,
      type: dbIngredient.TYPE as ingredientType,
      season: dbIngredient.SEASON.split(EncodingSeparator),
    };
  }

  /**
   * Decodes an array of ingredients from database storage format
   *
   * Processes multiple encoded ingredient elements from database queries,
   * converting each one to the application format. Returns empty array if
   * input is null, undefined, or empty.
   *
   * @private
   * @param queryResult - Array of encoded ingredient elements from database
   * @returns Array of decoded ingredient objects in application format
   */
  private decodeArrayOfIngredients(
    queryResult: Array<encodedIngredientElement>
  ): Array<ingredientTableElement> {
    if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
      return new Array<ingredientTableElement>();
    }
    return queryResult.map(ingredient => this.decodeIngredient(ingredient));
  }

  /**
   * Calculates the intersection of two seasonal availability arrays
   *
   * Combines seasonal data from multiple ingredients to determine when a recipe
   * can be made using seasonal ingredients. Returns months that are common to both seasons.
   *
   * @private
   * @param previousSeason - Previously calculated season array (accumulated from other ingredients)
   * @param ingredientSeason - Season array from current ingredient
   * @returns Array of month strings that are available in both seasons
   *
   * @example
   * Input: ["5","6","7","8"], ["6","7","8","9"]
   * Output: ["6","7","8"]
   */
  private decodeSeason(
    previousSeason: Array<string>,
    ingredientSeason: Array<string>
  ): Array<string> {
    return previousSeason.filter(month => ingredientSeason.includes(month));
  }

  /**
   * Encodes a tag for storage within a recipe's tags list
   *
   * Converts a tag to its database ID string representation for storage
   * within recipe data. Looks up the tag in the local cache if ID is missing.
   *
   * @private
   * @param tag - The tag object to encode
   * @returns String representation of the tag's database ID, or error message if not found
   */
  private encodeTag(tag: tagTableElement): string {
    if (tag.id === undefined) {
      const foundedTag = this.find_tag(tag);
      if (foundedTag && foundedTag.id) {
        return foundedTag.id.toString();
      } else {
        return 'ERROR : tag not found';
      }
    } else {
      return tag.id.toString();
    }
  }

  /**
   * Decodes tags from a recipe's encoded tag string
   *
   * Parses the encoded tag string from a recipe, looking up each tag by ID
   * in the database to get the full tag information including names.
   *
   * @private
   * @param encodedTag - Encoded string containing tag IDs separated by encoding separators
   * @returns Promise resolving to array of decoded tag objects
   *
   * @example
   * Input: "1__2__5__3__4"
   * Output: [{id: 1, name: "Italian"}, {id: 2, name: "Dinner"}, ...]
   */
  private async decodeTagFromRecipe(encodedTag: string): Promise<Array<tagTableElement>> {
    const arrDecoded = new Array<tagTableElement>();

    // Ex : "1__2__5__3__4"
    const tagSplit = encodedTag.includes(EncodingSeparator)
      ? encodedTag.split(EncodingSeparator)
      : new Array<string>(encodedTag);

    for (const tag of tagSplit) {
      const tableTag = await this._tagsTable.searchElementById<encodedTagElement>(
        +tag,
        this._dbConnection
      );
      if (tableTag !== undefined) {
        arrDecoded.push(this.decodeTag(tableTag));
      } else {
        databaseLogger.warn('Failed to find tag during recipe decoding', { tagId: +tag });
      }
    }

    return arrDecoded;
  }

  /**
   * Decodes a single tag from database storage format
   *
   * Converts an encoded tag element from the database into the application format.
   *
   * @private
   * @param dbTag - The encoded tag data from database
   * @returns Decoded tag object in application format
   *
   * @example
   * Input: {"ID":4,"NAME":"Italian"}
   * Output: {id: 4, name: "Italian"}
   */
  private decodeTag(dbTag: encodedTagElement): tagTableElement {
    // Ex : {"ID":4,"NAME":"TAG NAME"}
    return { id: dbTag.ID, name: dbTag.NAME };
  }

  /**
   * Decodes an array of tags from database storage format
   *
   * Processes multiple encoded tag elements from database queries,
   * converting each one to the application format. Returns empty array if
   * input is null, undefined, or empty.
   *
   * @private
   * @param queryResult - Array of encoded tag elements from database
   * @returns Array of decoded tag objects in application format
   */
  private decodeArrayOfTags(queryResult: Array<encodedTagElement>): Array<tagTableElement> {
    if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
      return new Array<tagTableElement>();
    }
    return queryResult.map(tagFound => this.decodeTag(tagFound));
  }

  /**
   * Encodes nutrition information for database storage
   *
   * Converts a nutrition object to a string representation by joining all
   * nutritional values with text separators for compact storage within recipe data.
   *
   * @private
   * @param nutrition - The nutrition object to encode
   * @returns String representation of all nutrition values separated by text separators
   */
  private encodeNutrition(nutrition: nutritionTableElement): string {
    return [
      nutrition.id || 0,
      nutrition.energyKcal,
      nutrition.energyKj,
      nutrition.fat,
      nutrition.saturatedFat,
      nutrition.carbohydrates,
      nutrition.sugars,
      nutrition.fiber,
      nutrition.protein,
      nutrition.salt,
      nutrition.portionWeight,
    ].join(textSeparator);
  }

  /**
   * Decodes nutrition information from database storage format
   *
   * Parses an encoded nutrition string back into a nutrition object.
   * Returns undefined if the string is empty or has invalid format.
   *
   * @private
   * @param encodedNutrition - Encoded string containing nutrition values separated by text separators
   * @returns Decoded nutrition object or undefined if invalid/empty
   *
   * @example
   * Input: "0--250--1046--15.0--8.0--25.0--12.0--2.5--6.0--0.8--100"
   * Output: {id: undefined, energyKcal: 250, energyKj: 1046, fat: 15.0, ...}
   */
  private decodeNutrition(encodedNutrition: string): nutritionTableElement | undefined {
    if (!encodedNutrition || encodedNutrition.trim().length === 0) {
      return undefined;
    }

    const parts = encodedNutrition.split(textSeparator);
    if (parts.length !== 11) {
      databaseLogger.warn('Invalid nutrition data format', { encodedNutrition });
      return undefined;
    }

    return {
      id: Number(parts[0]) || undefined,
      energyKcal: Number(parts[1]),
      energyKj: Number(parts[2]),
      fat: Number(parts[3]),
      saturatedFat: Number(parts[4]),
      carbohydrates: Number(parts[5]),
      sugars: Number(parts[6]),
      fiber: Number(parts[7]),
      protein: Number(parts[8]),
      salt: Number(parts[9]),
      portionWeight: Number(parts[10]),
    };
  }

  /**
   * Decodes preparation steps from database storage format
   *
   * Parses an encoded preparation string back into an array of preparation step objects.
   * Each step can have both a title and description, or just a description.
   *
   * @private
   * @param encodedPreparation - Encoded string containing preparation steps
   * @returns Array of preparation step objects with title and description
   *
   * @example
   * Input: "Cook pasta--Boil water and add pasta__Mix sauce--Combine ingredients"
   * Output: [{title: "Cook pasta", description: "Boil water and add pasta"}, {title: "Mix sauce", description: "Combine ingredients"}]
   */
  private decodePreparation(encodedPreparation: string): Array<preparationStepElement> {
    if (!encodedPreparation) {
      return [];
    }

    const steps = encodedPreparation.includes(EncodingSeparator)
      ? encodedPreparation.split(EncodingSeparator)
      : [encodedPreparation];

    return steps.map(step => {
      if (step.includes(textSeparator)) {
        const [title, description] = step.split(textSeparator);
        return { title: title || '', description: description || '' };
      } else {
        return { title: '', description: step };
      }
    });
  }

  /**
   * Encodes a shopping list item for database storage
   *
   * Converts a shopping list item from the application format to the database
   * storage format, encoding recipe titles as a joined string and converting
   * the purchased boolean to a numeric value.
   *
   * @private
   * @param shopToEncode - The shopping list item to encode for database storage
   * @returns Encoded shopping list element ready for database insertion/update
   */
  private encodeShopping(shopToEncode: shoppingListTableElement): encodedShoppingListElement {
    return {
      ID: shopToEncode.id ? shopToEncode.id : 0,
      TYPE: shopToEncode.type as string,
      INGREDIENT: shopToEncode.name,
      QUANTITY: shopToEncode.quantity,
      UNIT: shopToEncode.unit,
      TITLES: shopToEncode.recipesTitle.join(EncodingSeparator),
      PURCHASED: shopToEncode.purchased ? 1 : 0,
    };
  }

  /**
   * Decodes a shopping list item from database storage format
   *
   * Converts an encoded shopping list element from the database into the
   * application format, parsing recipe titles and converting the numeric
   * purchased value back to a boolean.
   *
   * @private
   * @param encodedShop - The encoded shopping list data from database
   * @returns Decoded shopping list item in application format
   */
  private decodeShopping(encodedShop: encodedShoppingListElement): shoppingListTableElement {
    return {
      id: encodedShop.ID,
      type: encodedShop.TYPE as TListFilter,
      name: encodedShop.INGREDIENT,
      quantity: encodedShop.QUANTITY.toString(),
      unit: encodedShop.UNIT,
      recipesTitle: encodedShop.TITLES.includes(EncodingSeparator)
        ? encodedShop.TITLES.split(EncodingSeparator)
        : new Array<string>(encodedShop.TITLES),
      purchased: encodedShop.PURCHASED == 0 ? false : true,
    };
  }

  /**
   * Decodes an array of shopping list items from database storage format
   *
   * Processes multiple encoded shopping list elements from database queries,
   * converting each one to the application format. Returns empty array if
   * input is null, undefined, or empty.
   *
   * @private
   * @param queryResult - Array of encoded shopping list elements from database
   * @returns Array of decoded shopping list items in application format
   */
  private decodeArrayOfShopping(
    queryResult: Array<encodedShoppingListElement>
  ): Array<shoppingListTableElement> {
    if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
      return new Array<shoppingListTableElement>();
    }
    return queryResult.map(shoppingElement => this.decodeShopping(shoppingElement));
  }

  /**
   * Retrieves all recipes from the database
   *
   * Fetches all recipe records from the database and decodes them into
   * the application format for use in the local cache.
   *
   * @private
   * @returns Promise resolving to array of all recipes in application format
   */
  private async getAllRecipes(): Promise<Array<recipeTableElement>> {
    return await this.decodeArrayOfRecipe(
      (await this._recipesTable.searchElement(this._dbConnection)) as Array<encodedRecipeElement>
    );
  }

  /**
   * Retrieves all tags from the database
   *
   * Fetches all tag records from the database and decodes them into
   * the application format for use in the local cache.
   *
   * @private
   * @returns Promise resolving to array of all tags in application format
   */
  private async getAllTags(): Promise<Array<tagTableElement>> {
    return this.decodeArrayOfTags(
      (await this._tagsTable.searchElement(this._dbConnection)) as Array<encodedTagElement>
    );
  }

  /**
   * Retrieves all ingredients from the database
   *
   * Fetches all ingredient records from the database and decodes them into
   * the application format for use in the local cache.
   *
   * @private
   * @returns Promise resolving to array of all ingredients in application format
   */
  private async getAllIngredients(): Promise<Array<ingredientTableElement>> {
    return this.decodeArrayOfIngredients(
      (await this._ingredientsTable.searchElement(
        this._dbConnection
      )) as Array<encodedIngredientElement>
    );
  }

  /**
   * Retrieves all shopping list items from the database
   *
   * Fetches all shopping list records from the database and decodes them into
   * the application format for use in the local cache.
   *
   * @private
   * @returns Promise resolving to array of all shopping list items in application format
   */
  private async getAllShopping(): Promise<Array<shoppingListTableElement>> {
    return this.decodeArrayOfShopping(
      (await this._shoppingListTable.searchElement(
        this._dbConnection
      )) as Array<encodedShoppingListElement>
    );
  }

  /**
   * Adds a shopping list item to the database
   *
   * Inserts a new shopping list item into the database, encodes it for storage,
   * and adds it to the local cache upon successful insertion.
   *
   * @private
   * @param shop - The shopping list item to add to the database
   */
  private async addShoppingList(shop: shoppingListTableElement) {
    const dbRes = await this._shoppingListTable.insertElement(
      this.encodeShopping(shop),
      this._dbConnection
    );
    if (dbRes === undefined) {
      databaseLogger.warn('Failed to add shopping item - database insertion failed', {
        itemName: shop.name,
      });
      return;
    }
    const dbShopping = await this._shoppingListTable.searchElementById<encodedShoppingListElement>(
      dbRes,
      this._dbConnection
    );
    if (dbShopping === undefined) {
      databaseLogger.warn('Failed to find shopping item after insertion', {
        recipeTitles: shop.recipesTitle,
        dbResult: dbRes,
      });
    } else {
      this.add_shopping(this.decodeShopping(dbShopping));
    }
  }

  /**
   * Removes a recipe's ingredients from shopping list items
   *
   * When a recipe is deleted, this method removes the recipe's contribution
   * from all related shopping list items. It subtracts quantities and removes
   * the recipe title from items. Items with zero or negative quantities are deleted.
   *
   * @private
   * @param recipe - The recipe whose ingredients should be removed from shopping lists
   */
  private async removeRecipeFromShopping(recipe: recipeTableElement) {
    const editedShopping = new Set<string>();
    const deletedShopping = new Set<string>();

    for (const shop of this._shopping) {
      if (shop.recipesTitle.includes(recipe.title)) {
        const recipeIng = recipe.ingredients.find(ingredient => ingredient.name === shop.name);
        if (recipeIng === undefined) {
          databaseLogger.warn('Cannot find ingredient in recipe for shopping removal', {
            ingredient: shop.name,
            recipeTitle: recipe.title,
          });
        } else if (recipeIng.quantity === undefined) {
          databaseLogger.warn('Missing quantity for ingredient during shopping removal', {
            ingredient: recipeIng.name,
            recipeTitle: recipe.title,
          });
        } else {
          shop.quantity = subtractNumberInString(recipeIng.quantity, shop.quantity);

          if (
            (isNumber(shop.quantity) && Number(shop.quantity) <= 0) ||
            shop.quantity.length === 0
          ) {
            deletedShopping.add(recipeIng.name);
          } else {
            editedShopping.add(recipeIng.name);
          }
        }
      }
    }
    for (const nameToEdit of editedShopping) {
      const currentShopping = this._shopping.find(
        shop => shop.name === nameToEdit
      ) as shoppingListTableElement;

      const editMap = new Map<string, number | string>([
        [shoppingListColumnsNames.quantity, currentShopping.quantity],
        [
          shoppingListColumnsNames.recipeTitles,
          currentShopping.recipesTitle.join(EncodingSeparator),
        ],
      ]);
      if (currentShopping.id !== undefined) {
        await this._shoppingListTable.editElementById(
          currentShopping.id,
          editMap,
          this._dbConnection
        );
      } else {
        const foundShopping =
          (await this._shoppingListTable.searchElement<encodedShoppingListElement>(
            this._dbConnection,
            new Map<string, string>([[shoppingListColumnsNames.ingredient, currentShopping.name]])
          )) as encodedShoppingListElement;
        await this._shoppingListTable.editElementById(
          foundShopping.ID,
          editMap,
          this._dbConnection
        );
      }
      currentShopping.recipesTitle.splice(currentShopping.recipesTitle.indexOf(recipe.title), 1);
    }
    for (const nameToDelete of deletedShopping) {
      const currentShopping = this._shopping.find(
        shop => shop.name === nameToDelete
      ) as shoppingListTableElement;

      if (currentShopping.id !== undefined) {
        await this._shoppingListTable.deleteElementById(currentShopping.id, this._dbConnection);
      } else {
        await this._shoppingListTable.deleteElement(
          this._dbConnection,
          new Map<string, string>([[shoppingListColumnsNames.ingredient, nameToDelete]])
        );
      }
      this._shopping.splice(
        this._shopping.findIndex(shop => shop.name === nameToDelete),
        1
      );
    }
  }

  /**
   * Cleans ingredient names for fuzzy matching
   *
   * Removes parenthetical content and extra whitespace from ingredient names
   * to improve fuzzy search accuracy by focusing on the core ingredient name.
   *
   * @private
   * @param name - The ingredient name to clean
   * @returns Cleaned ingredient name suitable for fuzzy matching
   *
   * @example
   * Input: "Tomatoes (canned, diced)   extra spaces"
   * Output: "Tomatoes extra spaces"
   */
  private cleanIngredientName(name: string): string {
    if (!name) {
      return '';
    }

    // Remove content in parentheses
    let cleaned = name.replace(/\([^)]*\)/g, '').trim();

    // Remove extra whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
  }

  /**
   * Compares two ingredient lists for similarity
   *
   * Determines if two ingredient lists are similar by comparing both ingredient
   * names and quantities per person. Uses a 20% threshold for quantity differences.
   * Used in the similar recipes feature to find recipes with comparable ingredients.
   *
   * @private
   * @param ingredients1 - First ingredient list to compare
   * @param ingredients2 - Second ingredient list to compare
   * @returns True if ingredients lists are similar, false otherwise
   *
   * @example
   * Two recipes with "flour: 2 cups per person" and "flour: 2.1 cups per person" would be similar
   * Two recipes with "flour: 2 cups per person" and "flour: 3 cups per person" would not be similar (50% difference > 20% threshold)
   */
  private areIngredientsSimilar(
    ingredients1: coreIngredientElement[],
    ingredients2: coreIngredientElement[]
  ): boolean {
    if (ingredients1.length !== ingredients2.length) {
      return false;
    }

    for (let i = 0; i < ingredients1.length; i++) {
      const ing1 = ingredients1[i];
      const ing2 = ingredients2[i];

      if (ing1.name !== ing2.name) {
        return false;
      }

      const quantity1 = ing1.quantityPerPerson as number;
      const quantity2 = ing2.quantityPerPerson as number;

      if (quantity1 === quantity2) {
        continue;
      }

      const max = Math.max(quantity1, quantity2);
      const min = Math.min(quantity1, quantity2);

      // Threshold of 20%
      if (max > min * 1.2) {
        return false;
      }
    }

    return true;
  }
}

export default RecipeDatabase;
