/**
 * TODO fill this part
 * @format
 */

import { PlusMinusIcons, checkboxBlankIcon, checkboxFillIcon , checkboxIcons, materialCommunityIconName } from "@assets/images/Icons"
import RectangleButton from "@components/atomic/RectangleButton"
import { padding, remValue, screenViews } from "@styles/spacing"
import React, { useState, useEffect } from "react"
import { FlatList, View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import CheckBoxButton from '../atomic/CheckBoxButton';
import MultiColumnButtonsRender from "@components/molecules/MultiColumnButtonsRender"
import { filtersCategories, isSeasonValue, listFilter, prepTimeValues, propsForFilter, recipeFilterType } from "@customTypes/RecipeFiltersTypes";
import { recipeDb } from "@utils/RecipeDatabase";
import { arrayOfIngredientWithoutType, arrayOfType, ingredientType, ingredientWithoutType } from "@customTypes/DatabaseElementTypes";


type FullScreenFilteringProps = {
    tagsList: Array<string>,
    ingredientsList: Array<string>,

    filtersProps: propsForFilter,
  }

export default function FullScreenFiltering (props: FullScreenFilteringProps) {

    const selectFilterFromProps = (filter: listFilter): [Array<recipeFilterType>, React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>, Array<string>] => {
        let filterValue: Array<recipeFilterType>;
        let filterSetter: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>;
        let elementFilters: Array<string>;

        switch (filter) {
            case listFilter.inSeason:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = isSeasonValue;
            break;
                case listFilter.cerealProduct:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfType(props.ingredientsList, ingredientType.base);
            break;
            case listFilter.tags:
                filterValue = props.filtersProps.tagsState
                filterSetter = props.filtersProps.setterTags;
                elementFilters = props.tagsList;
            break;
            case listFilter.prepTime:
                filterValue = props.filtersProps.prepTimeState;
                filterSetter = props.filtersProps.setterPrepTime;
                elementFilters = prepTimeValues;
            break;
            case listFilter.vegetable:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfType(props.ingredientsList, ingredientType.vegetable);
            break;
            case listFilter.meet:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfType(props.ingredientsList, ingredientType.meet);
            break;
            case listFilter.poultry:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfType(props.ingredientsList, ingredientType.poultry);
            break;
            case listFilter.spice:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfType(props.ingredientsList, ingredientType.spice);
            break;
            default:
                filterValue = props.filtersProps.ingredientsState;
                filterSetter = props.filtersProps.setterIngredients;
                elementFilters = arrayOfIngredientWithoutType(props.ingredientsList);
                break;
            }
            return [filterValue, filterSetter, elementFilters];
    }

    const renderItem = ({item}: {item: listFilter}) => {

        let [filterValueToUse, filterSetterToUse, elemToDisplay] = selectFilterFromProps(item);
        let toDisplay = false;
        
            for (let i = 0; i < props.filtersProps.sectionsState.length; i++) {
                if (props.filtersProps.sectionsState[i].includes(item)){
                    toDisplay = true;
                    break;
                }
            };

        return(
            <View>
                <RectangleButton text={item} height={50} centered={false} icon={PlusMinusIcons[Number(toDisplay)]} margins={padding.verySmall} onPressFunction={() => {
                    {toDisplay ? 
                        props.filtersProps.sectionsSetter(updatedSections => props.filtersProps.sectionsState.filter((elem) => elem != item)) 
                        :
                        props.filtersProps.sectionsSetter(updatedSections => [...props.filtersProps.sectionsState, item])
                    }
                }}  />
                {toDisplay ? 
                    <MultiColumnButtonsRender arrayToDisplay={elemToDisplay} filterTitle={item} filters={filterValueToUse} setFilters={filterSetterToUse}/>
                : null}
            </View>
        )
    };

    return(
            <FlatList data={filtersCategories} renderItem={renderItem} scrollEnabled={false}/>
    )
}
