import React from "react";
import {padding, screenWidth} from "@styles/spacing";
import {Icons} from "@assets/Icons";
import {useI18n} from "@utils/i18n";
import {IconButton, Searchbar} from "react-native-paper";
import {Keyboard} from "react-native";

export type SearchBarProps = {
    testId: string,
    searchPhrase: string,
    setSearchBarClicked: React.Dispatch<React.SetStateAction<boolean>>,
    updateSearchString: (newSearchString: string) => void;
}

// TODO it is case sensitive but it shouldn't be

export default function SearchBar({testId, searchPhrase, setSearchBarClicked, updateSearchString}: SearchBarProps) {
    const {t} = useI18n();

    return (
        <Searchbar testID={testId}
                   mode={"bar"}
                   placeholder={t('searchRecipeTitle')}
                   onChangeText={updateSearchString}
                   value={searchPhrase}
                   style={{margin: padding.medium, marginBottom: padding.small, borderRadius: screenWidth / 10}}
                   onFocus={() => setSearchBarClicked(true)}
                   onSubmitEditing={() => setSearchBarClicked(false)}
                   right={props => (searchPhrase.length > 0 &&
                       <IconButton {...props} testID={testId + "::RightIcon"} icon={Icons.crossIcon}
                                   onPress={() => {
                                       Keyboard.dismiss();
                                       setSearchBarClicked(false);
                                       updateSearchString("");
                                   }}/>)}
        />
    )
}
