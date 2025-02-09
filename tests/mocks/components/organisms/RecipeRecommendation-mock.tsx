import React from "react";
import {Text, View} from "react-native";
import {RecipeRecommendationProps} from "@components/organisms/RecipeRecommendation";


export function recipeRecommendationMock(recipeRecommendationProp: RecipeRecommendationProps) {
    return (
        <View>
            <Text testID={recipeRecommendationProp.testID + "::TitleRecommendation"}>
                {recipeRecommendationProp.titleRecommendation}
            </Text>
            <Text testID={recipeRecommendationProp.testID + "::CarouselProps"}>
                {JSON.stringify(recipeRecommendationProp.carouselProps)}
            </Text>
        </View>
    );
}
