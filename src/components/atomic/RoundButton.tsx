/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { roundButtonStyles, viewButtonStyles, viewInsideButtonCentered } from "@styles/buttons"

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type RoundButtonProps = {
    onPressFunction:() => void,
    diameter: number,
    text?: string,
    icon?: {
        name: string,
        color: string,
        size: number,
    },
}

// hitBox of round button is kind of buggy in React Native. This topic fix it : https://www.jsparling.com/round-buttons-in-react-native/#:~:text=The%20key%20to%20making%20the,height%20%2C%20width%20%2C%20and%20borderRadius%20.
// hitSlop minus diamter/12 is empirically a good solution

export default function RoundButton (props: RoundButtonProps) {

    const iconSize = props.diameter/2.3;

    return(
        <Pressable style={roundButtonStyles(props.diameter).roundButton} hitSlop={-props.diameter/12} onPress={() => props.onPressFunction()}>  
            <View style={viewInsideButtonCentered}>
              {/* {props.icon ? <Ionicons name={props.icon.name} size={props.icon.size} color={props.icon.color}/> : null } */}

              <FontAwesome name="camera" size={iconSize}/>
              {props.text ? <Text>{props.text}</Text> : null}
            </View>
        </Pressable>
    )
}