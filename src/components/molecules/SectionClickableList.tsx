/**
* TODO fill this part
* @format
*/

import { PlusMinusIcons, checkboxBlankIcon, checkboxFillIcon , checkboxIcons, enumIconTypes, iconProp, iconsType, materialCommunityIconName } from "@assets/images/Icons"
import RectangleButton from "@components/atomic/RectangleButton"
import { padding, remValue, screenViews } from "@styles/spacing"
import React, { useState, useEffect } from "react"
import { FlatList, View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import CheckBoxButton from '../atomic/CheckBoxButton';
import ChecklistsButtonsRender, { filterCheckbox, shoppingCheckbox } from "@components/molecules/ChecklistsButtonsRender"
import { filtersCategories, listFilter, prepTimeValues, propsForFilter, propsForShopping, recipeFilterType, shoppingCategories } from "@customTypes/RecipeFiltersTypes";
import { recipeDb } from "@utils/RecipeDatabase";
import { arrayOfIngredientWithoutType, arrayOfType, ingredientType, ingredientWithoutType, shoppingListTableElement } from "@customTypes/DatabaseElementTypes";
import { selectFilterFromProps } from "@utils/FilterFunctions";
import { colors } from '@styles/colors';
import { toggleActivationFunctions } from "@customTypes/ScreenTypes";

type propsFromSearch = {
    screen: "search",

    tagsList: Array<string>,
    ingredientsList: Array<string>,
    
    filtersProps: propsForFilter,
}

type propsFromShopping = {
    screen: "shopping",


    shoppingProps: propsForShopping;
}

type SectionClickableListProps = {
    route: propsFromSearch | propsFromShopping

    icon?: Array<iconProp>,
    useOnPress?: boolean,
}

export default function SectionClickableList (props: SectionClickableListProps) {

    const renderItem = ({item}: {item: listFilter}) => {

        let itemRoute: filterCheckbox | shoppingCheckbox;
        let elemToDisplay = new Array<string>();
        let toDisplay: boolean;
        
        switch (props.route.screen) {
            case "search":
                let filterValueToUse : Array<recipeFilterType>;
                let filterSetterToUse: React.Dispatch<React.SetStateAction<Array<recipeFilterType>>>;
                let stringArray: Array<string>;

                [filterValueToUse, filterSetterToUse, stringArray] = selectFilterFromProps(item, props.route.filtersProps, props.route.tagsList, props.route.ingredientsList);

                stringArray.forEach(element => {
                    elemToDisplay.push(element);
                });

                itemRoute = {type: "search", filters: filterValueToUse, setFilters: filterSetterToUse};
                
                toDisplay = false;
                for (let i = 0; i < props.route.filtersProps.sectionsState.length; i++) {
                    if (props.route.filtersProps.sectionsState[i].includes(item)){
                        toDisplay = true;
                        break;
                    }
                };
                break;

            case "shopping":
            default:
                let initValue: boolean;

                toDisplay = true;
                if(item == listFilter.purchased){
                    initValue = true;

                    
                    
                    props.route.shoppingProps.ingList.forEach(element => {
                        if(element.purchased){
                            elemToDisplay.push(element.name);
                        }
                    });
                }else{
                    initValue = false;
                    props.route.shoppingProps.ingList.forEach(element => {
                        if(element.type == item && !element.purchased){
                            elemToDisplay.push(element.name);
                        }
                    });
                }

                itemRoute = {type: "shopping", checkBoxInitialValue: initValue, shoppingProps: props.route.shoppingProps};
                break;
        }
            


        const iconFromProps = props.icon ? props.icon[Number(toDisplay)] : undefined;


        const functionfromProps = () => {
            if(props.useOnPress && props.route.screen == "search"){
                if(toDisplay){
                    return props.route.filtersProps.sectionsSetter(props.route.filtersProps.sectionsState.filter((elem) => elem != item)) 
                }else {
                    return props.route.filtersProps.sectionsSetter([...props.route.filtersProps.sectionsState, item])
                }
            }
        };

        
        return(
            <View>
                {elemToDisplay.length > 0 ?
                    <RectangleButton text={item} height={50} centered={false} icon={iconFromProps} margins={padding.verySmall} onPressFunction={functionfromProps}  />
                :
                null}
                
                {toDisplay ?
                    <ChecklistsButtonsRender arrayToDisplay={elemToDisplay} filterTitle={item} route={itemRoute}/>
                : null}
            </View>
            )
        
    }
    
    const dataToDisplay = (props.route.screen == "search") ? filtersCategories : shoppingCategories;

        return(
            <FlatList data={dataToDisplay} renderItem={renderItem} scrollEnabled={false}/>
        )
}