import React from 'react';
import {listFilter, prepTimeValues, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {FiltersSelectionProps} from "@components/organisms/FiltersSelection";
import {Button, Text, View} from "react-native";

let cptRemove = 0;

// TODO to put somewhere else
export function mapToObject(map: Map<any, any>) {
    const obj: Record<string, any> = {};
    map.forEach((value, key) => {
        obj[key] = value;
    });
    return obj;
}

export function filtersSelectionMock(filterProp: FiltersSelectionProps) {
    // TODO create a filter dataset
    const arrayOfFilters = new Array<[TListFilter, string]>([listFilter.nutsAndSeeds, 'Pine Nuts'], [listFilter.purchased, 'true'], [listFilter.prepTime, prepTimeValues[4]]);


    return (
        <View>
            <Button testID="FilterSelection::AddFilterButton"
                    onPress={() => {
                        const [filterType, filterValue] = arrayOfFilters[filterProp.filtersState.size];
                        filterProp.addFilter(filterType, filterValue)
                    }}
                    title="Add Filter"/>
            <Button testID="FilterSelection::RemoveFilterButton"
                    onPress={() => {
                        const [filterType, filterValue] = arrayOfFilters[cptRemove];
                        cptRemove++;
                        filterProp.removeFilter(filterType, filterValue);
                    }}
                    title="Remove Filter"/>
            <Button testID="FilterSelection::SectionClickButton"
                    onPress={() => filterProp.setPrintSectionClickable(!filterProp.printSectionClickable)}
                    title="Click on Section"/>
            <Text testID="FiltersSelection::FiltersState">
                {JSON.stringify(mapToObject(filterProp.filtersState))}
            </Text>
            <Text testID="FiltersSelection::SectionClickable">
                {JSON.stringify(filterProp.printSectionClickable)}
            </Text>
            <Text testID="FiltersSelection::IngredientsList">
                {JSON.stringify(filterProp.ingredientsList)}
            </Text>
            <Text testID="FiltersSelection::TagsList">
                {JSON.stringify(filterProp.tagsList)}
            </Text>
        </View>
    );
}
