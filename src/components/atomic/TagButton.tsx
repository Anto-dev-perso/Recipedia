import React from "react"
import {IconName} from '@assets/images/Icons';
import {Chip, MD3Theme, useTheme} from "react-native-paper";


export type TagButtonProps = {
    text: string,
    leftIcon?: IconName,
    rightIcon?: IconName,
    onPressFunction?: () => void,
};

export default function TagButton(props: TagButtonProps) {

    const theme: MD3Theme = useTheme();
    const fontSize = theme.fonts.bodySmall.fontSize;
    return (
        <Chip style={{backgroundColor: theme.colors.tertiary, borderRadius: 20}}
              textStyle={{fontSize: fontSize, letterSpacing: 0}}
              icon={props.leftIcon}
              onPress={props.onPressFunction}
              closeIcon={props.rightIcon} onClose={props.rightIcon ? props.onPressFunction : undefined}
        >
            {props.text}</Chip>
    )
}
