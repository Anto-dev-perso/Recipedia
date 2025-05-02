import {Dimensions, StyleSheet} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {palette} from "./colors";

const scaleFactor = Dimensions.get("screen").scale / Dimensions.get("window").scale;
export const screenWidth = Dimensions.get('window').width * scaleFactor;
export const screenHeight = Dimensions.get('window').height * scaleFactor;

export const remValue = screenWidth / 390;

EStyleSheet.build({$rem: remValue});

export const padding = {
    verySmall: 3,
    small: 7,
    medium: 12,
    large: 15,
    veryLarge: 20,
    extraLarge: 30,
};


export const screenViews = StyleSheet.create({
    screenView: {
        backgroundColor: palette.backgroundColor
    },
    sectionView: {
        margin: padding.verySmall,
    },
    listView: {
        padding: padding.small,
    },
    clickableListView: {
        paddingVertical: padding.small,
        paddingLeft: padding.extraLarge,
        paddingRight: padding.small,
    },
    tabView: {
        flexDirection: 'row',
    }
});

export const scrollView = (margin: number) => EStyleSheet.create({
    view: {
        marginBottom: margin * remValue,
    }
});

export const viewsSplitScreen = StyleSheet.create({
    splitIn2View: {
        width: '50%',
        padding: padding.small,
        alignItems: 'center', justifyContent: 'center',
    },
    viewInRow: {
        flexDirection: "row"
    }
});
