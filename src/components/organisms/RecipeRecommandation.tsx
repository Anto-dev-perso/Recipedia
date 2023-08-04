/**
 * TODO fill this part
 * @format
 */

import CarouselItem from "@components/molecules/CarouselItem";
import { typoStyles } from "@styles/typography";
import React from "react";
import { Text, View } from "react-native";
import { recipeTableElement } from "@customTypes/DatabaseElementTypes";
import { screenViews } from "@styles/spacing";


type RecipeRecommandationProps = {
    titleRecommandation: string,
    carouselProps: Array<recipeTableElement>
}

export default function RecipeRecommandation (props: RecipeRecommandationProps) {
    return (
        <View style={screenViews.sectionView}>
            <Text style={typoStyles.title}>{props.titleRecommandation}</Text>
            <CarouselItem items={props.carouselProps}/>
        </View>
    )
}