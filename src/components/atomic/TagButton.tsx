/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"
import { typoStyles } from "@styles/typography"
import { remValue } from "@styles/spacing"
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons"
import { displayIcon, enumIconTypes, iconProp, iconsSize, materialCommunityIconName } from '@assets/images/Icons';


type TagButtonProps = {
    text: string,
    leftIcon?: iconProp,
    rightIcon?: iconProp,
    onPressFunction?:() => void,
}

const TagHeight = 30 * remValue;


export default function TagButton (props: TagButtonProps) {
    return(
        <Pressable style={rectangleRoundedButtonStyles(TagHeight).rectangleRoundedButton} onPress={props.onPressFunction}>
            <View style={viewInsideButtonCentered}>
                {props.leftIcon ? displayIcon(props.leftIcon.type, props.leftIcon.name, props.leftIcon.size, props.leftIcon.color, props.leftIcon.style)
                : null}
                <Text style={typoStyles.element}>{props.text}</Text>
                {props.rightIcon ? displayIcon(props.rightIcon.type, props.rightIcon.name, props.rightIcon.size, props.rightIcon.color, props.rightIcon.style) : null}
            </View>
        </Pressable>
    )
}