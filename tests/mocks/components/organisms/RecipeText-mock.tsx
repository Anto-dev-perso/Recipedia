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
                    <Text testID={recipeTextProp.testID + "::EditableViewStyle"}>
                        {JSON.stringify(recipeTextProp.addOrEditProps.editableViewStyle)}
                    </Text>
                    <Text testID={recipeTextProp.testID + "::PrefixText"}>
                        {JSON.stringify(recipeTextProp.addOrEditProps.prefixText)}
                    </Text>
                    <Text testID={recipeTextProp.testID + "::SuffixText"}>
                        {JSON.stringify(recipeTextProp.addOrEditProps.suffixText)}
                    </Text>
                    {recipeTextProp.addOrEditProps.editType === 'add' ?
                        <View>
                            <Text testID={recipeTextProp.testID + "::Flex"}>
                                {JSON.stringify(recipeTextProp.addOrEditProps.flex)}
                            </Text>
                            <Text testID={recipeTextProp.testID + "::AlignItems"}>
                                {JSON.stringify(recipeTextProp.addOrEditProps.alignItems)}
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
                                    onPress={(newString) => {
                                        // @ts-ignore always edit here
                                        recipeTextProp.addOrEditProps.setTextToEdit(newString);
                                    }}
                                    title="Set Text to Edit"/>
                        </View>
                    }
                </View>
                : null}
        </View>
    );
}
