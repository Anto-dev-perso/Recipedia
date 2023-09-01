/**
 * TODO fill this part
 * @format
 */

import { PlusMinusIcons, checkboxBlank, checkboxFill, checkboxIcons, materialIconName } from "@assets/images/Icons"
import RectangleButton from "@components/atomic/RectangleButton"
import { padding, remValue, screenViews } from "@styles/spacing"
import React, { useState, useEffect } from "react"
import { FlatList, View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import CheckBoxButton from '../atomic/CheckBoxButton';
import MultiColumnButtonsRender from "@components/molecules/MultiColumnButtonsRender"
import { isSeasonValue, listFilter, prepTimeValues, recipeFilterType } from "@customTypes/RecipeFiltersTypes";
import { recipeDb } from "@utils/RecipeDatabase";


type FullScreenFilteringProps = {
    tagsList: Array<string>,
    ingredientsList: Array<string>,

    filtersIngredients: Array<recipeFilterType>,
    filtersTags: Array<recipeFilterType>,
    filtersPrepTime: Array<recipeFilterType>,
    selectedSections: Array<listFilter>

    setFiltersIngredients: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setFiltersTags: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setFiltersPrepTime: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setSelectedSections: React.Dispatch<React.SetStateAction<Array<listFilter>>>,
  }

export default function FullScreenFiltering (props: FullScreenFilteringProps) {

    const categories: Array<listFilter> = [listFilter.inSeason, listFilter.base, listFilter.tags, listFilter.prepTime,listFilter.vegetable];

    const selectFilterFromProps = (filter: listFilter): [Array<recipeFilterType>, React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>, Array<string>] => {
        let filterValue: Array<recipeFilterType>;
        let filterSetter: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>;
        let elementFilters: Array<string>;

        switch (filter) {
            case listFilter.inSeason:
                filterValue = props.filtersIngredients;
                filterSetter = props.setFiltersIngredients;
                elementFilters = isSeasonValue;
            break;
                case listFilter.base:
                filterValue = props.filtersIngredients;
                filterSetter = props.setFiltersIngredients;
                elementFilters = props.ingredientsList;
            break;
            case listFilter.tags:
                filterValue = props.filtersTags
                filterSetter = props.setFiltersTags;
                elementFilters = props.tagsList;
            break;
            case listFilter.prepTime:
                filterValue = props.filtersPrepTime;
                filterSetter = props.setFiltersPrepTime;
                elementFilters = prepTimeValues;
            break;
            case listFilter.vegetable:
                filterValue = props.filtersIngredients;
                filterSetter = props.setFiltersIngredients;
                elementFilters = props.ingredientsList;
            break;
            default:
                filterValue = props.filtersIngredients;
                filterSetter = props.setFiltersIngredients;
                elementFilters = props.ingredientsList;
                break;
            }
            return [filterValue, filterSetter, elementFilters];
    }

    const renderItem = ({item}: {item: listFilter}) => {

        let [filterValueToUse, filterSetterToUse, elemToDisplay] = selectFilterFromProps(item);
        let toDisplay = false;
        
            for (let i = 0; i < props.selectedSections.length; i++) {
                if (props.selectedSections[i].includes(item)){
                    toDisplay = true;
                    break;
                }
            };

        return(
            <View>
                <RectangleButton text={item} height={50} centered={false} icon={PlusMinusIcons[Number(toDisplay)]} margins={padding.verySmall} onPressFunction={() => {
                    {toDisplay ? 
                        props.setSelectedSections(updatedSections => props.selectedSections.filter((elem) => elem != item)) 
                        :
                        props.setSelectedSections(updatedSections => [...props.selectedSections, item])
                    }
                }}  />
                {toDisplay ? 
                    <MultiColumnButtonsRender arrayToDisplay={elemToDisplay} filterTitle={item} filters={filterValueToUse} setFilters={filterSetterToUse}/>
                : null}
            </View>
        )
    };

    return(
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
            <FlatList data={categories} renderItem={renderItem} scrollEnabled={false}/>
        </ScrollView>
    )
}
