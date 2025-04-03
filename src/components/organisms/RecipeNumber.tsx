import {FlexAlignType, Text, TextInput, TextStyle, View, ViewStyle} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/images/Icons";
import {screenViews} from "@styles/spacing";
import {TextProp} from "@components/organisms/RecipeText";
import {defaultValueNumber} from "@screens/Recipe";

export type NumberProp = { style: TextStyle, value: number };
export type RecipeNumberAddProps = {
    editType: 'add',
    flex: number,
    alignItems?: FlexAlignType,
    openModal: () => void
};
export type RecipeNumberEditProps = {
    editType: 'editable', textEditable: NumberProp, setTextToEdit: React.Dispatch<React.SetStateAction<number>>
};

export type RecipeNumberAddOrEditProps =
    {
        testID?: string,
        editableViewStyle?: ViewStyle,
        prefixText?: TextProp,
        suffixText?: TextProp
    }
    & (RecipeNumberAddProps | RecipeNumberEditProps);

export type RecipeNumberProps =
    {
        rootText?: TextProp,
        addOrEditProps?: RecipeNumberAddOrEditProps,
        testID?: string,
    };

export default function RecipeNumber(textProps: RecipeNumberProps) {
    return (
        <View style={screenViews.sectionView}>
            {textProps.rootText ? <Text
                style={textProps.rootText.style}>{textProps.rootText.value}</Text> : null}
            {textProps.addOrEditProps ?
                <RecipeNumberEditablePart testID={textProps.testID} {...textProps.addOrEditProps}/> : null}

        </View>
    )
}


function RecipeNumberEditablePart(addOrEditProps: RecipeNumberAddOrEditProps) {

    return (
        <View style={addOrEditProps.editableViewStyle}>
            {addOrEditProps.prefixText ?
                <Text style={addOrEditProps.prefixText.style}>{addOrEditProps.prefixText.value}</Text> : null}

            {addOrEditProps.editType === 'editable' ?
                <TextInput testID={addOrEditProps.testID + "::TextInput"} style={addOrEditProps.textEditable.style}
                           value={addOrEditProps.textEditable?.value == defaultValueNumber ? "" : addOrEditProps.textEditable.value.toString()}
                           onChangeText={newNumber => addOrEditProps.setTextToEdit(Number(newNumber))}
                           keyboardType={'numeric'}/>

                : <RoundButton style={{
                    ...viewButtonStyles.centeredView,
                    flex: addOrEditProps.flex,
                    alignItems: addOrEditProps.alignItems
                }} diameter={mediumButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: plusIcon,
                    size: iconsSize.small,
                    color: "#414a4c"
                }} onPressFunction={addOrEditProps.openModal}/>
            }
            {addOrEditProps.suffixText ?
                <Text style={addOrEditProps.suffixText.style}>{addOrEditProps.suffixText.value}</Text> : null}
        </View>

    )
}
