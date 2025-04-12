import {Text, View, ViewStyle} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/Icons";
import {screenViews} from "@styles/spacing";
import TextRender, {TextRenderProps} from "@components/molecules/TextRender";
import {RecipeTextAddProps, TextProp} from "@components/organisms/RecipeText";
import {typoRender} from "@styles/typography";

export type RecipeTextRenderEditProps = {
    editType: 'editable',
    textEditable: Array<string>,
    renderType: typoRender,

    textEdited: (oldTextId: number, newText: string) => void,
    addNewText: () => void,

    columnTitles?: {
        column1: TextProp,
        column2: TextProp,
        column3: TextProp,
    }
};

export type RecipeTextRenderAddOrEditProps =
    {
        testID?: string,
        type: 'addOrEdit',
        viewAddButton: ViewStyle,
        prefixText?: TextProp,
        suffixText?: TextProp
    }
    & (RecipeTextAddProps | RecipeTextRenderEditProps);
export type RecipeTextRenderReadOnlyProps = { type: 'readOnly' } & TextRenderProps;

export type RecipeTextRenderProps =
    { testID?: string }
    & (RecipeTextRenderReadOnlyProps | RecipeTextRenderAddOrEditProps);

export default function RecipeTextRender(textRenderProps: RecipeTextRenderProps) {

    return (
        <View style={screenViews.sectionView} testID={textRenderProps.testID}>
            {textRenderProps.type === 'readOnly' ?
                <TextRender text={textRenderProps.text} render={textRenderProps.render}/>
                : <RecipeTextRenderEditablePart testID={textRenderProps.testID} {...textRenderProps} />
            }
        </View>
    )
}

function RecipeTextRenderEditablePart(addOrEditProps: RecipeTextRenderAddOrEditProps) {
    const testIDRoundButton = addOrEditProps.testID + "::RoundButton";
    return (
        <View>
            {addOrEditProps.prefixText ?
                <Text style={addOrEditProps.prefixText.style}>{addOrEditProps.prefixText.value}</Text> : null}

            {addOrEditProps.editType === 'editable' ?
                <View>
                    {addOrEditProps.columnTitles ? <View style={screenViews.tabView}>
                        <Text
                            style={addOrEditProps.columnTitles.column1.style}>{addOrEditProps.columnTitles.column1.value}</Text>
                        <Text
                            style={addOrEditProps.columnTitles.column2.style}>{addOrEditProps.columnTitles.column2.value}</Text>
                        <Text
                            style={addOrEditProps.columnTitles.column3.style}>{addOrEditProps.columnTitles.column3.value}</Text>
                    </View> : null}

                    {/* TODO : Make it as a choice to avoid errors */}
                    <TextRender testID={addOrEditProps.testID} text={addOrEditProps.textEditable}
                                render={addOrEditProps.renderType}
                                editText={{withBorder: true, onChangeFunction: addOrEditProps.textEdited}}/>

                    <View style={addOrEditProps.viewAddButton}>
                        <RoundButton testID={testIDRoundButton} diameter={mediumButtonDiameter}
                                     icon={{
                                         type: enumIconTypes.materialCommunity,
                                         name: plusIcon,
                                         size: iconsSize.small,
                                         color: "#414a4c"
                                     }} onPressFunction={addOrEditProps.addNewText}/>
                    </View>
                </View>
                :
                <View style={viewButtonStyles.centeredView}>
                    <RoundButton testID={testIDRoundButton} diameter={mediumButtonDiameter}
                                 icon={{
                                     type: enumIconTypes.materialCommunity,
                                     name: plusIcon,
                                     size: iconsSize.small,
                                     color: "#414a4c"
                                 }} onPressFunction={addOrEditProps.openModal}/>
                </View>
            }
        </View>
    )
}
