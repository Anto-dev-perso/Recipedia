/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Image } from "expo-image";
import { ImageRequireSource, ImageSourcePropType, Pressable, View } from "react-native"
import { squareButtonStyles, viewButtonStyles, opacitySquare } from "@styles/buttons"


// import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RecipeScreenProp, } from "@customTypes/ScreenTypes";
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";


type SquareButtonProps = {
    side: number,
    recipe: recipeTableElement,
}


export default function SquareButton (props: SquareButtonProps) {


    const navigation = useNavigation<RecipeScreenProp>();

    const title = props.recipe.title
    const description = "Un plat rustique qui met tout le monde d'accord avec nos saucisses au couteau. Un plat de bistrot réconfortant pour petits et grands."
    const tags = ["Kids friendly", "Gourmand", "Express", "Tradition", "Test d'un tag débordant"]
    let ingredients = new Array<string> ()
    ingredients.push("250g__Champignons de Paris blanc")
    ingredients.push("100mL__Crème liquide")
    ingredients.push("0.5__Gouse d'ail")
    ingredients.push("200g__Macaroni demi-complets")
    ingredients.push("1__Oignon jaune")
    ingredients.push("250g__Saucisse couteau nature")

    let preparation = new Array<string> ()
    preparation.push("La crème aux champignons__Emincez l'oignon.\nPressez ou hachez l'ail.\nCoupez les champignons de Paris en tranches.\nDans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir les champignons, l'oignon et l'ail 15 min. Salez, poivrez.\nAu bout des 15 min, ajoutez la crème et poursuivez la cuisson 5 min à feu doux.\nEn parallèle, faites cuire les saucisses.")
    preparation.push("Les saucisses__Dans une seconde sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.\nFaites revenir les saucisses 12 min environ. Salez, poivrez.\nPendant ce temps, faites cuire les macaroni.")
    preparation.push("Les macaroni__Portez à ébullition une casserole d'eau salée.\nFaites cuire les macaroni selon les indications du paquet.")
    preparation.push("Etape finale__Servez sans attendre votre saucisse au couteau nappée de crème aux champignons et accompagnée des macaroni")

    const openStack = () => {
        navigation.navigate('Recipe', props.recipe);
      }


    return(
        <Pressable style={squareButtonStyles(props.side).squareButton} onPress={openStack}>
            <View style={viewButtonStyles.viewInsideButtons}>
              <Image source={{uri: props.recipe.image_Source}} style={viewButtonStyles.imageInsideButton}/>
            </View>
        </Pressable>
    )
}
