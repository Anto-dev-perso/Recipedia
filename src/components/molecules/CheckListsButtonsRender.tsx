import {viewPosition} from "@styles/buttons"
import {screenViews} from "@styles/spacing"
import {bulletListDataType} from "@styles/typography"
import React from "react"
import {FlatList, ListRenderItemInfo, View} from "react-native"
import CheckBoxButton from '@components/atomic/CheckBoxButton';
import {filtersAccessAndModifiers, propsForShopping, TListFilter} from '@customTypes/RecipeFiltersTypes';
import EStyleSheet from "react-native-extended-stylesheet";


export type filterCheckbox = { type: "search", } & filtersAccessAndModifiers;

export type shoppingCheckbox = { type: "shopping", checkBoxInitialValue: boolean, } & propsForShopping

export type ChecklistsButtonsRenderProps = {
    filterTitle: TListFilter,
    arrayToDisplay: Array<string>,

    route: filterCheckbox | shoppingCheckbox;
    testID: string,
    testMode?: boolean,
}

export default function CheckListsButtonsRender(props: ChecklistsButtonsRenderProps) {

    const numCol: number = (props.route.type == "search") ? 2 : 1;

    function isFilterAlreadySet(str: string): boolean {
        switch (props.route.type) {
            case "search":
                const typeOfFilterArray = props.route.filtersState.get(props.filterTitle);
                if (typeOfFilterArray === undefined) {
                    return false;
                } else {
                    return typeOfFilterArray.includes(str);
                }
            case "shopping":
                return props.route.checkBoxInitialValue;
        }
    }


    function renderItemOfArray({item}: ListRenderItemInfo<string>): JSX.Element {

        let viewFromProps: EStyleSheet.AnyObject;

        let dataOnLongPress: bulletListDataType | undefined;
        switch (props.route.type) {
            case "search":
                viewFromProps = viewPosition.splitVerticallyIn2;

                dataOnLongPress = undefined;
                break;
            case "shopping":
                viewFromProps = screenViews.listView;

                const recipesTitle = new Array<string>();
                for (const element of props.route.ingList) {
                    if (element.name == item) {
                        recipesTitle.push(...element.recipesTitle.map(title => "\n\t- " + title));
                    }
                }

                dataOnLongPress = {
                    bulletListData: recipesTitle,
                    multiplesData: (recipesTitle.length > 1),
                    shortData: recipesTitle.length + " recipe" + (recipesTitle.length > 1 ? "s" : "")
                };
                break;
            default:
                viewFromProps = {};
                dataOnLongPress = undefined;

        }

        function clickOnElementNotCheck() {
            switch (props.route.type) {
                case "search":
                    props.route.addFilter(props.filterTitle, item);
                    break;
                case "shopping":
                    props.route.updateIngredientFromShopping(item);
                    break;
            }
        }

        function clickOnElementCheck() {
            switch (props.route.type) {
                case "search":
                    props.route.removeFilter(props.filterTitle, item);
                    break;
                case "shopping":
                    props.route.updateIngredientFromShopping(item);
                    break;
            }
        }

        return (
            <View style={viewFromProps}>
                <CheckBoxButton testID={`CheckBoxButton - ${item}`} title={item} onLongPressData={dataOnLongPress}
                                stateInitialValue={isFilterAlreadySet(item)}
                                onActivation={clickOnElementNotCheck}
                                onDeActivation={clickOnElementCheck}/>
            </View>
        )
    }

    return (
        <FlatList testID={props.testID} data={props.arrayToDisplay} renderItem={renderItemOfArray} numColumns={numCol}
                  scrollEnabled={false} {...(props.testMode ? {
            initialNumToRender: props.arrayToDisplay.length,
            maxToRenderPerBatch: props.arrayToDisplay.length,
            windowSize: props.arrayToDisplay.length
        } : null)}/>
    )
}
