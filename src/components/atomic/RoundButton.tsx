import React from "react"
import {IconName} from "@assets/Icons";
import {FAB} from "react-native-paper";
import {StyleProp, View, ViewStyle} from "react-native";

export type RoundButtonProps = {
    icon: IconName,
    size: 'small' | 'medium' | 'large',
    onPressFunction: () => void,
    testID: string,
    style?: StyleProp<ViewStyle>,
}


export default function RoundButton({icon, onPressFunction, testID, style}: RoundButtonProps) {

    return (
        <View style={[{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
        }, style]}>
            <FAB testID={testID + "::RoundButton"} icon={icon} size={'medium'} mode={'elevated'}
                 style={{borderRadius: 999}}
                 onPress={onPressFunction}/>
        </View>
    )
}
