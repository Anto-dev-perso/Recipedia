import {Dimensions} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {cameraPalette, palette} from "./colors";

const scaleFactor = Dimensions.get("screen").scale / Dimensions.get("window").scale;
const screenWidth = Dimensions.get('window').width * scaleFactor;
const screenHeight = Dimensions.get('window').height * scaleFactor;

export const remValue = screenWidth / 390;

EStyleSheet.build({$rem: remValue});

export const padding = {
    verySmall: 3 * remValue,
    small: 7 * remValue,
    medium: 12 * remValue,
    large: 15 * remValue,
    veryLarge: 20 * remValue,
    extraLarge: 30 * remValue,
};

export const screenViews = EStyleSheet.create({
    screenView: {
        flex: 1,
        flexGrow: 1,
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
        padding: padding.small,
    }
});

export const scrollView = (margin: number) => EStyleSheet.create({
    view: {
        marginBottom: margin * remValue,
    }
});

export const viewsSplitScreen = EStyleSheet.create({
    splitIn2View: {
        width: '50%',
        padding: padding.small,
    },
    viewInRow: {
        flexDirection: "row"
    }
});


export const cropView = EStyleSheet.create({
    overlay: {
        padding: padding.small,
        justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: cameraPalette.backgroundColor,
    },
});
