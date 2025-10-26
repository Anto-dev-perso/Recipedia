/**
 * TextRender - Multi-format text display and editing component
 *
 * A highly versatile component that renders arrays of text data in multiple formats
 * including tables, sections, lists, and clickable lists. Features both read-only
 * display and interactive editing modes with specialized layouts for different
 * content types like ingredients, recipe steps, and general text lists.
 *
 * Key Features:
 * - Four distinct rendering modes: ARRAY (table), SECTION, LIST, CLICK_LIST
 * - Dual mode operation: read-only display and interactive editing
 * - Specialized ingredient table with quantity/unit/name columns
 * - Recipe step editing with title and content sections
 * - Autocomplete integration for ingredient names
 * - Internationalization support for all UI text
 * - Flexible styling per render mode
 * - Type-safe render mode enumeration
 *
 * @example
 * ```typescript
 * // Ingredient list with editing
 * <TextRender
 *   testID="ingredient-list"
 *   title="Ingredients"
 *   text={['2 cups|flour', '1 tsp|salt', '3 tbsp|sugar']}
 *   render={typoRender.ARRAY}
 *   editText={{
 *     onChangeFunction: (index, newValue) => updateIngredient(index, newValue)
 *   }}
 * />
 *
 * // Recipe steps display
 * <TextRender
 *   testID="recipe-steps"
 *   title="Preparation"
 *   text={['Mix ingredients|Combine flour and salt in bowl', 'Bake|Place in oven for 25 minutes']}
 *   render={typoRender.SECTION}
 * />
 *
 * // Simple tag list
 * <TextRender
 *   testID="recipe-tags"
 *   text={['vegetarian', 'gluten-free', 'quick']}
 *   render={typoRender.LIST}
 * />
 *
 * // Clickable category list
 * <TextRender
 *   testID="categories"
 *   text={['Breakfast', 'Lunch', 'Dinner', 'Dessert']}
 *   render={typoRender.CLICK_LIST}
 *   onClick={(category) => filterByCategory(category)}
 * />
 * ```
 */

import { screenViews } from '@styles/spacing';
import {
  editableText,
  textSeparator,
  typoRender,
  typoStyles,
  unitySeparator,
} from '@styles/typography';
import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import TextInputWithDropDown from '@components/molecules/TextInputWithDropDown';
import RecipeDatabase from '@utils/RecipeDatabase';
import { recipeTextRenderStyles } from '@styles/recipeComponents';
import CustomTextInput from '@components/atomic/CustomTextInput';
import NumericTextInput from '@components/atomic/NumericTextInput';
import { useI18n } from '@utils/i18n';
import { uiLogger } from '@utils/logger';
import { preparationStepElement } from '@customTypes/DatabaseElementTypes';
import { defaultValueNumber } from '@utils/Constants';

/**
 * Props for the TextRender component
 */
export type TextRenderProps = {
  /** Unique identifier for testing and accessibility */
  testID?: string;
  /** Optional title displayed above the content */
  title?: string;
  /** Array of text strings or preparation to render */
  text: Array<string | preparationStepElement>;
  /** Rendering mode determining layout and interaction */
  render: typoRender;
  /** Callback fired when clickable list items are pressed */
  onClick?(param: string): void;
  /** Configuration for edit mode functionality */
  editText?: editableText;
};

/**
 * Parses a quantity string to a number, handling comma decimal separators
 * @param quantity - The quantity string to parse (may contain comma as decimal separator)
 * @returns Parsed number or defaultValueNumber if invalid
 */
function parseQuantity(quantity: string): number {
  const normalizedQuantity = quantity.replace(',', '.');
  const parsed = parseFloat(normalizedQuantity);
  return isNaN(parsed) ? defaultValueNumber : parsed;
}

/**
 * TextRender component for multi-format text display and editing
 *
 * @param props - The component props
 * @returns JSX element representing formatted text content with optional editing capabilities
 */
