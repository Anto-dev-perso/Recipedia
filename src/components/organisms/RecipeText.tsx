import {FlexAlignType, Text, TextInput, TextStyle, View, ViewStyle} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/images/Icons";
import {screenViews} from "@styles/spacing";

export type TextProp = { style: TextStyle, value: string };
export type RecipeTextAddProps = { editType: 'add', flex: number, alignItems?: FlexAlignType, openModal: () => void };
export type RecipeTextEditProps = {
    editType: 'editable', textEditable: TextProp, setTextToEdit: React.Dispatch<React.SetStateAction<string>>
};

export type RecipeTextAddOrEditProps =
    {
        editableViewStyle?: ViewStyle,
        prefixText?: TextProp,
        suffixText?: TextProp
    }
    & (RecipeTextAddProps | RecipeTextEditProps);

export type RecipeTextProps =
    {
        rootText?: TextProp,
        addOrEditProps?: RecipeTextAddOrEditProps,
        testID?: string,
    };

export default function RecipeText(textProps: RecipeTextProps) {


    return (
        <View style={screenViews.sectionView} testID={textProps.testID}>
            {textProps.rootText ? <Text style={textProps.rootText.style}>{textProps.rootText.value}</Text> : null}
            {textProps.addOrEditProps ? <RecipeTextEditablePart {...textProps.addOrEditProps}/> : null}

        </View>
    )
}


function RecipeTextEditablePart(addOrEditProps: RecipeTextAddOrEditProps) {
    return (
        <View style={addOrEditProps.editableViewStyle}>
            {addOrEditProps.prefixText ?
                <Text style={addOrEditProps.prefixText.style}>{addOrEditProps.prefixText.value}</Text> : null}

            {addOrEditProps.editType === 'editable' ?
                <TextInput style={addOrEditProps.textEditable.style} value={addOrEditProps.textEditable.value}
                           onChangeText={newTitle => addOrEditProps.setTextToEdit(newTitle)} multiline={true}/>

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
