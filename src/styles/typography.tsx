import {cameraPalette, palette} from './colors'
import EStyleSheet from 'react-native-extended-stylesheet'
import {padding} from './spacing'
import {useFonts} from "expo-font";


export const textSeparator = "--";
export const unitySeparator = "@@";
export const EncodingSeparator = "__";

export const replaceAllBackToLine = /\n/g;
export const findAllNumbers = /\b\d+\b/g;
export const numberAtFirstIndex = /^\d/;
export const containNumbers = /\d/;
export const letterRegExp = /[a-zA-z]/;
export const exceptLettersRegExp = /[^a-zA-ZÀ-ÖØ-öø-ÿ]/g;
export const exceptLettersAndSpacesRegExp = /[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g;
export const extractBetweenParenthesis = /\((.*?)\)/;

export function fetchFonts() {
    return useFonts({
        'Lora-VariableFont_wght': require(`../assets/fonts/Lora/Lora-VariableFont_wght.ttf`),
        'Lora-Italic-VariableFont_wght': require(`../assets/fonts/Lora/Lora-Italic-VariableFont_wght.ttf`),
    })
}

const typoFamily = {
    normal: 'Lora-VariableFont_wght',
    italic: 'Lora-Italic-VariableFont_wght',
};

export const typoSize = {
    element: "10rem",
    paragraphSize: "14rem",
    headerSize: "18rem",
    titleSize: "22rem",
};

export enum typoRender {
    ARRAY = "ARRAY",
    SECTION = "SECTION",
    LIST = "LIST",
    CLICK_LIST = "CLICK_LIST",
}

export type bulletListDataType = {
    multiplesData: boolean,
    bulletListData: Array<string>,
    shortData: string,
}
export type editableText = {
    withBorder: boolean,
    onChangeFunction(oldParam: string, newParam: string): void,
}

export const borderStyle = EStyleSheet.create({
    border: {
        borderWidth: 2,
        color: palette.textPrimary,
        borderColor: palette.secondary,
        backgroundColor: palette.white,
    }
});

export const typoStyles = EStyleSheet.create({
    element: {
        color: palette.textGrey,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.element,
        fontWeight: 'normal',
        textAlign: 'left',
        paddingHorizontal: padding.large,
    },
    paragraph: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'normal',
        textAlign: 'left',
        paddingHorizontal: padding.veryLarge,
        paddingVertical: padding.verySmall,
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
    },
    modal: {
        color: palette.white,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        fontWeight: 'bold',
        textAlign: 'left',
        padding: padding.medium,
        marginTop: padding.medium,
    }
});

export const elementBorder = EStyleSheet.flatten([typoStyles.element, borderStyle.border]);
export const paragraphBorder = EStyleSheet.flatten([typoStyles.paragraph, borderStyle.border]);
export const headerBorder = EStyleSheet.flatten([typoStyles.header, borderStyle.border]);
export const titleBorder = EStyleSheet.flatten([typoStyles.title, borderStyle.border]);

export const carouselStyle = (length: number) => EStyleSheet.create({
    carouselTitle: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: (length / 2),
    }
})

export const searchBarStyle = EStyleSheet.create({
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
});

export const rowTextStyle = EStyleSheet.create({
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
});

export const cropText = EStyleSheet.create({
    overlay: {
        textTransform: 'uppercase',
        color: cameraPalette.buttonsColor,
        textAlign: 'center'
    },
})
