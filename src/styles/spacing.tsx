/**
 * TODO fill this part
 * @format
 */

import { Dimensions, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const remValue = screenWidth / 390

EStyleSheet.build({$rem: remValue});

const padding = {
    verySmall: 3 * remValue,
    small: 7 * remValue,
    medium: 12 * remValue,
    large: 15 * remValue,
    veryLarge: 30 * remValue,
}

const screenViews = EStyleSheet.create({
    screenView: {
        flexGrow: 1,
    },
    scrollView: {
        marginBottom: "75rem",
    },
    sectionView: {
        marginVertical: padding.small,
    },
    listView: {
        paddingVertical: padding.small,
        paddingLeft: padding.veryLarge,
        paddingRight: padding.small,
    },
    tabView: {
        flexDirection: 'row',
        padding: padding.small,
    }
})

const viewsSplitScreen = EStyleSheet.create({
    splitIn2View: {
        width: '50%',
        padding: padding.small,
    },
    viewInRow: {
        flexDirection: "row"
    }
})

export { padding, screenViews, viewsSplitScreen }