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
    tagTableName
} from '@customTypes/DatabaseElementTypes';
import TableManipulation from './TableManipulation';
import {EncodingSeparator, textSeparator} from '@styles/typography';
import {TListFilter} from '@customTypes/RecipeFiltersTypes';
import FileGestion from '@utils/FileGestion'
import {isNumber, subtractNumberInString, sumNumberInString} from "@utils/TypeCheckingFunctions";
import Fuse from 'fuse.js/dist/fuse.js';
import {scaleQuantityForPersons} from '@utils/Quantity';

export default class RecipeDatabase {
    static #instance: RecipeDatabase;


    protected _databaseName: string;
    protected _dbConnection: SQLite.SQLiteDatabase;

    protected _recipesTable: TableManipulation;
    protected _ingredientsTable: TableManipulation;
    protected _tagsTable: TableManipulation;
    // TODO add nutrition
    // protected _nutritionTable: TableManipulation;

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
        // this._nutritionTable = new TableManipulation(nutritionTableName, nutritionColumnsNames);

        this._shoppingListTable = new TableManipulation(shoppingListTableName, shoppingListColumnsEncoding);

        this._recipes = new Array<recipeTableElement>();
        this._ingredients = new Array<ingredientTableElement>();
        this._tags = new Array<tagTableElement>();
        // this._nutrition = new Array<>();

