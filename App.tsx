import React, {useEffect, useState} from 'react';
import {useI18n} from '@utils/i18n';
import {StatusBar, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@screens/Home';
import Parameters from '@screens/Parameters';
import LanguageSettings from '@screens/LanguageSettings';
import DefaultPersonsSettings from '@screens/DefaultPersonsSettings';
import IngredientsSettings from '@screens/IngredientsSettings';
import TagsSettings from '@screens/TagsSettings';
import Shopping from '@screens/Shopping';
import Recipe from '@screens/Recipe';
import Search from '@screens/Search';
import {Stack, Tab} from '@customTypes/ScreenTypes';
import {Icons, iconsSize} from '@assets/Icons';
import RecipeDatabase from "@utils/RecipeDatabase";
import FileGestion from "@utils/FileGestion";
import {Icon, PaperProvider, useTheme} from "react-native-paper";
import {darkTheme, lightTheme} from "@styles/theme";
import {fetchFonts} from "@styles/typography";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {padding, screenHeight} from "@styles/spacing";
import {getDarkMode, initSettings, setDarkMode as setDarkModeSetting} from "@utils/settings";


// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO use eslint-config-expo ?
// TODO replace react-navigation by expo-router


// TODO add special gastronomy (gluten free, lactose, etc)

function getActiveIconName(routeName: string): string {
    switch (routeName) {
        case 'Home':
            return Icons.homeUnselectedIcon;
        case 'Shopping':
            return Icons.shoppingUnselectedIcon;
        case 'Plannification':
            return Icons.plannerUnselectedIcon;
        case 'Parameters':
            return Icons.parametersUnselectedIcon;
        default:
            return Icons.crossIcon;
    }
}

function getInactiveIconName(routeName: string): string {
    switch (routeName) {
        case 'Home':
            return Icons.homeSelectedIcon;
        case 'Shopping':
            return Icons.shoppingSelectedIcon;
        case 'Plannification':
            return Icons.plannerSelectedIcon;
        case 'Parameters':
            return Icons.parametersSelectedIcon;
        default:
            return Icons.crossIcon;
    }
}

// Create a theme context to provide the current theme mode and toggle function
export const ThemeContext = React.createContext({
    isDarkMode: false,
    toggleDarkMode: async () => {
    }
});

export default function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const {t} = useI18n();

    fetchFonts();

    // Function to toggle dark mode
    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        try {
            // Save to AsyncStorage
            await setDarkModeSetting(newValue);
            setDarkMode(newValue);
        } catch (error) {
            console.error('Failed to toggle dark mode:', error);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            // Initialize settings first
            await initSettings();

            // Get dark mode setting
            const isDarkMode = await getDarkMode();
            setDarkMode(isDarkMode);

            // Initialize file system and database
            await FileGestion.getInstance().init();

            const recipeDb = RecipeDatabase.getInstance();
            await recipeDb.reset();
            await recipeDb.init();

            if (recipeDb.get_ingredients().length === 0) {
                await recipeDb.addMultipleIngredients(ingredientsDataset);
            }
            if (recipeDb.get_tags().length === 0) {
                await recipeDb.addMultipleTags(tagsDataset);
            }
            if (recipeDb.get_recipes().length === 0) {
                await recipeDb.addMultipleRecipes(recipesDataset);
            }

            setIsInitialized(true);
        };

        initialize();
    }, []);

    // Use the appropriate theme based on dark mode setting
    const theme = darkMode ? darkTheme : lightTheme;

    if (!isInitialized) {
        return (
            <PaperProvider theme={theme}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text>{t('loading')}</Text>
                </View>
            </PaperProvider>
        );
    }

    function Root() {
        const {colors, fonts} = useTheme();

        return (
            <>
                <StatusBar
                    backgroundColor={colors.primaryContainer}
                    barStyle={darkMode ? "light-content" : "dark-content"}
                />
                <Tab.Navigator
                    initialRouteName='Home'
                    screenOptions={({route}) => ({
                        headerShown: false,
                        tabBarIcon: ({focused, color}) => {
                            // Use different icon variants for focused/unfocused states (MD3 pattern)
                            const iconName = focused ?
                                getActiveIconName(route.name) :
                                getInactiveIconName(route.name);
                            const iconSize = iconsSize.medium;

                            return (
                                <View style={[{
                                    paddingHorizontal: padding.medium,
                                    paddingVertical: padding.verySmall
                                },
                                    focused ? {
                                        borderRadius: iconSize * 0.6,
                                        backgroundColor: colors.primaryContainer
                                    } : {}]}>
                                    <Icon source={iconName} size={iconSize} color={color}/>
                                </View>
                            )
                        },
                        tabBarActiveTintColor: colors.onPrimaryContainer,
                        tabBarInactiveTintColor: colors.onPrimaryContainer,
                        tabBarStyle: {
                            height: screenHeight / 9,
                            backgroundColor: colors.surface,
                            elevation: 2,  // Add shadow on Android
                            shadowOpacity: 0.1,  // Add shadow on iOS
                            borderTopWidth: 0
                        },
                        tabBarItemStyle: {
                            paddingVertical: padding.small
                        },
                        tabBarLabelStyle: fonts.bodyMedium,
                    })}
                >
                    <Tab.Screen name="Home" component={Home} options={{tabBarLabel: t('home')}}/>
                    <Tab.Screen name="Shopping" component={Shopping} options={{tabBarLabel: t('shopping')}}/>
                    {/*<Tab.Screen name="Plannification" component={Plannification}/>*/}
                    <Tab.Screen
                        name="Parameters"
                        component={Parameters}
                        options={{tabBarLabel: t('parameters')}}
                    />
                </Tab.Navigator>
            </>
        );
    }

    // Provide the theme context value
    const themeContextValue = {
        isDarkMode: darkMode,
        toggleDarkMode
    };

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Root' screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Recipe" component={Recipe}/>
                        <Stack.Screen name="Root" component={Root}/>
                        <Stack.Screen name="Search" component={Search}/>
                        <Stack.Screen name="LanguageSettings" component={LanguageSettings}/>
                        <Stack.Screen name="DefaultPersonsSettings" component={DefaultPersonsSettings}/>
                        <Stack.Screen name="IngredientsSettings" component={IngredientsSettings}/>
                        <Stack.Screen name="TagsSettings" component={TagsSettings}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </ThemeContext.Provider>
    );
}
