/**
 * TODO fill this part
 * @format
 */

import { Dimensions, StatusBar, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const scaleFactor = Dimensions.get("screen").scale / Dimensions.get("window").scale;
const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
const screenWidth = Dimensions.get('window').width * scaleFactor;
const screenHeight = (Dimensions.get('window').height - statusBarHeight) * scaleFactor;

console.log("statusBarHeight = ", statusBarHeight, ", scaleFactor : ", scaleFactor, ", windowHeight : ", Dimensions.get('window').height);

export const remValue = screenWidth / 390

EStyleSheet.build({$rem: remValue});

const padding = {
    verySmall: 3 * remValue,
    small: 7 * remValue,
    medium: 12 * remValue,
    large: 15 * remValue,
    veryLarge: 20 * remValue,
    extraLarge: 30 * remValue,
}

const screenViews = EStyleSheet.create({
    screenView: {
        flex: 1,
        flexGrow: 1,
    },
    sectionView: {
        marginVertical: padding.small,
    },
    listView: {
        paddingVertical: padding.small,
        paddingLeft: padding.extraLarge,
        paddingRight: padding.small,
    },
    tabView: {
        flexDirection: 'row',
        padding: padding.small,
    }
})

export const scrollView = (margin: number) => EStyleSheet.create({
    view:{
        marginBottom: margin * remValue,
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