/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Image, Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, rectangleButtonStyles } from "@styles/buttons"
import { rowTextStyle, typoRender, typoStyles } from "@styles/typography"
import { recipeTableElement } from "@customTypes/DatabaseElementTypes"
import { remValue, viewsSplitScreen } from "@styles/spacing"
import { openRecipeScreen } from "@navigation/NavigationFunctions"
import { useNavigation } from "@react-navigation/native"
import { RecipeScreenProp } from "@customTypes/ScreenTypes"
import { imageStyle } from "@styles/images"
import TextRender from "@components/molecules/TextRender"



type RectangleCardProps = {
    recipe: recipeTableElement,
}

export default function RectangleCard (props: RectangleCardProps) {
    const navigation = useNavigation<RecipeScreenProp>();
    
    return(
        <Pressable style={rectangleButtonStyles(400).rectangleButton} onPress={() => openRecipeScreen(props.recipe, navigation)}>

            <View style={viewButtonStyles.longVerticalButton}>
                <View style={imageStyle.containerCardStyle}>
                    <Image source={{uri: props.recipe.image_Source}} style={imageStyle.imageInsideView}/>
                </View>
                <Text style={typoStyles.paragraph}>{props.recipe.title}</Text>
                <TextRender text={props.recipe.tags} render={typoRender.LIST}/>
                
                <View style={viewsSplitScreen.viewInRow}>
                    <Text style={rowTextStyle.leftText}>Prep. {props.recipe.time} min</Text>
                    <Text style={rowTextStyle.rightText}>2 p.</Text>
                </View>
            </View>
        </Pressable>
    )
}