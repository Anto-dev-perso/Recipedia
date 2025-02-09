import {Button, Text, View} from "react-native";
import React from "react";
import {SectionClickableListProps} from "@components/molecules/SectionClickableList"

let cptIngPress = 0;

export function sectionClickableListMock(sectionClickableListProps: SectionClickableListProps) {

    return (
        <View>
            <Text testID="SectionClickableList::Screen">
                {JSON.stringify(sectionClickableListProps.screen)}
            </Text>
            <Text testID="SectionClickableList::Icon">
                {JSON.stringify(sectionClickableListProps.icon?.map(el => el.name))}
            </Text>
            {sectionClickableListProps.screen == "search" ?
                <View>
                    <Text testID="SectionClickableList::TagsList">
                        {JSON.stringify(sectionClickableListProps.tagsList)}
                    </Text>
                    <Text testID="SectionClickableList::IngredientsList">
                        {JSON.stringify(sectionClickableListProps.ingredientsList)}
                    </Text>
                    {/*Ignore filterState, addFilter and removeFilter because it is just passing through children (no effect visible)*/}
                </View>
                :
                <View>
                    <Text testID="SectionClickableList::IngList">
                        {JSON.stringify(sectionClickableListProps.ingList)}
                    </Text>
                    <Button testID="SectionClickableList::SetterIngList"
                            onPress={() => {
                                sectionClickableListProps.updateIngredientFromShopping(sectionClickableListProps.ingList[cptIngPress].name);
                                cptIngPress++;
                            }}
                            title="Click on Text"/>
                </View>}
        </View>
    );
}
