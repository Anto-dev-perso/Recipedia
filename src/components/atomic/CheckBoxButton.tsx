/**
 * TODO fill this part
 * @format
 */

import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import { viewButtonStyles, wrappingButtonWithPressed } from "@styles/buttons";
import { recipeDb } from "@utils/RecipeDatabase";
import FullScreenFiltering from "@components/organisms/FullScreenFiltering";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { checkboxIcons, enumIconTypes, iconsSize } from "@assets/images/Icons";
import { bulletListDataType, typoStyles } from '@styles/typography';
import { remValue } from "@styles/spacing";
import { toggleActivationFunctions } from "@customTypes/ScreenTypes";
import { displayIcon, materialCommunityIconName } from '../../assets/images/Icons';
import { AsyncAlert } from "@utils/AsyncAlert";


type CheckBoxButtonProps = {
    title: string,
    onLongPressData: bulletListDataType,
    stateInitialValue: boolean,
    useCheckBoxState: boolean,

    onPressFunctions: toggleActivationFunctions,
}

export default function CheckBoxButton ( props: CheckBoxButtonProps) {

    const [iconIndex, setIconIndex] = useState(0);
    const [pressState, setPressState] = useState(false);

    useEffect(() => {
        props.stateInitialValue ? setIconIndex(1) : setIconIndex(0) ;        
  }, [])

    return (
        <Pressable style={wrappingButtonWithPressed(pressState)}
        onPressIn={() => setPressState(true)}
        onPressOut={() => setPressState(false)}
            onPress={() => {
                {iconIndex==0 ?   props.onPressFunctions.onActivation() :   props.onPressFunctions.onDeActivation() }
                {props.useCheckBoxState ? setIconIndex( (iconIndex+1) % 2 ) : null}
            }} 
            onLongPress={() => {
                setPressState(true);
                AsyncAlert(`Recipes that use ${props.title}`, `Here are the list of recipes for this ingredient :${props.onLongPressData.bulletListData}`, "OK");
                
                }}>

        {displayIcon(enumIconTypes.materialCommunity, checkboxIcons[iconIndex], iconsSize.medium, "#414a4c", {paddingLeft: 2})}

        <View >
            <Text style={typoStyles.paragraph}>{props.title}</Text>
            {props.onLongPressData ? <Text style={typoStyles.element}>{props.onLongPressData.shortData}</Text> : null}
        </View>
    </Pressable>
    )
}