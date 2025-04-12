import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeNumberProps} from "@components/organisms/RecipeNumber";

export function recipeNumberMock(recipeNumberProp: RecipeNumberProps) {
    return (
        <View>
            <Text testID={recipeNumberProp.testID + "::RootText"}>
                {JSON.stringify(recipeNumberProp.rootText)}
            </Text>
            {recipeNumberProp.addOrEditProps ?
                <View>
                    {recipeNumberProp.addOrEditProps.editableViewStyle ?
                        <Text testID={recipeNumberProp.testID + "::EditableViewStyle"}>
                            {JSON.stringify(recipeNumberProp.addOrEditProps.editableViewStyle)}
                        </Text> : null}
                    {recipeNumberProp.addOrEditProps.prefixText ?
                        <Text testID={recipeNumberProp.testID + "::PrefixText"}>
                            {JSON.stringify(recipeNumberProp.addOrEditProps.prefixText)}
                        </Text> : null}
                    {recipeNumberProp.addOrEditProps.suffixText ?
                        <Text testID={recipeNumberProp.testID + "::SuffixText"}>
                            {JSON.stringify(recipeNumberProp.addOrEditProps.suffixText)}
                        </Text> : null}
                    {recipeNumberProp.addOrEditProps.editType === 'add' ?
                        <View>
                            <Text testID={recipeNumberProp.testID + "::Flex"}>
                                {JSON.stringify(recipeNumberProp.addOrEditProps.flex)}
                            </Text>
                            {recipeNumberProp.addOrEditProps.alignItems ?
                                <Text testID={recipeNumberProp.testID + "::AlignItems"}>
                                    {JSON.stringify(recipeNumberProp.addOrEditProps.alignItems)}
                                </Text> : null}
                            <Button testID={recipeNumberProp.testID + "::OpenModal"} onPress={() => {
                                // @ts-ignore always edit here
                                recipeNumberProp.addOrEditProps.openModal()
                            }}
                                    title="Open Modal"/>
                        </View>
                        :
                        <View>
                            <Text testID={recipeNumberProp.testID + "::TextEditable"}>
                                {JSON.stringify(recipeNumberProp.addOrEditProps.textEditable)}
                            </Text>
                            <Button testID={recipeNumberProp.testID + "::SetTextToEdit"}
                                    onPress={(newNumber) => {
                                        // @ts-ignore always edit here
                                        recipeNumberProp.addOrEditProps.setTextToEdit(Number(newNumber));
                                    }}
                                    title="Set Text to Edit"/>
                        </View>
                    }
                </View>
                : null}
        </View>
    );
}
