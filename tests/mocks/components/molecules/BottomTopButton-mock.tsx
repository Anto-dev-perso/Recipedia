import {Button, View} from "react-native";
import React from "react";
import {BottomTopButtonProps} from "@components/molecules/BottomTopButton";


export function bottomTopButtonMock(bottomTopButtonProps: BottomTopButtonProps<any>) {

    return (
        <View>
            <Button testID={bottomTopButtonProps.testID + "::OnPressFunction"}
                    onPress={() => bottomTopButtonProps.onPressFunction()}
                    title="On Press Function"/>
        </View>
    );
}
