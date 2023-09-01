/**
 * TODO fill this part
 * @format
 */

import React from "react"
import { Pressable, Text, View, Button, StyleProp, ViewStyle } from 'react-native';
import { bottomPosition, bottomFullButton, bottomLeftButton, bottomRightButton, bottomCenterButton } from "@styles/buttons"

type BottomButtonProps<T extends React.ElementType>  = {
    as: T,
    position: bottomPosition,
    buttonOffset?: number,
    onPressFunction(): void,
} 
& React.ComponentProps<T>;

export default function BottomButton<T extends React.ElementType> ( {as, position, buttonOffset, ... restProps}: BottomButtonProps<T> ) {
    const Button = as;
    let buttonStyle: StyleProp<ViewStyle>;
    let offset: number;
    
    // Bottom buttons can have a vertical offset. In this case, use the prop else set the offset to 0
    buttonOffset ? (offset = buttonOffset) : (offset = 0);

    switch (position) {
        case bottomPosition.left:
            buttonStyle = bottomLeftButton(offset);
            break;
        case bottomPosition.right:
            buttonStyle = bottomRightButton(offset);
            break;
        case bottomPosition.center:
            buttonStyle = bottomCenterButton(offset);
            break;
        case bottomPosition.full:
            buttonStyle = bottomFullButton(offset);
            break;
    
        default:
            break;
    }

    return(
    <View style={buttonStyle}>
        <Button {...restProps}/>
    </View>
    )
}