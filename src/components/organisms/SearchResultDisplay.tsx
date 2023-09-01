/**
 * TODO fill this part
 * @format
 */

import RectangleCard from '@components/molecules/RectangleCard';
import { recipeTableElement } from '@customTypes/DatabaseElementTypes';
import { viewPosition } from '@styles/buttons';
import { padding, remValue, screenViews, viewsSplitScreen } from '@styles/spacing';
import { typoStyles } from '@styles/typography';
import React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';


type SearchResultDisplayProps = {
    recipeArray: Array<recipeTableElement>
}

export default function SearchResultDisplay (props: SearchResultDisplayProps) {

    const renderMyItem = ({ item }: ListRenderItemInfo<recipeTableElement>) => {
        return(
          <View style={viewPosition.splitVerticallyIn2}>
            <RectangleCard recipe={item}/>
          </View>
        )
      }

    return(
        <View style={screenViews.scrollView}>
            <FlatList data={props.recipeArray} renderItem={renderMyItem} horizontal={false} numColumns={2} showsVerticalScrollIndicator={false} initialNumToRender={6}  />
        </View>
    )

}