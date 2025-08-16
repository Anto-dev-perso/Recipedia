import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {useI18n} from '@utils/i18n';
import {getDefaultPersons, setDefaultPersons as saveDefaultPersons} from '@utils/settings';
import {padding, screenWidth} from '@styles/spacing';
import {DefaultPersonsSettingsProp} from "@customTypes/ScreenTypes";
import {BottomScreenTitle} from "@styles/typography";
import RecipeDatabase from '@utils/RecipeDatabase';
import {defaultPersonsSettingsLogger} from '@utils/logger';

// TODO missing a back button on screen
export default function DefaultPersonsSettings({navigation}: DefaultPersonsSettingsProp) {
    const {t} = useI18n();
    const {colors} = useTheme();
    const [persons, setPersons] = useState(-1);

    useEffect(() => {
        const loadDefaultPersons = async () => {
            const value = await getDefaultPersons();
            defaultPersonsSettingsLogger.debug('Loaded default persons setting', { persons: value });
            setPersons(value);
        };

        loadDefaultPersons();
    }, []);

    const handleSave = async () => {
        defaultPersonsSettingsLogger.info('Saving new default persons setting', { 
            oldPersons: await getDefaultPersons(), 
            newPersons: persons 
        });
        
        await saveDefaultPersons(persons);
        navigation.goBack();

        // Schedule database update to run after navigation
        setTimeout(() => {
            defaultPersonsSettingsLogger.info('Starting recipe scaling for new default persons', { persons });
            RecipeDatabase.getInstance().scaleAllRecipesForNewDefaultPersons(persons);
        }, 0);
    };

    const screenTestId = "DefaultPersonSettings";
    return (
        <View style={{flex: 1, backgroundColor: colors.background, height: "100%"}}>
            <Text testID={screenTestId + "::Title"} variant={BottomScreenTitle}
                  style={{padding: padding.small}}>{t('default_persons')}</Text>

            <View style={styles.sliderContainer}>
                <Text testID={screenTestId + "::PersonsValue"} variant={"titleLarge"}
                      style={styles.valueText}>{persons} {t('persons')}</Text>

                <Slider testID={screenTestId + "::Slider"}
                        value={persons}
                        onValueChange={setPersons}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.backdrop}
                        thumbTintColor={colors.primary}
                />

                <View style={styles.rangeLabels}>
                    <Text testID={screenTestId + "::MinValue"} variant={"titleMedium"}>1</Text>
                    <Text testID={screenTestId + "::MaxValue"} variant={"titleMedium"}>10</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button testID={screenTestId + "::Cancel"}
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                >
                    {t('cancel')}
                </Button>

                <Button testID={screenTestId + "::Save"}
                        mode="contained"
                        onPress={handleSave}
                        style={styles.button}
                >
                    {t('save')}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sliderContainer: {
        marginTop: padding.large,
        paddingHorizontal: padding.medium,
    },
    valueText: {
        textAlign: 'center',
        marginBottom: padding.medium,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: padding.small,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: padding.large * 2,
    },
    button: {
        minWidth: screenWidth * 0.4,
    }
});
