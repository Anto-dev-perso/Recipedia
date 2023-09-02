/**
 * TODO fill this part
 * @format
 */

import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons"
import { remValue } from "@styles/spacing";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from "react";
import { GestureResponderEvent, StyleProp, TextStyle } from "react-native";




export type materialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
export type fontAwesomeIconName = keyof typeof FontAwesome.glyphMap;
export type entypoIconName = keyof typeof Entypo.glyphMap;

export type iconsType = materialCommunityIconName | fontAwesomeIconName | entypoIconName;

export enum enumIconTypes {
    materialCommunity,
    fontAwesome,
    entypo,
}

export const checkboxBlankIcon : materialCommunityIconName = "checkbox-blank-outline";
export const checkboxFillIcon  : materialCommunityIconName = "checkbox-marked";
export const plusIcon  : materialCommunityIconName = "plus";
export const minusIcon  : materialCommunityIconName = "minus";

export const filterPlusIcon  : materialCommunityIconName = "filter-plus-outline";
export const filterMinusIcon  : materialCommunityIconName = "filter-remove-outline";

export const checkboxIcons = [checkboxBlankIcon, checkboxFillIcon ];
export const PlusMinusIcons = [plusIcon , minusIcon ];

export const crossIcon  : entypoIconName = "cross";

export const homeIcon  : materialCommunityIconName = "home";
export const shoppingIcon  : entypoIconName = "shopping-cart";
export const plannerIcon  : materialCommunityIconName = "calendar";
export const parametersIcon  : fontAwesomeIconName = "gear";

export const webhIcon : materialCommunityIconName = "web";
export const searchIcon : fontAwesomeIconName = "search";
export const cameraIcon : entypoIconName = "camera";
export const galleryIcon : fontAwesomeIconName = "photo";
export const backIcon : materialCommunityIconName = "keyboard-backspace";
export const pencilIcon : materialCommunityIconName = "pencil";


export const iconsSize = {
    small: 20 * remValue,
    medium: 27 * remValue,
    large: 40 * remValue,
}

export type iconProp = {
    type: enumIconTypes,
    name: iconsType,
    size: number,
    color: string,
    style?: StyleProp<TextStyle>
}

export function displayIcon(iconType: enumIconTypes, iconName: iconsType, iconSize: number, iconColor: string, style?: StyleProp<TextStyle>, onPressFunction?: ((event: GestureResponderEvent) => void) | undefined){

  const propStyle = style ? style : undefined;

    switch (iconType) {
        case enumIconTypes.materialCommunity:
          return  <MaterialCommunityIcons name={iconName as materialCommunityIconName} size={iconSize} color={iconColor} style={propStyle} onPress={onPressFunction} />;
          break;
        case enumIconTypes.fontAwesome:
          return  <FontAwesome name={iconName as fontAwesomeIconName} size={iconSize} color={iconColor} style={propStyle} onPress={onPressFunction}/>;
          break;
        case enumIconTypes.entypo:
          return  <Entypo name={iconName as entypoIconName} size={iconSize} color={iconColor} style={propStyle} onPress={onPressFunction}/>;
          break;
      }
}