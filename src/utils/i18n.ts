import { createInstance } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import resourcesToBackend from 'i18next-resources-to-backend';
import fr from '@translations/fr';
import en from '@translations/en';

// Import translations

// Language name mapping
export const LANGUAGE_NAMES: { [key: string]: string } = {
  en: 'English',
  fr: 'Français',
};

// Export supported language type
export type SupportedLanguage = keyof typeof LANGUAGE_NAMES;

// Initialize i18next instance
const i18n = createInstance();

// Initialize with device locale first
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      // Load translations dynamically
      if (language === 'en' && namespace === 'translation') {
        return Promise.resolve(en);
      }
      if (language === 'fr' && namespace === 'translation') {
        return Promise.resolve(fr);
      }
      return Promise.resolve({});
    })
  )
  .init({
    lng: Localization.locale.split('-')[0], // Use device locale by default
    fallbackLng: 'en',
    debug: __DEV__, // Enable debug in development
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false, // Disable Suspense for React Native
    },
  });

/**
 * Hook to use translations in React components
 * @returns Translation functions and utilities
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    /**
     * Changes the current locale
     * @param locale The locale to set (e.g., 'en', 'fr')
     */
    setLocale: (locale: string): Promise<any> => i18n.changeLanguage(locale),

    /**
     * Gets the current locale
     * @returns The current locale
     */
    getLocale: (): string => i18n.language,

    /**
     * Gets all available locales
     * @returns Array of available locale codes
     */
    getAvailableLocales: (): string[] => Object.keys(LANGUAGE_NAMES),

    /**
     * Gets the locale name in its own language
     * @param locale The locale code
     * @returns The name of the language in its own language
     */
    getLocaleName: (locale: string): string => LANGUAGE_NAMES[locale] || locale,
  };
};

export default i18n;
