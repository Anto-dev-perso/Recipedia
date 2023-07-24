/**
 * TODO fill this part
 * @format
 */

import CarouselItem from "@components/molecules/CarouselItem";
import { typoStyles } from "@styles/typography";
import React from "react";
import { Text, View } from "react-native";
import { cardOfCarouselProps } from "customTypes/CarouselTypes";


type RecipeRecommandationProps = {
    titleRecommandation: string,
    carouselProps: Array<cardOfCarouselProps>
}

export default function RecipeRecommandation (props: RecipeRecommandationProps) {
    return (
        <View>
            <Text style={typoStyles.title}>{props.titleRecommandation}</Text>
            <CarouselItem items={props.carouselProps}/>
        </View>
    )
}