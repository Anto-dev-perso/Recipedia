/**
 * TODO fill this part
 * @format
 */

import { screenViews } from "@styles/spacing";
import React from "react";
import { Image } from "expo-image";
import { SafeAreaView, Text, View, ScrollView, Button } from 'react-native';
import { imageStyle } from '@styles/images'
import { typoRender, typoStyles } from "@styles/typography";
import TagsList from "@components/molecules/TagsList";
import TextRender from "@components/organisms/TextRender";
import { viewButtonStyles } from "@styles/buttons";
import RectangleRoundedButton from "@components/atomic/RectangleRoundedButton";
import RectangleButton from "@components/atomic/RectangleButton";
import BottomButton from "@components/molecules/BottomButton";
import { RecipeScreenProp } from '@customTypes/ScreenTypes';
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";


export default function Recipe ({ route, navigation }: RecipeScreenProp) {
    // Use a local for params props
    const props: recipeTableElement = route.params;

    // TODO
    const img = require('@assets/images/dog.jpg')
    const temps = "25 min"
    const ustensiles = ["Sel", "Poivre", "Huile d'olive", "2 sauteuses", "1 Passoire"]

    
    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView horizontal={false} style={screenViews.scrollView}>
                <View style={imageStyle.containerStyle}>
                    <Image source={{uri: props.image_Source}} style={imageStyle.imageInsideView}/>
                </View>

                <View style={screenViews.sectionView}>
                    <Text style={typoStyles.title}>{props.title}</Text>
                </View>

                <Text style={typoStyles.paragraph}>{props.description}</Text>

                <TagsList item={props.tags}/>

                <TextRender title={"Ingredients"} text={props.ingredients} render={typoRender.ARRAY}/>
                <TextRender title={"Preparation"} text={props.preparation} render={typoRender.SECTION}/>

                    {/* TODO add nutrition part */}
            </ScrollView>
            <BottomButton text="Add this recipe to the menu"/>
        </SafeAreaView>
    )
}