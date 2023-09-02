/**
 * TODO fill this part
 * @format
 */

import { enumIconTypes, iconProp, materialCommunityIconName, minusIcon  } from "@assets/images/Icons"
import TagButton from "@components/atomic/TagButton"
import { viewButtonStyles } from "@styles/buttons"
import { typoSize } from "@styles/typography"
import React from "react"
import { FlatList, ListRenderItemInfo, ScrollView, Text, View } from "react-native"


type TagsListProps = {
  item: Array<string>,
  icon?: iconProp, 
  onPressFunction:(elem: string) => void,
}

export default function TagsList (props: TagsListProps) {

  const renderTagItem = (item: string, index: number) => {

    return(
      <View key={index} style={viewButtonStyles.viewContainingButton}>
        {props.icon ? 
          <TagButton text={item} rightIcon={props.icon} onPressFunction={() => props.onPressFunction(item)}/>
        : 
          <TagButton text={item} onPressFunction={() => props.onPressFunction(item)}/>
        }
      </View>
    )
  }
  
    return(
      
        <ScrollView style={viewButtonStyles.viewContainingButton} contentContainerStyle={viewButtonStyles.wrappingListOfButton} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
          {props.item.map((item: string, index: number) => renderTagItem(item, index))}
        </ScrollView>
    )
} 