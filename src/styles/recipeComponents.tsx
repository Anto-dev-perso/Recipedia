import {StyleSheet, TextStyle, ViewStyle} from "react-native";
import {padding, screenViews} from "@styles/spacing";

const recipeMargins = StyleSheet.create({
    padding: {paddingHorizontal: padding.medium, paddingVertical: padding.small},
    smallVerticalMargin: {
        marginVertical: padding.verySmall
    },
    mediumVerticalMargin: {
        marginVertical: padding.medium
    },
    largeVerticalMargin: {
        marginVertical: padding.veryLarge
    },
});


export const recipeTextStyles = StyleSheet.create({
    containerSection: recipeMargins.padding as ViewStyle,
    containerElement: recipeMargins.smallVerticalMargin,
    containerTab: {
        ...recipeMargins.padding,
        flexDirection: 'row',
        alignItems: 'center',
        gap: padding.medium,
    } as ViewStyle,
});

export const recipeTextRenderStyles = StyleSheet.create({
    containerSection: {...recipeMargins.padding} as ViewStyle,
    headlineElement: {...recipeMargins.mediumVerticalMargin} as TextStyle,
    containerElement: {...recipeMargins.smallVerticalMargin},
    tagView: screenViews.tabView as ViewStyle,
    firstColumn: {flex: 2, textAlign: 'center', width: '100%'} as ViewStyle,
    secondColumn: {flex: 2, textAlign: 'center', width: '100%'} as ViewStyle,
    thirdColumn: {flex: 3, flexWrap: 'wrap', textAlign: 'center', width: '100%'} as ViewStyle,
    columnContentStyle: recipeMargins.mediumVerticalMargin,
    roundButtonPadding: {...recipeMargins.mediumVerticalMargin} as ViewStyle,
});

export const recipeTagsStyles = StyleSheet.create({
    containerSection: {...recipeMargins.padding} as ViewStyle,
    containerElement: {...recipeMargins.smallVerticalMargin} as TextStyle,
    tagsContainer: {padding: padding.small} as ViewStyle,
    tab: screenViews.tabView as ViewStyle,
    textInputDropDownContainer: {padding: padding.medium} as ViewStyle,
    roundButtonsContainer: {alignItems: 'center', justifyContent: 'center', flexDirection: "row"} as ViewStyle,
    roundButton: {flex: 1, justifyContent: 'center', alignItems: 'center'} as ViewStyle,
});


export const recipeNumberStyles = StyleSheet.create({
    editableView: {flexDirection: 'row', alignItems: 'center', gap: padding.medium} as ViewStyle,
    addView: {} as ViewStyle,
    roundButtonsContainer: {...recipeTagsStyles.roundButtonsContainer, marginTop: padding.large} as ViewStyle,
    roundButton: recipeTagsStyles.roundButton as ViewStyle,
});
