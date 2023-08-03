/**
 * TODO fill this part
 * @format
 */

import { palette } from './colors'
import EStyleSheet from 'react-native-extended-stylesheet'
import { padding } from './spacing'



const separator = "__";

const typoFamily={
    normal: 'Lora-VariableFont_wght',
    italic: 'Lora-Italic-VariableFont_wght',
} 

const typoSize = {
    element: "10rem",
    paragraphSize: "14rem",
    headerSize: "18rem",
    titleSize: "22rem",
}

const typoStyles = EStyleSheet.create({
    element: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.element,
        fontWeight: 'normal',
        textAlign: 'left',
        marginHorizontal: padding.large,
        marginVertical: padding.small,
    },
    paragraph: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'normal',
        textAlign: 'left',
        marginHorizontal: padding.large, 
        paddingBottom: padding.small,
    },
    header: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        fontWeight: 'bold',
        textAlign: 'left',
        padding: padding.medium,
    },
    title: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.titleSize,
        fontWeight: 'bold',
        textAlign: 'left',
        textTransform: 'uppercase',
        padding: padding.medium,
    },
})

const carouselStyle = (length: number) => EStyleSheet.create({
    carouselTitle: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: (length/2),
    }   
})


enum typoRender {
    ARRAY = "ARRAY",
    SECTION = "SECTION",
}

export { separator, typoSize, typoStyles, typoRender, carouselStyle};