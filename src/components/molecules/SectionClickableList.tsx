import {iconProp} from "@assets/images/Icons"
import React, {useState} from "react"
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import CheckListsButtonsRender, {filterCheckbox, shoppingCheckbox} from "@components/molecules/CheckListsButtonsRender"
import {
    filtersCategories,
    listFilter,
    propsForShopping,
    shoppingCategories,
    TListFilter
} from "@customTypes/RecipeFiltersTypes";
import {selectFilterValuesToDisplay} from "@utils/FilterFunctions";
import {FiltersPassingProps} from "@components/organisms/FiltersSelection";
import RectangleButton from "@components/atomic/RectangleButton";
import {padding} from "@styles/spacing";

export type propsFromSearch = { screen: "search", } & FiltersPassingProps

export type propsFromShopping = { screen: "shopping", } & propsForShopping;

export type SectionClickableListProps = {
    screen: "search" | "shopping"
    icon?: Array<iconProp>,
    testMode?: boolean,
} & (propsFromSearch | propsFromShopping)

export default function SectionClickableList(props: SectionClickableListProps) {

    const [filterCategoryClicked, setFilterCategoryClicked] = useState(props?.screen === 'search' ? new Map<TListFilter, boolean>(filtersCategories.map(filter => [filter, false])) : new Map<TListFilter, boolean>());


    // TODO maybe put this in a separate file for a better readability
    function renderItem({item}: ListRenderItemInfo<TListFilter>): JSX.Element {

        let itemRoute: filterCheckbox | shoppingCheckbox;
        let elemToDisplay = new Array<string>();

        switch (props.screen) {
            case "search":
                elemToDisplay = selectFilterValuesToDisplay(item, props.tagsList, props.ingredientsList);
                itemRoute = {
                    type: "search",
                    filtersState: props.filtersState,
                    addFilter: props.addFilter,
                    removeFilter: props.removeFilter
                } as const;
                break;

            case "shopping":
                elemToDisplay = props.ingList.filter(ingredient => ingredient.type == item).map(ingFiltered => ingFiltered.name);
                itemRoute = {
                    type: "shopping",
                    checkBoxInitialValue: item == listFilter.purchased,
                    ingList: props.ingList,
                    updateIngredientFromShopping: props.updateIngredientFromShopping,
                } as shoppingCheckbox;
                break;
            default:
                itemRoute = {
                    type: "shopping",
                    checkBoxInitialValue: false,
                    ingList: [],
                    updateIngredientFromShopping: () => {
                        console.warn('setterIngList:: empty implementation due to missing case in renderItem');
                    },
                } as shoppingCheckbox;
                console.warn('renderItem::Should not be reachable');
        }

        // TODO magic number not very good
        const iconFromProps = props.icon ? props.icon[Number(1)] : undefined;


        function updateCategoryClicked() {
            switch (props.screen) {
                case "search":
                    filterCategoryClicked.set(item, !filterCategoryClicked.get(item) as boolean);

                    // Make a copy for react to trigger re-rendering
                    setFilterCategoryClicked(new Map(filterCategoryClicked));
                    break;
                case "shopping":
                    // Do nothing
                    break;
            }
        }

        return (
            <View>
                {elemToDisplay.length == 0 ? null :
                    <View>
                        <RectangleButton testID={`RectangleButtonForCategory - ${item}`} text={item} height={50}
                                         centered={false} icon={iconFromProps}
                                         margins={padding.verySmall} onPressFunction={updateCategoryClicked}/>
                        <CheckListsButtonsRender testID={`CheckListForCategory - ${item}`} testMode={props.testMode}
                                                 arrayToDisplay={elemToDisplay}
                                                 filterTitle={item}
                                                 route={itemRoute}/>
                    </View>}

            </View>
        )
    }

    const dataToRender = (props.screen == "search") ? filtersCategories : shoppingCategories;
    return (
        <FlatList data={dataToRender} renderItem={renderItem}
                  scrollEnabled={false} {...(props.testMode ? {
            initialNumToRender: dataToRender.length,
            maxToRenderPerBatch: dataToRender.length,
            windowSize: dataToRender.length
        } : null)}/>
    )
}
