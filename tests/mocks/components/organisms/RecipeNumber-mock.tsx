import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeNumberProps} from "@components/organisms/RecipeNumber";

export function recipeNumberMock(recipeNumberProp: RecipeNumberProps) {
    return (
        <View>
            <View>
                {recipeNumberProp.numberProps.editType === 'read' ?
                    <Text testID={recipeNumberProp.testID + "::Text"}>
                        {recipeNumberProp.numberProps.text}
                    </Text>
                    :
                    <View>
                        <Text testID={recipeNumberProp.testID + "::PrefixText"}>
                            {recipeNumberProp.numberProps.prefixText}
                        </Text>
                        <Text testID={recipeNumberProp.testID + "::SuffixText"}>
                            {recipeNumberProp.numberProps.suffixText}
                        </Text>
                        {recipeNumberProp.numberProps.editType === 'add' ?
                            <Button testID={recipeNumberProp.testID + "::OpenModal"} onPress={() => {
                                // @ts-ignore always edit here
                                recipeNumberProp.numberProps.openModal()
                            }}
                                    title="Open Modal"/>
                            :
                            <View>
                                <Text testID={recipeNumberProp.testID + "::TextEditable"}>
                                    {recipeNumberProp.numberProps.textEditable}
                                </Text>
                                <Button testID={recipeNumberProp.testID + "::SetTextToEdit"}
                                        onPress={(newNumber) => {
                                            // @ts-ignore always edit here
                                            recipeNumberProp.numberProps.setTextToEdit(Number(newNumber));
                                        }}
                                        title="Set Text to Edit"/>
                            </View>}
                    </View>
                }
            </View>
        </View>
    );
}
