import {View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import {defaultValueNumber} from "@utils/Constants";
import {recipeNumberStyles, recipeTextStyles} from "@styles/recipeComponents";
import {Text} from 'react-native-paper'
import {VariantProp} from "react-native-paper/lib/typescript/components/Typography/types";
import CustomTextInput from "@components/atomic/CustomTextInput";

export type RecipeNumberAddProps = {
    editType: 'add',
    openModal: () => void,
    manuallyFill: () => void,
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
        testID: string,
    };

export default function RecipeNumber({testID, numberProps}: RecipeNumberProps) {
    return (
        <View style={recipeTextStyles.containerSection}>
            {numberProps.editType === 'read' ?
                <Text testID={testID + "::Text"} variant={"headlineMedium"}
                      style={{marginVertical: 20}}>{numberProps.text}</Text>
                :
                <RecipeNumberEditablePart testID={testID} {...numberProps}/>}
        </View>
    )
}


function RecipeNumberEditablePart(addOrEditProps: RecipeNumberAddOrEditProps) {

    const view = addOrEditProps.editType === "editable" ? recipeNumberStyles.editableView : recipeNumberStyles.addView;
    const prefixVariant: VariantProp<never> = addOrEditProps.editType === "editable" ? "titleMedium" : "headlineSmall";
    return (
        <View style={view}>
            <Text testID={addOrEditProps.testID + "::PrefixText"}
                  variant={prefixVariant}>{addOrEditProps.prefixText}</Text>
            {addOrEditProps.editType === 'editable' ?
                <CustomTextInput testID={addOrEditProps.testID}
                                 value={addOrEditProps.textEditable == defaultValueNumber ? "" : addOrEditProps.textEditable.toString()}
                                 onChangeText={newNumber => addOrEditProps.setTextToEdit(Number(newNumber))}
                                 keyboardType={'numeric'}
                />
                : <View style={recipeNumberStyles.roundButtonsContainer}>
                    <View style={recipeNumberStyles.roundButton}>
                        <RoundButton testID={addOrEditProps.testID + "::OpenModal"} size={"medium"}
                                     icon={Icons.scanImageIcon}
                                     onPressFunction={addOrEditProps.openModal}/>
                    </View>
                    <View style={recipeNumberStyles.roundButton}>
                        <RoundButton testID={addOrEditProps.testID + "::ManuallyFill"} size={"medium"}
                                     icon={Icons.pencilIcon}
                                     onPressFunction={addOrEditProps.manuallyFill}/>
                    </View>
                </View>

            }
            <Text testID={addOrEditProps.testID + "::SuffixText"}
                  variant={"titleMedium"}>{addOrEditProps.suffixText}</Text>
        </View>

    )
}
