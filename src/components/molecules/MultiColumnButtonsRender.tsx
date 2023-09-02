/**
 * TODO fill this part
 * @format
 */

import { PlusMinusIcons, checkboxBlankIcon, checkboxFillIcon , checkboxIcons, materialCommunityIconName } from "@assets/images/Icons"
import RectangleButton from "@components/atomic/RectangleButton"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { viewPosition } from "@styles/buttons"
import { padding, remValue, screenViews } from "@styles/spacing"
import { textSeparator, typoRender, typoStyles } from "@styles/typography"
import React, { useEffect, useState } from "react"
import { FlatList, View, Text, TouchableOpacity, Pressable } from "react-native"
import CheckBoxButton from '../atomic/CheckBoxButton';
import { listFilter, recipeFilterType} from '@customTypes/RecipeFiltersTypes';


type MultiColumnButtonsRenderProps = {
    arrayToDisplay: Array<string>,
    filterTitle: listFilter,
    filters: Array<recipeFilterType>,
    setFilters: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>
  }

export default function MultiColumnButtonsRender (props: MultiColumnButtonsRenderProps) {

    
    const isFilterAlreadySet = (str: string) => {
        let filterSet = false;

        for (let i = 0; i < props.filters.length; i++) {
            if( (props.filters[i].title == props.filterTitle) && (props.filters[i].value == str) ){
                filterSet = true;
                break;
            }
        }
        return filterSet;
    }

    
    const renderItem = ({item}: {item: string}) => {
 
        const checkBoxInitialValue = isFilterAlreadySet(item);

        return(
            <View style={viewPosition.splitVerticallyIn2}>
               <CheckBoxButton title={item} stateInitialValue={checkBoxInitialValue} onActivation={() => props.setFilters(updatedSections => [...props.filters, {title: props.filterTitle,   value: item}])
                } onDeActivation={() => props.setFilters(updatedSections => props.filters.filter(({value}) => !value.includes(item)))}/>
            </View>
        )
    }

    return(
        <FlatList data={props.arrayToDisplay} extraData={props.filters} renderItem={renderItem} numColumns={2} scrollEnabled={false}/>
    )
}



