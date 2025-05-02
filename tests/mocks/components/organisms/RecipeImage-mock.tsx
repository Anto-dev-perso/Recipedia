import React from "react";
import {Button, Text, View} from "react-native";
import {RecipeImageProps} from "@components/organisms/RecipeImage";
import {recipeColumnsNames} from "@customTypes/DatabaseElementTypes";


export function recipeImageMock(recipeImageProp: RecipeImageProps) {
    return (
        <View>
            <Text testID={recipeImageProp.testID + "::ImgUri"}>
                {recipeImageProp.imgUri}
            </Text>
            <Text testID={recipeImageProp.testID + "::ButtonIcon"}>
                {recipeImageProp.buttonIcon}
            </Text>
            <Button testID={recipeImageProp.testID + "::OpenModal"}
                    onPress={() => {
                        //@ts-ignore addProps is always defined here
                        recipeImageProp.addProps.openModal(recipeColumnsNames.image)
                    }}
                    title="Open Modal"/>
        </View>
    );
}
