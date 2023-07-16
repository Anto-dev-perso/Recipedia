/**
 * TODO fill this part
 * @format
 */

import { StyleSheet } from 'react-native'
import { palette } from './colors'

const typoFamily={
    normal: 'Lora-VariableFont_wght',
    italic: 'Lora-Italic-VariableFont_wght',
} 

const typoSize= {
    paragraphSize: 14,
    headerSize: 16,
    titleSize: 18,
}

const typoStyles = StyleSheet.create({
    paragraph: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'normal',
        textAlign: 'left',
    },
    header: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        fontWeight: 'bold',
        textAlign: 'left',
        
    },
    title: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.titleSize,
        fontWeight: 'bold',
        textAlign: 'left',
        textTransform: 'uppercase',

    },
})

const carouselStyle = (length: number) => StyleSheet.create({
    carouselTitle: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: (length/2),
    }   
})

export {typoStyles, carouselStyle};