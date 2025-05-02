import React from "react"
import {IconName} from '@assets/Icons';
import {Chip, Icon, MD3Theme, useTheme} from "react-native-paper";


export type TagButtonProps = {
    text: string,
    leftIcon?: IconName,
    rightIcon?: IconName,
    onPressFunction?: () => void,
};

export default function TagButton(props: TagButtonProps) {

    const {colors, fonts}: MD3Theme = useTheme();

    // Create custom icon functions with specific color
    // The Chip component automatically passes the size parameter to our icon function
    // We use that size and override only the color
    const leftIconComponent = props.leftIcon ?
        ({size}: { size: number }) => <Icon source={props.leftIcon} size={size} color={colors.onSecondaryContainer}/> :
        undefined;

    return (
        <Chip style={{backgroundColor: colors.secondaryContainer, borderRadius: 20}}
              textStyle={[fonts.bodySmall, {color: colors.onSecondaryContainer}]}
              mode={'outlined'}
              selectedColor={colors.secondary}
              icon={leftIconComponent}
              closeIcon={props.rightIcon}
              onClose={props.rightIcon ? props.onPressFunction : undefined}
              onPress={props.onPressFunction}>
            {props.text}</Chip>
    )
}
