/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, opacityRectangleRounded } from "@styles/buttons"


type RectangleRoundedButtonProps = {
    length: number,
    text?: string,
}

export default function RectangleRoundedButton (props: RectangleRoundedButtonProps) {
    return(
        <Pressable style={rectangleRoundedButtonStyles(props.length).rectangleRoundedButton}>
            <View style={viewButtonStyles.viewInsideButtons}>
              {props.text ? <Text>Icon text</Text> : null}
            </View>
        </Pressable>
    )
}