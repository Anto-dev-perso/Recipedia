/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Image } from "expo-image";
import { ImageRequireSource, ImageSourcePropType, Pressable, View } from "react-native"
import { squareButtonStyles, viewButtonStyles, viewInsideButtonCentered } from "@styles/buttons"


// import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RecipeScreenProp, } from "@customTypes/ScreenTypes";
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import { openRecipeScreen } from "@navigation/NavigationFunctions";


type SquareButtonProps = {
    side: number,
    recipe: recipeTableElement,
}


export default function SquareButton (props: SquareButtonProps) {
    const navigation = useNavigation<RecipeScreenProp>();

    return(
        <Pressable style={squareButtonStyles(props.side).squareButton} onPress={() => openRecipeScreen(props.recipe, navigation)}>
            <View style={viewInsideButtonCentered}>
              <Image source={{uri: props.recipe.image_Source}} style={viewButtonStyles.imageInsideButton}/>
              {/* <Image source={{width: 500,height: 500, uri: 'content:///storage/emulated/0/Pictures/cat.jpg'}} style={viewButtonStyles.imageInsideButton} onError={() => console.log("Image not found")}/> */}
            </View>
        </Pressable>
    )
}
