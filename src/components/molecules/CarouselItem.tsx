import SquareButton from "@components/atomic/SquareButton";
import {mediumCardWidth, viewButtonStyles} from "@styles/buttons";
import {carouselStyle} from "@styles/typography";
import React from "react";
import {FlatList, ListRenderItemInfo, Text, View} from "react-native";
import {recipeTableElement} from "@customTypes/DatabaseElementTypes";

type CarouselItemProps = {
    items: Array<recipeTableElement>
}

let titleLength = mediumCardWidth / 5.5;

export default function CarouselItem(props: CarouselItemProps) {

    function renderMyItem({item}: ListRenderItemInfo<recipeTableElement>) {
        return (
            <View>
                <SquareButton side={mediumCardWidth} type={'recipe'} recipe={item}/>
                <Text style={carouselStyle(titleLength).carouselTitle}>
                    {((item.title).length > titleLength) ?
                        (((item.title).substring(0, titleLength - 3)) + '...') :
                        item.title}
                </Text>
            </View>
        )
    }

    return (
        <View style={viewButtonStyles.viewContainingButton}>
            <FlatList data={props.items} renderItem={renderMyItem} horizontal={true}
                      showsHorizontalScrollIndicator={false}/>
        </View>
    )
} 
