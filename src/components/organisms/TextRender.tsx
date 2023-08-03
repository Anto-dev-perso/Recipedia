/**
 * TODO fill this part
 * @format
 */

import { screenViews } from "@styles/spacing"
import { separator, typoRender, typoStyles } from "@styles/typography"
import React from "react"
import { FlatList, View, Text } from "react-native"


type TextRenderProps = {
    title: string
    text: Array<string>
    render: typoRender,
  }



export default function TextRender (props: TextRenderProps) {

    const renderAsTable = (item: string, index: number) => {
        // For now, only 2 columns are render 
        const splitItem = item.split(separator);
    
        return(
            <View key={index} style={screenViews.tabView}>
                <Text style={{...typoStyles.paragraph, flex: 1}}>{splitItem[0]}</Text>
                <Text  style={{...typoStyles.paragraph, flex: 5}}>{splitItem[1]}</Text>
            </View>
        )
      }

      const renderAsSection = (item: string, index: number) => {
        // For now, only 2 columns are render 
        const splitItem = item.split(separator);

        return(
            <View key={index} style={screenViews.sectionView}>
                <Text style={typoStyles.header}>{index+1}) {splitItem[0]}</Text>
                <Text  style={typoStyles.paragraph}>{splitItem[1]}</Text>
            </View>
        )
      }
    

    return(
        <View>
            <Text style={typoStyles.title}>{props.title}</Text>
            {props.render == typoRender.ARRAY ? 
                props.text.map((item, index) => renderAsTable(item, index))
            : 
                props.text.map((item, index) => renderAsSection(item, index))
            }
        </View>
    )

}