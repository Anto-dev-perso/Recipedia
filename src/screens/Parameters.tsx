/**
 * Parameters - Comprehensive app settings and configuration screen
 *
 * The main settings hub providing access to all app configuration options including
 * appearance settings, recipe defaults, data management, and app information.
 * Features organized sections with intuitive navigation and real-time setting updates.
 *
 * Key Features:
 * - Appearance settings (dark mode, language selection)
 * - Recipe defaults (serving count, seasonal filtering)
 * - Data management (ingredients, tags administration)
 * - App information (version, about details)
 * - Real-time setting synchronization
 * - Context integration for global state management
 * - Hierarchical navigation to detailed setting screens
 *
 * Settings Categories:
 *
 * **Appearance:**
 * - Dark/Light mode toggle with instant theme switching
 * - Language selection with localized interface
 *
 * **Recipe Defaults:**
 * - Default serving count for new recipes
 * - Seasonal filtering toggle for search results
 *
 * **Data Management:**
 * - Ingredient database administration
 * - Tag system management and organization
 *
 * **About:**
 * - App version information
 * - Build and configuration details
 *
 * Navigation Integration:
 * - Seamless navigation to specialized setting screens
 * - Proper back navigation with state preservation
 * - Context-aware navigation based on current settings
 *
 * @example
 * ```typescript
 * // Navigation integration (typically in tab navigator)
 * <Tab.Screen
 *   name="Parameters"
 *   component={Parameters}
 *   options={{
 *     tabBarIcon: ({ color }) => <Icon name="settings" color={color} />
 *   }}
 * />
 *
 * // The Parameters screen automatically handles:
 * // - Loading current settings from storage/context
 * // - Providing navigation to detailed setting screens
 * // - Real-time updates to global app state
 * // - Organized presentation of all configuration options
 * ```
 */

import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, List, Switch, useTheme } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import { getDefaultPersons } from '@utils/settings';
import { useSeasonFilter } from '@context/SeasonFilterContext';
import { ParametersScreenProp, StackScreenNavigation } from '@customTypes/ScreenTypes';
import { useNavigation } from '@react-navigation/native';
import { Icons } from '@assets/Icons';
import { DarkModeContext } from '@context/DarkModeContext';
import Constants from 'expo-constants';

/**
 * Parameters screen component - Main app settings and configuration hub
 *
 * @param props - Navigation props for the Parameters screen
 * @returns JSX element representing the comprehensive settings interface
 */
export default function Parameters({}: ParametersScreenProp) {
  const { t, getLocale, getLocaleName } = useI18n();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [defaultPersons, setDefaultPersons] = useState(4);
  const { seasonFilter, setSeasonFilter } = useSeasonFilter();
  const { colors } = useTheme();
  const currentLocale = getLocale();
  const AppVersion = Constants.expoConfig?.version ?? 'N/A';

  // Load settings on component mount
  useEffect(() => {
    getDefaultPersons().then(value => setDefaultPersons(value));
  }, []);

  const { navigate } = useNavigation<StackScreenNavigation>();

  // Navigate to language selection screen
  const handleLanguagePress = () => {
    navigate('LanguageSettings');
  };

  // Navigate to default persons setting screen
  const handlePersonsPress = () => {
    navigate('DefaultPersonsSettings');
  };

  // Navigate to ingredient management screen
  const handleIngredientsPress = () => {
    navigate('IngredientsSettings');
  };

  // Navigate to tag management screen
  const handleTagsPress = () => {
    navigate('TagsSettings');
  };

  const screenId = 'Parameters';
  const sectionId = screenId + '::Section';
  const appearanceId = sectionId + '::Appearance';
  const darkModeId = appearanceId + '::DarkMode';
  const languageId = appearanceId + '::Language';

  const recipeId = sectionId + '::RecipeDefaults';
  const personId = recipeId + '::Person';
  const seasonId = recipeId + '::Season';

  const dataId = sectionId + '::Data';
  const ingredientsId = dataId + '::Ingredients';
  const tagsId = dataId + '::Tags';

  const aboutId = sectionId + '::About';
  const versionId = aboutId + '::Version';

  return (
    <View style={{ backgroundColor: colors.background }}>
      <ScrollView>
        {/* Appearance Section */}
        <List.Section>
          <List.Subheader testID={appearanceId + '::SubHeader'}>{t('appearance')}</List.Subheader>
          <List.Item
            testID={darkModeId + '::Item'}
            title={t('dark_mode')}
            left={props => <List.Icon {...props} icon={Icons.lightDarkTheme} />}
            right={props => (
              <Switch
                testID={darkModeId + '::Switch'}
                value={isDarkMode}
                onValueChange={toggleDarkMode}
              />
            )}
          />
          <Divider testID={appearanceId + '::Divider'} />
          <List.Item
            testID={languageId + '::Item'}
            title={t('language')}
            description={getLocaleName(currentLocale)}
            left={props => <List.Icon {...props} icon={Icons.translate} />}
            right={props => <List.Icon {...props} icon={Icons.chevronRight} />}
            onPress={handleLanguagePress}
          />
        </List.Section>

        {/* Recipe Defaults Section */}
        <List.Section>
          <List.Subheader testID={recipeId + '::SubHeader'}>{t('recipe_defaults')}</List.Subheader>
          <List.Item
            testID={personId + '::Item'}
            title={t('default_persons')}
            description={`${defaultPersons} ${t('persons')}`}
            left={props => <List.Icon {...props} icon={Icons.groupPeople} />}
            right={props => <List.Icon {...props} icon={Icons.chevronRight} />}
            onPress={handlePersonsPress}
          />
          <Divider testID={recipeId + '::Divider'} />
          <List.Item
            testID={seasonId + '::Item'}
            title={t('default_season_filter')}
            left={props => <List.Icon {...props} icon={Icons.plannerUnselectedIcon} />}
            right={props => (
              <Switch
                testID={seasonId + '::Switch'}
                value={seasonFilter}
                onValueChange={setSeasonFilter}
              />
            )}
          />
        </List.Section>

        {/* Data Management Section */}
        <List.Section>
          <List.Subheader testID={dataId + '::SubHeader'}>{t('data_management')}</List.Subheader>
          <List.Item
            testID={ingredientsId + '::Item'}
            title={t('ingredients')}
            description={t('manage_ingredients_description')}
            left={props => <List.Icon {...props} icon={Icons.apple} />}
            right={props => <List.Icon {...props} icon={Icons.chevronRight} />}
            onPress={handleIngredientsPress}
          />
          <Divider testID={dataId + '::Divider'} />
          <List.Item
            testID={tagsId + '::Item'}
            title={t('tags')}
            description={t('manage_tags_description')}
            left={props => <List.Icon {...props} icon={Icons.tags} />}
            right={props => <List.Icon {...props} icon={Icons.chevronRight} />}
            onPress={handleTagsPress}
          />
        </List.Section>

        {/* About Section */}
        <List.Section>
          <List.Subheader testID={aboutId + '::SubHeader'}>{t('about')}</List.Subheader>
          <List.Item
            testID={versionId + '::Item'}
            title={t('version')}
            description={AppVersion}
            left={props => <List.Icon {...props} icon={Icons.information} />}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}
