/**
 * Recipe - Comprehensive recipe management screen with multi-modal interactions
 *
 * The central recipe screen supporting four distinct modes: read-only viewing, editing,
 * manual creation, and OCR-assisted creation from images. Features dynamic UI adaptation,
 * intelligent ingredient/tag validation, automatic scaling, and comprehensive CRUD operations.
 *
 * Key Features:
 * - Four interaction modes: read-only, edit, manual add, OCR add
 * - Dynamic UI adaptation based on current mode and data state
 * - OCR integration for extracting recipe data from images
 * - Intelligent ingredient and tag similarity matching
 * - Automatic quantity scaling based on serving count changes
 * - Comprehensive validation with user-friendly error messages
 * - File management integration for image handling
 * - Shopping list integration for recipe ingredients
 * - Real-time data synchronization with database
 *
 * Architecture:
 * - State-driven component rendering with mode-specific props
 * - Modular prop generation functions for clean separation
 * - Comprehensive error handling and user feedback
 * - Performance optimization with efficient re-renders
 * - Type-safe discriminated unions for different modes
 *
 * OCR Integration:
 * - Field-specific OCR extraction (title, ingredients, steps, etc.)
 * - Image cropping and preprocessing
 * - Intelligent data parsing and validation
 * - Fallback to manual input when OCR fails
 *
 * Data Management:
 * - Real-time ingredient quantity scaling
 * - Duplicate detection and prevention
 * - Similarity matching for tags and ingredients
 * - Comprehensive validation before database operations
 *
 * @example
 * ```typescript
 * // Navigation to different recipe modes
 *
 * // Read-only mode for viewing existing recipes
 * navigation.navigate('Recipe', {
 *   mode: 'readOnly',
 *   recipe: existingRecipe
 * });
 *
 * // Edit mode for modifying existing recipes
 * navigation.navigate('Recipe', {
 *   mode: 'edit',
 *   recipe: recipeToEdit
 * });
 *
 * // Manual creation mode
 * navigation.navigate('Recipe', {
 *   mode: 'addManually'
 * });
 *
 * // OCR-assisted creation from image
 * navigation.navigate('Recipe', {
 *   mode: 'addFromPic',
 *   imgUri: capturedImageUri
 * });
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { RecipeScreenProp } from '@customTypes/ScreenTypes';
import {
  extractIngredientsNameWithQuantity,
  extractTagsName,
  ingredientTableElement,
  ingredientType,
  isRecipeEqual,
  nutritionTableElement,
  preparationStepElement,
  recipeColumnsNames,
  recipeTableElement,
  tagTableElement,
} from '@customTypes/DatabaseElementTypes';
import BottomTopButton from '@components/molecules/BottomTopButton';
import { SafeAreaView, ScrollView, View } from 'react-native';
import {
  BottomTopButtonOffset,
  bottomTopPosition,
  LargeButtonDiameter,
  rectangleButtonHeight,
} from '@styles/buttons';
import { scrollView } from '@styles/spacing';
import RecipeImage, { RecipeImageProps } from '@components/organisms/RecipeImage';
import { Icons } from '@assets/Icons';
import RecipeTextRender, { RecipeTextRenderProps } from '@components/organisms/RecipeTextRender';
import RecipeText, { RecipeTextProps, TextProp } from '@components/organisms/RecipeText';
import { textSeparator, typoRender, unitySeparator } from '@styles/typography';
import RecipeTags, { RecipeTagProps } from '@components/organisms/RecipeTags';
import FileGestion from '@utils/FileGestion';
import { useRecipeDatabase } from '@context/RecipeDatabaseContext';
import RectangleButton from '@components/atomic/RectangleButton';
import RoundButton from '@components/atomic/RoundButton';
import { extractFieldFromImage } from '@utils/OCR';
import RecipeNumber, { RecipeNumberProps } from '@components/organisms/RecipeNumber';
import { defaultValueNumber } from '@utils/Constants';
import { useTheme } from 'react-native-paper';
import ModalImageSelect from '@screens/ModalImageSelect';
import { cropImage } from '@utils/ImagePicker';
import { useI18n } from '@utils/i18n';
import Alert, { AlertProps } from '@components/dialogs/Alert';
import { getDefaultPersons } from '@utils/settings';
import { scaleQuantityForPersons } from '@utils/Quantity';
import SimilarityDialog, { SimilarityDialogProps } from '@components/dialogs/SimilarityDialog';
import RecipeNutrition, { RecipeNutritionProps } from '@components/organisms/RecipeNutrition';
import { ocrLogger, recipeLogger, validationLogger } from '@utils/logger';

/** Enum defining the four possible recipe interaction modes */
export enum recipeStateType {
  readOnly,
  edit,
  addManual,
  addOCR,
}

// Export enum values for external use - keeping for API compatibility
export const recipeStates = {
  readOnly: recipeStateType.readOnly,
  edit: recipeStateType.edit,
  addManual: recipeStateType.addManual,
  addOCR: recipeStateType.addOCR,
};

/** Props for read-only recipe viewing */
export type readRecipe = { mode: 'readOnly'; recipe: recipeTableElement };

/** Props for editing existing recipes */
export type editRecipeManually = { mode: 'edit'; recipe: recipeTableElement };

/** Props for manual recipe creation */
export type addRecipeManually = { mode: 'addManually' };

/** Props for OCR-assisted recipe creation from image */
export type addRecipeFromPicture = { mode: 'addFromPic'; imgUri: string };

/** Union type for all possible recipe screen configurations */
export type RecipePropType =
  | readRecipe
  | editRecipeManually
  | addRecipeManually
  | addRecipeFromPicture;

type SimilarityDialogPropsPicked = Pick<SimilarityDialogProps, 'isVisible' | 'item'>;
const defaultSimilarityDialogPropsPicked: SimilarityDialogPropsPicked = {
  isVisible: false,
  item: {
    type: 'Tag',
    newItemName: '',
    onConfirm: _tag => {
      throw new Error(
        `onConfirm callback calls on default prop (${_tag}). This should not be possible`
      );
    },
  },
};

type ValidationDialogProps = Pick<
  AlertProps,
  'title' | 'content' | 'confirmText' | 'cancelText' | 'onConfirm' | 'onCancel'
>;
const defaultValidationDialogProp: ValidationDialogProps = {
  title: '',
  content: '',
  confirmText: '',
  onConfirm: undefined,
  onCancel: undefined,
};

