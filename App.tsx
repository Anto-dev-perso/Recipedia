import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RecipeDatabase from '@utils/RecipeDatabase';
import FileGestion from '@utils/FileGestion';
import {PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from '@styles/theme';
import {getDataset} from '@utils/DatasetLoader';
import i18n, {SupportedLanguage} from '@utils/i18n';
import AppWrapper from '@components/organisms/AppWrapper';
import {getDarkMode, getDefaultPersons, initSettings, setDarkMode as setDarkModeSetting,} from '@utils/settings';
import * as SplashScreen from 'expo-splash-screen';
import {useFetchFonts} from '@styles/typography';
import {DarkModeContext} from '@context/DarkModeContext';
import {SeasonFilterProvider} from '@context/SeasonFilterContext';
import {DefaultPersonsProvider} from '@context/DefaultPersonsContext';
import {appLogger} from '@utils/logger';
import {isFirstLaunch} from '@utils/firstLaunch';

// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO use eslint-config-expo ?
// TODO replace react-navigation by expo-router

// TODO add special gastronomy (gluten free, lactose, etc)

SplashScreen.preventAutoHideAsync();

export function App() {
    useFetchFonts();

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
                appLogger.debug('Dark mode setting loaded', {isDarkMode});


                appLogger.debug('Initializing file system');
                await FileGestion.getInstance().init();

                appLogger.debug('File system initialized');
                appLogger.debug('Initializing database');
                const recipeDb = RecipeDatabase.getInstance();
                await recipeDb.init();

                const isFirst = await isFirstLaunch();


                if (isFirst) {
                    if (recipeDb.isDatabaseEmpty()) {
                        appLogger.info('First launch detected and database is empty - loading complete dataset');
                        const currentLanguage = i18n.language as SupportedLanguage;
                        const dataset = getDataset(currentLanguage);

                        await recipeDb.addMultipleIngredients(dataset.ingredients);
                        await recipeDb.addMultipleTags(dataset.tags);
                        await recipeDb.addMultipleRecipes(dataset.recipes);

                        appLogger.info('Complete dataset loaded successfully');

                        const defaultPersons = await getDefaultPersons();
                        appLogger.info('Scaling all recipes to default persons count', {
                            defaultPersons,
                            totalRecipes: dataset.recipes.length,
                        });
                        await recipeDb.scaleAllRecipesForNewDefaultPersons(defaultPersons);
                        appLogger.info('All recipes scaled successfully');
                    } else {
                        appLogger.warn('First launch flag is set but database already contains data - skipping data load to prevent duplicates', {
                            recipesCount: recipeDb.get_recipes().length,
                            ingredientsCount: recipeDb.get_ingredients().length,
                            tagsCount: recipeDb.get_tags().length,
                        });
                    }
                } else {
                    appLogger.debug('Not first launch - database should already contain data');
                }
                appLogger.info('App initialization completed successfully');
                setIsInitialized(true);
            } catch (error) {
                appLogger.error('App initialization failed', {error});
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
            appLogger.error('Failed to toggle dark mode', {error});
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
        <DefaultPersonsProvider>
            <SeasonFilterProvider>
                <DarkModeContext.Provider
                    value={{
                        isDarkMode: darkMode,
                        toggleDarkMode,
                    }}
                >
                    <PaperProvider theme={theme}>
                        <NavigationContainer onReady={onLayoutRootView}>
                            <AppWrapper/>
                        </NavigationContainer>
                    </PaperProvider>
                </DarkModeContext.Provider>
            </SeasonFilterProvider>
        </DefaultPersonsProvider>
    );
}

export default App;
