import React from "react";
import {Keyboard, TextInput, View} from "react-native";
import {searchBarStyle, typoStyles} from "@styles/typography";
import {remValue} from "@styles/spacing";
import {crossIcon, displayIcon, enumIconTypes, iconsSize, searchIcon} from "@assets/Icons";
import { useI18n } from "@utils/i18n";

export type SearchBarProps = {
    clicked: boolean,
    searchPhrase: string,
    setClicked: React.Dispatch<React.SetStateAction<boolean>>,
    setSearch: (newSearchString: string) => void;
}

// TODO it is case sensitive but it shouldn't be

export default function SearchBar(props: SearchBarProps) {
    const { t } = useI18n();
    function crossGesture() {
        Keyboard.dismiss();
        props.setClicked(false);
        props.setSearch("");
    }

    return (
        <View style={searchBarStyle.searchBarView} testID={"SearchBar"}>
            <View style={searchBarStyle.searchBarComponent}>
                {/* search Icon */}
                {displayIcon(enumIconTypes.materialCommunity, searchIcon, iconsSize.small, "#414a4c", {paddingLeft: 10 * remValue})}

                {/* Input field */}
                <TextInput style={typoStyles.searchBar} placeholder={t('searchRecipeTitle')} value={props.searchPhrase}
                           onChangeText={props.setSearch} onFocus={() => props.setClicked(true)}
                           onSubmitEditing={() => {
                               props.setClicked(false);
                           }}/>

                {/* cross Icon, depending on whether the search bar is clicked or not */}
                {props.clicked ? displayIcon(enumIconTypes.materialCommunity, crossIcon, iconsSize.medium, "#414a4c", {paddingRight: 10 * remValue}, crossGesture) : null}
            </View>
        </View>
    )
}
