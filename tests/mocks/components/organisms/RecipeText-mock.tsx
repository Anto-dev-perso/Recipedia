import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeTextProps} from "@components/organisms/RecipeText";

export function recipeTextMock(recipeTextProp: RecipeTextProps) {
    return (
        <View>
            <Text testID={recipeTextProp.testID + "::RootText"}>
                {recipeTextProp.rootText.value}
            </Text>
            {recipeTextProp.addOrEditProps ?
                <View>
                    {recipeTextProp.addOrEditProps.editType === 'add' ?
                        <View>
                            <Button testID={recipeTextProp.testID + "::OpenModal"} onPress={() => {
                                // @ts-ignore always edit here
                                recipeTextProp.addOrEditProps.openModal()
                            }}
                                    title="Open Modal"/>
                        </View>
                        :
                        <View>
                            <Text testID={recipeTextProp.testID + "::TextEditable"}>
                                {recipeTextProp.addOrEditProps.textEditable}
                            </Text>
                            <Button testID={recipeTextProp.testID + "::SetTextToEdit"}
                                    onPress={(newText) => {
                                        // @ts-ignore always edit here
                                        recipeTextProp.addOrEditProps.setTextToEdit(newText);
                                    }}
                                    title="Set Text to Edit"/>
                        </View>
                    }
                </View>
                : null}
        </View>
    );
}
