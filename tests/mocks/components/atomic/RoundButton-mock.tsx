import {Button, Text, View} from "react-native";
import React from "react";
import {RoundButtonProps} from "@components/atomic/RoundButton";


export function roundButtonMock(roundButtonProps: RoundButtonProps) {

    return (
        <View>
            <Text testID="RoundButton::Icon">
                {roundButtonProps.icon}
            </Text>
            {roundButtonProps.onPressFunction !== undefined ?
                <Button testID="RoundButton::OnPressFunction"
                        onPress={roundButtonProps.onPressFunction}
                        title="Click on Text"/> : null}

        </View>
    );
}
