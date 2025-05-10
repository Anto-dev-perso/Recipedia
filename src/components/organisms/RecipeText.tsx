import {View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import {Text} from "react-native-paper";
import {recipeTextStyles} from "@styles/recipeComponents";
import {VariantProp} from "react-native-paper/lib/typescript/components/Typography/types";
import CustomTextInput from "@components/atomic/CustomTextInput";

export type TextProp = { style: 'headline' | 'title' | 'paragraph', value: string };
export type RecipeTextAddProps = { editType: 'add', openModal: () => void };
export type RecipeTextEditProps = {
    editType: 'editable', textEditable: string, setTextToEdit: React.Dispatch<React.SetStateAction<string>>
};

export type RecipeTextAddOrEditProps =
    {
        testID?: string,
    }
    & (RecipeTextAddProps | RecipeTextEditProps);

export type RecipeTextProps =
    {
        rootText: TextProp,
        addOrEditProps?: RecipeTextAddOrEditProps,
        testID?: string,
    };

export default function RecipeText({rootText, testID, addOrEditProps}: RecipeTextProps) {

    const containerStyle = (addOrEditProps?.editType === 'add' ? recipeTextStyles.containerTab : recipeTextStyles.containerSection);

    let variant: VariantProp<never>;
    switch (rootText.style) {
        case "headline":
            variant = "headlineMedium";
            break;
        case "title":
            variant = "headlineSmall";
            break;
        case "paragraph":
            variant = "bodyLarge";
            break;
    }

    return (
        <View style={containerStyle}>
            <Text testID={testID + "::Text"} variant={variant}
                  style={recipeTextStyles.containerElement}>{rootText.value}</Text>
            {addOrEditProps ?
                <RecipeTextEditablePart testID={testID} {...addOrEditProps}/> : null}
        </View>
    )
}


function RecipeTextEditablePart(addOrEditProps: RecipeTextAddOrEditProps) {
    return (
        <View>
            {addOrEditProps.editType === 'editable' ?
                <CustomTextInput testID={addOrEditProps.testID}
                                 style={recipeTextStyles.containerElement}
                                 value={addOrEditProps.textEditable} multiline={true}
                                 onChangeText={newText => addOrEditProps.setTextToEdit(newText)}/>

                :
                <RoundButton testID={addOrEditProps.testID + "::OpenModal"} size={"medium"} icon={Icons.scanImageIcon}
                             onPressFunction={addOrEditProps.openModal}/>
            }
        </View>

    )
}
