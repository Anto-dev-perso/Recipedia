import React from "react";
import {View} from 'react-native';
import HorizontalList from "@components/molecules/HorizontalList";
import TagButton from "@components/atomic/TagButton";
import {viewButtonStyles} from "@styles/buttons";
import {filtersAccessAndModifiers} from "@customTypes/RecipeFiltersTypes";
import {crossIcon, enumIconTypes, plusIcon, PlusMinusIcons} from "@assets/images/Icons";
import {padding} from "@styles/spacing";
import {ingredientTableElement} from "@customTypes/DatabaseElementTypes";
import SectionClickableList from "@components/molecules/SectionClickableList";
import {retrieveAllFilters} from "@utils/FilterFunctions";

export type FiltersPassingProps = {
    tagsList: Array<string>,
    ingredientsList: Array<ingredientTableElement>,
} & filtersAccessAndModifiers

export type FiltersSelectionProps = {
    printSectionClickable: boolean,
    setPrintSectionClickable: React.Dispatch<React.SetStateAction<boolean>>,
} & FiltersPassingProps

export default function FiltersSelection(props: FiltersSelectionProps) {

    function findFilterStringAndRemove(item: string) {
        for (const [key, value] of props.filtersState) {
            if (value.includes(item)) {
                props.removeFilter(key, item);
            }
        }
    }

    return (
        <View testID={'FilterSelection'}>
            <HorizontalList propType={"Tag"} item={retrieveAllFilters(props.filtersState)} icon={{
                type: enumIconTypes.entypo,
                name: crossIcon,
                size: padding.large,
                color: "#414a4c",
                style: {paddingRight: 5}
            }} onTagPress={(item: string) => findFilterStringAndRemove(item)}/>
            <View style={viewButtonStyles.longHorizontalButton}>
                <TagButton text={"Add a filter"} leftIcon={{
                    type: enumIconTypes.materialCommunity,
                    name: plusIcon,
                    size: padding.veryLarge,
                    color: "#414a4c",
                    style: {paddingLeft: 5}
                }} onPressFunction={() => props.setPrintSectionClickable(!props.printSectionClickable)}/>
            </View>
            {props.printSectionClickable ?
                <SectionClickableList screen={"search"} icon={PlusMinusIcons} ingredientsList={props.ingredientsList}
                                      tagsList={props.tagsList} filtersState={props.filtersState}
                                      addFilter={props.addFilter} removeFilter={props.removeFilter}/>
                : null}
        </View>
    )
}
