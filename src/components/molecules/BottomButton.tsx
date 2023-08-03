/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, opacityRectangleRounded, rectangleButtonStyles } from "@styles/buttons"
import { typoStyles } from "@styles/typography"
import RectangleButton from "@components/atomic/RectangleButton"


type BottomButtonProps = {
    text: string,
}

export default function BottomButton (props: BottomButtonProps) {
    return(
    <View style={viewButtonStyles.bottomButton}>
        <RectangleButton text={props.text}/>
    </View>
    )
}