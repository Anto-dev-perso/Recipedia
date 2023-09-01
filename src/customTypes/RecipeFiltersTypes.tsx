/**
 * TODO fill this part
 * @format
 */

import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { recipeTableElement, recipeColumnsNames, regExp } from './DatabaseElementTypes';
import RecipeDatabase, { recipeDb } from "@utils/RecipeDatabase";
import { textSeparator } from "@styles/typography";

export enum listFilter {
    prepTime = "Preparation Time",
    tags = "Tags",
    inSeason = "In-season",
    base = "Base",
    vegetable = "Vegetable",
    // kalories: "Kalories",
}

export type recipeFilterType = {
    title: listFilter,
    value: string,
}

export const isSeasonValue = ["Only in-season ingredients"];

export const prepTimeValues = [
    "0-10 min",
    "10-15 min",
    "15-20 min",
    "20-25 min",
    "25-30 min",
    "30-40 min",
    "40-50 min",
    "+60 min",
]

export function recipeTitleFilteredFunction (recipeArray: Array<recipeTableElement>, filter: string) {
    let result = recipeArray;
    if(filter.length > 0){
        result = result.filter((item) =>  item.title.toLowerCase().includes(filter.toLowerCase()));
    }
    return result;
}

export function extractFilteredRecipeDatas(recipeArray: Array<recipeTableElement>): [Array<string>, Array<string>, Array<string>] {
    let ingredientsArray = new Array<string>();
    let tagsArray = new Array<string>();

    const titleSortedArray = recipeArray.map(({title}) => (title)).sort();

    recipeArray.forEach(element => {
        element.ingredients.forEach(ing => {
            const ingDecoded = ing.split(textSeparator)[1].replace(regExp, "");
            if(!ingredientsArray.includes(ingDecoded)){
                ingredientsArray.push(ingDecoded);
            }
        });
        element.tags.forEach(tag => {
            if(!tagsArray.includes(tag)){
                tagsArray.push(tag);
            }
        });
    });
    tagsArray.sort();
    ingredientsArray.sort();

    return [titleSortedArray, tagsArray , ingredientsArray]
}

export function filterPrepTimeFromRecipe(recipeArray: Array<recipeTableElement>, filterTimeArray: Array<recipeFilterType>){
    let result: Array<recipeTableElement> = recipeArray;
    
    if(filterTimeArray.length > 0){

        let allowedTimes = new Array<number>();
        
        filterTimeArray.forEach(range => {
            if(range.value == prepTimeValues.at(prepTimeValues.length - 1)){
                for (let i = 60; i < 120; i+=5) {
                    allowedTimes.push(i);
                }
            }else{
                let splitTime = range.value.replace(" min", "").split(`-`);
    
                splitTime.forEach(time => {
                    const timeInNumber = Number(time)
                    if(!allowedTimes.includes(timeInNumber)){
                        allowedTimes.push(timeInNumber);
                    }
                });
            }
        });
        result = result.filter((item) => allowedTimes.includes(item.time));
    }

    return result;
}

function filterInArrayOfString(strArray : Array<string>, filter: string){
    let breakNeeded = false;
    for (let i = 0; (i < strArray.length) && !breakNeeded; i++) {
        breakNeeded = breakNeeded || (strArray[i].toLowerCase() == filter.toLowerCase() ); 
    }
    return breakNeeded;
}

export function filterFromRecipe(recipeArray: Array<recipeTableElement>, filterArray: Array<recipeFilterType>) {
    let filteredArray = recipeArray;

        if(filterArray.length > 0){
            filteredArray = filteredArray.filter((item) =>  {
                let keepElement = false;
                
                for (let indexFilters = 0; (indexFilters < filterArray.length) && !keepElement; indexFilters++) {
                    let arrayToFilter = new Array<string>();
                    switch (filterArray[indexFilters].title) {
                        case listFilter.tags:
                                arrayToFilter = item.tags;
                            break;
                            case listFilter.base:
                            case listFilter.vegetable:
                                arrayToFilter = item.ingredients;
                            break;
                    }
                    keepElement = keepElement || filterInArrayOfString(arrayToFilter, filterArray[indexFilters].value);
                }
                return keepElement;
            });
        }
        return filteredArray;
}

export function filterTagsFromRecipe(recipeArray: Array<recipeTableElement>, filterTagsArray: Array<recipeFilterType>){
    return filterFromRecipe(recipeArray, filterTagsArray);
}

export function filterIngredientsFromRecipe(recipeArray: Array<recipeTableElement>, filterIngredients: Array<recipeFilterType>){
    let result: Array<recipeTableElement> = recipeArray;

    
    if(filterIngredients.length > 0){
        
        let inSeasonFilter: boolean = false;
        let baseFilter = new Array<recipeFilterType>();
        let vegetableFilter = new Array<recipeFilterType>();

        filterIngredients.forEach(filter => {
            switch (filter.title) {
                case listFilter.inSeason:
                    inSeasonFilter = true;
                    break;
                case listFilter.base:
                    baseFilter.push(filter);
                    break;
                    case listFilter.vegetable:
                    vegetableFilter.push(filter);
                    break;
            }
        });

        if(baseFilter.length > 0){
            result = filterFromRecipe(result, baseFilter);
        }
        if(inSeasonFilter) {
            // TODO
            result = filterFromRecipe(result, inSeasonFilter);
        }
        if(vegetableFilter.length > 0){
            result = filterFromRecipe(result, vegetableFilter);
        }
    }

    return result;
}

const filterInSeason = (arr: Array<recipeTableElement>, filter: Array<listFilter>) => {
    let result: Array<recipeTableElement> = arr;
    
    // In-season is a unique filter
    if(filter.length > 0){
        // TODO

    }
    return result;
}