export function TextRender(props: TextRenderProps) {
  const { t } = useI18n();

  function selectRender(renderChoice: typoRender) {
    switch (renderChoice) {
      case typoRender.ARRAY:
        return props.text.map((item, index) => renderAsTable(item as string, index));
      case typoRender.SECTION:
        return props.text.map((item, index) =>
          renderAsSection(item as preparationStepElement, index)
        );
      case typoRender.LIST:
        return props.text.map((item, index) => renderAsList(item as string, index));
      case typoRender.CLICK_LIST:
        return props.text.map((item, index) => renderAsClickableList(item as string, index));
      default:
        uiLogger.warn('Unrecognized render choice in TextRender', { renderChoice });
    }
  }

  // TODO split into separate files all these render functions
  function renderAsTable(item: string, index: number) {
    // For now, only 2 columns are render
    // So far; only ingredients use this
    const [unitAndQuantity, ingName] = item.split(textSeparator);
    const [quantity, unit] = unitAndQuantity.split(unitySeparator);

    const ingredientsList = RecipeDatabase.getInstance()
      .get_ingredients()
      .map(ingredient => ingredient.name)
      .sort();

    return (
      <View key={index}>
        {props.editText ? (
          <View style={screenViews.tabView}>
            <NumericTextInput
              testID={props.testID + `::${index}::QuantityInput::NumericTextInput`}
              style={recipeTextRenderStyles.firstColumn as StyleProp<TextStyle>}
              contentStyle={recipeTextRenderStyles.columnContentStyle}
              value={parseQuantity(quantity)}
              onChangeValue={newQuantity => {
                const currentItem = props.text[index] as string;
                const [currentUnitAndQuantity, currentIngName] = currentItem.split(textSeparator);
                const [, currentUnit] = currentUnitAndQuantity.split(unitySeparator);

                props.editText?.onChangeFunction(
                  index,
                  `${newQuantity}${unitySeparator}${currentUnit}${textSeparator}${currentIngName}`
                );
              }}
            />
            <CustomTextInput
              testID={props.testID + `::${index}::Unit`}
              value={unit}
              style={recipeTextRenderStyles.secondColumn}
              contentStyle={recipeTextRenderStyles.columnContentStyle}
              editable={false}
            />
            <TextInputWithDropDown
              testID={props.testID + `::${index}::Dropdown`}
              style={recipeTextRenderStyles.thirdColumn}
              contentStyle={recipeTextRenderStyles.columnContentStyle}
              absoluteDropDown={true}
              referenceTextArray={ingredientsList}
              value={ingName}
              onValidate={newIngredientName => {
                // Get current ingredient data from props.text
                const currentItem = props.text[index] as string;
                const [currentUnitAndQuantity] = currentItem.split(textSeparator);

                props.editText?.onChangeFunction(
                  index,
                  `${currentUnitAndQuantity}${textSeparator}${newIngredientName}`
                );
              }}
            />
          </View>
        ) : (
          <View style={screenViews.tabView}>
            <Text
              testID={props.testID + `::${index}::QuantityAndUnit`}
              variant={'titleMedium'}
              style={{ flex: 1 }}
            >
              {quantity} {unit}
            </Text>
            <Text
              testID={props.testID + `::${index}::IngredientName`}
              variant={'titleMedium'}
              style={{ flex: 3 }}
            >
              {ingName}
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderAsSection(item: preparationStepElement, index: number) {
    // Section rendering is only for preparationStepElement (recipe preparation steps)

    return (
      <View key={index}>
        {props.editText ? (
          <View style={recipeTextRenderStyles.containerSection}>
            <Text
              testID={props.testID + `::${index}::Step`}
              variant={'headlineMedium'}
              style={recipeTextRenderStyles.headlineElement}
            >
              {t('preparationOCRStep')} {index + 1}
            </Text>

            <View style={recipeTextRenderStyles.containerSection}>
              <Text
                testID={props.testID + `::${index}::Title`}
                variant={'titleLarge'}
                style={recipeTextRenderStyles.containerElement}
              >
                {t('preparationOCRStepTitle')} {index + 1} :{' '}
              </Text>
              <CustomTextInput
                testID={props.testID + `::${index}::TextInputTitle`}
                value={item.title}
                style={recipeTextRenderStyles.containerElement}
                onChangeText={newTitle => {
                  if (props.editText?.onTitleChangeFunction) {
                    props.editText.onTitleChangeFunction(index, newTitle);
                  } else {
                    // Get current step data from props.text
                    const currentItem = props.text[index] as preparationStepElement;
                    props.editText?.onChangeFunction(
                      index,
                      `${newTitle}${textSeparator}${currentItem.description}`
                    );
                  }
                }}
                multiline={true}
              />
              <Text
                testID={props.testID + `::${index}::Content`}
                variant={'titleLarge'}
                style={recipeTextRenderStyles.containerElement}
              >
                {t('preparationOCRStepContent')} {index + 1} :{' '}
              </Text>
              <CustomTextInput
                testID={props.testID + `::${index}::TextInputContent`}
                style={recipeTextRenderStyles.containerElement}
                value={item.description}
                onChangeText={newParagraph => {
                  if (props.editText?.onDescriptionChangeFunction) {
                    props.editText.onDescriptionChangeFunction(index, newParagraph);
                  } else {
                    // Get current step data from props.text
                    const currentItem = props.text[index] as preparationStepElement;
                    props.editText?.onChangeFunction(
                      index,
                      `${currentItem.title}${textSeparator}${newParagraph}`
                    );
                  }
                }}
                multiline={true}
              />
            </View>
          </View>
        ) : (
          <View style={recipeTextRenderStyles.containerSection}>
            <Text
              testID={props.testID + `::${index}::SectionTitle`}
              variant={'titleLarge'}
              style={recipeTextRenderStyles.headlineElement}
            >
              {index + 1}) {item.title}
            </Text>
            <Text
              testID={props.testID + `::${index}::SectionParagraph`}
              variant={'titleMedium'}
              style={recipeTextRenderStyles.containerElement}
            >
              {item.description}
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderAsList(item: string, index: number) {
    return (
      <Text key={index} variant={'titleMedium'}>
        {item}
      </Text>
    );
  }

  function renderAsClickableList(item: string, index: number) {
    return (
      <TouchableOpacity
        key={index}
        style={screenViews.clickableListView}
        onPress={() => {
          props.onClick
            ? props.onClick(item)
            : uiLogger.warn('Missing onClick handler in renderAsClickableList');
        }}
      >
        <Text style={typoStyles.paragraph}>{item}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      {props.title ? (
        <Text
          testID={props.testID + '::Title'}
          variant={'headlineSmall'}
          style={recipeTextRenderStyles.containerElement}
        >
          {props.title}
        </Text>
      ) : null}
      {selectRender(props.render)}
    </View>
  );
}

export default TextRender;
