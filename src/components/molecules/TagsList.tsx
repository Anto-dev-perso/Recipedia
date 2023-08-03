/**
 * TODO fill this part
 * @format
 */

import RectangleRoundedButton from "@components/atomic/RectangleRoundedButton"
import { viewButtonStyles } from "@styles/buttons"
import { typoSize } from "@styles/typography"
import React from "react"
import { FlatList, ListRenderItemInfo, ScrollView, Text, View } from "react-native"


type TagsListProps = {
  item: Array<string>
}

export default function TagsList (props: TagsListProps) {

  const renderTagItem = (item: string, index: number) => {
    return(
      <View key={index} style={viewButtonStyles.viewContainingButton}>
        <RectangleRoundedButton text={item}/>
      </View>
    )
  }
  
    return(
      
        <ScrollView style={viewButtonStyles.viewContainingButton} contentContainerStyle={viewButtonStyles.wrappingListOfButton} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
          {props.item.map((item: string, index: number) => renderTagItem(item, index))}
        </ScrollView>
    )
} 