/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { roundButtonStyles, viewButtonStyles, viewInsideButtonCentered } from "@styles/buttons"

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { cameraIcon, displayIcon, enumIconTypes, iconProp, iconsSize, iconsType } from "@assets/images/Icons";

type RoundButtonProps = {
    onPressFunction:() => void,
    diameter: number,
    text?: string,
    icon?: iconProp,
}

// hitBox of round button is kind of buggy in React Native. This topic fix it : https://www.jsparling.com/round-buttons-in-react-native/#:~:text=The%20key%20to%20making%20the,height%20%2C%20width%20%2C%20and%20borderRadius%20.
// hitSlop minus diamter/12 is empirically a good solution

export default function RoundButton (props: RoundButtonProps) {

    return(
        <Pressable style={roundButtonStyles(props.diameter).roundButton} hitSlop={-props.diameter/12} onPress={() => props.onPressFunction()}>  
            <View style={viewInsideButtonCentered}>

              {props.icon ? displayIcon(props.icon.type, props.icon.name, props.icon.size, props.icon.color) : null}
              {props.text ? <Text>{props.text}</Text> : null}
            </View>
        </Pressable>
    )
}