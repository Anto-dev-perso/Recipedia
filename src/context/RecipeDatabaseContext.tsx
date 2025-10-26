/**
 * RecipeDatabaseContext - React Context for reactive database operations
 *
 * Provides a reactive wrapper around the RecipeDatabase singleton, enabling
 * automatic component re-renders when database state changes. Eliminates the
 * need for manual useFocusEffect workarounds and direct getInstance() calls.
 *
 * Key Features:
 * - Reactive state management for recipes, ingredients, tags, and shopping
 * - Automatic re-renders when database changes occur
 * - Smart update logic: edits/deletes on ingredients/tags trigger recipe refresh
 * - Exposes all essential RecipeDatabase methods through hook interface
 * - Type-safe with full TypeScript support
 * - Testable with thin mock that uses real database operations
 *
 * Architecture:
 * - Provider wraps the app and maintains reactive state
 * - Hook provides access to state and database operations
 * - All operations automatically trigger appropriate state refreshes
 * - No manual refresh functions needed
 *
 * Smart Update Logic:
 * - Add ingredient/tag: Refreshes only that collection (new items don't affect existing recipes)
 * - Edit ingredient/tag: Refreshes both collection AND recipes (existing recipes reference them)
 * - Delete ingredient/tag: Refreshes both collection AND recipes (recipes might reference them)
 * - Recipe operations: Always refresh recipes
 * - Shopping operations: Always refresh shopping list
 *
 * @example
 * ```typescript
 * // In App.tsx - wrap the entire app
 * <RecipeDatabaseProvider>
 *   <YourApp />
 * </RecipeDatabaseProvider>
 *
 * // In any component - use the hook
 * function MyComponent() {
 *   const { recipes, addRecipe, editRecipe } = useRecipeDatabase();
 *
 *   // State automatically updates when database changes
 *   return <RecipeList recipes={recipes} />;
 * }
 * ```
 */

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RecipeDatabase } from '@utils/RecipeDatabase';
import {
  ingredientTableElement,
  ingredientType,
  recipeTableElement,
  shoppingListTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';

/**
 * Type definition for the RecipeDatabase context value
 *
 * Provides access to reactive database state and all database operations.
 * All mutation methods automatically trigger appropriate state refreshes.
 */
interface RecipeDatabaseContextType {
  /** Current recipes state - reactive, triggers re-renders when changed */
  recipes: recipeTableElement[];
  /** Adds recipe to database and refreshes recipes state */
  addRecipe: (recipe: recipeTableElement) => Promise<void>;
  /** Edits recipe in database and refreshes recipes state */
  editRecipe: (recipe: recipeTableElement) => Promise<boolean>;
  /** Deletes recipe from database and refreshes recipes state */
  deleteRecipe: (recipe: recipeTableElement) => Promise<boolean>;

  /** Current ingredients state - reactive, triggers re-renders when changed */
  ingredients: ingredientTableElement[];
  /** Adds ingredient to database and refreshes ingredients state (not recipes) */
  addIngredient: (
    ingredient: ingredientTableElement
  ) => Promise<ingredientTableElement | undefined>;
  /** Edits ingredient in database and refreshes both ingredients AND recipes state */
  editIngredient: (ingredient: ingredientTableElement) => Promise<boolean>;
  /** Deletes ingredient from database and refreshes both ingredients AND recipes state */
  deleteIngredient: (ingredient: ingredientTableElement) => Promise<boolean>;

  /** Current tags state - reactive, triggers re-renders when changed */
  tags: tagTableElement[];
  /** Adds tag to database and refreshes tags state (not recipes) */
  addTag: (tag: tagTableElement) => Promise<void>;
  /** Edits tag in database and refreshes both tags AND recipes state */
  editTag: (tag: tagTableElement) => Promise<boolean>;
  /** Deletes tag from database and refreshes both tags AND recipes state */
  deleteTag: (tag: tagTableElement) => Promise<boolean>;

  /** Current shopping list state - reactive, triggers re-renders when changed */
  shopping: shoppingListTableElement[];
  /** Adds recipe ingredients to shopping list and refreshes shopping state */
  addRecipeToShopping: (recipe: recipeTableElement) => Promise<void>;
  /** Updates purchase status of ingredient in shopping list and refreshes shopping state */
  purchaseIngredientInShoppingList: (ingredientId: number, purchased: boolean) => Promise<void>;
  /** Clears entire shopping list and refreshes shopping state */
  clearShoppingList: () => Promise<void>;

  /** Finds recipes similar to the given recipe using fuzzy matching */
  findSimilarRecipes: (recipe: recipeTableElement) => recipeTableElement[];
  /** Finds ingredients similar to the given name using fuzzy matching */
  findSimilarIngredients: (ingredientName: string) => ingredientTableElement[];
  /** Finds tags similar to the given name using fuzzy matching */
  findSimilarTags: (tagName: string) => tagTableElement[];

  /** Returns random ingredients of specified type */
  getRandomIngredients: (type: ingredientType, count: number) => ingredientTableElement[];
  /** Returns random tags */
  getRandomTags: (count: number) => tagTableElement[];
  /** Returns random tags (legacy method) */
  searchRandomlyTags: (count: number) => tagTableElement[];

  /** Scales all recipes to new default persons count and refreshes recipes state */
  scaleAllRecipesForNewDefaultPersons: (newDefaultPersons: number) => Promise<void>;

  /** Checks if database is empty (for first launch detection) */
  isDatabaseEmpty: () => boolean;
  /** Adds multiple ingredients to database and refreshes ingredients state */
  addMultipleIngredients: (ingredients: ingredientTableElement[]) => Promise<void>;
  /** Adds multiple tags to database and refreshes tags state */
  addMultipleTags: (tags: tagTableElement[]) => Promise<void>;
  /** Adds multiple recipes to database and refreshes recipes state */
  addMultipleRecipes: (recipes: recipeTableElement[]) => Promise<void>;
}

const RecipeDatabaseContext = createContext<RecipeDatabaseContextType | undefined>(undefined);

/**
 * RecipeDatabaseProvider - Context provider for reactive database access
 *
 * Wraps the application (or part of it) to provide reactive database state
 * and operations to all child components. Should be placed near the root of
 * the component tree, after DarkModeProvider but before NavigationContainer.
 *
 * Responsibilities:
 * - Initializes reactive state from RecipeDatabase singleton
 * - Wraps all database methods with state refresh logic
 * - Provides context value to all child components via useRecipeDatabase hook
 *
 * @param children - Child components that will have access to the database context
 *
 * @example
 * ```typescript
 * // In App.tsx
 * <RecipeDatabaseProvider>
 *   <DefaultPersonsProvider>
 *     <SeasonFilterProvider>
 *       <DarkModeContext.Provider value={{...}}>
 *         <NavigationContainer>
 *           <AppWrapper />
 *         </NavigationContainer>
 *       </DarkModeContext.Provider>
 *     </SeasonFilterProvider>
 *   </DefaultPersonsProvider>
 * </RecipeDatabaseProvider>
 * ```
 */
export const RecipeDatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const db = RecipeDatabase.getInstance();

  const [recipes, setRecipes] = useState<recipeTableElement[]>([]);
  const [ingredients, setIngredients] = useState<ingredientTableElement[]>([]);
  const [tags, setTags] = useState<tagTableElement[]>([]);
  const [shopping, setShopping] = useState<shoppingListTableElement[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      await db.init();
      setRecipes([...db.get_recipes()]);
      setIngredients([...db.get_ingredients()]);
      setTags([...db.get_tags()]);
      setShopping([...db.get_shopping()]);
      setIsInitialized(true);
    };
    initializeDatabase();
  }, []);

  const refreshRecipes = () => {
    setRecipes([...db.get_recipes()]);
  };

  const refreshIngredients = () => {
    setIngredients([...db.get_ingredients()]);
  };

  const refreshTags = () => {
    setTags([...db.get_tags()]);
  };

  const refreshShopping = () => {
    setShopping([...db.get_shopping()]);
  };

  const addRecipe = async (recipe: recipeTableElement): Promise<void> => {
    await db.addRecipe(recipe);
    refreshRecipes();
  };

  const editRecipe = async (recipe: recipeTableElement) => {
    const result = await db.editRecipe(recipe);
    refreshRecipes();
    return result;
  };

  const deleteRecipe = async (recipe: recipeTableElement) => {
    const result = await db.deleteRecipe(recipe);
    refreshRecipes();
    return result;
  };

  const addIngredient = async (ingredient: ingredientTableElement) => {
    const result = await db.addIngredient(ingredient);
    refreshIngredients();
    return result;
  };

  const editIngredient = async (ingredient: ingredientTableElement) => {
    const result = await db.editIngredient(ingredient);
    refreshIngredients();
    refreshRecipes();
    return result;
  };

  const deleteIngredient = async (ingredient: ingredientTableElement) => {
    const result = await db.deleteIngredient(ingredient);
    refreshIngredients();
    refreshRecipes();
    return result;
  };

  const addTag = async (tag: tagTableElement): Promise<void> => {
    await db.addTag(tag);
    refreshTags();
  };

  const editTag = async (tag: tagTableElement) => {
    const result = await db.editTag(tag);
    refreshTags();
    refreshRecipes();
    return result;
  };

  const deleteTag = async (tag: tagTableElement) => {
    const result = await db.deleteTag(tag);
    refreshTags();
    refreshRecipes();
    return result;
  };

  const addRecipeToShopping = async (recipe: recipeTableElement) => {
    await db.addRecipeToShopping(recipe);
    refreshShopping();
  };

  const purchaseIngredientInShoppingList = async (ingredientId: number, purchased: boolean) => {
    await db.purchaseIngredientOfShoppingList(ingredientId, purchased);
    refreshShopping();
  };

  const clearShoppingList = async () => {
    await db.resetShoppingList();
    refreshShopping();
  };

  const findSimilarRecipes = (recipe: recipeTableElement) => {
    return db.findSimilarRecipes(recipe);
  };

  const findSimilarIngredients = (ingredientName: string) => {
    return db.findSimilarIngredients(ingredientName);
  };

  const findSimilarTags = (tagName: string) => {
    return db.findSimilarTags(tagName);
  };

  const getRandomIngredients = (type: ingredientType, count: number) => {
    return db.getRandomIngredientsByType(type, count);
  };

  const getRandomTags = (count: number) => {
    return db.getRandomTags(count);
  };

  const searchRandomlyTags = (count: number) => {
    return db.searchRandomlyTags(count);
  };

  const scaleAllRecipesForNewDefaultPersons = async (newDefaultPersons: number) => {
    await db.scaleAllRecipesForNewDefaultPersons(newDefaultPersons);
    refreshRecipes();
  };

  const isDatabaseEmpty = () => {
    return db.isDatabaseEmpty();
  };

  const addMultipleIngredients = async (ingredients: ingredientTableElement[]) => {
    await db.addMultipleIngredients(ingredients);
    refreshIngredients();
  };

  const addMultipleTags = async (tags: tagTableElement[]) => {
    await db.addMultipleTags(tags);
    refreshTags();
  };

  const addMultipleRecipes = async (recipes: recipeTableElement[]) => {
    await db.addMultipleRecipes(recipes);
    refreshRecipes();
  };

  const contextValue: RecipeDatabaseContextType = {
    recipes,
    addRecipe,
    editRecipe,
    deleteRecipe,
    ingredients,
    addIngredient,
    editIngredient,
    deleteIngredient,
    tags,
    addTag,
    editTag,
    deleteTag,
    shopping,
    addRecipeToShopping,
    purchaseIngredientInShoppingList,
    clearShoppingList,
    findSimilarRecipes,
    findSimilarIngredients,
    findSimilarTags,
    getRandomIngredients,
    getRandomTags,
    searchRandomlyTags,
    scaleAllRecipesForNewDefaultPersons,
    isDatabaseEmpty,
    addMultipleIngredients,
    addMultipleTags,
    addMultipleRecipes,
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <RecipeDatabaseContext.Provider value={contextValue}>{children}</RecipeDatabaseContext.Provider>
  );
};

