import {consoleTransport, logger} from 'react-native-logs';

const log = logger.createLogger({
    severity: __DEV__ ? 'debug' : 'error',
    transport: __DEV__ ? consoleTransport : undefined,
    transportOptions: {
        colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
            debug: 'cyan',
        },
    },
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    enabled: true,
    enabledExtensions: ['Database', 'Filesystem', "OCR", "UI", 'Home', 'Recipe', 'Search', 'Shopping', 'Parameters', 'IngredientsSettings', 'TagsSettings', 'LanguageSettings', 'DefaultPersonsSettings', 'Settings', 'Validation', 'Navigation', 'App'],
});

export const databaseLogger = log.extend("Database");
export const filesystemLogger = log.extend("FileSystem");
export const ocrLogger = log.extend("OCR");
export const uiLogger = log.extend("UI");

export const homeLogger = log.extend("Home");

export const recipeLogger = log.extend("Recipe");
export const searchLogger = log.extend("Search");
export const shoppingLogger = log.extend("Shopping");
export const parametersLogger = log.extend("Parameters");
export const ingredientsSettingsLogger = log.extend("IngredientsSettings");
export const tagsSettingsLogger = log.extend("TagsSettings");
export const languageSettingsLogger = log.extend("LanguageSettings");
export const defaultPersonsSettingsLogger = log.extend("DefaultPersonsSettings");
export const settingsLogger = log.extend("Settings");
export const validationLogger = log.extend("Validation");
export const navigationLogger = log.extend("Navigation");
export const appLogger = log.extend("App");

export default {
    database: databaseLogger,
    filesystem: filesystemLogger,
    ocr: ocrLogger,
    ui: uiLogger,
    home: homeLogger,
    recipe: recipeLogger,
    search: searchLogger,
    shopping: shoppingLogger,
    parameters: parametersLogger,
    ingredientsSettings: ingredientsSettingsLogger,
    tagsSettings: tagsSettingsLogger,
    languageSettings: languageSettingsLogger,
    defaultPersonsSettings: defaultPersonsSettingsLogger,
    settings: settingsLogger,
    validation: validationLogger,
    navigation: navigationLogger,
    app: appLogger,
};
