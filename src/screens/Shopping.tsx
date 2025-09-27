/**
 * Shopping - Smart shopping list with categorized ingredients and recipe tracking
 *
 * A comprehensive shopping list screen that automatically organizes ingredients by category,
 * tracks purchase status, and provides detailed recipe information for each ingredient.
 * Features intuitive checkbox interactions and complete list management capabilities.
 *
 * Key Features:
 * - Automatic ingredient categorization (vegetables, proteins, dairy, etc.)
 * - Purchase status tracking with visual feedback (strikethrough)
 * - Recipe origin tracking - see which recipes use each ingredient
 * - Long-press for detailed recipe information dialog
 * - One-tap shopping list clearing functionality
 * - Focus-based data synchronization with recipe changes
 * - Empty state handling with user-friendly messaging
 * - Comprehensive logging for shopping analytics
 *
 * UI/UX Features:
 * - Sectioned list organization by ingredient type
 * - Visual purchase indicators (checkboxes + strikethrough)
 * - Recipe count badges for multi-recipe ingredients
 * - Smooth interactions with immediate visual feedback
 * - Accessible design with proper contrast and sizing
 *
 * Data Management:
 * - Real-time synchronization with recipe database
 * - Persistent purchase state across app sessions
 * - Automatic cleanup when recipes are removed
 * - Efficient category-based organization
 *
 * @example
 * ```typescript
 * // Navigation integration (typically in tab navigator)
 * <Tab.Screen
 *   name="Shopping"
 *   component={Shopping}
 *   options={{
 *     tabBarIcon: ({ color }) => <Icon name="shopping-cart" color={color} />
 *   }}
 * />
 *
 * // The Shopping screen automatically handles:
 * // - Loading shopping list from added recipes
 * // - Organizing ingredients by category
 * // - Managing purchase status
 * // - Providing recipe context for ingredients
 * ```
 */

