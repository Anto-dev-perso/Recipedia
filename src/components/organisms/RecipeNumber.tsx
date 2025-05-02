import {View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import {defaultValueNumber} from "@utils/Constants";
import {recipeNumberStyles, recipeTextStyles} from "@styles/recipeComponents";
import {Text, TextInput} from 'react-native-paper'

export type RecipeNumberAddProps = {
    editType: 'add',
    openModal: () => void
};

export type RecipeNumberEditProps = {
    editType: 'editable', textEditable: number, setTextToEdit: React.Dispatch<React.SetStateAction<number>>
};

export type RecipeNumberAddOrEditProps =
    {
        testID?: string,
        prefixText?: string,
        suffixText?: string,
    }
    & (RecipeNumberAddProps | RecipeNumberEditProps);

export type RecipeNumberReadOnlyProps = { editType: 'read', text: string };

export type RecipeNumberReadAddOrEditProps = RecipeNumberAddOrEditProps | RecipeNumberReadOnlyProps;

export type RecipeNumberProps =
    {
        numberProps: RecipeNumberReadAddOrEditProps,
        testID?: string,
    };

export default function RecipeNumber({testID, numberProps}: RecipeNumberProps) {
    return (
        <View style={recipeTextStyles.containerSection}>
            {numberProps.editType === 'read' ?
                <Text variant={"headlineMedium"}
                      style={{marginVertical: 20}}>{numberProps.text}</Text>
                :
                <RecipeNumberEditablePart testID={testID} {...numberProps}/>}
        </View>
    )
}


function RecipeNumberEditablePart(addOrEditProps: RecipeNumberAddOrEditProps) {
    return (
        <View style={recipeNumberStyles.editableView}>
            {addOrEditProps.prefixText ?
                <Text variant={"titleMedium"}>{addOrEditProps.prefixText}</Text> : null}

            {addOrEditProps.editType === 'editable' ?
                <TextInput testID={addOrEditProps.testID + "::TextInput"}
                           mode={"outlined"}
                           value={addOrEditProps.textEditable == defaultValueNumber ? "" : addOrEditProps.textEditable.toString()}
                           onChangeText={newNumber => addOrEditProps.setTextToEdit(Number(newNumber))}
                           keyboardType={'numeric'}/>

                : <RoundButton testID={addOrEditProps.testID + "::OpenModal"} size={"medium"} icon={Icons.scanImageIcon}
                               onPressFunction={addOrEditProps.openModal}/>
            }
            {addOrEditProps.suffixText ?
                <Text variant={"titleMedium"}>{addOrEditProps.suffixText}</Text> : null}
        </View>

    )
}
