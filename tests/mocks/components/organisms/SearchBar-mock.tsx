import {SearchBarProps} from "@components/organisms/SearchBar";
import {Button, Text, View} from "react-native";
import React from "react";

let cptSearch = 0;

export function searchBarMock(searchBarProp: SearchBarProps) {
    // TODO create a filter dataset

    const searchPhrase = new Array<string>('S', 'Se', 'Sea', 'Sear', 'Search');


    return (
        <View>
            <Button testID="SearchBar::SearchBarClicked"
                    onPress={() => {
                        searchBarProp.setClicked(!searchBarProp.clicked);
                    }}
                    title="Click on search Bar"/>
            <Button testID="SearchBar::SearchBarPhraseChange"
                    onPress={() => {
                        const newSearchPhrase = searchPhrase[cptSearch];
                        cptSearch++;
                        searchBarProp.setSearch(newSearchPhrase);
                    }}
                    title="Editing search phrase"/>
            <Text testID="SearchBar::Clicked">
                {JSON.stringify(searchBarProp.clicked)}
            </Text>
            <Text testID="SearchBar::SectionClickable">
                {JSON.stringify(searchBarProp.searchPhrase)}
            </Text>
        </View>
    );
}