/**
 * useRecipeDatabase - React hook for accessing reactive database state and operations
 *
 * Provides access to reactive database state and all database operations.
 * Components using this hook will automatically re-render when database state changes.
 *
 * Must be used within a RecipeDatabaseProvider component tree.
 *
 * @returns RecipeDatabaseContextType object containing:
 *   - Reactive state: recipes, ingredients, tags, shopping (direct state access)
 *   - CRUD operations: add*, edit*, delete* for recipes/ingredients/tags
 *   - Shopping operations: addRecipeToShopping, purchaseIngredientInShoppingList, clearShoppingList
 *   - Utility functions: findSimilar*, getRandom*, scaleAllRecipesForNewDefaultPersons
 *
 * @throws Error if used outside RecipeDatabaseProvider
 *
 * @example
 * ```typescript
 * function RecipeList() {
 *   const { recipes, addRecipe, deleteRecipe } = useRecipeDatabase();
 *
 *   // Component automatically re-renders when recipes state changes
 *   return (
 *     <FlatList
 *       data={recipes}
 *       renderItem={({item}) => <RecipeCard recipe={item} />}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * function AddRecipeButton() {
 *   const { addRecipe } = useRecipeDatabase();
 *
 *   const handleAdd = async () => {
 *     await addRecipe(newRecipe);
 *     // All components using useRecipeDatabase will automatically update
 *   };
 *
 *   return <Button onPress={handleAdd}>Add Recipe</Button>;
 * }
 * ```
 */
export const useRecipeDatabase = (): RecipeDatabaseContextType => {
  const context = useContext(RecipeDatabaseContext);
  if (context === undefined) {
    throw new Error('useRecipeDatabase must be used within a RecipeDatabaseProvider');
  }
  return context;
};
