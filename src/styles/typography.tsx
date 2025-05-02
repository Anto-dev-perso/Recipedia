import {palette} from './colors'
import {padding} from './spacing'
import {useFonts} from "expo-font";
import {StyleSheet} from "react-native";

export const textSeparator = "--";
export const unitySeparator = "@@";
export const EncodingSeparator = "__";

export const replaceAllBackToLine = /\n/g;
export const findAllNumbers = /\b\d+\b/g;
export const allNonDigitCharacter = /\D/g;
export const numberAtFirstIndex = /^\d/;
export const containNumbers = /\d/;
export const separateNumbersFromStr = /\d+|\D+/g;
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
    element: 10,
    paragraphSize: 14,
    headerSize: 18,
    titleSize: 22,
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
    onChangeFunction(oldValueId: number, newParam: string): void,
}

export const borderStyle = StyleSheet.create({
    border: {
        borderWidth: 2,
    }
});

export const typoStyles = StyleSheet.create({
    element: {
        color: palette.textGrey,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.element,
        fontWeight: 'normal',
        textAlign: 'left',
    },
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
        padding: padding.small,
    },
    searchBar: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.headerSize,
        marginHorizontal: padding.large,
        width: "75%",
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

export const carouselStyle = (length: number) => StyleSheet.create({
    carouselTitle: {
        color: palette.textPrimary,
        fontFamily: typoFamily.normal,
        fontSize: typoSize.paragraphSize,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: (length / 2),
    }
});

export const searchBarStyle = StyleSheet.create({
    searchBarView: {
        marginTop: padding.extraLarge,
        marginHorizontal: padding.medium,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "95%",
    },
    searchBarComponent: {
        padding: padding.small,
        flexDirection: "row",
        flex: 1,
        // width: "80%",
        backgroundColor: palette.textBackground,
        borderRadius: "20rem",
        alignItems: "center",
        justifyContent: "space-evenly",
    }
});

export const rowTextStyle = StyleSheet.create({
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