        this._shopping = new Array<shoppingListTableElement>();
    }


    /* PUBLIC METHODS */

    public static getInstance(): RecipeDatabase {
        if (!RecipeDatabase.#instance) {
            RecipeDatabase.#instance = new RecipeDatabase();
        }

        return RecipeDatabase.#instance;
    }

    public async reset() {

        await this.openDatabase();
        await this._recipesTable.deleteTable(this._dbConnection);
        await this._ingredientsTable.deleteTable(this._dbConnection);
        await this._tagsTable.deleteTable(this._dbConnection);
        await this._shoppingListTable.deleteTable(this._dbConnection);
        // await this._nutritionTable.deleteTable(this._dbConnection);

        this._recipes = new Array<recipeTableElement>();
        this._ingredients = new Array<ingredientTableElement>();
        this._tags = new Array<tagTableElement>();
        this._shopping = new Array<shoppingListTableElement>();
    }

    public async init() {


        await this.openDatabase();

        // TODO can we create multiple table in a single query ?
        await this._recipesTable.createTable(this._dbConnection);
        await this._ingredientsTable.createTable(this._dbConnection);
        await this._tagsTable.createTable(this._dbConnection);
        await this._shoppingListTable.createTable(this._dbConnection);
        // await this._nutritionTable.createTable();

        this._ingredients = await this.getAllIngredients();
        this._tags = await this.getAllTags();
        this._recipes = await this.getAllRecipes();
        this._shopping = await this.getAllShopping();
    }

    public async addIngredient(ingredient: ingredientTableElement): Promise<ingredientTableElement | undefined> {
        const ingToAdd: encodedIngredientElement = {
            ID: ingredient.id ? ingredient.id : 0, INGREDIENT: ingredient.name,
            UNIT: ingredient.unit,
            TYPE: ingredient.type,
            SEASON: ingredient.season.join(EncodingSeparator)
        };
        const dbRes = await this._ingredientsTable.insertElement(ingToAdd, this._dbConnection);
        if (dbRes === undefined) {
            console.warn("Can't add the ingredient because insertion in the database didn't worked");
            return undefined;
        }
        const dbIngredient = await this._ingredientsTable.searchElementById<encodedIngredientElement>(dbRes, this._dbConnection);

        if (dbIngredient === undefined) {
            console.warn("addIngredient: Searching for ingredient  ", ingredient.name, " didn't worked");
            return undefined;
        }
        const decodedIng = this.decodeIngredient(dbIngredient);
        this.add_ingredients(decodedIng);
        return decodedIng;
    }

    public async addTag(newTag: tagTableElement) {
        const tagToAdd: encodedTagElement = {ID: newTag.id ? newTag.id : 0, NAME: newTag.name};
        const dbRes = await this._tagsTable.insertElement(tagToAdd, this._dbConnection);
        if (dbRes === undefined) {
            console.warn("addTag: Can't add the tag because insertion in the database didn't worked");
            return
        }

        const dbTag = await this._tagsTable.searchElementById<encodedTagElement>(dbRes, this._dbConnection);
        if (dbTag === undefined) {
            console.warn("addTag: Searching for tag ", newTag.name, " didn't worked")
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

    public async addRecipe(rec: recipeTableElement) {

        let recipe = {...rec};
        // TODO can we verify both in the same query ?
        recipe.tags = await this.verifyTagsExist(rec.tags);
        recipe.ingredients = await this.verifyIngredientsExist(rec.ingredients);

        const recipeConverted = this.encodeRecipe(recipe);

        const dbRes = await this._recipesTable.insertElement(recipeConverted, this._dbConnection);
        if (dbRes === undefined) {
            console.warn("addRecipe: Can't add the recipe because insertion in the database didn't worked");
            return
        }
        const dbRecipe = await this._recipesTable.searchElementById<encodedRecipeElement>(dbRes, this._dbConnection)
        if (dbRecipe === undefined) {
            console.warn("addRecipe: Searching for recipe  ", recipeConverted.TITLE, " didn't worked")
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
            console.warn("editRecipe: Recipe must have an id");
            return false;
        }
        const updateMap = this.constructUpdateRecipeStructure(this.encodeRecipe(rec));
        const success = await this._recipesTable.editElementById(rec.id, updateMap, this._dbConnection);
        if (success) {
            this.update_recipe(rec);
        }
        return success;
    }

    public async editIngredient(ingredient: ingredientTableElement) {
        if (ingredient.id === undefined) {
            console.warn("editIngredient: Ingredient must have an id");
            return false;
        }
        const updateMap = this.constructUpdateIngredientStructure(ingredient);
        const success = await this._ingredientsTable.editElementById(ingredient.id, updateMap, this._dbConnection);
        if (success) {
            this.update_ingredient(ingredient);
        }
        return success;
    }

    public async editTag(tag: tagTableElement) {
        if (tag.id === undefined) {
            console.warn("editTag: Tag must have an id");
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
                quantity: (ing.quantity ? ing.quantity : "0"),
                unit: ing.unit,
                recipesTitle: Array<string>(recipe.title),
                purchased: false
            } as shoppingListTableElement
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

    public async updateIngredientInShoppingList(shopToAdd: shoppingListTableElement, previousShop: shoppingListTableElement) {

        if (previousShop.id === undefined) {
            console.error("CAN'T UPDATE A SHOPPING ELEMENT WITHOUT AN ID");
            return false;
        }

        const shopToAddIsNumber = isNumber(shopToAdd.quantity);
        const oldShopIsNumber = isNumber(previousShop.quantity);
        if (shopToAddIsNumber && oldShopIsNumber) {
            previousShop.quantity = (Number(shopToAdd.quantity) + Number(previousShop.quantity)).toString();
        } else if (!shopToAddIsNumber && !shopToAddIsNumber) {
            previousShop.quantity = sumNumberInString(shopToAdd.quantity, previousShop.quantity);
        } else {
            // TODO to test
            console.error("Can't have one which can be a number and other which cannot be: ", shopToAdd, " ", previousShop);
            return false;
        }

        previousShop.recipesTitle = [...previousShop.recipesTitle, ...shopToAdd.recipesTitle];

        if (await this._shoppingListTable.editElementById(previousShop.id, new Map<string, number | string>([[shoppingListColumnsNames.quantity, previousShop.quantity], [shoppingListColumnsNames.recipeTitles, previousShop.recipesTitle.join(EncodingSeparator)]]), this._dbConnection)) {
            this.update_shopping(previousShop);
            return true;
        }
        return false;
    }

    public async purchaseIngredientOfShoppingList(ingredientId: number, newPurchasedValue: boolean) {

        if (await this._shoppingListTable.editElementById(ingredientId, new Map<string, number | string>([[shoppingListColumnsNames.purchased, newPurchasedValue.toString()]]), this._dbConnection)) {
            this.setPurchasedOfShopping(ingredientId, newPurchasedValue);
            return true;
        }
        return false;
    }

    public async addMultipleShopping(recipes: Array<recipeTableElement>) {
        for (const recEl of recipes) {
            //TODO single query
            await this.addRecipeToShopping(recEl)
        }
    }

    public searchRandomlyRecipes(numOfElements: number): Array<recipeTableElement> {
        if (this._recipes.length == 0) {
            console.error("RECIPE TABLE IS EMPTY, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT");
            return new Array<recipeTableElement>();
        } else {
            return fisherYatesShuffle(this._recipes, numOfElements);
        }
    }

    public searchRandomlyTags(numOfElements: number): Array<tagTableElement> {
        if (this._tags.length == 0) {
            console.error("NO TAGS PROVIDED, IMPOSSIBLE TO EXTRACT A NUMBER FROM IT");
            return new Array<tagTableElement>();
        } else {
            if (this._tags.length <= numOfElements) {
                console.log("Return directly the table because we want the same size");
                return this._tags;
            } else {
                // TODO can find a better random function
                // TODO this can be abstract in a function so that it is also used for other searchRandom
                let res = new Array<tagTableElement>();
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

    public async deleteRecipe(recipe: recipeTableElement): Promise<boolean> {
        let recipeDeleted: boolean;
        if (recipe.id !== undefined) {
            recipeDeleted = await this._recipesTable.deleteElementById(recipe.id, this._dbConnection);
        } else {
            recipeDeleted = await this._recipesTable.deleteElement(this._dbConnection, this.constructSearchRecipeStructure(recipe));
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
            ingredientDeleted = await this._ingredientsTable.deleteElementById(ingredient.id, this._dbConnection);
        } else {
            ingredientDeleted = await this._ingredientsTable.deleteElement(this._dbConnection, this.constructSearchIngredientStructure(ingredient));
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
            tagDeleted = await this._tagsTable.deleteElement(this._dbConnection, this.constructSearchTagStructure(tag));
        }
        if (tagDeleted) {
            this.remove_tag(tag);
        }
        return tagDeleted;
    }

    public get_recipes(): Array<recipeTableElement> {
        return this._recipes;
    }

    public isRecipeExist(recipeToSearch: recipeTableElement): boolean {
        return this.find_recipe(recipeToSearch) !== undefined;
    }

    public get_ingredients() {
        return this._ingredients;
    }

    public get_tags(): Array<tagTableElement> {
        return this._tags;
    }

    public get_shopping(): Array<shoppingListTableElement> {
        return this._shopping;
    }

    public add_recipes(recipe: recipeTableElement) {
        this._recipes.push(recipe);
    }

    public add_ingredients(ingredient: ingredientTableElement) {
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
            console.warn("remove_recipe: can't find recipe");
        }
    }

    public remove_ingredient(ingredient: ingredientTableElement) {
        const foundIngredient = this.find_ingredient(ingredient);
        if (foundIngredient !== undefined) {
            this._ingredients.splice(this._ingredients.indexOf(foundIngredient), 1);
        } else {
            console.warn("remove_ingredient: can't find ingredient");
        }
    }

    public remove_tag(tag: tagTableElement) {
        const foundTag = this.find_tag(tag);
        if (foundTag !== undefined) {
            this._tags.splice(this._tags.indexOf(foundTag), 1);
        } else {
            console.warn("remove_tag: can't find tag");
        }
    }

    public remove_shopping(shop: shoppingListTableElement) {
        const foundShopping = this.find_shopping(shop);
        if (foundShopping !== undefined) {
            this._shopping.splice(this._shopping.indexOf(foundShopping), 1);
        } else {
            console.warn("remove_shopping: can't find tag");
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
                console.warn("Can't find recipe with id ", updatedRecipe.id, " in the recipe table. Object is ", updatedRecipe);
            }
        }
    }

    public update_ingredient(newIngredient: ingredientTableElement) {
        const foundIngredient = this._ingredients.findIndex(ingredient => ingredient.id === newIngredient.id);
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
            console.error("setPurchasedOfShopping:: Element of shopping with id ", ingredientId, " is out of bound");
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
        console.error("update_shopping Element of shopping named ", shop.name, " doesn't exist already");
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
                            : ingredient.quantity
                    }));

                    updatedRecipes.push({
                        ...recipe,
                        persons: newDefaultPersons,
                        ingredients: updatedIngredients
                    });
                } else {
                    console.error(`Recipe with id ${recipe.id} and persons ${recipe.persons}, is invalid. Can't scale it.`);
                }
            }

            if (updatedRecipes.length > 0) {
                const batchUpdates = updatedRecipes.map(recipe => ({
                    id: recipe.id!,
                    elementToUpdate: this.constructUpdateRecipeStructure(this.encodeRecipe(recipe))
                }));

                const success = await this._recipesTable.batchUpdateElementsById(batchUpdates, this._dbConnection);

                if (success) {
                    this.update_multiple_recipes(updatedRecipes);
                }
            }
        } catch (error) {
            console.error('Error updating recipes for new default persons count:', error);
        }
    }

    public findSimilarRecipes(recipeToCompare: recipeTableElement): recipeTableElement[] {
        const ingredientTypesToIgnore: ingredientType[] = [ingredientType.condiment, ingredientType.oilAndFat];

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
                        quantityPerPerson: (ing.quantity && !isNaN(parseFloat(ing.quantity))) ? parseFloat(ing.quantity) / persons : undefined
                    } as coreIngredientElement
                }).filter(ing => ing.quantityPerPerson !== undefined)
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
            return this.areIngredientsSimilar(processedRecipeToCompareIngredients, processedExistingRecipeIngredients);
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

    public findSimilarTags(tagName: string): tagTableElement[] {
        if (!tagName || tagName.trim().length === 0) {
            return [];
        }

        const exactMatch = this._tags.find(tag => 
            tag.name.toLowerCase() === tagName.toLowerCase()
        );
        if (exactMatch) {
            return [exactMatch];
        }

        const fuse = new Fuse(this._tags, {
            keys: ['name'],
            threshold: 0.4,
            includeScore: true,
        });
        
        return fuse.search(tagName)
            .sort((a, b) => (a.score || 0) - (b.score || 0))
            .map(result => result.item);
    }

    protected constructUpdateRecipeStructure(encodedRecipe: encodedRecipeElement): Map<string, string | number> {
        return new Map<string, string | number>([[recipeColumnsNames.image, encodedRecipe.IMAGE_SOURCE], [recipeColumnsNames.title, encodedRecipe.TITLE], [recipeColumnsNames.description, encodedRecipe.DESCRIPTION], [recipeColumnsNames.tags, encodedRecipe.TAGS], [recipeColumnsNames.persons, encodedRecipe.PERSONS], [recipeColumnsNames.ingredients, encodedRecipe.INGREDIENTS], [recipeColumnsNames.preparation, encodedRecipe.PREPARATION], [recipeColumnsNames.time, encodedRecipe.TIME],]);
    }

    protected constructUpdateIngredientStructure(ingredient: ingredientTableElement): Map<string, string | number> {
        return new Map<string, string | number>([[ingredientsColumnsNames.ingredient, ingredient.name], [ingredientsColumnsNames.unit, ingredient.unit], [ingredientsColumnsNames.type, ingredient.type], [ingredientsColumnsNames.season, ingredient.season.join(EncodingSeparator)]]);
    }

    protected constructUpdateTagStructure(tag: tagTableElement): Map<string, string | number> {
        return new Map<string, string | number>([[tagsColumnsNames.name, tag.name]]);
    }

    /* PROTECTED METHODS */
    protected async openDatabase() {
        try {
            this._dbConnection = await SQLite.openDatabaseAsync(this._databaseName);
        } catch (error) {
            console.warn("ERROR during openDatabase : ", error);
        }
    };

    protected async deleteDatabase() {
        try {
            await this._dbConnection.closeAsync();
            await SQLite.deleteDatabaseAsync(this._databaseName);
            await this.reset();
        } catch (error: any) {
            console.warn('deleteDatabase : received error ', error);
        }
    }

    protected async verifyTagsExist(tags: Array<tagTableElement>): Promise<Array<tagTableElement>> {
        // TODO is it really useful to return a new Array ?
        // isn't it better to simply return eventually the array to push ?
        let result = new Array<tagTableElement>();
        for (const tag of tags) {
            const elemFound = this.find_tag(tag);
            if (elemFound) {
                result.push(elemFound)
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

    protected async verifyIngredientsExist(ingredients: Array<ingredientTableElement>): Promise<Array<ingredientTableElement>> {

        // TODO is it really useful to return a new Array ?
        // isn't it better to simply return eventually the array to push ?
        let result = new Array<ingredientTableElement>();
        let newIngredients = new Array<ingredientTableElement>();

        for (const ing of ingredients) {
            const elemFound = this.find_ingredient(ing);
            if (elemFound !== undefined) {
                elemFound.quantity = ing.quantity;
                result.push(elemFound)
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
                    console.log("User canceled adding ingredient");
                    break;
            }
        }
         */
        // TODO for now, just add the ingredients so that we can move on
        await this.addMultipleIngredients(newIngredients);
        result.push(...newIngredients);
        return result;

    }

    protected constructSearchRecipeStructure(recipe: recipeTableElement): Map<string, string | number> {
        return new Map<string, string | number>([[recipeColumnsNames.title, recipe.title], [recipeColumnsNames.description, recipe.description], [recipeColumnsNames.image, recipe.image_Source]]);
    }

    protected constructSearchIngredientStructure(ingredient: ingredientTableElement): Map<string, string | number> {
        return new Map<string, string>([[ingredientsColumnsNames.ingredient, ingredient.name], [ingredientsColumnsNames.unit, ingredient.unit], [ingredientsColumnsNames.type, ingredient.type]]);
    }

    protected constructSearchTagStructure(tag: tagTableElement): Map<string, string | number> {
        return new Map<string, string | number>([[tagsColumnsNames.name, tag.name]]);
    }

    protected encodeRecipe(recToEncode: recipeTableElement): encodedRecipeElement {
        return {
            ID: recToEncode.id ? recToEncode.id : 0,
            IMAGE_SOURCE: recToEncode.image_Source,
            TITLE: recToEncode.title,
            DESCRIPTION: recToEncode.description,
            TAGS: recToEncode.tags.map(tag => this.encodeTag(tag)).join(EncodingSeparator),
            PERSONS: recToEncode.persons,
            INGREDIENTS: recToEncode.ingredients.map(ing => this.encodeIngredient(ing)).join(EncodingSeparator),
            PREPARATION: recToEncode.preparation.join(EncodingSeparator),
            TIME: recToEncode.time,
        };
    }

    protected async decodeRecipe(encodedRecipe: encodedRecipeElement): Promise<recipeTableElement> {
        const [decodedIngredients, decodedSeason] = await this.decodeIngredientFromRecipe(encodedRecipe.INGREDIENTS);
        return {
            id: encodedRecipe.ID,
            image_Source: FileGestion.getInstance().get_directoryUri() + encodedRecipe.IMAGE_SOURCE,
            title: encodedRecipe.TITLE,
            description: encodedRecipe.DESCRIPTION,
            tags: await this.decodeTagFromRecipe(encodedRecipe.TAGS),
            persons: encodedRecipe.PERSONS,
            ingredients: decodedIngredients,
            season: decodedSeason,
            preparation: encodedRecipe.PREPARATION.split(EncodingSeparator),
            time: encodedRecipe.TIME,
        };
    }

    protected async decodeArrayOfRecipe(queryResult: Array<encodedRecipeElement>): Promise<Array<recipeTableElement>> {
        const returnRecipes = new Array<recipeTableElement>();
        if (queryResult.length > 0) {
            for (const recipeEncoded of queryResult) {
                returnRecipes.push(await this.decodeRecipe(recipeEncoded))
            }
        }
        return returnRecipes;
    }

    protected encodeIngredient(ingredientToEncode: ingredientTableElement): string {
        // To encode : ID--quantity
        const quantity = (ingredientToEncode.quantity ? ingredientToEncode.quantity.toString() : "");
        let idForEncoding: number;
        if (ingredientToEncode.id === undefined) {
            const foundIngredient = this.find_ingredient(ingredientToEncode);
            if (foundIngredient == undefined || foundIngredient.id == undefined) {
                console.warn('ERROR : ingredient not found');
                return "";
            } else {
                idForEncoding = foundIngredient.id;
            }
        } else {
            idForEncoding = ingredientToEncode.id;
        }
        return idForEncoding + textSeparator + quantity;
    }

    protected async decodeIngredientFromRecipe(encodedIngredient: string): Promise<[Array<ingredientTableElement>, Array<string>]> {
        const arrDecoded = new Array<ingredientTableElement>();
        let recipeSeason = new Array<string>('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');
        let firstSeasonFound = true;

        // Ex : 1--250__2--100__3--0.5__4--200__5--1__6--250
        const ingSplit = encodedIngredient.includes(EncodingSeparator) ? encodedIngredient.split(EncodingSeparator) : new Array<string>(encodedIngredient);

        for (const ingredient of ingSplit) {
            const id = Number(ingredient.split(textSeparator)[0]);
            const ingQuantity = ingredient.split(textSeparator)[1];

            const tableIngredient = await this._ingredientsTable.searchElementById<encodedIngredientElement>(id, this._dbConnection);
            if (tableIngredient === undefined) {
                console.warn("decodeIngredientFromRecipe: Searching for ingredient at id ", id, " didn't worked");
            } else {
                let decodedIngredient = this.decodeIngredient(tableIngredient);
                decodedIngredient.quantity = ingQuantity;
                arrDecoded.push(decodedIngredient);

                // In case of *, nothing to do
                if (!decodedIngredient.season.includes("*")) {
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

    protected decodeIngredient(dbIngredient: encodedIngredientElement): ingredientTableElement {

        // Ex :  {"ID":1,"INGREDIENT":"INGREDIENT NAME","UNIT":"g", "TYPE":"BASE", "SEASON":"*"}
        return {
            id: dbIngredient.ID,
            name: dbIngredient.INGREDIENT,
            unit: dbIngredient.UNIT,
            type: dbIngredient.TYPE as ingredientType,
            season: dbIngredient.SEASON.split(EncodingSeparator),
        };
    }

    protected decodeArrayOfIngredients(queryResult: Array<encodedIngredientElement>): Array<ingredientTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<ingredientTableElement>
        }
        return queryResult.map(ingredient => this.decodeIngredient(ingredient));
    }

    protected decodeSeason(previousSeason: Array<string>, ingredientSeason: Array<string>): Array<string> {
        return previousSeason.filter(month => ingredientSeason.includes(month));
    }

    protected encodeTag(tag: tagTableElement): string {
        if (tag.id === undefined) {
            const foundedTag = this.find_tag(tag);
            if (foundedTag && foundedTag.id) {
                return foundedTag.id.toString();
            } else {
                return "ERROR : tag not found";
            }
        } else {
            return tag.id.toString();
        }
    }

    protected async decodeTagFromRecipe(encodedTag: string): Promise<Array<tagTableElement>> {
        const arrDecoded = new Array<tagTableElement>();

        // Ex : "1__2__5__3__4"
        const tagSplit = encodedTag.includes(EncodingSeparator) ? encodedTag.split(EncodingSeparator) : new Array<string>(encodedTag);

        for (const tag of tagSplit) {
            const tableTag = await this._tagsTable.searchElementById<encodedTagElement>(+tag, this._dbConnection);
            if (tableTag !== undefined) {
                arrDecoded.push(this.decodeTag(tableTag));
            } else {
                console.warn("decodeTagFromRecipe: Searching for tag ", +tag, " didn't worked")
            }
        }

        return arrDecoded;
    }

    protected decodeTag(dbTag: encodedTagElement): tagTableElement {
        // Ex : {"ID":4,"NAME":"TAG NAME"}
        return {id: dbTag.ID, name: dbTag.NAME};
    }

    protected decodeArrayOfTags(queryResult: Array<encodedTagElement>): Array<tagTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<tagTableElement>();
        }
        return queryResult.map(tagFound => this.decodeTag(tagFound));
    }

    protected encodeShopping(shopToEncode: shoppingListTableElement): encodedShoppingListElement {
        return {
            ID: shopToEncode.id ? shopToEncode.id : 0,
            TYPE: shopToEncode.type as string,
            INGREDIENT: shopToEncode.name,
            QUANTITY: shopToEncode.quantity,
            UNIT: shopToEncode.unit,
            TITLES: shopToEncode.recipesTitle.join(EncodingSeparator),
            PURCHASED: shopToEncode.purchased ? 1 : 0,
        }
    }

    protected decodeShopping(encodedShop: encodedShoppingListElement): shoppingListTableElement {
        return {
            id: encodedShop.ID,
            type: encodedShop.TYPE as TListFilter,
            name: encodedShop.INGREDIENT,
            quantity: encodedShop.QUANTITY.toString(),
            unit: encodedShop.UNIT,
            recipesTitle: encodedShop.TITLES.includes(EncodingSeparator) ? encodedShop.TITLES.split(EncodingSeparator) : new Array<string>(encodedShop.TITLES),
            purchased: encodedShop.PURCHASED == 0 ? false : true,
        };
    }

    protected decodeArrayOfShopping(queryResult: Array<encodedShoppingListElement>): Array<shoppingListTableElement> {
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length == 0) {
            return new Array<shoppingListTableElement>()
        }
        return queryResult.map(shoppingElement => this.decodeShopping(shoppingElement));
    }

    protected async getAllRecipes(): Promise<Array<recipeTableElement>> {
        return await this.decodeArrayOfRecipe(await this._recipesTable.searchElement(this._dbConnection) as Array<encodedRecipeElement>)
    }

    protected async getAllTags(): Promise<Array<tagTableElement>> {
        return this.decodeArrayOfTags(await this._tagsTable.searchElement(this._dbConnection) as Array<encodedTagElement>)
    }

    protected async getAllIngredients(): Promise<Array<ingredientTableElement>> {
        return this.decodeArrayOfIngredients(await this._ingredientsTable.searchElement(this._dbConnection) as Array<encodedIngredientElement>)
    }

    protected async getAllShopping(): Promise<Array<shoppingListTableElement>> {
        return this.decodeArrayOfShopping(await this._shoppingListTable.searchElement(this._dbConnection) as Array<encodedShoppingListElement>)
    }

    protected async addShoppingList(shop: shoppingListTableElement) {

        const dbRes = await this._shoppingListTable.insertElement(this.encodeShopping(shop), this._dbConnection);
        if (dbRes === undefined) {
            console.warn("addShoppingList: Can't add the shopping because insertion in the database didn't worked")
            return;
        }
        const dbShopping = await this._shoppingListTable.searchElementById<encodedShoppingListElement>(dbRes, this._dbConnection)
        if (dbShopping === undefined) {
            console.warn("addRecipe: Searching for recipe  ", shop.recipesTitle, " didn't worked")
        } else {
            this.add_shopping(this.decodeShopping(dbShopping));
        }
    }

    protected async removeRecipeFromShopping(recipe: recipeTableElement) {
        const editedShopping = new Set<string>;
        const deletedShopping = new Set<string>;


        for (const shop of this._shopping) {
            if (shop.recipesTitle.includes(recipe.title)) {
                const recipeIng = recipe.ingredients.find((ingredient) => ingredient.name === shop.name);
                if (recipeIng === undefined) {
                    console.warn("removeRecipeFromShopping: Error can't find ingredient in recipe");
                } else if (recipeIng.quantity === undefined) {
                    console.warn("removeRecipeFromShopping: Error can't find quantity in ingredient");
                } else {
                    shop.quantity = subtractNumberInString(recipeIng.quantity, shop.quantity);

                    if ((isNumber(shop.quantity) && Number(shop.quantity) <= 0) || shop.quantity.length === 0) {
                        deletedShopping.add(recipeIng.name);
                    } else {
                        editedShopping.add(recipeIng.name);
                    }
                }
            }
        }
        for (const nameToEdit of editedShopping) {
            const currentShopping = this._shopping.find(shop => shop.name
                === nameToEdit) as shoppingListTableElement;

            const editMap = new Map<string, number | string>([[shoppingListColumnsNames.quantity, currentShopping.quantity], [shoppingListColumnsNames.recipeTitles, currentShopping.recipesTitle.join(EncodingSeparator)]]);
            if (currentShopping.id !== undefined) {
                await this._shoppingListTable.editElementById(currentShopping.id, editMap, this._dbConnection);
            } else {
                const foundShopping = await this._shoppingListTable.searchElement<encodedShoppingListElement>(this._dbConnection, new Map<string, string>([[shoppingListColumnsNames.ingredient, currentShopping.name]])) as encodedShoppingListElement;
                await this._shoppingListTable.editElementById(foundShopping.ID, editMap, this._dbConnection);
            }
            currentShopping.recipesTitle.splice(currentShopping.recipesTitle.indexOf(recipe.title), 1);
        }
        for (const nameToDelete of deletedShopping) {
            const currentShopping = this._shopping.find(shop => shop.name
                === nameToDelete) as shoppingListTableElement;

            if (currentShopping.id !== undefined) {
                await this._shoppingListTable.deleteElementById(currentShopping.id, this._dbConnection);
            } else {
                await this._shoppingListTable.deleteElement(this._dbConnection, new Map<string, string>([[shoppingListColumnsNames.ingredient, nameToDelete]]));
            }
            this._shopping.splice(this._shopping.findIndex(shop => shop.name === nameToDelete), 1);
        }
    }

    private areIngredientsSimilar(ingredients1: coreIngredientElement[], ingredients2: coreIngredientElement[]): boolean {
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

/**
 * Shuffles the data array using the Fisher-Yates algorithm.
 * @param arrayToShuffle
 * @param numberOfElementsWanted
 */
// TODO to be placed at a better place ?
export function fisherYatesShuffle<T>(arrayToShuffle: Array<T>, numberOfElementsWanted?: number): Array<T> {
    const shuffled = [...arrayToShuffle]; // Create a copy to avoid mutating the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    if (numberOfElementsWanted === undefined || numberOfElementsWanted === 0 || numberOfElementsWanted >= arrayToShuffle.length) {
        return shuffled
    } else {
        return shuffled.slice(0, numberOfElementsWanted);
    }
}
