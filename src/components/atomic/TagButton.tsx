/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, viewInsideButtonCentered} from "@styles/buttons"
import { typoStyles } from "@styles/typography"
import { remValue } from "@styles/spacing"
import { Entypo } from "@expo/vector-icons"
import { iconsSize } from '../../assets/images/Icons';


type TagButtonProps = {
    text: string,
    leftIcon?: boolean,
    rightIcon?: boolean,
    onPressFunction?:() => void,
}

const TagHeight = 30 * remValue;


export default function TagButton (props: TagButtonProps) {
    return(
        <Pressable style={rectangleRoundedButtonStyles(TagHeight).rectangleRoundedButton} onPress={props.onPressFunction}>
            <View style={viewInsideButtonCentered}>
                {props.leftIcon ? <Entypo name="cross" size={iconsSize.small} color="#414a4c" style={{paddingLeft: 2}}/> : null}
                <Text style={typoStyles.element}>{props.text}</Text>
                {props.rightIcon ? <Entypo name="cross" size={iconsSize.small} color="#414a4c" style={{paddingRight: 2}}/> : null}
            </View>
        </Pressable>
    )
}