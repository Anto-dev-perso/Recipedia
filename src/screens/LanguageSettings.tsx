import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Divider, List, RadioButton, Text, useTheme} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import {getLanguage, setLanguage} from '@utils/settings';
import {BottomScreenTitle} from '@styles/typography';
import {LanguageSettingsProp} from "@customTypes/ScreenTypes";
import {padding} from "@styles/spacing";

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
        <View style={{backgroundColor: colors.background}}>
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
