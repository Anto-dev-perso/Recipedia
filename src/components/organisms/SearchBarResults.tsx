import React from "react";
import {List} from "react-native-paper";
import {FlatList, Keyboard, ListRenderItemInfo} from "react-native";
import {padding} from "@styles/spacing";

export type SearchBarResultsProps = {
    testId: string,
    filteredTitles: Array<string>
    setSearchBarClicked: React.Dispatch<React.SetStateAction<boolean>>,
    updateSearchString: (newSearchString: string) => void,
}


export default function SearchBarResults({
                                             testId,
                                             filteredTitles,
                                             setSearchBarClicked,
                                             updateSearchString
                                         }: SearchBarResultsProps) {

    const renderTitle = ({item, index}: ListRenderItemInfo<string>) => {
        return (
            <List.Item testID={testId + "::Item::" + index}
                       key={index}
                       title={item}
                       onPress={() => {
                           Keyboard.dismiss();
                           setSearchBarClicked(false);
                           updateSearchString(item);
                       }}
                       style={{padding: padding.veryLarge}}
            />)
    };

    return (
        <List.Section>
            <FlatList testID={testId} data={filteredTitles} renderItem={renderTitle} scrollEnabled={false}/>
        </List.Section>
    )
}
