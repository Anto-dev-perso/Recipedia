

import { PlusMinusIcons, checkboxBlankIcon, checkboxFillIcon , checkboxIcons, materialCommunityIconName } from "@assets/images/Icons"
import RectangleButton from "@components/atomic/RectangleButton"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { viewPosition } from "@styles/buttons"
import { padding, remValue, screenViews } from "@styles/spacing"
import { bulletListDataType, textSeparator, typoRender, typoStyles } from "@styles/typography"
import React, { useEffect, useState } from "react"
import { FlatList, View, Text, TouchableOpacity, Pressable } from "react-native"
import CheckBoxButton from '../atomic/CheckBoxButton';
import { TListFilter, propsForShopping, recipeFilterType} from '@customTypes/RecipeFiltersTypes';
import { shoppingListTableElement } from "@customTypes/DatabaseElementTypes"
import { recipeDb } from "@utils/RecipeDatabase"


export type filterCheckbox = {
    type: "search",
    
    filters: Array<recipeFilterType>,
    setFilters: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>
}

export type shoppingCheckbox = {
    type: "shopping",
    
    checkBoxInitialValue: boolean,
    shoppingProps: propsForShopping;
}

type ChecklistsButtonsRenderProps = {
    filterTitle: TListFilter,
    
    arrayToDisplay: Array<string>,

    route : filterCheckbox | shoppingCheckbox;
  }

export default function ChecklistsButtonsRender (props: ChecklistsButtonsRenderProps) {

    const numCol: number = (props.route.type == "search") ? 2 : 1 ;

    const isFilterAlreadySet = (str: string) => {
        let filterSet = false;

        if(props.route.type == "search"){
            for (let i = 0; i < props.route.filters.length; i++) {
                if( (props.route.filters[i].title == props.filterTitle) && (props.route.filters[i].value == str) ){
                    filterSet = true;
                    break;
                }
            }
        }else{
            filterSet = props.route.checkBoxInitialValue;
        }
        return filterSet;
    }

    
    const renderItem = ({item}: {item: string}) => {
 
        const checkBoxInitialValue = isFilterAlreadySet(item);
        let viewFromProps: any; 
        let checkboxState: boolean;

        let dataOnLongPress: bulletListDataType = {bulletListData: new Array<string>(), multiplesData: false, shortData: ""};
        if(props.route.type == "shopping"){
            let recipesTitle = new Array<string>();
            viewFromProps =  screenViews.listView ;
            checkboxState = false

            props.route.shoppingProps.ingList.forEach(element => {
                if(element.name == item){
                    element.recipes.forEach(recName => {
                        recipesTitle.push(recName);
                    });
                }
            });

            dataOnLongPress.shortData = recipesTitle.length + " recipe";
            
            if(recipesTitle.length > 1){
                dataOnLongPress.shortData += "s";
                dataOnLongPress.multiplesData = true;
            }

            recipesTitle.forEach(element => {
                dataOnLongPress.bulletListData.push("\n\t- " + element);
            });
        
        }else{
            viewFromProps =  viewPosition.splitVerticallyIn2;
            checkboxState = true;
        }

        const clickOnElementNotCheck = () => {
            if(props.route.type == "search"){
                props.route.setFilters([...props.route.filters, {title: props.filterTitle, value: item}]);
            }else{
                props.route.shoppingProps.setterIngList(props.route.shoppingProps.ingList.map(element => element.name == item ? {...element, purchased: true} : element));
                let toUpdate = props.route.shoppingProps.ingList.find(elem => elem.name == item);
                if(toUpdate){
                    toUpdate.purchased = true;
                    recipeDb.updateShoppingList(toUpdate);
                }
            }
        }
        
        const clickOnElementCheck = () => {
            if(props.route.type == "search"){
                props.route.setFilters(props.route.filters.filter(({value}) => !value.includes(item)))
            }else{
                props.route.shoppingProps.setterIngList(props.route.shoppingProps.ingList.map(element => element.name == item ? {...element, purchased: false} : element));
                let toUpdate = props.route.shoppingProps.ingList.find(elem => elem.name == item);
                if(toUpdate){
                    toUpdate.purchased = false;
                    recipeDb.updateShoppingList(toUpdate);
                }
                    
            }
        }

        return(
            <View style={viewFromProps}>
               <CheckBoxButton title={item} onLongPressData={dataOnLongPress} stateInitialValue={checkBoxInitialValue} useCheckBoxState={checkboxState} onPressFunctions={{onActivation: clickOnElementNotCheck, onDeActivation: clickOnElementCheck}}/>
            </View>
        )
    }

    return(
        <FlatList data={props.arrayToDisplay} renderItem={renderItem} numColumns={numCol} scrollEnabled={false}/>
    )
}



