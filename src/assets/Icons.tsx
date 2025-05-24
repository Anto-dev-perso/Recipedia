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

export const checkboxIcons = [checkboxBlankIcon, checkboxFillIcon];
export const PlusMinusIcons = [plusIcon, minusIcon];

export const crossIcon: dictionaryIcons = "close";

export const searchIcon: dictionaryIcons = "magnify";


export const iconsSize = {
    verySmall: 9 * remValue,
    small: 22 * remValue,
    medium: 27 * remValue,
    large: 40 * remValue,
};

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
    homeUnselectedIcon: "home",
    homeSelectedIcon: "home-outline",
    shoppingUnselectedIcon: "cart",
    shoppingSelectedIcon: "cart-outline",
    plannerUnselectedIcon: "calendar",
    plannerSelectedIcon: "calendar-outline",
    parametersUnselectedIcon: "cog",
    parametersSelectedIcon: "cog-outline",
    webIcon: "web",
    searchIcon: "magnify",
    cameraIcon: "camera",
    galleryIcon: "image-area",
    scanImageIcon: 'line-scan',
    backIcon: "keyboard-backspace",
    pencilIcon: "pencil",
    exportIcon: "export",
    rotateIcon: "rotate-right",
    flipHorizontalIcon: "flip-horizontal",
    flipVerticalIcon: "flip-vertical",
    information: "information",
    lightDarkTheme: "theme-light-dark",
    translate: "translate",
    chevronRight: "chevron-right",
    chevronLeft: "chevron-left",
    groupPeople: "account-group",
    apple: "food-apple",
    tags: "tag-multiple",
} as const;
export type IconName = keyof typeof Icons;


// TODO to transfrom in a React component
export function displayIcon(iconType: enumIconTypes, iconName: iconsType, iconSize: number, iconColor: string, propStyle?: StyleProp<TextStyle>, onPressFunction?: ((event: GestureResponderEvent) => void) | undefined) {

    return <MaterialCommunityIcons name={iconName as dictionaryIcons} size={iconSize}
                                   color={iconColor} style={propStyle} onPress={onPressFunction}/>
}
