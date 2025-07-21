import React from "react";
import {List, useTheme} from "react-native-paper";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import CarouselItem from "@components/molecules/CarouselItem";


export type RecipeRecommendationProps = {
    titleRecommendation: string,
    carouselProps: Array<recipeTableElement>,
}

export default function RecipeRecommendation(props: RecipeRecommendationProps) {
    const {fonts} = useTheme();
    return (
        <List.Section>
            <List.Subheader style={fonts.titleLarge}>{props.titleRecommendation}</List.Subheader>
            <CarouselItem testID={props.titleRecommendation} items={props.carouselProps}/>
        </List.Section>
    );
}
