import {MD3DarkTheme, MD3LightTheme as DefaultTheme} from 'react-native-paper';
import {palette} from "@styles/colors";

export const lightTheme = {
    ...DefaultTheme,

    colors: {
        ...DefaultTheme.colors,
        primary: palette.primary,
        secondary: palette.secondary,
        tertiary: palette.accent,
        background: palette.backgroundColor,
        surface: '#F5F5F5',
        text: palette.textPrimary,
        error: '#B00020',
    },
    roundness: 0,
// TODO fonts
    fonts: {
        ...DefaultTheme.fonts,
        bodySmall: {
            ...DefaultTheme.fonts.bodySmall,
            letterSpacing: 0,
            fontSize: 10,
            fontWeight: 'normal',
            textAlign: 'left',
        },
        bodyMedium: {
            ...DefaultTheme.fonts.bodyMedium,
            letterSpacing: 0,
            fontSize: 14,
            fontWeight: 'normal',
            textAlign: 'left',
        },
        bodyLarge: {
            ...DefaultTheme.fonts.bodyLarge,
            letterSpacing: 0,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
        },
    }
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        //     TODO
    },
};
