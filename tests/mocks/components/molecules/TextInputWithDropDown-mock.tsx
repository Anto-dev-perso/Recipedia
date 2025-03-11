import {Button, Text, View} from "react-native";
import React from "react";
import {TextInputWithDropDownType} from "@components/molecules/TextInputWithDropDown";

export function textInputWithDropdownMock(inputWithDropdownProps: TextInputWithDropDownType) {
    return (
        <View>
            <Text testID={inputWithDropdownProps.testID + "::TextInputWithDropdown::AbsoluteDropDown"}>
                {inputWithDropdownProps.absoluteDropDown}
            </Text>
            <Text testID={inputWithDropdownProps.testID + "::TextInputWithDropdown::ReferenceTextArray"}>
                {JSON.stringify(inputWithDropdownProps.referenceTextArray)}
            </Text>
            <Text testID={inputWithDropdownProps.testID + "::TextInputWithDropdown::Value"}>
                {JSON.stringify(inputWithDropdownProps.value)}
            </Text>
            <Text testID={inputWithDropdownProps.testID + "::TextInputWithDropdown::Outline"}>
                {JSON.stringify(inputWithDropdownProps.outline)}
            </Text>
            <Button testID={inputWithDropdownProps.testID + "::TextInputWithDropdown::OnValidate"}
                    onPress={() => {
                        // @ts-ignore
                        inputWithDropdownProps.onValidate("Test string");
                    }}
                    title="Click on Validate"/>
        </View>
    );
}
