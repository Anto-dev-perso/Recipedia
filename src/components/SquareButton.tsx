/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Image, ImageRequireSource, ImageSourcePropType, Pressable, View } from "react-native"
import { squareButtonStyles, viewButtonStyles, opacitySquare } from "@styles/buttons"

import Icon from 'react-native-vector-icons/FontAwesome';


type SquareButtonProps = {
    onPressFunction:() => void,
    side: number,
    text?: string,
    // image?: ImageRequireSource,
    image?: ImageSourcePropType,
}

export default function SquareButton (props: SquareButtonProps) {
    return(
        <Pressable style={squareButtonStyles(props.side).squareButton} onPress={() => props.onPressFunction()}>
            <View style={viewButtonStyles.viewInsideButtons}>
              {props.image ? <Image source={props.image} style={viewButtonStyles.imageInsideButton}/> : null}
            </View>
        </Pressable>
    )
}
