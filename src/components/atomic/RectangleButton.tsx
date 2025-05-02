import React from "react";
import {Button, useTheme} from 'react-native-paper';
import {IconName} from "@assets/Icons";
import {StyleProp, ViewStyle} from "react-native";

export type RectangleButtonProps = {
    text: string,
    onPressFunction?: () => void,
    icon?: IconName,
    centered: boolean,
    border: boolean,
    testID: string,
}

export default function RectangleButton(props: RectangleButtonProps) {
    const {colors, fonts} = useTheme();

    const borderStyle: StyleProp<ViewStyle> = (props.border) ? {borderTopWidth: 1, borderColor: colors.outline} : null;

    return (
        <Button
            testID={props.testID}
            style={borderStyle}
            contentStyle={{
                flexDirection: 'row',
                justifyContent: props.centered ? 'center' : 'flex-start',
            }}
            labelStyle={{
                ...fonts.titleLarge,
                textAlign: props.centered ? 'center' : 'left',
            }}
            mode="contained"
            buttonColor={colors.primaryContainer}
            textColor={colors.onPrimaryContainer}
            icon={props.icon}
            onPress={props.onPressFunction}>
            {props.text}
        </Button>
    );
}
