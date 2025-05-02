import {StyleSheet, TextStyle, ViewStyle} from "react-native";
import {padding, screenViews} from "@styles/spacing";
import {viewButtonStyles} from "@styles/buttons";

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

const commonStyles = StyleSheet.create({
    roundButton: {...viewButtonStyles.centeredView, ...recipeMargins.smallVerticalMargin},
});

export const recipeTextStyles = StyleSheet.create({
    containerSection: recipeMargins.padding as ViewStyle,
    containerElement: recipeMargins.smallVerticalMargin as TextStyle,
    containerTab: {
        ...recipeMargins.padding,
        flexDirection: 'row',
        alignItems: 'center',
        gap: padding.medium,
    } as ViewStyle,
});

export const recipeNumberStyles = StyleSheet.create({
    editableView: {flexDirection: 'row', alignItems: 'center', gap: padding.medium} as ViewStyle,
});

export const recipeTextRenderStyles = StyleSheet.create({
    containerSection: {...recipeMargins.padding} as ViewStyle,
    headlineElement: {...recipeMargins.mediumVerticalMargin} as TextStyle,
    containerElement: {...recipeMargins.smallVerticalMargin} as TextStyle,
    tagView: screenViews.tabView as ViewStyle,
    firstColumn: {flex: 2, textAlign: 'center'} as TextStyle,
    secondColumn: {flex: 2, textAlign: 'center'} as TextStyle,
    thirdColumn: {flex: 3, flexWrap: 'wrap', textAlign: 'center'} as TextStyle,
    columnContentStyle: recipeMargins.mediumVerticalMargin,
    roundButtonPadding: {...recipeMargins.mediumVerticalMargin} as ViewStyle,
});

export const recipeTagsStyles = StyleSheet.create({
    containerSection: {...recipeMargins.padding} as ViewStyle,
    containerElement: {...recipeMargins.smallVerticalMargin} as TextStyle,

    // titleText: typoStyles.header as TextStyle,
    // helperText: typoStyles.element as TextStyle,
    tagsContainer: {padding: padding.small} as ViewStyle,
    tagsList: screenViews.tabView as ViewStyle,
    textInputDropDownContainer: {padding: padding.medium} as ViewStyle,
    roundButton: commonStyles.roundButton as ViewStyle,
});
