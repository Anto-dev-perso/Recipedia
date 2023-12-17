

import { enumIconTypes, iconProp, materialCommunityIconName, minusIcon  } from "@assets/images/Icons"
import SquareButton from "@components/atomic/SquareButton"
import TagButton from "@components/atomic/TagButton"
import { localImgData } from "@customTypes/ImageTypes"
import { StackScreenNavigation } from "@customTypes/ScreenTypes"
import { useNavigation } from "@react-navigation/native"
import { mediumCardWidth, smallCardWidth, viewButtonStyles } from "@styles/buttons"
import { editableText, typoSize } from "@styles/typography"
import React from "react"
import { FlatList, ListRenderItemInfo, ScrollView, Text, View, ViewStyle } from "react-native"

type TagProp = {
  propType: "Tag",
  item: Array<string>,
  icon?: iconProp, 
  editText?: editableText,
  onTagPress:(elem: string ) => void,
}

type ImageProp = {
  propType: "Image",
  item: Array<localImgData>,
  onImgPress:(elem: localImgData, nav: StackScreenNavigation) => void,
}

type HorizontalListProps = {
  list: TagProp | ImageProp,
}

export default function HorizontalList (props: HorizontalListProps) {

  const horizontalView: ViewStyle = props.list.propType == "Image" ? { ...viewButtonStyles.wrappingListOfButton, justifyContent: 'center', alignItems: 'center'} : viewButtonStyles.wrappingListOfButton ; 


  const icon = props.list.propType == "Tag" ? props.list.icon : undefined ;
  const navigation = useNavigation<StackScreenNavigation>();

  const renderItem = (item: string | localImgData, index: number) => {

    return(
      <View key={index} style={viewButtonStyles.viewContainingButton}>
        {props.list.propType == "Tag" ?
          <TagButton text={item as string} rightIcon={icon} onPressFunction={() => selectOnPress(item)} editText={props.list.editText}/>
         :
         <SquareButton side={smallCardWidth} imgSrc={item as localImgData} onPressFunction={() => selectOnPress(item)}/>
         }
      </View>
    )
  }
  

  const selectOnPress = (item: string | localImgData) => {
    if(props.list.propType == "Tag"){
      props.list.onTagPress(item as string)
    }else{
      props.list.onImgPress(item as localImgData, navigation);
    }
  }

    return(
      <View style={horizontalView}>
          {props.list.item.map((item: string | localImgData, index: number) => renderItem(item, index))}
       </View>
    )
} 