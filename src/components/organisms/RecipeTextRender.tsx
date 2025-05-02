import {View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons, plusIcon} from "@assets/Icons";
import TextRender, {TextRenderProps} from "@components/molecules/TextRender";
import {RecipeTextAddProps} from "@components/organisms/RecipeText";
import {typoRender} from "@styles/typography";
import {recipeTextRenderStyles} from "@styles/recipeComponents";
import {Text} from "react-native-paper";

export type RecipeTextRenderEditProps = {
    editType: 'editable',
    textEditable: Array<string>,
    renderType: typoRender,

    textEdited: (oldTextId: number, newText: string) => void,
    addNewText: () => void,

    columnTitles?: {
        column1: string,
        column2: string,
        column3: string,
    }
};

export type RecipeTextRenderAddOrEditProps =
    {
        testID?: string,
        type: 'addOrEdit',
        prefixText?: string,
    }
    & (RecipeTextAddProps | RecipeTextRenderEditProps);
export type RecipeTextRenderReadOnlyProps = { type: 'readOnly' } & TextRenderProps;

export type RecipeTextRenderProps =
    { testID?: string }
    & (RecipeTextRenderReadOnlyProps | RecipeTextRenderAddOrEditProps);

export default function RecipeTextRender(textRenderProps: RecipeTextRenderProps) {

    return (
        <View style={recipeTextRenderStyles.containerSection} testID={textRenderProps.testID}>
            {textRenderProps.type === 'readOnly' ?
                <TextRender text={textRenderProps.text} render={textRenderProps.render}/>
                : <RecipeTextRenderEditablePart testID={textRenderProps.testID} {...textRenderProps} />
            }
        </View>
    )
}

function RecipeTextRenderEditablePart(addOrEditProps: RecipeTextRenderAddOrEditProps) {
    return (
        <View>
            {addOrEditProps.prefixText ?
                <Text variant={"headlineSmall"}
                      style={recipeTextRenderStyles.containerElement}>{addOrEditProps.prefixText}</Text> : null}

            {addOrEditProps.editType === 'editable' ?
                <View>
                    {addOrEditProps.columnTitles ?
                        <View style={recipeTextRenderStyles.tagView}>
                            <Text variant={"titleMedium"}
                                  style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.firstColumn}}>{addOrEditProps.columnTitles.column1}</Text>
                            <Text variant={"titleMedium"}
                                  style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.secondColumn}}>{addOrEditProps.columnTitles.column2}</Text>
                            <Text variant={"titleMedium"}
                                  style={{...recipeTextRenderStyles.containerElement, ...recipeTextRenderStyles.thirdColumn}}>{addOrEditProps.columnTitles.column3}</Text>
                        </View> : null}

                    {/* TODO : Make it as a choice to avoid errors */}
                    <TextRender testID={addOrEditProps.testID} text={addOrEditProps.textEditable}
                                render={addOrEditProps.renderType}
                                editText={{withBorder: true, onChangeFunction: addOrEditProps.textEdited}}/>

                    <RoundButton testID={addOrEditProps.testID} size={"medium"} icon={plusIcon}
                                 onPressFunction={addOrEditProps.addNewText}
                                 style={recipeTextRenderStyles.roundButtonPadding}/>
                </View>
                :
                <View style={recipeTextRenderStyles.roundButtonPadding}>
                    <RoundButton testID={addOrEditProps.testID} size={"medium"} icon={Icons.scanImageIcon}
                                 onPressFunction={addOrEditProps.openModal}/>
                </View>
            }
        </View>
    )
}
