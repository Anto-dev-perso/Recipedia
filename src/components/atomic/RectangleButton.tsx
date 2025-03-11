import React from "react"
import {IconName} from "@assets/images/Icons";
import {Button, useTheme} from 'react-native-paper'
import {palette} from "@styles/colors";
import {padding} from "@styles/spacing";


export type RectangleButtonProps = {
    text: string,
    onPressFunction?: () => void,
    icon?: IconName,
    centered: boolean,
    margins?: number
    testID: string,
}

export default function RectangleButton(props: RectangleButtonProps) {
    
    const theme = useTheme();

    return (
        <Button testID={props.testID}
                style={{
                    backgroundColor: theme.colors.primary,
                    borderWidth: 1,
                    borderColor: palette.borderColor,
                    paddingVertical: padding.small,
                }}
                contentStyle={{justifyContent: props.centered ? "center" : "flex-start"}}
                labelStyle={{
                    ...theme.fonts.bodyLarge,
                    color: palette.textPrimary, textAlignVertical: "center"
                }}
                icon={props.icon}
                onPress={props.onPressFunction}>{props.text}</Button>
    )
}
