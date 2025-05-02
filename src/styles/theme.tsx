import {configureFonts, MD3LightTheme} from 'react-native-paper';
import {ThemeProp} from "react-native-paper/lib/typescript/types";

export const lightTheme: ThemeProp = {
    ...MD3LightTheme,
    version: 3,
    colors: {
        primary: "#006D38",
        onPrimary: "#FFFFFF",
        primaryContainer: "#95D9B0",
        onPrimaryContainer: "#00210D",
        secondary: "#99461D",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#FFDBCD",
        onSecondaryContainer: "#360F00",
        tertiary: "#365CA8",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#D9E2FF",
        onTertiaryContainer: "#001944",
        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",
        background: "#FBFDF7",
        onBackground: "#191C19",
        surface: "#FBFDF7",
        onSurface: "#191C19",
        surfaceVariant: "#DDE5DA",
        onSurfaceVariant: "#384940",
        outline: "#717971",
        outlineVariant: "#C1C9BF",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#2E312E",
        inverseOnSurface: "#F0F1EC",
        inversePrimary: "#79DB95",
        elevation: {
            level0: "transparent",
            level1: "#EEF6ED",
            level2: "#E7F2E8",
            level3: "#DFEDE2",
            level4: "#DDECE0",
            level5: "#D8E9DC"
        },
        surfaceDisabled: "#191c191f",
        onSurfaceDisabled: "#191c1961",
        backdrop: "#2b322b66"
    },
    roundness: 0,
    fonts: configureFonts({
        isV3: true, config: {
            titleLarge: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '400'},
            titleMedium: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '400'},
            titleSmall: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            displayLarge: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            displayMedium: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            displaySmall: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            headlineLarge: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            headlineMedium: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '700'},
            headlineSmall: {fontFamily: 'Lora-VariableFont_wght', fontWeight: '400'},
            bodyLarge: {fontFamily: 'Lora-VariableFont_wght'},
            bodyMedium: {fontFamily: 'Lora-VariableFont_wght'},
            bodySmall: {fontFamily: 'Lora-VariableFont_wght'},
            labelLarge: {fontFamily: 'Lora-Italic-VariableFont_wght'},
            labelMedium: {fontFamily: 'Lora-Italic-VariableFont_wght'},
            labelSmall: {fontFamily: 'Lora-Italic-VariableFont_wght'},
        }
    })

};

export const darkTheme: ThemeProp = {
    ...lightTheme,
    colors: {
        primary: "#79DB95",
        onPrimary: "#00391A",
        primaryContainer: "#00391A",
        onPrimaryContainer: "#95F7B0",
        secondary: "#FFB597",
        onSecondary: "#581E00",
        secondaryContainer: "#7A2F06",
        onSecondaryContainer: "#FFDBCD",
        tertiary: "#B0C6FF",
        onTertiary: "#002D6E",
        tertiaryContainer: "#18438F",
        onTertiaryContainer: "#D9E2FF",
        error: "#FFB4AB",
        onError: "#690005",
        errorContainer: "#93000A",
        onErrorContainer: "#FFB4AB",
        background: "#191C19",
        onBackground: "#E1E3DE",
        surface: "#191C19",
        onSurface: "#E1E3DE",
        surfaceVariant: "#384940",
        onSurfaceVariant: "#C1C9BF",
        outline: "#8B938A",
        outlineVariant: "#384940",
        shadow: "#000000",
        scrim: "#000000",
        inverseSurface: "#E1E3DE",
        inverseOnSurface: "#2E312E",
        inversePrimary: "#006D38",
        elevation: {
            level0: "transparent",
            level1: "#1E261F",
            level2: "#212B23",
            level3: "#243127",
            level4: "#253328",
            level5: "#26372A"
        },
        surfaceDisabled: "#e1e3de1f",
        onSurfaceDisabled: "#e1e3de61",
        backdrop: "#2b322b66"
    }
};
// TODO dark theme
