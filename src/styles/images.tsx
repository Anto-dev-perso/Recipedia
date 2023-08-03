/**
 * TODO fill this part
 * @format
 */

import EStyleSheet from "react-native-extended-stylesheet"
import { palette } from "./colors"



const imageStyle = EStyleSheet.create({
    containerStyle: {
        postition: 'absolute',
        top: 0,
        width: '100%',
        height: "250rem",
        backgroundColor: palette.secondary,
    },
    imageInsideView: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})

export { imageStyle }