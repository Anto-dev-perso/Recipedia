/**
 * TODO fill this part
 * @format
 */

import SquareButton from "@components/atomic/SquareButton";
import { viewButtonStyles } from "@styles/buttons";
import { padding } from "@styles/spacing";
import { carouselStyle } from "@styles/typography";
import React from "react";
import { FlatList, ImageRequireSource, ImageSourcePropType, ListRenderItemInfo, Text, View } from "react-native";
import { recipeTableElement } from "customTypes/CarouselTypes";

type CarouselItemProps = {
  items: Array<recipeTableElement>
}

  let cardWidth = 120;
  let titleLength = cardWidth / 5.5

export default function CarouselItem (props: CarouselItemProps) {

  const renderMyItem = ({ item }: ListRenderItemInfo<recipeTableElement>) => {
    return(
      <View>
        <SquareButton side={cardWidth} recipe={item}/>
      <Text style={carouselStyle(titleLength).carouselTitle}>
        {((item.title).length > titleLength) ? 
          (((item.title).substring(0,titleLength-3)) + '...') : 
          item.title}
      </Text>
      </View>
    )
  }
  
    return(
        <View style={viewButtonStyles.viewContainingButton}>
          <FlatList data={props.items} renderItem={renderMyItem} horizontal={true} showsHorizontalScrollIndicator={false}/>
        </View>
    )
} 