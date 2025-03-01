import React from "react"
import {Image} from 'expo-image';
import {Pressable, View} from "react-native"
import {squareButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"


// import Icon from 'react-native-vector-icons/FontAwesome';
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {localImgData} from "@customTypes/ImageTypes";

type propIsRecipe = { type: 'recipe', recipe: recipeTableElement };
type propIsImg = { type: 'image', imgSrc: localImgData };

export type SquareButtonProps = {
    side: number,
    onPressFunction: () => void
} & (propIsRecipe | propIsImg)


export default function SquareButton(buttonProps: SquareButtonProps) {
    let img: localImgData;
    switch (buttonProps.type) {
        case "recipe":
            img = {uri: buttonProps.recipe.image_Source, width: 100, height: 100};
            break;
        case "image":
            img = buttonProps.imgSrc;
            break;
    }


    return (
        <Pressable style={squareButtonStyles(buttonProps.side).squareButton} onPress={buttonProps.onPressFunction}>
            <View style={viewInsideButtonCentered}>
                <Image source={img} style={viewButtonStyles.imageInsideButton}
                       onError={() => {
                           // console.log("Image not found")
                       }}/>
            </View>
        </Pressable>
    )
}
