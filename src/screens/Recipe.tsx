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
import TextRender from "@components/molecules/TextRender";
import { viewButtonStyles, bottomPosition } from '@styles/buttons';
import RectangleButton from "@components/atomic/RectangleButton";
import BottomButton from "@components/molecules/BottomButton";
import { RecipeScreenProp } from '@customTypes/ScreenTypes';
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";


export default function Recipe ({ route, navigation }: RecipeScreenProp) {
    // Use a local for params props
    const props: recipeTableElement = route.params;

    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={screenViews.scrollView}>
                <View style={imageStyle.containerFullStyle}>
                    <Image source={{uri: props.image_Source}} style={imageStyle.imageInsideView}/>
                </View>

                <View style={screenViews.sectionView}>
                    <Text style={typoStyles.title}>{props.title}</Text>
                </View>

                <Text style={typoStyles.paragraph}>{props.description}</Text>

                <TagsList item={props.tags} onPressFunction={() => null}/>

                <TextRender title={"Ingredients"} text={props.ingredients} render={typoRender.ARRAY}/>
                <TextRender title={`Preparation (${props.time} min)`} text={props.preparation} render={typoRender.SECTION}/>

                    {/* TODO add number of person */}
                    {/* TODO add nutrition */}
            </ScrollView>
            <BottomButton as={RectangleButton} position={bottomPosition.full} centered={true} text="Add this recipe to the menu" onPressFunction={() => console.log("Add to menu")}/>
        </SafeAreaView>
    )
}