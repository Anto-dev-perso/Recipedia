import {Text, TextInput, TextStyle, View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/Icons";
import {screenViews} from "@styles/spacing";

export type TextProp = { style: TextStyle, value: string };
export type RecipeTextAddProps = { editType: 'add', flex: number, openModal: () => void };
export type RecipeTextEditProps = {
    editType: 'editable', textEditable: TextProp, setTextToEdit: React.Dispatch<React.SetStateAction<string>>
};

export type RecipeTextAddOrEditProps =
    {
        testID?: string,
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
        <View style={screenViews.sectionView}>
            {textProps.rootText ? <Text
                style={textProps.rootText.style}>{textProps.rootText.value}</Text> : null}
            {textProps.addOrEditProps ?
                <RecipeTextEditablePart testID={textProps.testID} {...textProps.addOrEditProps}/> : null}

        </View>
    )
}


function RecipeTextEditablePart(addOrEditProps: RecipeTextAddOrEditProps) {
    return (
        <View>
            {addOrEditProps.editType === 'editable' ?
                <TextInput testID={addOrEditProps.testID + "::TextInput"} style={addOrEditProps.textEditable.style}
                           value={addOrEditProps.textEditable.value}
                           onChangeText={newText => addOrEditProps.setTextToEdit(newText)} multiline={true}/>

                : <RoundButton style={{
                    ...viewButtonStyles.centeredView,
                    flex: addOrEditProps.flex,
                }} diameter={mediumButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: plusIcon,
                    size: iconsSize.small,
                    color: "#414a4c"
                }} onPressFunction={addOrEditProps.openModal}/>
            }
        </View>

    )
}
