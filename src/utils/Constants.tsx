/**
 * Constants - Application-wide constants and default values
 *
 * This module defines constant values used throughout the Recipedia app.
 * Includes default values for data initialization and asset references
 * for the initial recipe collection.
 *
 * Key Features:
 * - Default numeric values for form inputs and data initialization
 * - Initial recipe image assets for app demonstration
 * - Centralized constant management for easy maintenance
 * - Type-safe constant definitions
 *
 * Initial Recipe Collection:
 * - Curated set of popular international recipes
 * - High-quality recipe images for demonstration
 * - Diverse cuisine representation for user onboarding
 * - Pre-loaded content for immediate app functionality
 *
 * @example
 * ```typescript
 * import { defaultValueNumber, initialRecipesImages } from '@utils/Constants';
 *
 * // Using default values in forms
 * const [servings, setServings] = useState(defaultValueNumber);
 *
 * // Accessing initial recipe images
 * const recipeImage = initialRecipesImages[0]; // spaghetti_bolognese.png
 *
 * // Using in recipe initialization
 * const newRecipe = {
 *   id: generateId(),
 *   servings: defaultValueNumber,
 *   image: initialRecipesImages[Math.floor(Math.random() * initialRecipesImages.length)],
 *   // ... other recipe properties
 * };
 * ```
 */

/** Default numeric value used for form inputs and data initialization */
export const defaultValueNumber = -1;

/** Interval between demo actions during tutorial (in milliseconds) */
export const TUTORIAL_DEMO_INTERVAL = 1500;

/**
 * Array of initial recipe images for app demonstration and onboarding
 * Contains require() statements for bundled image assets representing
 * a diverse collection of popular international recipes
 */
export const initialRecipesImages = [
  require('../assets/images/spaghetti_bolognese.png'),
  require('../assets/images/taco_shell.png'),
  require('../assets/images/classic_pancakes.png'),
  require('../assets/images/caesar_salad.png'),
  require('../assets/images/margherita_pizza.png'),
  require('../assets/images/vegetable_soup.png'),
  require('../assets/images/chocolate_cake.png'),
  require('../assets/images/pesto_pasta.png'),
  require('../assets/images/sushi_rolls.png'),
  require('../assets/images/lentil_curry.png'),
];
