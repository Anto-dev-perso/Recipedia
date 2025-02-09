import CarouselItem from "@components/molecules/CarouselItem";
import {typoStyles} from "@styles/typography";
import React from "react";
import {Text, View} from "react-native";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {screenViews} from "@styles/spacing";


export type RecipeRecommendationProps = {
    titleRecommendation: string,
    carouselProps: Array<recipeTableElement>,
    testID: string
}

export default function RecipeRecommendation(props: RecipeRecommendationProps) {
    return (
        <View style={screenViews.sectionView}>
            <Text style={typoStyles.title}>{props.titleRecommendation}</Text>
            <CarouselItem items={props.carouselProps}/>
        </View>
    )
}