/**
 * Recipe screen component - Comprehensive recipe management with multi-modal support
 *
 * @param props - Navigation props containing route parameters and navigation functions
 * @returns JSX element representing the recipe management screen
 */
export function Recipe({ route, navigation }: RecipeScreenProp) {
  const { t } = useI18n();

  const { colors } = useTheme();

  const {
    addRecipe,
    editRecipe,
    deleteRecipe,
    addRecipeToShopping,
    findSimilarRecipes,
    findSimilarIngredients,
    findSimilarTags,
    searchRandomlyTags,
  } = useRecipeDatabase();

  const recipeTestId = 'Recipe';

  const props: RecipePropType = route.params;
  const initStateFromProp = props.mode === 'readOnly' || props.mode === 'edit';

  const [stackMode, setStackMode] = useState(convertModeFromProps());
  const [recipeImage, setRecipeImage] = useState(
    initStateFromProp ? props.recipe.image_Source : ''
  );
  const [recipeTitle, setRecipeTitle] = useState(initStateFromProp ? props.recipe.title : '');
  const [recipeDescription, setRecipeDescription] = useState(
    initStateFromProp ? props.recipe.description : ''
  );
  const [recipeTags, setRecipeTags] = useState(
    initStateFromProp ? props.recipe.tags : new Array<tagTableElement>()
  );
  const [recipePersons, setRecipePersons] = useState(
    initStateFromProp ? props.recipe.persons : defaultValueNumber
  );
  const [recipeIngredients, setRecipeIngredients] = useState(
    initStateFromProp ? props.recipe.ingredients : new Array<ingredientTableElement>()
  );
  const [recipePreparation, setRecipePreparation] = useState(
    initStateFromProp ? props.recipe.preparation : new Array<preparationStepElement>()
  );
  const [recipeTime, setRecipeTime] = useState(
    initStateFromProp ? props.recipe.time : defaultValueNumber
  );
  const [recipeNutrition, setRecipeNutrition] = useState(
    initStateFromProp ? props.recipe.nutrition : undefined
  );
  const [imgForOCR, setImgForOCR] = useState(
    props.mode === 'addFromPic' ? new Array<string>(props.imgUri) : new Array<string>()
  );
  const [randomTags] = useState(searchRandomlyTags(3).map(element => element.name));

  const [validationButtonText, validationFunction] = recipeValidationButtonProps();

  const [modalField, setModalField] = useState<recipeColumnsNames | undefined>(undefined);

  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false);
  const [validationDialogProp, setValidationDialogProp] = useState(defaultValidationDialogProp);

  const [similarityDialog, setSimilarityDialog] = useState<SimilarityDialogPropsPicked>(
    defaultSimilarityDialogPropsPicked
  );

  const previousPersonsRef = useRef<number>(recipePersons);

  useEffect(() => {
    const loadDefaultPersons = async () => {
      if (!initStateFromProp) {
        const defaultPersons = await getDefaultPersons();
        setRecipePersons(defaultPersons);
      }
    };

    loadDefaultPersons();
  }, [initStateFromProp]);

  useEffect(() => {
    const previousPersons = previousPersonsRef.current;
    const nextPersons = recipePersons;
    if (
      previousPersons !== defaultValueNumber &&
      nextPersons !== defaultValueNumber &&
      previousPersons !== nextPersons
    ) {
      setRecipeIngredients(prevIngredients =>
        prevIngredients.map(ing => ({
          ...ing,
          quantity: ing.quantity
            ? scaleQuantityForPersons(ing.quantity, previousPersons, nextPersons)
            : undefined,
        }))
      );
    }
    previousPersonsRef.current = nextPersons;
  }, [recipePersons]);

  function convertModeFromProps() {
    switch (props.mode) {
      case 'readOnly':
        return recipeStateType.readOnly;
      case 'edit':
        return recipeStateType.edit;
      case 'addManually':
        return recipeStateType.addManual;
      case 'addFromPic':
        return recipeStateType.addOCR;
    }
  }

  async function onDelete() {
    switch (stackMode) {
      case recipeStateType.readOnly:
      case recipeStateType.edit:
        setValidationDialogProp({
          title: t('deleteRecipe'),
          content: t('confirmDelete'),
          confirmText: t('save'),
          cancelText: t('cancel'),
          onConfirm: async () => {
            const dialogProps: ValidationDialogProps = {
              title: t('deleteRecipe'),
              confirmText: t('ok'),
              onConfirm: () => {
                navigation.goBack();
              },
              content: '',
            };
            //@ts-ignore params.recipe exist because we already checked with switch
            if (!(await deleteRecipe(props.recipe))) {
              dialogProps.content = `${t('errorOccurred')} ${t('deleteRecipe')} ${recipeTitle}`;
            } else {
              dialogProps.content = t('deletedFromDatabase', { recipeName: recipeTitle });
            }
            setValidationDialogProp(dialogProps);
            setIsValidationDialogOpen(true);
          },
        });
        setIsValidationDialogOpen(true);
        break;
      case recipeStateType.addManual:
      case recipeStateType.addOCR:
        recipeLogger.warn('Delete operation not allowed in current mode', { stackMode });
        break;
    }
  }

  // TODO let the possibility to add manually the field

  function removeTag(tag: string) {
    setRecipeTags(recipeTags.filter(tagElement => tagElement.name !== tag));
  }

  /**
   * Adds a new tag to the recipe with intelligent similarity matching and validation
   *
   * This function implements sophisticated tag management including duplicate prevention,
   * case-insensitive matching, database similarity searching, and user confirmation
   * for similar matches. It provides a seamless experience for both existing and new tags.
   *
   * @param newTag - The tag name to add to the recipe
   *
   * Validation Logic:
   * 1. Rejects empty or whitespace-only tags
   * 2. Prevents duplicate tags in the recipe (case-insensitive)
   * 3. Searches database for similar existing tags
   * 4. Handles exact matches automatically
   * 5. Shows similarity dialog for potential matches
   *
   * Similarity Matching:
   * - Performs fuzzy matching against existing database tags
   * - Exact matches (case-insensitive) are added immediately
   * - Similar matches trigger SimilarityDialog for user choice
   * - Completely new tags can be created through the dialog
   *
   * Side Effects:
   * - Updates recipeTags state array when exact match found
   * - Triggers SimilarityDialog display for similar matches
   * - May add new tags to database through similarity dialog
   *
   * User Experience:
   * - Silent addition for exact matches (no interruption)
   * - Interactive dialog for similar matches (prevents typos)
   * - Option to create completely new tags
   *
   * Performance:
   * - Async operation to prevent UI blocking
   * - Efficient database similarity search
   */
  async function addTag(newTag: string) {
    if (!newTag || newTag.trim().length === 0) {
      return;
    }

    if (recipeTags.some(tag => tag.name.toLowerCase() === newTag.toLowerCase())) {
      return;
    }

    const similarTags = findSimilarTags(newTag);

    // Check for exact match in database - if found, add it directly without showing dialog
    const exactMatch = similarTags.find(tag => tag.name.toLowerCase() === newTag.toLowerCase());
    if (exactMatch) {
      setRecipeTags([...recipeTags, exactMatch]);
      return;
    }

    const addToStateIfNotDuplicate = (tag: tagTableElement) => {
      if (!recipeTags.some(existing => existing.name.toLowerCase() === tag.name.toLowerCase())) {
        setRecipeTags([...recipeTags, tag]);
      }
    };
    // Show similarity dialog for new tags or similar matches
    setSimilarityDialog({
      isVisible: true,
      item: {
        type: 'Tag',
        newItemName: newTag,
        similarItem: similarTags.length > 0 ? similarTags[0] : undefined,
        onConfirm: addToStateIfNotDuplicate,
        onUseExisting: addToStateIfNotDuplicate,
      },
    });
  }

  /**
   * Edits an existing ingredient with complex parsing and similarity validation
   *
   * This function handles the complex process of updating an ingredient in the recipe.
   * It parses ingredient strings that contain quantity, unit, and name information,
   * validates the input, checks for similar ingredients in the database, and either
   * updates the ingredient directly or shows a similarity dialog for user confirmation.
   *
   * @param oldIngredientId - Index of the ingredient to edit in the recipeIngredients array
   * @param newIngredient - Formatted string containing: "${quantity}${unitySeparator}${unit}${textSeparator}${name}"
   *
   * Input Format:
   * The newIngredient string follows this structure:
   * - Quantity and unit separated by unitySeparator ("@@")
   * - Name separated from quantity/unit by textSeparator ("--")
   * - Example: "2@@cups--flour" represents "2 cups of flour"
   *
   * Business Logic:
   * 1. Validates ingredient index bounds
   * 2. Parses ingredient string into components (quantity, unit, name)
   * 3. Validates that ingredient name is not empty
   * 4. Searches database for similar ingredients (fuzzy matching)
   * 5. If exact match found: updates ingredient directly
   * 6. If similar matches found: shows SimilarityDialog for user choice
   * 7. If no matches: creates new ingredient entry
   *
   * Side Effects:
   * - Updates recipeIngredients state array
   * - May trigger SimilarityDialog display
   * - Logs warnings for invalid operations
   * - May add new ingredients to database through similarity dialog
   *
   * Error Handling:
   * - Validates array bounds and logs warnings for invalid indices
   * - Handles empty or malformed ingredient strings gracefully
   * - Prevents duplicate ingredients in the recipe
   */
  function editIngredients(oldIngredientId: number, newIngredient: string) {
    if (oldIngredientId < 0 || oldIngredientId >= recipeIngredients.length) {
      recipeLogger.warn('Cannot edit ingredient - invalid index', {
        oldIngredientId,
        ingredientsCount: recipeIngredients.length,
      });
      return;
    }

    // ${newQuantity}${unitySeparator}${unit}${textSeparator}${ingName}
    const [unitAndQuantity, newName] = newIngredient.split(textSeparator);
    const [newQuantity, newUnit] = unitAndQuantity.split(unitySeparator);

    const updateIngredient = (ingredient: ingredientTableElement) => {
      const ingredientCopy: Array<ingredientTableElement> = recipeIngredients.map(ingredient => ({
        ...ingredient,
      }));
      const foundIngredient = ingredientCopy[oldIngredientId];

      if (ingredient.id && foundIngredient.id !== ingredient.id) {
        foundIngredient.id = ingredient.id;
      }
      if (ingredient.name && foundIngredient.name !== ingredient.name) {
        foundIngredient.name = ingredient.name;
      }
      if (ingredient.unit && foundIngredient.unit !== ingredient.unit) {
        foundIngredient.unit = ingredient.unit;
      }
      if (ingredient.quantity && foundIngredient.quantity !== ingredient.quantity) {
        foundIngredient.quantity = ingredient.quantity;
      }
      if (ingredient.season.length > 0 && foundIngredient.season !== ingredient.season) {
        foundIngredient.season = ingredient.season;
      }
      if (
        ingredient.type !== ingredientType.undefined &&
        foundIngredient.type !== ingredient.type
      ) {
        foundIngredient.type = ingredient.type;
      }

      setRecipeIngredients(ingredientCopy);
    };

    // Check if ingredient name changed and validate it
    if (
      newName &&
      newName.trim().length > 0 &&
      recipeIngredients[oldIngredientId].name !== newName
    ) {
      const similarIngredients = findSimilarIngredients(newName);

      const exactMatch = similarIngredients.find(
        ing => ing.name.toLowerCase() === newName.toLowerCase()
      );
      if (exactMatch) {
        const isDuplicate = recipeIngredients.some(
          (existing, idx) =>
            idx !== oldIngredientId &&
            (existing.name.toLowerCase() === exactMatch.name.toLowerCase() ||
              (existing.id && exactMatch.id && existing.id === exactMatch.id))
        );

        if (!isDuplicate) {
          updateIngredient(exactMatch);
        } else {
          validationLogger.debug('Duplicate ingredient detected - not adding', {
            ingredientName: exactMatch.name,
          });
          setRecipeIngredients(recipeIngredients.filter((_, index) => index !== oldIngredientId));
        }
        return;
      }

      const dismissCallback = () => {
        validationLogger.debug('Ingredient validation cancelled - removing ingredient');
        setRecipeIngredients(recipeIngredients.filter((_, index) => index !== oldIngredientId));
      };

      const onCloseCallback = (chosenIngredient: ingredientTableElement) => {
        const isDuplicate = recipeIngredients.some(
          (existing, idx) =>
            (idx !== oldIngredientId &&
              existing.id &&
              chosenIngredient.id &&
              existing.id === chosenIngredient.id) ||
            existing.name.toLowerCase() === chosenIngredient.name.toLowerCase()
        );

        if (!isDuplicate) {
          validationLogger.debug('Updating ingredient with validated data', {
            ingredientName: chosenIngredient.name,
            ingredientType: chosenIngredient.type,
          });
          updateIngredient(chosenIngredient);
        } else {
          validationLogger.debug('Duplicate ingredient detected - not adding', {
            ingredientName: chosenIngredient.name,
          });
          setRecipeIngredients(recipeIngredients.filter((_, index) => index !== oldIngredientId));
        }
      };

      setSimilarityDialog({
        isVisible: true,
        item: {
          type: 'Ingredient',
          newItemName: newName,
          similarItem: similarIngredients.length > 0 ? similarIngredients[0] : undefined,
          onConfirm: onCloseCallback,
          onUseExisting: onCloseCallback,
          onDismiss: dismissCallback,
        },
      });
    } else {
      updateIngredient({
        name: newName,
        unit: newUnit,
        quantity: newQuantity,
        season: [],
        type: ingredientType.undefined,
      });
    }
  }

  function addNewIngredient() {
    setRecipeIngredients([
      ...recipeIngredients,
      {
        name: '',
        unit: '',
        quantity: '',
        type: ingredientType.undefined,
        season: [],
      },
    ]);
  }

  function editPreparationTitle(stepIndex: number, newTitle: string) {
    if (stepIndex < 0 || stepIndex >= recipePreparation.length) {
      recipeLogger.warn('Cannot edit preparation step title - invalid index', {
        stepIndex,
        preparationCount: recipePreparation.length,
      });
      return;
    }
    const updatedPreparation = [...recipePreparation];
    updatedPreparation[stepIndex] = { ...updatedPreparation[stepIndex], title: newTitle };
    setRecipePreparation(updatedPreparation);
  }

  function editPreparationDescription(stepIndex: number, newDescription: string) {
    if (stepIndex < 0 || stepIndex >= recipePreparation.length) {
      recipeLogger.warn('Cannot edit preparation step description - invalid index', {
        stepIndex,
        preparationCount: recipePreparation.length,
      });
      return;
    }
    const updatedPreparation = [...recipePreparation];
    updatedPreparation[stepIndex] = {
      ...updatedPreparation[stepIndex],
      description: newDescription,
    };
    setRecipePreparation(updatedPreparation);
  }

  function addNewPreparationStep() {
    setRecipePreparation([...recipePreparation, { title: '', description: '' }]);
  }

  /**
   * Creates a complete recipe object from current component state
   *
   * This function transforms the component's state variables into a properly
   * formatted recipeTableElement that can be saved to the database. It handles
   * different recipe modes and preserves existing data when appropriate.
   *
   * @returns recipeTableElement - Complete recipe object ready for database operations
   *
   * State Transformation:
   * - Combines all state variables into single recipe object
   * - Preserves existing ID for read-only/edit modes
   * - Generates undefined ID for new recipes (auto-generated by database)
   * - Maintains season data for existing recipes or creates empty array for new ones
   *
   * Mode-Specific Behavior:
   * - Read-only mode: Preserves original recipe ID and season data
   * - Edit mode: Preserves original recipe ID and season data
   * - Add modes: Creates new recipe with undefined ID and empty season array
   *
   * Data Integrity:
   * - Ensures all required fields are populated from current state
   * - Maintains type safety with recipeTableElement interface
   * - Preserves complex objects (tags, ingredients) without mutation
   *
   * Usage:
   * This function is called before any database operation (add, edit, save)
   * to ensure the recipe data is in the correct format for persistence.
   */
  function createRecipeFromStates(): recipeTableElement {
    return {
      id: props.mode === 'readOnly' ? props.recipe.id : undefined,
      image_Source: recipeImage,
      title: recipeTitle,
      description: recipeDescription,
      tags: recipeTags,
      persons: recipePersons,
      ingredients: recipeIngredients,
      season: initStateFromProp ? props.recipe.season : new Array<string>(),
      preparation: recipePreparation,
      time: recipeTime,
      nutrition: recipeNutrition,
    };
  }

  async function readOnlyValidation() {
    await addRecipeToShopping(createRecipeFromStates());
    setValidationDialogProp({
      title: t('success'),
      content: t('addedToShoppingList', { recipeName: recipeTitle }),
      confirmText: t('ok'),
      onConfirm: () => navigation.goBack(),
    });
    setIsValidationDialogOpen(true);
  }

  function validateRecipeData(): string[] {
    const missingElem = new Array<string>();
    const translatedMissingElemPrefix = 'alerts.missingElements.';

    if (recipeImage.length == 0) {
      missingElem.push(t(translatedMissingElemPrefix + 'image'));
    }
    if (recipeTitle.length == 0) {
      missingElem.push(t(translatedMissingElemPrefix + 'titleRecipe'));
    }
    if (recipeIngredients.length == 0) {
      missingElem.push(t(translatedMissingElemPrefix + 'titleIngredients'));
    } else {
      const allIngredientsHaveNames = recipeIngredients.every(
        ingredient => ingredient.name && ingredient.name.trim().length > 0
      );
      if (!allIngredientsHaveNames) {
        missingElem.push(t(translatedMissingElemPrefix + 'ingredientNames'));
      }
      const allIngredientsHaveQuantities = recipeIngredients.every(
        ingredient => ingredient.quantity && ingredient.quantity.trim().length > 0
      );
      if (!allIngredientsHaveQuantities) {
        missingElem.push(t(translatedMissingElemPrefix + 'ingredientQuantities'));
      }
    }
    if (recipePreparation.length == 0) {
      validationLogger.debug('Recipe preparation is empty', { recipeTitle });
      missingElem.push(t(translatedMissingElemPrefix + 'titlePreparation'));
    }
    if (recipePersons === defaultValueNumber) {
      missingElem.push(t(translatedMissingElemPrefix + 'titlePersons'));
    }
    if (recipeTime === defaultValueNumber) {
      missingElem.push(t(translatedMissingElemPrefix + 'titleTime'));
    }
    if (
      recipeNutrition &&
      Object.values(recipeNutrition).some(value => value === defaultValueNumber)
    ) {
      missingElem.push(t(translatedMissingElemPrefix + 'nutrition'));
    }

    return missingElem;
  }

  function showValidationErrorDialog(missingElem: string[]) {
    const dialogProp = { ...defaultValidationDialogProp };
    const translatedMissingElemPrefix = 'alerts.missingElements.';

    dialogProp.confirmText = t('understood');
    if (missingElem.length == 1) {
      validationLogger.debug('Single validation element missing', {
        missingElement: missingElem[0],
      });

      dialogProp.title = t(translatedMissingElemPrefix + 'titleSingular');

      // Special case for nutrition to handle proper grammar
      const nutritionTranslation = t(translatedMissingElemPrefix + 'nutrition');
      if (missingElem[0] === nutritionTranslation) {
        dialogProp.content = t(translatedMissingElemPrefix + 'messageSingularNutrition');
      } else {
        dialogProp.content =
          t(translatedMissingElemPrefix + 'messageSingularBeginning') +
          missingElem[0] +
          t(translatedMissingElemPrefix + 'messageSingularEnding');
      }
    } else {
      dialogProp.title = t(translatedMissingElemPrefix + 'titlePlural');
      dialogProp.content = t(translatedMissingElemPrefix + 'messagePlural');
      for (const elem of missingElem) {
        dialogProp.content += `\n\t- ${elem}`;
      }
    }
    setValidationDialogProp(dialogProp);
    setIsValidationDialogOpen(true);
  }

  async function editValidation() {
    const missingElem = validateRecipeData();

    if (missingElem.length == 0) {
      recipeLogger.info('Saving edited recipe to database', {
        recipeTitle,
      });
      const recipeToEdit = createRecipeFromStates();
      const originalRecipe = props.mode === 'edit' ? props.recipe : recipeToEdit;

      // Scale recipe to default persons count before saving to database
      const defaultPersons = await getDefaultPersons();
      if (recipeToEdit.persons !== defaultPersons && recipeToEdit.persons > 0) {
        recipeToEdit.ingredients = recipeToEdit.ingredients.map(ingredient => ({
          ...ingredient,
          quantity: ingredient.quantity
            ? scaleQuantityForPersons(ingredient.quantity, recipeToEdit.persons, defaultPersons)
            : ingredient.quantity,
        }));
        recipeToEdit.persons = defaultPersons;
      }

      // Only update database if the recipe actually changed
      if (!isRecipeEqual(originalRecipe, recipeToEdit)) {
        // @ts-ignore No need to wait for clearCache
        FileGestion.getInstance().clearCache();

        await editRecipe(recipeToEdit);
      }

      setStackMode(recipeStateType.readOnly);

      recipeLogger.info('Recipe edit completed successfully', {
        recipeTitle,
      });
      // @ts-ignore No need to wait for clearCache
      FileGestion.getInstance().clearCache();
    } else {
      recipeLogger.warn('Validation failed, missing elements', {
        missingElements: missingElem,
      });
      showValidationErrorDialog(missingElem);
    }
  }

  // TODO checking if tags aren't in doublons
  /**
   * Comprehensive recipe validation before saving to database
   *
   * This function implements extensive validation logic for recipe creation and editing.
   * It checks for required fields, validates data integrity, handles similar recipe
   * detection, manages file operations, and provides detailed user feedback.
   *
   * Validation Steps:
   * 1. **Required Field Validation**: Checks title, ingredients, preparation, persons
   * 2. **Data Integrity Checks**: Validates ingredient names and quantities
   * 3. **Similarity Detection**: Searches for existing similar recipes
   * 4. **File Operations**: Saves recipe image with proper naming
   * 5. **Quantity Scaling**: Normalizes ingredients to default person count
   * 6. **Database Operations**: Saves recipe with proper error handling
   *
   * Error Handling:
   * - Displays detailed validation errors to user
   * - Handles file operation failures gracefully
   * - Provides specific error messages for missing fields
   * - Logs validation attempts and failures
   *
   * Side Effects:
   * - Shows validation dialog with error details or success message
   * - Saves recipe image to file system
   * - Adds recipe to database
   * - Clears file cache (async, non-blocking)
   * - Scales ingredient quantities to default person count
   * - Navigates back to previous screen on success
   *
   * User Experience:
   * - Shows similarity dialog for potential duplicate recipes
   * - Provides clear feedback on validation failures
   * - Handles success and error states with appropriate messages
   *
   * Performance Considerations:
   * - Async operations prevent UI blocking
   * - File operations handled efficiently
   * - Database queries optimized for similarity detection
   *
   * @async
   * @returns Promise<void> - Resolves when validation and save operations complete
   */
  async function addValidation() {
    const missingElem = validateRecipeData();

    // No mandatory elements missing
    if (missingElem.length == 0) {
      const dialogProp = { ...defaultValidationDialogProp };
      const recipeToAdd = createRecipeFromStates();
      const similarRecipes = findSimilarRecipes(recipeToAdd);

      const addRecipeToDatabase = async () => {
        try {
          // @ts-ignore No need to wait
          FileGestion.getInstance().clearCache();

          // Scale recipe to default persons count before saving to database
          const defaultPersons = await getDefaultPersons();
          if (recipeToAdd.persons !== defaultPersons && recipeToAdd.persons > 0) {
            recipeToAdd.ingredients = recipeToAdd.ingredients.map(ingredient => ({
              ...ingredient,
              quantity: ingredient.quantity
                ? scaleQuantityForPersons(ingredient.quantity, recipeToAdd.persons, defaultPersons)
                : ingredient.quantity,
            }));
            recipeToAdd.persons = defaultPersons;
          }

          recipeLogger.info('Saving new recipe to database', {
            recipeTitle,
          });

          await addRecipe(recipeToAdd);

          recipeLogger.info('Recipe add completed successfully', {
            recipeTitle,
          });

          dialogProp.title = t('addAnyway');
          dialogProp.content = t('addedToDatabase', { recipeName: recipeToAdd.title });
          dialogProp.confirmText = t('understood');
          dialogProp.onConfirm = () => {
            navigation.goBack();
          };
          setValidationDialogProp(dialogProp);
          setIsValidationDialogOpen(true);
        } catch (error) {
          validationLogger.error('Failed to validate and add recipe to database', {
            recipeTitle,
            error,
          });
        }
      };

      if (similarRecipes.length === 0) {
        await addRecipeToDatabase();
      } else {
        const separator = '\n\t- ';
        dialogProp.title = t('similarRecipeFound');
        dialogProp.content =
          t('similarRecipeFoundContent') +
          separator +
          similarRecipes.map((r: recipeTableElement) => r.title).join(separator);
        dialogProp.confirmText = t('addAnyway');
        dialogProp.cancelText = t('cancel');
        dialogProp.onConfirm = async () => {
          await addRecipeToDatabase();
        };
        setValidationDialogProp(dialogProp);
        setIsValidationDialogOpen(true);
      }
    } else {
      showValidationErrorDialog(missingElem);
    }
  }

  async function fillOneField(uri: string, field: recipeColumnsNames) {
    const newFieldData = await extractFieldFromImage(
      uri,
      field,
      {
        recipePreparation: recipePreparation,
        recipePersons: recipePersons,
        recipeIngredients: recipeIngredients,
        recipeTags: recipeTags,
      },
      msg => {
        ocrLogger.warn('OCR processing warning', { message: msg });
      }
    );
    if (newFieldData.recipeImage) {
      setRecipeImage(newFieldData.recipeImage);
    }
    if (newFieldData.recipeTitle) {
      setRecipeTitle(newFieldData.recipeTitle);
    }
    if (newFieldData.recipeDescription) {
      setRecipeDescription(newFieldData.recipeDescription);
    }
    if (newFieldData.recipeTags) {
      setRecipeTags(newFieldData.recipeTags);
    }
    if (newFieldData.recipePreparation) {
      setRecipePreparation(newFieldData.recipePreparation);
    }
    if (newFieldData.recipePersons) {
      setRecipePersons(newFieldData.recipePersons);
    }
    if (newFieldData.recipeTime) {
      setRecipeTime(newFieldData.recipeTime);
    }
    if (newFieldData.recipeIngredients) {
      setRecipeIngredients(newFieldData.recipeIngredients);
    }
    if (newFieldData.recipeNutrition) {
      const newNutrition: nutritionTableElement = {
        energyKcal: defaultValueNumber,
        energyKj: defaultValueNumber,
        fat: defaultValueNumber,
        saturatedFat: defaultValueNumber,
        carbohydrates: defaultValueNumber,
        sugars: defaultValueNumber,
        fiber: defaultValueNumber,
        protein: defaultValueNumber,
        salt: defaultValueNumber,
        portionWeight: defaultValueNumber,
      };

      for (const [key, value] of Object.entries(newFieldData.recipeNutrition)) {
        if (value !== undefined) {
          newNutrition[key as keyof nutritionTableElement] = value;
        }
      }

      setRecipeNutrition(newNutrition);
    }
  }

  function openModalForField(field: recipeColumnsNames) {
    setModalField(field);
  }

  function recipeImageProp(): RecipeImageProps {
    const defaultReturn: RecipeImageProps = { imgUri: recipeImage, openModal: openModalForField };
    switch (stackMode) {
      case recipeStateType.readOnly:
        return defaultReturn;
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return { ...defaultReturn, buttonIcon: Icons.cameraIcon };
      case recipeStateType.addOCR:
        return { ...defaultReturn, buttonIcon: Icons.scanImageIcon };
      default:
        recipeLogger.warn('Unknown stack mode in recipeImageProp', { stackMode });
        return {
          imgUri: '',
          openModal: () => {
            recipeLogger.warn('Unknown stack mode in recipeImageProp callback', { stackMode });
          },
        };
    }
  }

  /**
   * Generates props for recipe title component based on current mode
   *
   * This function creates mode-specific props for the RecipeText component that handles
   * the recipe title. It adapts the component behavior, styling, and functionality
   * based on whether the recipe is being viewed, edited, or created.
   *
   * @returns RecipeTextProps - Props configured for the current recipe mode
   *
   * Mode-Specific Behavior:
   * - **Read-only**: Displays title as headline text, no editing capability
   * - **Edit/Manual Add**: Shows title input with label, editing enabled
   * - **OCR Add**: Includes OCR button for automatic title extraction
   *
   * Text Styling:
   * - Read-only: Uses 'headline' style for prominent display
   * - Edit/Add modes: Uses 'title' style with descriptive label
   *
   * Interaction Features:
   * - Edit modes: Provides text input with change handlers
   * - OCR mode: Adds scanning button for automatic text extraction
   * - Read-only: No interaction, just display
   */
  function recipeTitleProp(): RecipeTextProps {
    const titleTestID = 'RecipeTitle';
    const titleRootText: TextProp = {
      style: stackMode == recipeStateType.readOnly ? 'headline' : 'title',
      value: stackMode == recipeStateType.readOnly ? recipeTitle : t('title') + ':',
    };
    switch (stackMode) {
      case recipeStateType.readOnly:
        return {
          testID: titleTestID,
          rootText: titleRootText,
        };
      case recipeStateType.addOCR:
        if (recipeTitle.length == 0) {
          return {
            testID: titleTestID,
            rootText: titleRootText,
            addOrEditProps: {
              editType: 'add',
              testID: titleTestID,
              openModal: () => openModalForField(recipeColumnsNames.title),
            },
          };
        }
      // Else return the same props as edit or addManual
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          testID: titleTestID,
          rootText: titleRootText,
          addOrEditProps: {
            editType: 'editable',
            testID: titleTestID,
            textEditable: recipeTitle,
            setTextToEdit: setRecipeTitle,
          },
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipeTitleProp', { stackMode });
        return { rootText: { style: 'paragraph', value: '' } };
    }
  }

  function recipeDescriptionProp(): RecipeTextProps {
    const descriptionTestID = 'RecipeDescription';
    const descriptionRootText: TextProp = {
      style: stackMode == recipeStateType.readOnly ? 'paragraph' : 'title',
      value: stackMode == recipeStateType.readOnly ? recipeDescription : t('description') + ':',
    };
    switch (stackMode) {
      case recipeStateType.readOnly:
        return { rootText: descriptionRootText, testID: descriptionTestID };
      case recipeStateType.addOCR:
        if (recipeDescription.length == 0) {
          return {
            rootText: descriptionRootText,
            testID: descriptionTestID,
            addOrEditProps: {
              editType: 'add',
              testID: descriptionTestID,
              openModal: () => openModalForField(recipeColumnsNames.description),
            },
          };
        }
      // Else return the same props as edit or addManual
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          rootText: descriptionRootText,
          testID: descriptionTestID,
          addOrEditProps: {
            editType: 'editable',
            testID: descriptionTestID,
            textEditable: recipeDescription,
            setTextToEdit: setRecipeDescription,
          },
        };

      default:
        recipeLogger.warn('Unknown stack mode in recipeDescriptionProp', { stackMode });
        return { rootText: { style: 'paragraph', value: '' } };
    }
  }

  /**
   * Generates props for recipe tags component with mode-specific functionality
   *
   * This function creates complex props for the RecipeTags component, handling
   * different interaction modes, tag management operations, and OCR integration.
   * It provides the most sophisticated prop generation with multiple callback functions.
   *
   * @returns RecipeTagProps - Props configured for the current recipe mode
   *
   * Component Behavior:
   * - **Read-only**: Simple tag display without interaction
   * - **Edit/Manual Add**: Full tag management with add/remove capabilities
   * - **OCR Add**: Enhanced with OCR modal for automatic tag extraction
   *
   * Tag Management Features:
   * - Random tag suggestions for inspiration
   * - Add/remove tag callbacks with validation
   * - Similarity matching for tag consistency
   * - Extract existing tags for display
   *
   * OCR Integration:
   * - Provides modal trigger for OCR-based tag extraction
   * - Combines manual and automated tag input methods
   *
   * State Management:
   * - Uses extracted tag names from complex tag objects
   * - Integrates with addTag() function for similarity checking
   * - Connects to removeTag() for tag removal operations
   */
  function recipeTagsProp(): RecipeTagProps {
    const tagsExtracted = extractTagsName(recipeTags);
    const editProps: RecipeTagProps = {
      tagsList: tagsExtracted,
      type: 'addOrEdit',
      editType: 'edit',
      randomTags: randomTags.join(', '),
      addNewTag: addTag,
      removeTag: removeTag,
    };
    switch (stackMode) {
      case recipeStateType.readOnly:
        return { type: 'readOnly', tagsList: tagsExtracted };
      case recipeStateType.addOCR:
        return {
          ...editProps,
          editType: 'add',
          openModal: () => openModalForField(recipeColumnsNames.tags),
        };
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return editProps;
      default:
        recipeLogger.warn('Unknown stack mode in recipeTagsProp', { stackMode });
        return { tagsList: [], type: 'readOnly' };
    }
  }

  function recipePersonsProp(): RecipeNumberProps {
    const personTestID = 'RecipePersons';
    switch (stackMode) {
      case recipeStateType.readOnly:
        return {
          testID: personTestID,
          numberProps: {
            editType: 'read',
            text:
              t('ingredientReadOnlyBeforePerson') +
              recipePersons +
              t('ingredientReadOnlyAfterPerson'),
          },
        };
      case recipeStateType.addOCR:
        if (recipePersons === defaultValueNumber) {
          return {
            testID: personTestID,
            numberProps: {
              editType: 'add',
              testID: personTestID,
              prefixText: t('personPrefixOCR'),
              openModal: () => openModalForField(recipeColumnsNames.persons),
              manuallyFill: () => {
                setRecipePersons(0);
              },
            },
          };
        }
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          testID: personTestID,
          numberProps: {
            editType: 'editable',
            testID: personTestID,
            textEditable: recipePersons,
            prefixText: t('personPrefixEdit'),
            suffixText: t('personSuffixEdit'),
            setTextToEdit: setRecipePersons,
          },
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipePersonsProp', { stackMode });
        return {
          testID: personTestID,
          numberProps: { editType: 'read', text: '' },
        };
    }
  }

  function recipeTimeProp(state: recipeStateType = stackMode): RecipeNumberProps {
    const timeTestID = 'RecipeTime';
    switch (state) {
      case recipeStateType.readOnly:
        return {
          testID: timeTestID,
          numberProps: {
            editType: 'read',
            text: t('timeReadOnlyBeforePerson') + recipeTime + t('timeReadOnlyAfterPerson'),
          },
        };
      case recipeStateType.addOCR:
        if (recipeTime === defaultValueNumber) {
          return {
            testID: timeTestID,
            numberProps: {
              editType: 'add',
              testID: timeTestID,
              prefixText: t('timePrefixOCR'),
              openModal: () => openModalForField(recipeColumnsNames.time),
              manuallyFill: () => {
                setRecipeTime(0);
              },
            },
          };
        }
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          testID: timeTestID,
          numberProps: {
            editType: 'editable',
            testID: timeTestID,
            textEditable: recipeTime,
            prefixText: t('timePrefixEdit'),
            suffixText: t('timeSuffixEdit'),
            setTextToEdit: setRecipeTime,
          },
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipeTimeProp', { stackMode });
        return {
          testID: timeTestID,
          numberProps: { editType: 'read', text: '' },
        };
    }
  }

  function recipeIngredientsProp(): RecipeTextRenderProps {
    const ingredientPrefixText = t('ingredients') + ': ';
    const ingredientRender: typoRender = typoRender.ARRAY;
    const extractedIngredients = extractIngredientsNameWithQuantity(recipeIngredients);
    const ingredientTestID = 'RecipeIngredients';
    switch (stackMode) {
      case recipeStateType.readOnly:
        return {
          testID: ingredientTestID,
          type: 'readOnly',
          text: extractedIngredients,
          render: ingredientRender,
        };
      case recipeStateType.addOCR:
        if (recipeIngredients.length == 0) {
          return {
            testID: ingredientTestID,
            type: 'addOrEdit',
            editType: 'add',
            prefixText: ingredientPrefixText,
            openModal: () => openModalForField(recipeColumnsNames.ingredients),
          };
        }
      // Else return the same props as edit or addManual
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          testID: ingredientTestID,
          type: 'addOrEdit',
          editType: 'editable',
          prefixText: ingredientPrefixText,
          columnTitles: {
            column1: t('quantity'),
            column2: t('unit'),
            column3: t('ingredientName'),
          },
          renderType: typoRender.ARRAY,
          textEditable: extractedIngredients,
          textEdited: editIngredients,
          addNewText: addNewIngredient,
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipeIngredientsProp', { stackMode });
        return {
          testID: ingredientTestID,
          type: 'readOnly',
          text: [],
          render: typoRender.LIST,
        };
    }
  }

  function recipePreparationProp(): RecipeTextRenderProps {
    const preparationRender: typoRender = typoRender.SECTION;
    const preparationTestID = 'RecipePreparation';

    switch (stackMode) {
      case recipeStateType.readOnly:
        return {
          testID: preparationTestID,
          type: 'readOnly',
          text: recipePreparation,
          render: preparationRender,
        };
      case recipeStateType.addOCR:
        if (recipePreparation.length == 0) {
          return {
            testID: preparationTestID,
            type: 'addOrEdit',
            editType: 'add',
            prefixText: t('preparationReadOnly'),
            openModal: () => openModalForField(recipeColumnsNames.preparation),
          };
        }
      // Else return the same props as edit or addManual
      // falls through
      case recipeStateType.edit:
      case recipeStateType.addManual:
        return {
          testID: preparationTestID,
          type: 'addOrEdit',
          editType: 'editable',
          renderType: preparationRender,
          textEditable: recipePreparation,
          textEdited: (stepIndex: number, combinedText: string) => {
            //   TODO refactor/remove RecipeTextRender so that we don't have this callback
            // Fallback for legacy string-based editing (shouldn't be used with new callbacks)
            const [title, description] = combinedText.split(textSeparator);
            editPreparationTitle(stepIndex, title || '');
            editPreparationDescription(stepIndex, description || '');
          },
          addNewText: addNewPreparationStep,
          onTitleEdit: editPreparationTitle,
          onDescriptionEdit: editPreparationDescription,
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipePreparationProp', { stackMode });
        return {
          testID: preparationTestID,
          type: 'readOnly',
          text: [],
          render: typoRender.LIST,
        };
    }
  }

  function recipeNutritionProp(): RecipeNutritionProps {
    switch (stackMode) {
      case recipeStateType.readOnly:
        return {
          parentTestId: recipeTestId,
          nutrition: recipeNutrition,
          mode: recipeStateType.readOnly,
        };
      case recipeStateType.edit:
        return {
          parentTestId: recipeTestId,
          nutrition: recipeNutrition,
          mode: recipeStateType.edit,
          onNutritionChange: setRecipeNutrition,
        };
      case recipeStateType.addManual:
        return {
          parentTestId: recipeTestId,
          nutrition: recipeNutrition,
          mode: recipeStateType.addManual,
          onNutritionChange: setRecipeNutrition,
        };
      case recipeStateType.addOCR:
        return {
          parentTestId: recipeTestId,
          nutrition: recipeNutrition,
          mode: recipeStateType.addOCR,
          onNutritionChange: setRecipeNutrition,
          openModal: () => openModalForField(recipeColumnsNames.nutrition),
        };
      default:
        recipeLogger.warn('Unknown stack mode in recipeNutritionProp', { stackMode });
        return {
          parentTestId: recipeTestId,
          nutrition: undefined,
          mode: recipeStateType.readOnly,
        };
    }
  }

  function recipeValidationButtonProps(): [string, () => Promise<void>] {
    switch (stackMode) {
      case recipeStateType.readOnly:
        return [t('validateReadOnly'), readOnlyValidation];
      case recipeStateType.edit:
        return [t('validateEdit'), editValidation];
      case recipeStateType.addManual:
      case recipeStateType.addOCR:
        return [t('validateAdd'), addValidation];
      default:
        recipeLogger.warn('Unknown stack mode in recipeValidationButtonProps', { stackMode });
        return [
          '',
          async () =>
            recipeLogger.error('Validation button clicked with unknown stack mode', { stackMode }),
        ];
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={scrollView(rectangleButtonHeight).view}
        keyboardShouldPersistTaps={'handled'}
        nestedScrollEnabled={true}
      >
        {/*Image*/}
        <RecipeImage {...recipeImageProp()} />

        {/*Title*/}
        <RecipeText {...recipeTitleProp()} />

        {/*Description*/}
        <RecipeText {...recipeDescriptionProp()} />

        {/*Tags*/}
        <RecipeTags {...recipeTagsProp()} />

        {/*Persons*/}
        <RecipeNumber {...recipePersonsProp()} />

        {/*Ingredients*/}
        <RecipeTextRender {...recipeIngredientsProp()} />

        {/* TODO let the possibility to add another time in picture */}
        {/*Time*/}
        <RecipeNumber {...recipeTimeProp()} />

        {/*Preparation*/}
        <RecipeTextRender {...recipePreparationProp()} />

        {/*Nutrition*/}
        <RecipeNutrition {...recipeNutritionProp()} />

        {/* Add some space to avoid missing clicking */}
        <View style={{ paddingVertical: LargeButtonDiameter / 2 }} />

        {/* TODO add nutrition */}
      </ScrollView>
      <Alert
        {...validationDialogProp}
        isVisible={isValidationDialogOpen}
        testId={'Recipe'}
        onClose={() => {
          setIsValidationDialogOpen(false);
          setValidationDialogProp(defaultValidationDialogProp);
        }}
      />
      {/*TODO add a generic component to tell which bottom button we want*/}
      <BottomTopButton
        testID={'BackButton'}
        as={RoundButton}
        position={bottomTopPosition.top_left}
        buttonOffset={0}
        size={'medium'}
        onPressFunction={() => navigation.goBack()}
        icon={Icons.backIcon}
      />

      {stackMode == recipeStateType.readOnly ? (
        <>
          <BottomTopButton
            testID={'RecipeDelete'}
            as={RoundButton}
            position={bottomTopPosition.top_right}
            buttonOffset={0}
            onPressFunction={() => onDelete()}
            size={'medium'}
            icon={Icons.trashIcon}
          />
          <BottomTopButton
            testID={'RecipeEdit'}
            as={RoundButton}
            position={bottomTopPosition.bottom_right}
            buttonOffset={BottomTopButtonOffset}
            onPressFunction={() => setStackMode(recipeStateType.edit)}
            size={'medium'}
            icon={Icons.pencilIcon}
          />
        </>
      ) : null}

      {/* TODO to refactor for react-native-paper  */}
      <BottomTopButton
        testID={'RecipeValidate'}
        as={RectangleButton}
        position={bottomTopPosition.bottom_full}
        text={validationButtonText}
        centered={true}
        border={false}
        onPressFunction={async () => await validationFunction()}
      />
      {modalField ? (
        <ModalImageSelect
          arrImg={imgForOCR}
          onSelectFunction={async (imgSelected: string) => {
            const croppedUri = await cropImage(imgSelected, colors);
            if (croppedUri.length > 0) {
              await fillOneField(croppedUri, modalField);
              setModalField(undefined);
            }
          }}
          onDismissFunction={() => setModalField(undefined)}
          onImagesUpdated={(imageUri: string) => setImgForOCR([...imgForOCR, imageUri])}
        />
      ) : null}

      {/* SimilarityDialog for both tags and ingredients */}
      {similarityDialog.item && (
        <SimilarityDialog
          testId={`Recipe${similarityDialog.item.type}Similarity`}
          isVisible={similarityDialog.isVisible}
          onClose={() => setSimilarityDialog(defaultSimilarityDialogPropsPicked)}
          item={similarityDialog.item}
        />
      )}
    </SafeAreaView>
  );
}

export default Recipe;
