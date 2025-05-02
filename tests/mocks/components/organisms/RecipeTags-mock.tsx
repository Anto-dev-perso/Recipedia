import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeTagProps} from "@components/organisms/RecipeTags";

export function recipeTagsMock(recipeTagProp: RecipeTagProps) {

    return (
        <View>
            <Text testID={recipeTagProp.testID + "::TagsList"}>
                {JSON.stringify(recipeTagProp.tagsList)}
            </Text>
            {recipeTagProp.type === 'readOnly' ? null :
                <View>
                    <Text testID={recipeTagProp.testID + "::RandomTags"}>
                        {recipeTagProp.randomTags}
                    </Text>
                    <Button testID={recipeTagProp.testID + "::AddNewTag"}
                            onPress={() => recipeTagProp.addNewTag(recipeTagProp.tagsList[0])}
                            title="Add New Tag"/>
                    <Button testID={recipeTagProp.testID + "::RemoveTag"}
                            onPress={() => recipeTagProp.removeTag(recipeTagProp.tagsList[0])}
                            title="Change Tag"/>
                </View>
            }
        </View>
    );
}
