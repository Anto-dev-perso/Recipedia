import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RecipeDatabase from "@utils/RecipeDatabase";
import FileGestion from "@utils/FileGestion";
import {PaperProvider} from "react-native-paper";
import {darkTheme, lightTheme} from "@styles/theme";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import RootNavigator from "@navigation/RootNavigator";
import {getDarkMode, initSettings, setDarkMode as setDarkModeSetting} from "@utils/settings";
import * as SplashScreen from 'expo-splash-screen';
import {fetchFonts} from "@styles/typography";
import {DarkModeContext} from '@context/DarkModeContext';
import {SeasonFilterProvider} from '@context/SeasonFilterContext';
import {appLogger} from '@utils/logger';

// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO use eslint-config-expo ?
// TODO replace react-navigation by expo-router


// TODO add special gastronomy (gluten free, lactose, etc)

SplashScreen.preventAutoHideAsync();

export default function App() {
    fetchFonts();

    const [isInitialized, setIsInitialized] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                appLogger.info('Starting app initialization');

                // Initialize settings first
                appLogger.debug('Initializing settings');
                await initSettings();

                const isDarkMode = await getDarkMode();
                setDarkMode(isDarkMode);
                appLogger.debug('Dark mode setting loaded', { isDarkMode });

                // Initialize file system and database
                appLogger.debug('Initializing file system');
                await FileGestion.getInstance().init();

                appLogger.debug('Initializing database');
                const recipeDb = RecipeDatabase.getInstance();
                await recipeDb.reset();
                await recipeDb.init();

                // Load initial data if needed
                if (recipeDb.get_ingredients().length === 0) {
                    appLogger.info('Loading initial ingredients dataset');
                    await recipeDb.addMultipleIngredients(ingredientsDataset);
                }
                if (recipeDb.get_tags().length === 0) {
                    appLogger.info('Loading initial tags dataset');
                    await recipeDb.addMultipleTags(tagsDataset);
                }
                if (recipeDb.get_recipes().length === 0) {
                    appLogger.info('Loading initial recipes dataset');
                    await recipeDb.addMultipleRecipes(recipesDataset);
                }

                appLogger.info('App initialization completed successfully');
                setIsInitialized(true);
            } catch (error) {
                appLogger.error('App initialization failed', { error });
                // Still set as initialized to prevent infinite loading
                setIsInitialized(true);
            }
        };
        initialize();
    }, []);

    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        try {
            // Save to AsyncStorage
            await setDarkModeSetting(newValue);
            setDarkMode(newValue);
        } catch (error) {
            appLogger.error('Failed to toggle dark mode', { error });
        }
    };

    const theme = darkMode ? darkTheme : lightTheme;


    const onLayoutRootView = useCallback(async () => {
        if (isInitialized) {
            appLogger.debug('Hiding splash screen - app ready');
            await SplashScreen.hideAsync();
        }
    }, [isInitialized]);

    if (!isInitialized) {
        return null;
    }

    return (
        <SeasonFilterProvider>
            <DarkModeContext.Provider value={{
                isDarkMode: darkMode,
                toggleDarkMode
            }}>
                <PaperProvider theme={theme}>
                    <NavigationContainer onReady={onLayoutRootView}>
                        <RootNavigator/>
                    </NavigationContainer>
                </PaperProvider>
            </DarkModeContext.Provider>
        </SeasonFilterProvider>
    );
}
