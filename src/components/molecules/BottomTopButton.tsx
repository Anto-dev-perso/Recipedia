import React from "react"
import {StyleProp, View, ViewStyle} from 'react-native';
import {
    bottomCenterButton,
    bottomFullButton,
    bottomLeftButton,
    bottomRightButton,
    bottomTopPosition,
    topCenterButton,
    topFullButton,
    topLeftButton,
    topRightButton
} from "@styles/buttons"

export type BottomTopButtonProps<T extends React.ElementType> = {
        as: T,
        position: bottomTopPosition,
        buttonOffset?: number,
        onPressFunction(): void,

        testID: string,
    }
    & React.ComponentProps<T>;

export default function BottomTopButton<T extends React.ElementType>({
                                                                         as,
                                                                         position,
                                                                         buttonOffset,
                                                                         ...restProps
                                                                     }: BottomTopButtonProps<T>) {
    const Button = as;
    let buttonStyle: StyleProp<ViewStyle>;
    // Bottom buttons can have a vertical offset. In this case, use the prop else set the offset to 0
    const offset = buttonOffset ? buttonOffset : 0;

    switch (position) {
        case bottomTopPosition.top_left:
            buttonStyle = topLeftButton(offset);
            break;
        case bottomTopPosition.top_right:
            buttonStyle = topRightButton(offset);
            break;
        case bottomTopPosition.top_center:
            buttonStyle = topCenterButton(offset);
            break;
        case bottomTopPosition.top_full:
            buttonStyle = topFullButton(offset);
            break;
        case bottomTopPosition.bottom_left:
            buttonStyle = bottomLeftButton(offset);
            break;
        case bottomTopPosition.bottom_right:
            buttonStyle = bottomRightButton(offset);
            break;
        case bottomTopPosition.bottom_center:
            buttonStyle = bottomCenterButton(offset);
            break;
        case bottomTopPosition.bottom_full:
            buttonStyle = bottomFullButton(offset);
            break;
        default:
            console.warn("BottonTopButtons : Unreachable code");
            break;
    }

    return (
        <View style={buttonStyle}>
            <Button {...restProps}/>
        </View>
    )
}
