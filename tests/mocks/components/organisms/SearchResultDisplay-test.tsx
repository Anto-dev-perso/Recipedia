import {Text, View} from "react-native";
import React from "react";
import {SearchResultDisplayProps} from "@components/organisms/SearchResultDisplay";

export function searchResultDisplayMock(searchResultDisplayProp: SearchResultDisplayProps) {

    return (
        <View>
            <Text testID="SearchResultDisplay::RecipesTitles">
                {JSON.stringify(searchResultDisplayProp.recipeArray)}
            </Text>
        </View>
    );
}
