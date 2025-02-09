import React from "react";
import {Button, Text, View} from 'react-native'
import {ChecklistsButtonsRenderProps} from "@components/molecules/CheckListsButtonsRender";
import {TListFilter} from "@customTypes/RecipeFiltersTypes";
import {mapToObject} from "@mocks/components/organisms/FiltersSelection-mock";

export function checkListsButtonMock(checkListsProps: ChecklistsButtonsRenderProps) {
    return (<View>
        <Text testID={checkListsProps.testID + "::FilterTitle"}>
            {checkListsProps.filterTitle}
        </Text>
        <Text testID={checkListsProps.testID + "::ArrayToDisplay"}>
            {JSON.stringify(checkListsProps.arrayToDisplay)}
        </Text>
        {checkListsProps.route.type === 'search' ?
            <View>
                <Text testID={checkListsProps.testID + "::FiltersState"}>
                    {JSON.stringify(mapToObject(checkListsProps.route.filtersState))}
                </Text>
                <Button testID={checkListsProps.testID + "::AddFilter"}
                        onPress={(filter: TListFilter, value: string) => {
                            //@ts-ignore function does exist at this point
                            checkListsProps.route.addFilter(filter, value)
                        }}
                        title="Add a filter"/>
                <Button testID={checkListsProps.testID + "::RemoveFilter"}
                        onPress={(filter: TListFilter, value: string) => {
                            //@ts-ignore function does exist at this point
                            checkListsProps.route.removeFilter(filter, value)
                        }}
                        title="Remove a filter"/>
            </View>
            : <View>
                <Text testID={checkListsProps.testID + "::CheckBoxInitialValue"}>
                    {checkListsProps.route.checkBoxInitialValue}
                </Text>
                <Text testID={checkListsProps.testID + "::IngList"}>
                    {JSON.stringify(checkListsProps.route.ingList)}
                </Text>
                <Button testID={checkListsProps.testID + "::updateIngredientFromShopping"}
                        onPress={(ingredientName) => {
                            //@ts-ignore function does exist at this point
                            checkListsProps.route.updateIngredientFromShopping(ingredientName)
                        }}
                        title="Update an Ingredient"/>
            </View>}
    </View>)
}
