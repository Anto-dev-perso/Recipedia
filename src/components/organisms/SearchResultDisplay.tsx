import RectangleCard from '@components/molecules/RectangleCard';
import {recipeTableElement} from '@customTypes/DatabaseElementTypes';
import {viewPosition} from '@styles/buttons';
import React from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';


export type SearchResultDisplayProps = {
    recipeArray: Array<recipeTableElement>
}

export default function SearchResultDisplay(props: SearchResultDisplayProps) {

    const renderSearchResult = ({item}: ListRenderItemInfo<recipeTableElement>) => {
        return (
            <View style={viewPosition.splitVerticallyIn2}>
                <RectangleCard recipe={item}/>
            </View>
        )
    };
    return (
        <FlatList data={props.recipeArray} renderItem={renderSearchResult} scrollEnabled={false} numColumns={2}
                  showsVerticalScrollIndicator={false} initialNumToRender={6}/>
    )

}
