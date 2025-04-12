import React from "react"
import {Pressable, StyleProp, Text, View, ViewStyle} from "react-native"
import {roundButtonStyles, viewInsideButtonCentered} from "@styles/buttons"
import {displayIcon, iconProp} from "@assets/Icons";

export type RoundButtonProps = {
    onPressFunction: () => void,
    diameter: number,
    style?: StyleProp<ViewStyle>,
    text?: string,
    icon?: iconProp,
    testID?: string,
}

// TODO hitBox of round button is kind of buggy in React Native. This topic fix it : https://www.jsparling.com/round-buttons-in-react-native/#:~:text=The%20key%20to%20making%20the,height%20%2C%20width%20%2C%20and%20borderRadius%20.
// hitSlop minus diameter/12 is empirically a good solution (12 as a magic number)


export default function RoundButton(props: RoundButtonProps) {

    return (
        <View style={props.style}>
            {/*TODO direct call to onPressFunction instead*/}
            <Pressable testID={props.testID} style={roundButtonStyles(props.diameter).roundButton}
                       hitSlop={-props.diameter / 12}
                       onPress={() => props.onPressFunction()}>
                <View style={viewInsideButtonCentered}>

                    {props.icon ? displayIcon(props.icon.type, props.icon.name, props.icon.size, props.icon.color) : null}
                    {props.text ? <Text>{props.text}</Text> : null}
                </View>
            </Pressable>
        </View>
    )
}
