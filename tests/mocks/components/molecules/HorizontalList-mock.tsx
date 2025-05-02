import {Button, Text, View} from "react-native";
import React from "react";
import {HorizontalListProps} from "@components/molecules/HorizontalList";

let cptPress = 0;

export function horizontalListMock(horizontalListProps: HorizontalListProps) {

    return (
        <View>
            <Text testID="HorizontalList::PropType">
                {horizontalListProps.propType}
            </Text>
            <Text testID="HorizontalList::Item">
                {JSON.stringify(horizontalListProps.item)}
            </Text>
            <Button testID="HorizontalList::OnPress"
                    onPress={() => {
                        // @ts-ignore onPress is always defined here
                        horizontalListProps.onPress(horizontalListProps.item[cptPress]);
                        cptPress++;
                    }}
                    title="Click on Tag"/>
            {horizontalListProps.propType == "Tag" ?
                <View>
                    <Text testID="HorizontalList::Icon">
                        {horizontalListProps.icon}
                    </Text>
                </View>
                : null}
        </View>
    );
}
