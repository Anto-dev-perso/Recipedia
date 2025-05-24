import React from "react";
import {Button, Text, View} from 'react-native'
import {ItemDialogProps} from "@components/dialogs/ItemDialog";

export function itemDialogMock({item, mode, onClose, testId}: ItemDialogProps) {
    const dialogTestID = testId + "::ItemDialog";
    return (<View>
        <Text testID={dialogTestID + "::Mode"}>   {mode}        </Text>
        <Button testID={dialogTestID + "::OnClose"}
                onPress={() => onClose()}
                title="Close dialog"/>
        <Text testID={dialogTestID + "::Item"}>
            {JSON.stringify(item)}
        </Text>
        <Text testID={dialogTestID + "::Item::Type"}>
            {item.type}
        </Text>
        <Text testID={dialogTestID + "::Item::Value"}>
            {JSON.stringify(item.value)}
        </Text>
        <Button testID={dialogTestID + "::Item::OnConfirm"} onPress={() => {
            if (item.type === 'tag') {
                item.onConfirmTag(mode, {...item.value, tagName: "New Value"})
            } else {
                item.onConfirmIngredient(mode, {...item.value, ingName: "New Value"})
            }
        }} title="Confirm"/>
    </View>)
}
