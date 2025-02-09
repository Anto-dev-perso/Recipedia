import {Button, Text, View} from "react-native";
import React from "react";
import {CheckBoxButtonProps} from "@components/atomic/CheckBoxButton";

export function checkBoxButtonMock(checkBoxButtonProps: CheckBoxButtonProps) {

    return (
        <View>
            <Text testID={checkBoxButtonProps.testID + "::Title"}>
                {checkBoxButtonProps.title}
            </Text>
            <Text testID={checkBoxButtonProps.testID + "::StateInitialValue"}>
                {checkBoxButtonProps.stateInitialValue}
            </Text>
            <Text testID={checkBoxButtonProps.testID + "::UseCheckBoxState"}>
                {checkBoxButtonProps.useCheckBoxState}
            </Text>
            <Text testID={checkBoxButtonProps.testID + "::OnLongPressData"}>
                {JSON.stringify(checkBoxButtonProps.onLongPressData)}
            </Text>
            <Button testID={checkBoxButtonProps.testID + "::OnActivation"}
                    onPress={() => checkBoxButtonProps.onActivation()}
                    title="Click on Text"/>
            <Button testID={checkBoxButtonProps.testID + "::OnDeActivation"}
                    onPress={() => checkBoxButtonProps.onDeActivation()}
                    title="Click on Text"/>
        </View>
    );
}
