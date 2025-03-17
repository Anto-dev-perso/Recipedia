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
            {recipeImageProp.addProps ?
                <View>
                    <Button testID={recipeImageProp.testID + "::SetImgUri"}
                            onPress={(newUri) => {
                                //@ts-ignore addProps is always defined here
                                recipeImageProp.addProps.setImgUri(newUri)
                            }}
                            title="Set Img Uri"/>
                    <Button testID={recipeImageProp.testID + "::OpenModal"}
                            onPress={() => {
                                //@ts-ignore addProps is always defined here
                                recipeImageProp.addProps.openModal(recipeColumnsNames.image)
                            }}
                            title="Open Modal"/>
                </View>
                : null}
        </View>
    );
}
