/**
 * LanguageSettings - Language selection and localization screen
 * 
 * A clean interface for selecting the app's display language with immediate
 * effect and persistent storage. Features radio button selection with native
 * language names and automatic navigation back to settings.
 * 
 * Key Features:
 * - Radio button selection for clear choice indication
 * - Native language names for better accessibility
 * - Immediate language switching with instant UI updates
 * - Persistent storage of language preference
 * - Automatic navigation back after selection
 * - Support for all configured app languages
 * - Clean, accessible design following Material guidelines
 * 
 * Supported Languages:
 * - English (en)
 * - French (fr)
 * - Additional languages can be configured in i18n setup
 * 
 * @example
 * ```typescript
 * // Navigation from Parameters screen
 * <List.Item
 *   title="Language"
 *   description={currentLanguageName}
 *   onPress={() => navigation.navigate('LanguageSettings')}
 * />
 * ```
 */

import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Divider, List, RadioButton, Text, useTheme} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import {getLanguage, setLanguage} from '@utils/settings';
import {BottomScreenTitle} from '@styles/typography';
import {LanguageSettingsProp} from "@customTypes/ScreenTypes";
import {padding} from "@styles/spacing";

/**
 * LanguageSettings screen component - Language selection interface
 * 
 * @param props - Navigation props for the LanguageSettings screen
 * @returns JSX element representing the language selection interface
 */
export default function LanguageSettings({navigation}: LanguageSettingsProp) {
    const {t, getLocale, getAvailableLocales, getLocaleName} = useI18n();
    const [currentLocale, setCurrentLocale] = useState<string>(getLocale());
    const {colors} = useTheme();
    const availableLocales = getAvailableLocales();

    // Load saved language on component mount
    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await getLanguage();
            setCurrentLocale(savedLanguage);
        };
        loadLanguage();
    }, []);

    const handleLanguageChange = async (locale: string) => {
        // Update both AsyncStorage and i18n
        await setLanguage(locale);
        setCurrentLocale(locale);
        // Go back to parameters screen after changing language
        navigation.goBack();
    };

    const languageTestId = "LanguageSettings";
    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <Text testID={languageTestId + "::Title"} variant={BottomScreenTitle}
                  style={{padding: padding.small}}>{t('language')}</Text>

            <RadioButton.Group onValueChange={handleLanguageChange} value={currentLocale}>
                <List.Section>
                    <FlatList
                        data={availableLocales}
                        keyExtractor={(locale) => locale}
                        ItemSeparatorComponent={() => <Divider/>}
                        renderItem={({item: locale, index}) => (
                            <View key={index}>
                                <List.Item testID={languageTestId + `::Item::${index}`}
                                           title={getLocaleName(locale)}
                                           left={() => <RadioButton value={locale}/>}
                                           onPress={() => handleLanguageChange(locale)}
                                />
                            </View>
                        )}
                    />
                </List.Section>
            </RadioButton.Group>
        </View>
    );
}
