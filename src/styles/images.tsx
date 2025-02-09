import EStyleSheet from "react-native-extended-stylesheet"
import {palette} from "./colors"


export const imageStyle = EStyleSheet.create({
    containerFullStyle: {
        width: '100%',
        height: "300rem",
        backgroundColor: palette.secondary,
    },
    containerCardStyle: {
        width: '90%',
        height: "150rem",
        marginHorizontal: 10,
        backgroundColor: palette.secondary,
    },
    imageInsideView: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
});
