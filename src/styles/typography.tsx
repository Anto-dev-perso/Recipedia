/**
 * TODO fill this part
 * @format
 */

import { colors, palette } from './colors'
import EStyleSheet from 'react-native-extended-stylesheet'
import { padding } from './spacing'
import { loadAsync } from 'expo-font';



const textSeparator = "--";
const EncodingSeparator = "__";

const fetchFonts = () => {
    return loadAsync({
    'Lora-VariableFont_wght': require(`../assets/fonts/Lora/Lora-VariableFont_wght.ttf`),
    'Lora-Italic-VariableFont_wght': require(`../assets/fonts/Lora/Lora-Italic-VariableFont_wght.ttf`),
    })
  }

const typoFamily = {
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
        color: palette.textGrey,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.element,
        fontWeight: 'normal',
        textAlign: 'left',
        marginHorizontal: padding.large,
        // marginVertical: padding.small,
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
    searchBar: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        marginHorizontal: padding.large,
        width: "85%",
    }
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

const searchBarStyle = EStyleSheet.create({
    searchBarView: {
        marginTop: padding.extraLarge,
        marginHorizontal: padding.medium,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "94%",
    },
    searchBarComponent: {
        padding: padding.small,
        flexDirection: "row",
        flex: 1,
        width: "100%",
        backgroundColor: palette.textBackground,
        borderRadius: "20rem",
        alignItems: "center",
        justifyContent: "space-evenly",
      }
})

const rowTextStyle = EStyleSheet.create({
    leftText: {
        textAlign: "left", 
        flex: 2,
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'normal',
    },
    rightText: {
        textAlign: "right", 
        flex: 1,
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'normal',
    },
})



enum typoRender {
    ARRAY = "ARRAY",
    SECTION = "SECTION",
    LIST = "LIST",
    CLICK_LIST = "CLICK_LIST",
}

export { textSeparator, EncodingSeparator, typoSize, typoStyles, searchBarStyle, rowTextStyle, typoRender, carouselStyle, fetchFonts};