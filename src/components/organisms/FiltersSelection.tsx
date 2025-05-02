import React from "react";
import {View} from 'react-native';
import HorizontalList from "@components/molecules/HorizontalList";
import TagButton from "@components/atomic/TagButton";
import {viewButtonStyles} from "@styles/buttons";
import {filtersAccessAndModifiers} from "@customTypes/RecipeFiltersTypes";
import {Icons, PlusMinusIcons} from "@assets/Icons";
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
            <HorizontalList propType={"Tag"} item={retrieveAllFilters(props.filtersState)} icon={Icons.crossIcon}
                            onPress={(item: string) => findFilterStringAndRemove(item)}/>
            <View style={viewButtonStyles.longHorizontalButton}>
                <TagButton text={"Add a filter"}
                           leftIcon={props.printSectionClickable ? Icons.removeFilterIcon : Icons.addFilterIcon}
                           onPressFunction={() => props.setPrintSectionClickable(!props.printSectionClickable)}/>
            </View>
            {props.printSectionClickable ?
                <SectionClickableList screen={"search"} icon={PlusMinusIcons} ingredientsList={props.ingredientsList}
                                      tagsList={props.tagsList} filtersState={props.filtersState}
                                      addFilter={props.addFilter} removeFilter={props.removeFilter}/>
                : null}
        </View>
    )
}
