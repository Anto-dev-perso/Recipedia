import React from "react"
import {Pressable, View} from "react-native"
import {squareButtonStyles, viewInsideButtonCentered} from "@styles/buttons"


import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import CustomImage from "@components/atomic/CustomImage";

type propIsRecipe = { type: 'recipe', recipe: recipeTableElement };
type propIsImg = { type: 'image', imgSrc: string };

export type SquareButtonProps = {
    side: number,
    onPressFunction: () => void,
    testID: string,
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
                <CustomImage testID={buttonProps.testID + "::SquareButton"} uri={img}/>
            </View>
        </Pressable>
    )
}
