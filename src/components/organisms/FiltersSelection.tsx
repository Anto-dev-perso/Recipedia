/**
 * TODO fill this part
 * @format
 */

import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import TagsList from "@components/molecules/TagsList";
import TagButton from "@components/atomic/TagButton";
import { viewButtonStyles } from "@styles/buttons";
import { recipeDb } from "@utils/RecipeDatabase";
import FullScreenFiltering from "@components/organisms/FullScreenFiltering";
import { listFilter, recipeFilterType } from "@customTypes/RecipeFiltersTypes";

type FiltersSelectionProps = {
    tagsList: Array<string>,
    ingredientsList: Array<string>,

    filtersIngredients: Array<recipeFilterType>,
    filtersTags: Array<recipeFilterType>,
    filtersPrepTime: Array<recipeFilterType>,

    selectedSections: Array<listFilter>,
    addingFilter: boolean,

    setFiltersIngredients: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setFiltersTags: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setFiltersPrepTime: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>,
    setSelectedSections: React.Dispatch<React.SetStateAction<Array<listFilter>>>,
    setAddingFilter: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function FiltersSelection ( props: FiltersSelectionProps) {

    const retrieveAllFilters = () => {
        const allFilters = new Array<string>();

        props.filtersTags.forEach(element => {
            allFilters.push(element.value);
        });
        props.filtersPrepTime.forEach(element => {
            allFilters.push(element.value);
        });
        props.filtersIngredients.forEach(element => {
            allFilters.push(element.value);
        });

        return allFilters;
    }


    const deleteElement = (item: string) => {
        let breakLoop = false;

        for (let indexIngredients = 0; (indexIngredients < props.filtersIngredients.length) && !breakLoop; indexIngredients++) {
            if(props.filtersIngredients[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.setFiltersIngredients(updatedArray => props.filtersIngredients.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }

        for (let indexIngredients = 0; (indexIngredients < props.filtersPrepTime.length) && !breakLoop; indexIngredients++) {
            if(props.filtersPrepTime[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.setFiltersPrepTime(updatedArray => props.filtersPrepTime.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }

        for (let indexIngredients = 0; (indexIngredients < props.filtersTags.length) && !breakLoop; indexIngredients++) {
            if(props.filtersTags[indexIngredients].value.toLowerCase().includes(item.toLowerCase())){
                props.setFiltersTags(updatedArray => props.filtersTags.filter(({value}) => !value.includes(item)));
                breakLoop = true;
            }
        }
    }

    return (
        <View>
            <TagsList item={retrieveAllFilters()} onPressFunction={(item: string) => deleteElement(item)}/>
            <View style={viewButtonStyles.longHorizontalButton}>
                <TagButton text={"Add a filter"} leftIcon={true} onPressFunction={() => {
                    props.setAddingFilter(!props.addingFilter)
                }} />
            </View>
            {props.addingFilter ?
                <FullScreenFiltering filtersIngredients={props.filtersIngredients} filtersTags={props.filtersTags} filtersPrepTime={props.filtersPrepTime} setFiltersIngredients={props.setFiltersIngredients} setFiltersTags={props.setFiltersTags} setFiltersPrepTime={props.setFiltersPrepTime} selectedSections={props.selectedSections} setSelectedSections={props.setSelectedSections} tagsList={props.tagsList} ingredientsList={props.ingredientsList} />
            : null}
        </View>
    )
}