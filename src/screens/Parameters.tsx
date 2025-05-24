import React, { useState, useEffect, useContext } from "react";
import {ScrollView, View} from "react-native";
import {Divider, List, Switch, useTheme} from "react-native-paper";
import {useI18n} from "@utils/i18n";
import { getDefaultPersons, getSeasonFilter, toggleSeasonFilter } from "@utils/settings";
import {ParametersScreenProp, StackScreenNavigation} from "@customTypes/ScreenTypes";
import {useNavigation} from "@react-navigation/native";
import {Icons} from "@assets/Icons";
import { ThemeContext } from "../../App";

export default function Parameters({}: ParametersScreenProp) {
    const {t, getLocale, getLocaleName} = useI18n();
    const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
    const [defaultPersons, setDefaultPersons] = useState(4);
    const [seasonFilter, setSeasonFilter] = useState(true);
    const {colors} = useTheme();
    const currentLocale = getLocale();
    
    // Load settings on component mount
    useEffect(() => {
        const loadSettings = async () => {
            const persons = await getDefaultPersons();
            setDefaultPersons(persons);
            
            const filter = await getSeasonFilter();
            setSeasonFilter(filter);
        };
        
        loadSettings();
    }, []);

    const {navigate} = useNavigation<StackScreenNavigation>();

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

    return (
        <View style={{backgroundColor: colors.background}}>
            <ScrollView>
                {/* Appearance Section */}
                <List.Section>
                    <List.Subheader>{t('appearance')}</List.Subheader>
                    <List.Item
                        title={t('dark_mode')}
                        left={props => <List.Icon {...props} icon={Icons.lightDarkTheme}/>}
                        right={props => <Switch value={isDarkMode} onValueChange={toggleDarkMode}/>}
                    />
                    <Divider/>
                    <List.Item
                        title={t('language')}
                        description={getLocaleName(currentLocale)}
                        left={props => <List.Icon {...props} icon={Icons.translate}/>}
                        right={props => <List.Icon {...props} icon={Icons.chevronRight}/>}
                        onPress={handleLanguagePress}
                    />
                </List.Section>

                {/* Recipe Defaults Section */}
                <List.Section>
                    <List.Subheader>{t('recipe_defaults')}</List.Subheader>
                    <List.Item
                        title={t('default_persons')}
                        description={`${defaultPersons} ${t('persons')}`}
                        left={props => <List.Icon {...props} icon={Icons.groupPeople}/>}
                        right={props => <List.Icon {...props} icon={Icons.chevronRight}/>}
                        onPress={handlePersonsPress}
                    />
                    <Divider/>
                    <List.Item
                        title={t('default_season_filter')}
                        left={props => <List.Icon {...props} icon={Icons.plannerUnselectedIcon}/>}
                        right={props => <Switch value={seasonFilter} onValueChange={async () => {
                            const newValue = await toggleSeasonFilter();
                            setSeasonFilter(newValue);
                        }}/>}
                    />
                </List.Section>

                {/* Data Management Section */}
                <List.Section>
                    <List.Subheader>{t('data_management')}</List.Subheader>
                    <List.Item
                        title={t('ingredients')}
                        description={t('manage_ingredients_description')}
                        left={props => <List.Icon {...props} icon={Icons.apple}/>}
                        right={props => <List.Icon {...props} icon={Icons.chevronRight}/>}
                        onPress={handleIngredientsPress}
                    />
                    <Divider/>
                    <List.Item
                        title={t('tags')}
                        description={t('manage_tags_description')}
                        left={props => <List.Icon {...props} icon={Icons.tags}/>}
                        right={props => <List.Icon {...props} icon={Icons.chevronRight}/>}
                        onPress={handleTagsPress}
                    />
                </List.Section>

                {/* About Section */}
                <List.Section>
                    <List.Subheader>{t('about')}</List.Subheader>
                    <List.Item
                        title={t('version')}
                        // TODO can't we use the version in package.json ?
                        description="1.0.0"
                        left={props => <List.Icon {...props} icon={Icons.information}/>}
                    />
                </List.Section>
            </ScrollView>
        </View>
    );
}
