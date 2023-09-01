/**
 * TODO fill this part
 * @format
 */

import EStyleSheet from "react-native-extended-stylesheet"
import { palette } from "./colors"
import { padding } from "./spacing"



const imageStyle = EStyleSheet.create({
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
        width: '100%',
        height: '100%',
    }
})

export { imageStyle }