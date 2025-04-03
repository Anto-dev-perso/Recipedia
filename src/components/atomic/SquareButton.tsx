import React from "react"
import {Image} from 'expo-image';
import {Pressable, View} from "react-native"
import {squareButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"


import {recipeTableElement} from "@customTypes/DatabaseElementTypes";

type propIsRecipe = { type: 'recipe', recipe: recipeTableElement };
type propIsImg = { type: 'image', imgSrc: string };

export type SquareButtonProps = {
    side: number,
    onPressFunction: () => void
} & (propIsRecipe | propIsImg)


export default function SquareButton(buttonProps: SquareButtonProps) {
    let img: string;
    switch (buttonProps.type) {
        case "recipe":
            img = buttonProps.recipe.image_Source;
            break;
        case "image":
            img = buttonProps.imgSrc;
            break;
    }


    return (
        <Pressable style={squareButtonStyles(buttonProps.side).squareButton} onPress={buttonProps.onPressFunction}>
            <View style={viewInsideButtonCentered}>
                <Image source={{uri: img}} style={viewButtonStyles.imageInsideButton}
                       onError={() => {
                           // console.log("Image not found")
                       }}/>
            </View>
        </Pressable>
    )
}
