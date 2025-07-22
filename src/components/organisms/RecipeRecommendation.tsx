import React from "react";
import {List, useTheme} from "react-native-paper";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import Carousel from "@components/molecules/Carousel";


export type RecipeRecommendationProps = {
    testId: string,
    titleRecommendation: string,
    carouselProps: Array<recipeTableElement>,
}

export default function RecipeRecommendation(props: RecipeRecommendationProps) {
    const {fonts} = useTheme();
    return (
        <List.Section>
            <List.Subheader testID={props.testId + "::SubHeader"}
                            style={fonts.titleLarge}>{props.titleRecommendation}</List.Subheader>
            <Carousel testID={props.testId + "::Carousel"} items={props.carouselProps}/>
        </List.Section>
    );
}
