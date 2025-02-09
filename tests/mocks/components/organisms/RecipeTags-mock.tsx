import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeTagProps} from "@components/organisms/RecipeTags";


export function recipeTagsMock(recipeTagProp: RecipeTagProps) {
    return (
        <View>
            <Text testID={recipeTagProp.testID + "::TagsList"}>
                {JSON.stringify(recipeTagProp.tagsList)}
            </Text>
            {recipeTagProp.type === 'readOnly' ?
                <Button testID={recipeTagProp.testID + "::OnPress"}
                        onPress={() => recipeTagProp.onPress()}
                        title="Add Filter"/>
                :
                <View>
                    <Text testID={recipeTagProp.testID + "::RandomTags"}>
                        {JSON.stringify(recipeTagProp.randomTags)}
                    </Text>
                    <Button testID={recipeTagProp.testID + "::AddNewTag"}
                            onPress={() => recipeTagProp.addNewTag()}
                            title="Add New Tag"/>
                    <Button testID={recipeTagProp.testID + "::ChangeTag"}
                            onPress={() => recipeTagProp.changeTag(recipeTagProp.tagsList[0], recipeTagProp.tagsList[0] + ' changed')}
                            title="Change Tag"/>
                </View>
            }
        </View>
    );
}
