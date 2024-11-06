

import React from "react"
import { Pressable, Text, View } from "react-native"
import { rectangleRoundedButtonStyles, viewButtonStyles, rectangleButtonStyles, viewInsideButtonCentered, rectangleButtonHeight } from "@styles/buttons"
import { typoStyles } from "@styles/typography"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { remValue } from "@styles/spacing";
import { displayIcon, iconProp, iconsType, materialCommunityIconName } from "@assets/images/Icons";


type RectangleButtonProps = {
    text: string,
    height?: number,
    onPressFunction?:() => void,
    icon?: iconProp,
    centered: boolean,
    margins?: number
}

export default function RectangleButton (props: RectangleButtonProps) {

    const rectHeight = (props.height ? props.height :rectangleButtonHeight ) ;
    const viewButton = (props.centered ? viewInsideButtonCentered : viewButtonStyles.viewInsideButtons ) ;

    return(
        <Pressable style={{...rectangleButtonStyles(rectHeight).rectangleButton, margin: props.margins}} onPress={props.onPressFunction}>
            <View style={viewButton}>
                {props.icon ? displayIcon(props.icon.type, props.icon.name, props.icon.size, props.icon.color, props.icon.style) : null}
                <Text style={typoStyles.header}>{props.text}</Text>
            </View>
        </Pressable>
    )
}