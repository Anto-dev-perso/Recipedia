/**
 * TODO fill this part
 * @format
 */

import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from 'react-native';
import { viewButtonStyles } from "@styles/buttons";
import { recipeDb } from "@utils/RecipeDatabase";
import FullScreenFiltering from "@components/organisms/FullScreenFiltering";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { checkboxIcons, iconsSize } from "@assets/images/Icons";
import { typoStyles } from '@styles/typography';
import { remValue } from "@styles/spacing";

type CheckBoxButtonProps = {
    title: string,
    stateInitialValue: boolean
    onActivation:() => void,
    onDeActivation:() => void,
}

export default function CheckBoxButton ( props: CheckBoxButtonProps) {

    const [iconIndex, setIconIndex] = useState(0);

    useEffect(() => {
        props.stateInitialValue ? setIconIndex(1) : setIconIndex(0) ;        
  }, [])

    return (
        <Pressable style={viewButtonStyles.wrappingListOfButton} onPress={() => {
            {iconIndex==0 ?   props.onActivation() :   props.onDeActivation() }
            setIconIndex( (iconIndex+1) % 2 );
        }}>
        <MaterialCommunityIcons name={checkboxIcons[iconIndex]} size={iconsSize.medium} color="#414a4c" style={{paddingLeft: 2}} />
        <Text style={typoStyles.paragraph}>{props.title}</Text>
    </Pressable>
    )
}