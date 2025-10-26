import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useI18n } from '@utils/i18n';
import { padding, screenWidth } from '@styles/spacing';
import { DefaultPersonsSettingsProp } from '@customTypes/ScreenTypes';
import { BottomScreenTitle } from '@styles/typography';
import RecipeDatabase from '@utils/RecipeDatabase';
import { defaultPersonsSettingsLogger } from '@utils/logger';
import { useDefaultPersons } from '@context/DefaultPersonsContext';

// TODO missing a back button on screen
// TODO: Implement background sync solution for better UX - current implementation blocks UI during scaling
export function DefaultPersonsSettings({ navigation }: DefaultPersonsSettingsProp) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { defaultPersons, setDefaultPersons: setDefaultPersonsContext } = useDefaultPersons();
  const [persons, setPersons] = useState(defaultPersons);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    defaultPersonsSettingsLogger.debug('Loaded default persons from context', {
      persons: defaultPersons,
    });
    setPersons(defaultPersons);
  }, [defaultPersons]);

  const handleSave = async () => {
    const oldPersons = defaultPersons;
    defaultPersonsSettingsLogger.info('Saving new default persons setting', {
      oldPersons,
      newPersons: persons,
    });

    setIsLoading(true);

    await setDefaultPersonsContext(persons);
    defaultPersonsSettingsLogger.info('Starting recipe scaling for new default persons', {
      persons,
    });
    await RecipeDatabase.getInstance().scaleAllRecipesForNewDefaultPersons(persons);

    defaultPersonsSettingsLogger.info('Recipe scaling completed');
    setIsLoading(false);
    navigation.goBack();
  };

  const screenTestId = 'DefaultPersonSettings';
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, height: '100%' }}>
      <Text
        testID={screenTestId + '::Title'}
        variant={BottomScreenTitle}
        style={{ padding: padding.small }}
      >
        {t('default_persons')}
      </Text>

      <View style={styles.sliderContainer}>
        <Text
          testID={screenTestId + '::PersonsValue'}
          variant={'titleLarge'}
          style={styles.valueText}
        >
          {persons} {t('persons')}
        </Text>

        <Slider
          testID={screenTestId + '::Slider'}
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
          <Text testID={screenTestId + '::MinValue'} variant={'titleMedium'}>
            1
          </Text>
          <Text testID={screenTestId + '::MaxValue'} variant={'titleMedium'}>
            10
          </Text>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator testID={screenTestId + '::Loading'} size='large' />
          <Text testID={screenTestId + '::LoadingText'} style={{ marginTop: padding.small }}>
            {t('updating_recipes')}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          testID={screenTestId + '::Cancel'}
          mode='outlined'
          onPress={() => navigation.goBack()}
          style={styles.button}
          disabled={isLoading}
        >
          {t('cancel')}
        </Button>

        <Button
          testID={screenTestId + '::Save'}
          mode='contained'
          onPress={handleSave}
          style={styles.button}
          disabled={isLoading}
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
  loadingContainer: {
    alignItems: 'center',
    marginTop: padding.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: padding.large * 2,
  },
  button: {
    minWidth: screenWidth * 0.4,
  },
});
export default DefaultPersonsSettings;
