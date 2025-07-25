import React from "react";
import {FlatList, ListRenderItemInfo, View} from "react-native";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";
import {padding} from "@styles/spacing";
import RecipeCard from "@components/molecules/RecipeCard";

export type CarouselItemProps = {
    items: Array<recipeTableElement>,
    testID: string,
};

export default function Carousel(props: CarouselItemProps) {
    return (
        <View>
            <FlatList
                data={props.items}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, idx) => item.title + idx}
                contentContainerStyle={{paddingHorizontal: padding.small}}
                renderItem={({item, index}: ListRenderItemInfo<recipeTableElement>) => <RecipeCard
                    testId={props.testID + `::Card::${index}`} size={"small"} recipe={item}/>}
            />
        </View>
    );
}
