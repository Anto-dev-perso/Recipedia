import {MaterialCommunityIcons} from "@expo/vector-icons"
import {remValue} from "@styles/spacing";
import React from "react";
import {GestureResponderEvent, StyleProp, TextStyle} from "react-native";

export type dictionaryIcons = keyof typeof MaterialCommunityIcons.glyphMap;

export type iconsType = dictionaryIcons;

export enum enumIconTypes {
    materialCommunity,
}

// TODO clean up these variables and use the record instead
export const checkboxBlankIcon: dictionaryIcons = "checkbox-blank-outline";
export const checkboxFillIcon: dictionaryIcons = "checkbox-marked";
export const plusIcon: dictionaryIcons = "plus";
export const minusIcon: dictionaryIcons = "minus";

export const addFilterIcon: dictionaryIcons = "filter-plus-outline";
export const removeFilterIcon: dictionaryIcons = "filter-remove";
export const tagSearchIcon: dictionaryIcons = "tag-search-outline";

export const filterPlusIcon: dictionaryIcons = "filter-plus-outline";
export const filterMinusIcon: dictionaryIcons = "filter-remove-outline";

export const checkboxIcons = [checkboxBlankIcon, checkboxFillIcon];
export const PlusMinusIcons = [plusIcon, minusIcon];

export const crossIcon: dictionaryIcons = "close";
export const trashIcon: dictionaryIcons = "delete";

export const homeIcon: dictionaryIcons = "home";
export const shoppingIcon: dictionaryIcons = "cart";
export const plannerIcon: dictionaryIcons = "calendar";
export const parametersIcon: dictionaryIcons = "cog";

export const webIcon: dictionaryIcons = "web";
export const searchIcon: dictionaryIcons = "magnify";
export const cameraIcon: dictionaryIcons = "camera";
export const galleryIcon: dictionaryIcons = "image-area";
export const backIcon: dictionaryIcons = "keyboard-backspace";
export const pencilIcon: dictionaryIcons = "pencil";
export const exportIcon: dictionaryIcons = "export";


export const rotateIcon: dictionaryIcons = "rotate-right";
export const flipHorizontalIcon: dictionaryIcons = "flip-horizontal";
export const flipVerticalIcon: dictionaryIcons = "flip-vertical";

export const iconsSize = {
    verySmall: 9 * remValue,
    small: 20 * remValue,
    medium: 27 * remValue,
    large: 40 * remValue,
};

export const iconsColor = "#414a4c";

export const Icons: Record<string, dictionaryIcons> = {
    checkboxBlankIcon: "checkbox-blank-outline",
    checkboxFillIcon: "checkbox-marked",
    plusIcon: "plus",
    minusIcon: "minus",
    addFilterIcon: "filter-plus-outline",
    removeFilterIcon: "filter-remove",
    tagSearchIcon: "tag-search-outline",
    filterPlusIcon: "filter-plus-outline",
    filterMinusIcon: "filter-remove-outline",
    crossIcon: "close",
    trashIcon: "delete",
    homeIcon: "home",
    shoppingIcon: "cart",
    plannerIcon: "calendar",
    parametersIcon: "cog",
    webIcon: "web",
    searchIcon: "magnify",
    cameraIcon: "camera",
    galleryIcon: "image-area",
    backIcon: "keyboard-backspace",
    pencilIcon: "pencil",
    exportIcon: "export",
    rotateIcon: "rotate-right",
    flipHorizontalIcon: "flip-horizontal",
    flipVerticalIcon: "flip-vertical",
} as const;
export type IconName = keyof typeof Icons;


export type iconProp = {
    type: enumIconTypes,
    name: iconsType,
    size: number,
    color: string,
    style?: StyleProp<TextStyle>
}

// TODO to transfrom in a React component
export function displayIcon(iconType: enumIconTypes, iconName: iconsType, iconSize: number, iconColor: string, propStyle?: StyleProp<TextStyle>, onPressFunction?: ((event: GestureResponderEvent) => void) | undefined) {

    return <MaterialCommunityIcons name={iconName as dictionaryIcons} size={iconSize}
                                   color={iconColor} style={propStyle} onPress={onPressFunction}/>
}
