/**
 * TODO fill this part
 * @format
 */

import { screenViews } from "@styles/spacing"
import { textSeparator, typoRender, typoStyles } from "@styles/typography"
import React from "react"
import { FlatList, View, Text, TouchableOpacity } from "react-native"


type TextRenderProps = {
    title?: string
    text: Array<string>
    render: typoRender,
    onClick?(param: string): void,
  }



export default function TextRender (props: TextRenderProps) {

    const selectRender = (renderChoice: typoRender) => {
        switch (renderChoice) {
            case typoRender.ARRAY:
                return(props.text.map((item, index) => renderAsTable(item, index)))
            case typoRender.SECTION:
                return(props.text.map((item, index) => renderAsSection(item, index)))
            case typoRender.LIST:
                return(props.text.map((item, index) => renderAsList(item, index)))
            case typoRender.CLICK_LIST:
                return(props.text.map((item, index) => renderAsClickableList(item, index)))
            case typoRender.CLICK_LIST:
                return(props.text.map((item, index) => renderAsClickableList(item, index)))
        
        }
    }

    const renderAsTable = (item: string, index: number) => {
        // For now, only 2 columns are render 
        const splitItem = item.split(textSeparator);
    
        return(
            <View key={index} style={screenViews.tabView}>
                <Text style={{...typoStyles.paragraph, flex: 1}}>{splitItem[0]}</Text>
                <Text  style={{...typoStyles.paragraph, flex: 3}}>{splitItem[1]}</Text>
            </View>
        )
      }

      const renderAsSection = (item: string, index: number) => {
        // For now, only 2 columns are render 
        const splitItem = item.split(textSeparator);

        return(
            <View key={index} style={screenViews.sectionView}>
                <Text style={typoStyles.header}>{index+1}) {splitItem[0]}</Text>
                <Text  style={typoStyles.paragraph}>{splitItem[1]}</Text>
            </View>
        )
      }

      const renderAsList = (item: string, index: number) => {

        return(
                <Text key={index} style={typoStyles.element}>{item}</Text>
        )
      }
    

      const renderAsClickableList = (item: string, index: number) => {

        return(
            <TouchableOpacity key={index} style={screenViews.listView} onPress={() => {props.onClick ? props.onClick(item): console.warn("onClick doesn't exist !");
            }}>
                <Text style={typoStyles.paragraph}>{item}</Text>
            </TouchableOpacity>
        )
      }
    

    return(
        <View>
            {props.title ? <Text style={typoStyles.title}>{props.title}</Text> : null}
            {selectRender(props.render)}
        </View>
    )

}