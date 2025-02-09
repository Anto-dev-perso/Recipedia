import {RectangleButtonProps} from "@components/atomic/RectangleButton";
import React from "react";
import {Button, Text, View} from 'react-native'

export function rectangleButtonMock(rectangleProps: RectangleButtonProps) {
    return (<View>
        <Text testID={rectangleProps.testID + "::Text"}>
            {rectangleProps.text}
        </Text>
        <Text testID={rectangleProps.testID + "::Height"}>
            {rectangleProps.height?.toString()}
        </Text>
        <Text testID={rectangleProps.testID + "::Icon"}>
            {JSON.stringify(rectangleProps.icon)}
        </Text>
        <Text testID={rectangleProps.testID + "::Centered"}>
            {rectangleProps.centered}
        </Text>
        <Text testID={rectangleProps.testID + "::Margins"}>
            {rectangleProps.margins?.toString()}
        </Text>
        <Button testID={rectangleProps.testID + "::OnPressFunction"}
                onPress={rectangleProps.onPressFunction}
                title="Click on Text"/>

    </View>)
}
