import {padding, screenViews} from "@styles/spacing";
import React, {useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet} from "react-native";
import {Card, RadioButton, Text} from "react-native-paper";
import {typoStyles} from "@styles/typography";
import {useI18n} from "@utils/i18n";
// TODO to implement
//  Default nb persons
// Default on-season only or not (filter pre-selected)
// ingredient list with seasonality (editable)
//  tag list (editable)
// dark mode

export default function Parameters() {

    const {t, getLocale, setLocale, getAvailableLocales, getLocaleName} = useI18n();

    const [currentLocale, setCurrentLocale] = useState<string>(getLocale());
    const availableLocales = getAvailableLocales();

    const handleLanguageChange = async (locale: string) => {
        await setLocale(locale);
        setCurrentLocale(locale);
    };
    return (
        <SafeAreaView style={screenViews.screenView}>
            <ScrollView>
                <Text style={typoStyles.title}>{t('parameters')}</Text>

                <Card style={styles.card}>
                    <Card.Title title={t('language')}/>
                    <Card.Content>
                        <RadioButton.Group onValueChange={handleLanguageChange} value={currentLocale}>
                            {availableLocales.map((locale) => (
                                <RadioButton.Item
                                    key={locale}
                                    label={getLocaleName(locale)}
                                    value={locale}
                                    style={styles.radioItem}
                                />
                            ))}
                        </RadioButton.Group>
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: padding.medium,
    },
    radioItem: {
        paddingVertical: padding.small,
    },
});
