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
        type: 'addOrEdit',
        prefixText?: string,
    }
    & (RecipeTextAddProps | RecipeTextRenderEditProps);
export type RecipeTextRenderReadOnlyProps = { type: 'readOnly' } & TextRenderProps;

export type  RecipeTextRenderReadOnlyOrAddOrEdit = (RecipeTextRenderReadOnlyProps | RecipeTextRenderAddOrEditProps);

export type RecipeTextRenderProps =
    { testID: string }
    & RecipeTextRenderReadOnlyOrAddOrEdit;
// TODO add a loading, it can take long
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
                                         size={"medium"} icon={plusIcon}
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
