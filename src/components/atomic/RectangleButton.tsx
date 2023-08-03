/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, opacityRectangleRounded, rectangleButtonStyles } from "@styles/buttons"
import { typoStyles } from "@styles/typography"


type RectangleButtonProps = {
    text: string,
}

export default function RectangleButton (props: RectangleButtonProps) {
    return(
        <Pressable style={rectangleButtonStyles.rectangleButton}>
            <View style={viewButtonStyles.viewInsideButtons}>
              <Text style={typoStyles.header}>{props.text}</Text>
            </View>
        </Pressable>
    )
}