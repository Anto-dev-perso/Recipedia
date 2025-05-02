import EStyleSheet from "react-native-extended-stylesheet"
import {palette} from "./colors"


export const imageStyle = EStyleSheet.create({
    containerCardStyle: {
        width: '90%',
        height: "150rem",
        marginHorizontal: 10,
        backgroundColor: palette.secondary,
    },
});
