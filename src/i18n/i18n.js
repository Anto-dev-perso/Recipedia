


// From  https://medium.com/@raazthemystery273/how-to-use-i18next-react-i18next-in-react-native-f81ece184cd2

import i18next from "i18next";
import i18n from "i18next";

import { initReactI18next } from "react-i18next";
import { getLocales } from 'expo-localization';

import english from './translations/english.json';
import french from './translations/french.json';
 

const RESOURCES = {
    en: {
        translation: english,
    },
    fr: {
        translation: french,
    }
}

i18n
    .use(initReactI18next) 
    .init({
        compatibilityJSON: 'v3',
        lng: getLocales()[0].languageCode,
        fallbackLng: 'en',
        resources: RESOURCES,
        interpolation: {
            escapeValue: false, // react already safes from xss
        }
    });

export default i18n;