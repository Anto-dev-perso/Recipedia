/**
 * TODO fill this part
 * @format
 */

import SquareButton from "@components/SquareButton";
import { viewButtonStyles } from "@styles/buttons";
import { padding } from "@styles/spacing";
import { carouselStyle } from "@styles/typography";
import React from "react";
import { FlatList, ImageRequireSource, ImageSourcePropType, Text, View } from "react-native";
import { cardOfCarouselProps } from "@types/CarouselTypes";

type CarouselItemProps = {
  items: cardOfCarouselProps[]
}

  let cardWidth = 100;
  let titleLength = cardWidth / 7;

const renderMyItem = ({item}) => {
  return(
    <View>
      <SquareButton side={cardWidth} text={item.title} image={item.image}  onPressFunction={() => console.log("Pressed item")}/>
    <Text style={carouselStyle(titleLength).carouselTitle}>
      {((item.title).length > titleLength) ? 
        (((item.title).substring(0,titleLength-3)) + '...') : 
        item.title}
    </Text>
    </View>
  )
}

export default function CarouselItem (props: CarouselItemProps) {
    return(
        <View style={viewButtonStyles.viewContainingButton}>
          <FlatList data={props.items} renderItem={renderMyItem} horizontal={true} showsHorizontalScrollIndicator={false}/>
        </View>
    )
} 