/**
 * RecipeTextRender - Advanced text rendering with editing capabilities for recipes
 * 
 * A sophisticated text rendering component designed specifically for recipe content
 * with comprehensive editing capabilities. Features dual-mode operation for read-only
 * display and interactive editing with support for structured data like ingredients
 * and preparation steps.
 * 
 * Key Features:
 * - Dual mode: read-only display and interactive editing
 * - Support for structured recipe data (ingredients, steps)
 * - Column-based layout for ingredient editing
 * - OCR integration for content addition via image scanning
 * - Dynamic content addition with add buttons
 * - Flexible text rendering based on content type
 * - Responsive styling for different screen contexts
 * 
 * @example
 * ```typescript
 * // Read-only recipe display
 * <RecipeTextRender
 *   type="readOnly"
 *   testID="recipe-ingredients"
 *   text={recipe.ingredients}
 *   render={typoRender.ARRAY}
 * />
 * 
 * // Editable ingredient list with columns
 * <RecipeTextRender
 *   type="addOrEdit"
 *   editType="editable"
 *   prefixText="Ingredients"
 *   testID="ingredient-editor"
 *   textEditable={editableIngredients}
 *   renderType={typoRender.ARRAY}
 *   columnTitles={{
 *     column1: "Quantity",
 *     column2: "Unit", 
 *     column3: "Ingredient"
 *   }}
 *   textEdited={(index, newText) => updateIngredient(index, newText)}
 *   addNewText={() => addNewIngredient()}
 * />
 * 
 * // OCR-based content addition
 * <RecipeTextRender
 *   type="addOrEdit"
 *   editType="add"
 *   prefixText="Instructions"
 *   testID="instruction-scanner"
 *   openModal={() => openOCRModal()}
 * />
 * ```
 */

import {View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import TextRender, {TextRenderProps} from "@components/molecules/TextRender";
import {RecipeTextAddProps} from "@components/organisms/RecipeText";
import {typoRender} from "@styles/typography";
import {recipeTextRenderStyles} from "@styles/recipeComponents";
import {Text} from "react-native-paper";

/** Props for editable text rendering mode */
export type RecipeTextRenderEditProps = {
    editType: 'editable',
    /** Array of editable text strings */
    textEditable: Array<string>,
    /** Type of rendering to apply to the text */
    renderType: typoRender,
    /** Callback fired when text is edited */
    textEdited: (oldTextId: number, newText: string) => void,
    /** Callback fired to add new text item */
    addNewText: () => void,
    /** Optional column titles for table-like rendering */
    columnTitles?: {
        column1: string,
        column2: string,
        column3: string,
    }
};

/** Props for add/edit modes with discriminated union */
export type RecipeTextRenderAddOrEditProps =
    {
        type: 'addOrEdit',
        /** Optional prefix text to display above content */
        prefixText?: string,
    }
    & (RecipeTextAddProps | RecipeTextRenderEditProps);

/** Props for read-only mode */
export type RecipeTextRenderReadOnlyProps = { type: 'readOnly' } & TextRenderProps;

/** Union type for all possible component configurations */
export type  RecipeTextRenderReadOnlyOrAddOrEdit = (RecipeTextRenderReadOnlyProps | RecipeTextRenderAddOrEditProps);

/**
 * Props for the RecipeTextRender component
 */
export type RecipeTextRenderProps =
    { 
        /** Unique identifier for testing and accessibility */
        testID: string 
    }
    & RecipeTextRenderReadOnlyOrAddOrEdit;
/**
 * RecipeTextRender component for advanced recipe text rendering and editing
 * 
 * @param textRenderProps - The component props with mode-specific configuration
 * @returns JSX element representing recipe text with optional editing capabilities
 */
export default function RecipeTextRender(textRenderProps: RecipeTextRenderProps) {
    return (
        <View style={recipeTextRenderStyles.containerSection}>
            {textRenderProps.type === 'readOnly' ?
                <TextRender testID={textRenderProps.testID + "::TextRender"} text={textRenderProps.text}
                            render={textRenderProps.render}/>
                :
                <View>
                    {textRenderProps.prefixText ?
                        <Text testID={textRenderProps.testID + "::PrefixText"} variant={"headlineSmall"}
                              style={recipeTextRenderStyles.containerElement}>{textRenderProps.prefixText}</Text> : null}

                    {textRenderProps.editType === 'editable' ?
                        <View>
                            {textRenderProps.columnTitles ?
                                <View style={recipeTextRenderStyles.tagView}>
                                    <Text testID={textRenderProps.testID + "::Column1"} variant={"titleMedium"}
                                          style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.firstColumn}}>{textRenderProps.columnTitles.column1}</Text>
                                    <Text testID={textRenderProps.testID + "::Column2"} variant={"titleMedium"}
                                          style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.secondColumn}}>{textRenderProps.columnTitles.column2}</Text>
                                    <Text testID={textRenderProps.testID + "::Column3"} variant={"titleMedium"}
                                          style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.thirdColumn}}>{textRenderProps.columnTitles.column3}</Text>
                                </View> : null}
                            <TextRender testID={`${textRenderProps.testID}::TextRender`}
                                        text={textRenderProps.textEditable}
                                        render={textRenderProps.renderType}
                                        editText={{
                                            withBorder: true,
                                            onChangeFunction: textRenderProps.textEdited
                                        }}/>

                            <RoundButton testID={`${textRenderProps.testID}::AddButton`}
                                         size={"medium"} icon={Icons.plusIcon}
                                         onPressFunction={textRenderProps.addNewText}
                                         style={recipeTextRenderStyles.roundButtonPadding}/>
                        </View>
                        :
                        <View style={recipeTextRenderStyles.roundButtonPadding}>
                            <RoundButton testID={`${textRenderProps.testID}::OpenModal`}
                                         size={"medium"}
                                         icon={Icons.scanImageIcon}
                                         onPressFunction={textRenderProps.openModal}/>
                        </View>
                    }
                </View>
            }
        </View>
    )
}