import { shoppingListTableElement } from '@customTypes/DatabaseElementTypes';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SectionList, StyleProp, TextStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import { useSafeCopilot } from '@hooks/useSafeCopilot';
import { CopilotStepData } from '@customTypes/TutorialTypes';
import RecipeDatabase from '@utils/RecipeDatabase';
import { Checkbox, Divider, List, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import {
  ShoppingAppliedToDatabase,
  shoppingCategories,
  TListFilter,
} from '@customTypes/RecipeFiltersTypes';
import BottomTopButton from '@components/molecules/BottomTopButton';
import RoundButton from '@components/atomic/RoundButton';
import { bottomTopPosition } from '@styles/buttons';
import { Icons } from '@assets/Icons';
import Alert from '@components/dialogs/Alert';
import { shoppingLogger } from '@utils/logger';
import { TUTORIAL_DEMO_INTERVAL, TUTORIAL_STEPS } from '@utils/Constants';
import { padding } from '@styles/spacing';

/** Type for dialog data containing ingredient and recipe information */
type ingredientDataForDialog = Pick<shoppingListTableElement, 'name' | 'recipesTitle'>;

/**
 * Shopping screen component - Categorized shopping list with recipe tracking
 *
 * @param props - Navigation props for the Shopping screen
 * @returns JSX element representing the shopping list interface
 */
const CopilotView = walkthroughable(View);

export function Shopping() {
  const { t } = useI18n();
  const { colors, fonts } = useTheme();
  const copilotData = useSafeCopilot();
  const copilotEvents = copilotData?.copilotEvents;
  const currentStep = copilotData?.currentStep;

  const [shoppingList, setShoppingList] = useState(new Array<shoppingListTableElement>());
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDialogOpenRef = useRef(false);

  const stepOrder = TUTORIAL_STEPS.Shopping.order;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ingredientDataForDialog, setIngredientDataForDialog] = useState<ingredientDataForDialog>({
    recipesTitle: [],
    name: '',
  });

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const toggleDemoDialog = useCallback(() => {
    if (isDialogOpenRef.current) {
      setIsDialogOpen(false);
      setIngredientDataForDialog({ name: '', recipesTitle: [] });
      isDialogOpenRef.current = false;
    } else {
      setIngredientDataForDialog(shoppingList[2]);
      setIsDialogOpen(true);
      isDialogOpenRef.current = true;
    }
  }, [shoppingList]);

  const closingDialogInDemo = () => {
    setIsDialogOpen(false);
    setIngredientDataForDialog({ name: '', recipesTitle: [] });
    isDialogOpenRef.current = false;
  };

  const stopDemo = useCallback(() => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    closingDialogInDemo();
  }, []);

  const startDemo = useCallback(() => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }

    demoIntervalRef.current = setInterval(toggleDemoDialog, TUTORIAL_DEMO_INTERVAL);
  }, [toggleDemoDialog]);

  const handleStepChange = useCallback(
    (step: CopilotStepData | undefined) => {
      if (step?.order === stepOrder) {
        startDemo();
      } else {
        stopDemo();
      }
    },
    [stepOrder, startDemo, stopDemo]
  );

  useFocusEffect(
    React.useCallback(() => {
      setShoppingList([...RecipeDatabase.getInstance().get_shopping()]);
    }, [])
  );

  useEffect(() => {
    if (!copilotData || !copilotEvents) {
      return;
    }

    // Start demo if we're already on our step when component mounts
    if (currentStep?.order === stepOrder) {
      startDemo();
    }

    copilotEvents.on('stepChange', handleStepChange);
    copilotEvents.on('stop', stopDemo);

    return () => {
      copilotEvents.off('stepChange', handleStepChange);
      copilotEvents.off('stop', stopDemo);
      stopDemo();
    };
  }, [currentStep, copilotData, copilotEvents, handleStepChange, startDemo, stepOrder, stopDemo]);

  const sections = shoppingCategories
    .map(category => {
      return {
        title: category,
        data: shoppingList.filter(item => item.type === category),
      } as ShoppingAppliedToDatabase;
    })
    .filter(section => section.data.length > 0);

  const screenId = 'ShoppingScreen';
  const sectionId = screenId + '::SectionList';

  /**
   * Creates formatted dialog title for ingredient recipe usage
   *
   * Generates a localized title showing which ingredient is being queried
   * and indicates that recipe usage information will be displayed.
   *
   * @returns string - Formatted dialog title with ingredient name and context
   */
  function createDialogTitle() {
    return t('recipeUsingTitle') + ' ' + ingredientDataForDialog.name.toLowerCase();
  }

  /**
   * Creates formatted dialog content listing recipes using the ingredient
   *
   * Builds a multi-line message showing all recipes that use the selected
   * ingredient. Formats the list with proper indentation and bullets for readability.
   *
   * @returns string - Formatted message with bullet-pointed recipe list
   *
   * Content Format:
   * - Starts with localized explanation message
   * - Lists each recipe title on new line with tab indentation
   * - Uses bullet points (- ) for visual clarity
   * - Joins all recipe titles into single formatted string
   */
  function createDialogContent() {
    return (
      t('recipeUsingMessage') +
      ' :' +
      ingredientDataForDialog.recipesTitle.map(title => `\n\t- ${title}`).join('')
    );
  }

  /**
   * Updates shopping list item purchase status with database synchronization
   *
   * This function manages the complex process of toggling ingredient purchase status
   * while maintaining consistency between local state and database storage.
   * It handles both UI updates and persistent data storage.
   *
   * @param ingredientName - Name of the ingredient to update
   *
   * Update Process:
   * 1. Creates shallow copy of shopping list for state management
   * 2. Finds the specific ingredient by name
   * 3. Toggles the purchased status (true ↔ false)
   * 4. Persists change to database asynchronously
   * 5. Updates local state to reflect change
   *
   * Error Handling:
   * - Validates ingredient exists in current list
   * - Ensures ingredient has valid ID for database operations
   * - Logs warnings for invalid operations
   * - Gracefully handles database failures
   *
   * State Management:
   * - Maintains state consistency during async operations
   * - Updates UI immediately for responsive experience
   * - Synchronizes with database in background
   *
   * Side Effects:
   * - Updates shoppingList state
   * - Modifies database purchase status
   * - Triggers UI re-render with new purchase state
   */
  function updateShoppingList(ingredientName: string) {
    const newShoppingList = shoppingList.map(item => item);

    const ingToEdit = shoppingList.find(item => item.name === ingredientName);
    if (ingToEdit !== undefined) {
      ingToEdit.purchased = !ingToEdit.purchased;
      if (ingToEdit.id !== undefined) {
        RecipeDatabase.getInstance()
          .purchaseIngredientOfShoppingList(ingToEdit.id, ingToEdit.purchased)
          .then(() => setShoppingList(newShoppingList));
      } else {
        shoppingLogger.warn('Shopping list ingredient missing ID', { ingredientName });
      }
    } else {
      shoppingLogger.warn('Shopping list ingredient not found', { ingredientName });
    }
  }

  function showClearConfirmation() {
    setIsConfirmationDialogOpen(true);
  }

  function closeClearConfirmation() {
    setIsConfirmationDialogOpen(false);
  }

  async function clearShoppingList() {
    await RecipeDatabase.getInstance().resetShoppingList();
    setShoppingList([]);
    setIsConfirmationDialogOpen(false);
  }

  function renderSectionHeader({ section: { title } }: { section: { title: TListFilter } }) {
    const headerId = sectionId + '::' + title;
    return (
      <View>
        <List.Subheader
          testID={headerId + '::SubHeader'}
          style={{ ...fonts.titleMedium, color: colors.primary }}
        >
          {t(title)}
        </List.Subheader>
        <Divider testID={headerId + '::Divider'} />
      </View>
    );
  }

  function renderItem({ item }: { item: shoppingListTableElement }) {
    const recipesCount = item.recipesTitle.length;
    const recipesText =
      recipesCount > 1
        ? `${recipesCount} ${t('recipes')}`
        : recipesCount === 1
          ? `1 ${t('recipe')}`
          : '';

    const textStyle: StyleProp<TextStyle> = [
      { ...fonts.bodyMedium },
      item.purchased && { textDecorationLine: 'line-through' },
    ];
    const itemTestId = sectionId + '::' + item.name;
    return (
      <List.Item
        testID={itemTestId}
        title={item.name}
        titleStyle={textStyle}
        descriptionStyle={textStyle}
        description={recipesText}
        left={() => <Checkbox status={item.purchased ? 'checked' : 'unchecked'} />}
        onPress={() => updateShoppingList(item.name)}
        onLongPress={() => {
          setIngredientDataForDialog(item);
          setIsDialogOpen(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {shoppingList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text testID={screenId + '::TextNoItem'} variant='titleMedium'>
            {t('noItemsInShoppingList')}
          </Text>
        </View>
      ) : (
        <SectionList
          testID={sectionId}
          sections={sections}
          keyExtractor={item => item.id?.toString() || item.name}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* Positioned overlay for tutorial highlighting - appears in center where dialog shows */}
      {copilotData && (
        <CopilotStep text={t('tutorial.shopping.description')} order={stepOrder} name={'Shopping'}>
          <CopilotView
            style={{
              position: 'absolute',
              top: '33%',
              left: padding.small,
              right: padding.small,
              height: '55%',
              pointerEvents: 'none',
            }}
          />
        </CopilotStep>
      )}

      <Alert
        isVisible={isDialogOpen}
        confirmText={t('recipeUsingValidation')}
        content={createDialogContent()}
        testId={screenId}
        title={createDialogTitle()}
        onClose={() => {
          setIsDialogOpen(false);
          setIngredientDataForDialog({ name: '', recipesTitle: [] });
        }}
      />
      <Alert
        isVisible={isConfirmationDialogOpen}
        title={t('clearShoppingList')}
        content={t('confirmClearShoppingList')}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
        testId={screenId + '::ClearConfirmation'}
        onConfirm={clearShoppingList}
        onClose={closeClearConfirmation}
      />
      {shoppingList.length > 0 && (
        <BottomTopButton
          testID={screenId + '::ClearShoppingListButton'}
          as={RoundButton}
          position={bottomTopPosition.top_right}
          size={'medium'}
          icon={Icons.trashIcon}
          onPressFunction={showClearConfirmation}
        />
      )}
    </SafeAreaView>
  );
}

export default Shopping;
