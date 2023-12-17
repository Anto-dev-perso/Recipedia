

import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import HorizontalList from "@components/molecules/HorizontalList";
import TagButton from "@components/atomic/TagButton";
import { viewButtonStyles } from "@styles/buttons";
import { recipeDb } from "@utils/RecipeDatabase";
import FullScreenFiltering from "@components/organisms/FullScreenFiltering";
import { listFilter, propsForFilter, recipeFilterType } from "@customTypes/RecipeFiltersTypes";
import { crossIcon , minusIcon , plusIcon , filterPlusIcon , filterMinusIcon, displayIcon, enumIconTypes  } from "@assets/images/Icons";
import { padding } from "@styles/spacing";

type FiltersSelectionProps = {
    tagsList: Array<string>,
    ingredientsList: Array<string>,

    addingFilter: boolean,

    setAddingFilter: React.Dispatch<React.SetStateAction<boolean>>,

    filtersProps: propsForFilter,
}

export default function FiltersSelection ( props: FiltersSelectionProps) {

    const retrieveAllFilters = () => {
        const allFilters = new Array<string>();

        props.filtersProps.tagsState.forEach(element => {
            allFilters.push(element.value);
        });
        props.filtersProps.prepTimeState.forEach(element => {
            allFilters.push(element.value);
        });
        props.filtersProps.ingredientsState.forEach(element => {
            allFilters.push(element.value);
        });

        return allFilters;
    }


    const deleteElement = (item: string) => {
        let breakLoop = false;

        for (let indexIngredients = 0; (indexIngredients < props.filtersProps.ingredientsState.length) && !breakLoop; indexIngredients++) {
            if(props.filtersProps.ingredientsState[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.filtersProps.setterIngredients(updatedArray => props.filtersProps.ingredientsState.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }

        for (let indexIngredients = 0; (indexIngredients < props.filtersProps.prepTimeState.length) && !breakLoop; indexIngredients++) {
            if(props.filtersProps.prepTimeState[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.filtersProps.setterPrepTime(updatedArray => props.filtersProps.prepTimeState.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }

        for (let indexIngredients = 0; (indexIngredients < props.filtersProps.tagsState.length) && !breakLoop; indexIngredients++) {
            if(props.filtersProps.tagsState[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.filtersProps.setterTags(updatedArray => props.filtersProps.tagsState.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }
    }

    return (
        <View>
            <HorizontalList list={{propType: "Tag", item: retrieveAllFilters(), icon: {type: enumIconTypes.entypo, name: crossIcon, size: padding.large, color: "#414a4c", style: {paddingRight: 5}}, onTagPress: (item: string) => deleteElement(item)}}/>
            <View style={viewButtonStyles.longHorizontalButton}>
                <TagButton text={"Add a filter"} leftIcon={{type: enumIconTypes.materialCommunity, name: plusIcon, size: padding.veryLarge, color: "#414a4c", style: {paddingLeft: 5}}} onPressFunction={() => {
                    props.setAddingFilter(!props.addingFilter)
                }} />
            </View>
            {props.addingFilter ?
                <FullScreenFiltering filtersProps={props.filtersProps} tagsList={props.tagsList} ingredientsList={props.ingredientsList} />
            : null}
        </View>
    )
}