import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeTextProps} from "@components/organisms/RecipeText";

export function recipeTextMock(recipeTextProp: RecipeTextProps) {
    return (
        <View>
            <Text testID={recipeTextProp.testID + "::RootText"}>
                {JSON.stringify(recipeTextProp.rootText)}
            </Text>
            {recipeTextProp.addOrEditProps ?
                <View>
                    {recipeTextProp.addOrEditProps.editType === 'add' ?
                        <View>
                            <Text testID={recipeTextProp.testID + "::Flex"}>
                                {JSON.stringify(recipeTextProp.addOrEditProps.flex)}
                            </Text>
                            <Button testID={recipeTextProp.testID + "::OpenModal"} onPress={() => {
                                // @ts-ignore always edit here
                                recipeTextProp.addOrEditProps.openModal()
                            }}
                                    title="Open Modal"/>
                        </View>
                        :
                        <View>
                            <Text testID={recipeTextProp.testID + "::TextEditable"}>
                                {JSON.stringify(recipeTextProp.addOrEditProps.textEditable)}
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
