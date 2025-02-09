import React from "react"
import {Image} from 'expo-image';
import {Pressable, View} from "react-native"
import {squareButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"


// import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";
import {StackScreenNavigation,} from "@customTypes/ScreenTypes";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {localImgData} from "@customTypes/ImageTypes";

type propIsRecipe = { type: 'recipe', recipe: recipeTableElement };
type propIsImg = { type: 'image', imgSrc: localImgData, onPressFunction: () => void };

export type SquareButtonProps = {
    side: number,
} & (propIsRecipe | propIsImg)


export default function SquareButton(buttonProps: SquareButtonProps) {

    const {navigate} = useNavigation<StackScreenNavigation>();
    let recipe: recipeTableElement;
    let img: localImgData;
    let pressFunc: () => void;
    switch (buttonProps.type) {
        case "recipe":
            img = {uri: buttonProps.recipe.image_Source, width: 100, height: 100};
            recipe = buttonProps.recipe;
            pressFunc = () => {
                navigate('Recipe', {mode: 'readOnly', recipe: recipe});
            };
            break;
        case "image":
            img = buttonProps.imgSrc;
            pressFunc = buttonProps.onPressFunction;
            break;
    }


    return (
        <Pressable style={squareButtonStyles(buttonProps.side).squareButton} onPress={pressFunc}>
            <View style={viewInsideButtonCentered}>
                <Image source={img} style={viewButtonStyles.imageInsideButton}
                       onError={() => console.log("Image not found")}/>
            </View>
        </Pressable>
    )
}
