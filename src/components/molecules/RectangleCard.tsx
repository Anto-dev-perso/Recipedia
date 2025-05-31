import React from "react"
import {Pressable, Text, View} from "react-native"
import {rectangleButtonStyles, viewButtonStyles} from "@styles/buttons"
import {rowTextStyle, typoRender, typoStyles} from "@styles/typography"
import {recipeTableElement} from "@customTypes/DatabaseElementTypes"
import {viewsSplitScreen} from "@styles/spacing"
import {useNavigation} from "@react-navigation/native"
import {StackScreenNavigation} from "@customTypes/ScreenTypes"
import {imageStyle} from "@styles/images"
import TextRender from "@components/molecules/TextRender"
import CustomImage from "@components/atomic/CustomImage";


type RectangleCardProps = {
    recipe: recipeTableElement,
    testID: string,
}

export default function RectangleCard(props: RectangleCardProps) {
    const {navigate} = useNavigation<StackScreenNavigation>();

    return (
        <Pressable style={rectangleButtonStyles(400).rectangleButton}
                   onPress={() => navigate('Recipe', {mode: 'readOnly', recipe: props.recipe})
                   }>

            <View style={viewButtonStyles.longVerticalButton}>
                <View style={imageStyle.containerCardStyle}>
                    <CustomImage testID={props.testID + "::RectangleCard"} uri={props.recipe.image_Source}/>
                </View>
                <Text style={typoStyles.paragraph}>{props.recipe.title}</Text>
                <TextRender text={props.recipe.tags.map(tag => tag.name)} render={typoRender.LIST}/>

                <View style={viewsSplitScreen.viewInRow}>
                    <Text style={rowTextStyle.leftText}>Prep. {props.recipe.time} min</Text>
                    <Text style={rowTextStyle.rightText}>2 p.</Text>
                </View>
            </View>
        </Pressable>
    )
}
