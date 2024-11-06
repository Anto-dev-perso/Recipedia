

import React from "react"
import { Image } from 'expo-image';
import { ImageRequireSource, ImageSourcePropType, Pressable, View } from "react-native"
import { squareButtonStyles, viewButtonStyles, viewInsideButtonCentered } from "@styles/buttons"


// import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { RecipeScreenProp, StackScreenNavigation, } from "@customTypes/ScreenTypes";
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import { fileGestion } from "@utils/FileGestion";
import { imageStyle } from '@styles/images';
import { localImgData } from "@customTypes/ImageTypes";
import { recipeStateType } from "@screens/Recipe";


type SquareButtonProps = {
    side: number,
} & (
    |{recipe: recipeTableElement}
    |{imgSrc: localImgData, onPressFunction:() => void}
)


export default function SquareButton ({side, ...other}: SquareButtonProps) {

    const { navigate } = useNavigation<StackScreenNavigation>();
    let recipe: recipeTableElement;
    let img: localImgData;
    let pressFunc:() => void

    if('recipe' in other && other.recipe !== undefined){
        img = {uri: other.recipe.image_Source, width: 100, height: 100}
        recipe = other.recipe
    }else if ('imgSrc' in other && other.imgSrc !== undefined){
        img = other.imgSrc;
        pressFunc = other.onPressFunction
    }else{
        throw new Error(`None of props are passed ! Here is what is given in SquareBUtton component : ${side}, ${other}`)
    }

    return(
        <Pressable style={squareButtonStyles(side).squareButton} onPress={() => {
                if(recipe){
                    navigate('Recipe', {mode: 'readOnly', recipe: recipe})
                }else{
                    pressFunc()
                }
                }}>
            <View style={viewInsideButtonCentered}>
              <Image source={img} style={viewButtonStyles.imageInsideButton} onError={() => console.log("Image not found")}/>
            </View>
        </Pressable>
    )
}
