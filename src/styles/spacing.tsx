/**
 * TODO fill this part
 * @format
 */

import { Dimensions, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


EStyleSheet.build({$rem: screenWidth / 390});

const padding = {
    small: "7rem",
    medium: "12rem",
    large: "15rem",
}

const screenViews = EStyleSheet.create({
    screenView: {
        flexGrow: 1,
    },
    scrollView: {
        marginBottom: "75rem",
    },
    sectionView: {
        marginVertical: padding.large,
    },
    tabView: {
        flexDirection: 'row',
        padding: padding.small,
    }
})

export { padding, screenViews }