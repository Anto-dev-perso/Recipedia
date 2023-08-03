/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, opacityRectangleRounded } from "@styles/buttons"
import { typoStyles } from "@styles/typography"


type RectangleRoundedButtonProps = {
    text: string,
}

export default function RectangleRoundedButton (props: RectangleRoundedButtonProps) {
    return(
        <Pressable style={rectangleRoundedButtonStyles.rectangleRoundedButton}>
            <View style={viewButtonStyles.viewInsideButtons}>
              <Text style={typoStyles.element}>{props.text}</Text>
            </View>
        </Pressable>
    )
}