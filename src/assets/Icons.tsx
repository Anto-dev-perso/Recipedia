import {MaterialCommunityIcons} from "@expo/vector-icons"
import {remValue} from "@styles/spacing";

export type dictionaryIcons = keyof typeof MaterialCommunityIcons.glyphMap;

// TODO clean up these variables and use the record instead
export const plusIcon: dictionaryIcons = "plus";

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
