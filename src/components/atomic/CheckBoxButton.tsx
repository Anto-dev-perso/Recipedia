import React, {useState} from "react";
import {Pressable, Text, View} from 'react-native';
import {wrappingButtonWithPressed} from "@styles/buttons";
import {checkboxIcons, displayIcon, enumIconTypes, iconsSize} from "@assets/Icons";
import {bulletListDataType, typoStyles} from '@styles/typography';
import {toggleActivationFunctions} from "@customTypes/ScreenTypes";
import {AsyncAlert} from "@utils/AsyncAlert";


export type CheckBoxButtonProps = {
    title: string,
    onLongPressData?: bulletListDataType,
    stateInitialValue: boolean,
    testID: string,

} & toggleActivationFunctions

export default function CheckBoxButton(props: CheckBoxButtonProps) {

    const [iconIndex, setIconIndex] = useState(props.stateInitialValue ? 1 : 0);
    const [pressState, setPressState] = useState(false);

    function togglePressState() {
        setPressState(!pressState);
    }

    function onPressFunction() {
        iconIndex == 0 ? props.onActivation() : props.onDeActivation();
        setIconIndex((iconIndex + 1) % 2)
    }

    function onLongPressFunction() {
        if (props.onLongPressData) {
            setPressState(true);
            AsyncAlert(`Recipes that use ${props.title}`, `Here are the list of recipes for this ingredient :${props.onLongPressData.bulletListData}`, "OK");
        }
    }

    return (
        <Pressable testID={props.testID + '::Pressable'} style={wrappingButtonWithPressed(pressState)}
                   onPressIn={togglePressState}
                   onPressOut={togglePressState}
                   onPress={onPressFunction}
                   onLongPress={onLongPressFunction}>
            {displayIcon(enumIconTypes.materialCommunity, checkboxIcons[iconIndex], iconsSize.medium, "#414a4c", {paddingLeft: 2})}

            <View>
                <Text testID={props.testID + '::Title'} style={typoStyles.paragraph}>{props.title}</Text>
                {props.onLongPressData ?
                    <Text testID={props.testID + '::LongPressData'}
                          style={typoStyles.element}>{props.onLongPressData.shortData}</Text> : null}
            </View>
        </Pressable>
    )
}
