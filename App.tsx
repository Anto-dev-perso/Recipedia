import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import FileGestion from '@utils/FileGestion';
import {PaperProvider} from 'react-native-paper';
import {darkTheme, lightTheme} from '@styles/theme';
import AppWrapper from '@components/organisms/AppWrapper';
import {getDarkMode, initSettings, setDarkMode as setDarkModeSetting,} from '@utils/settings';
import * as SplashScreen from 'expo-splash-screen';
import {useFetchFonts} from '@styles/typography';
import {DarkModeContext} from '@context/DarkModeContext';
import {SeasonFilterProvider} from '@context/SeasonFilterContext';
import {DefaultPersonsProvider} from '@context/DefaultPersonsContext';
import {RecipeDatabaseProvider, useRecipeDatabase} from '@context/RecipeDatabaseContext';
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

function AppContent() {
    const [isAppInitialized, setIsAppInitialized] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const {isDatabaseInitialized} = useRecipeDatabase();

    useEffect(() => {
        const initialize = async () => {
            try {
                appLogger.info('Starting app initialization');

                appLogger.debug('Initializing settings');
                await initSettings();

                const isDarkMode = await getDarkMode();
                setDarkMode(isDarkMode);
                appLogger.debug('Dark mode setting loaded', {isDarkMode});

                appLogger.debug('Initializing file system');
                await FileGestion.getInstance().init();
                appLogger.debug('File system initialized');

                appLogger.info('App initialization completed successfully');
                setIsAppInitialized(true);
            } catch (error) {
                appLogger.error('App initialization failed', {error});
            }
        };
        initialize();
    }, []);

    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        try {
            await setDarkModeSetting(newValue);
            setDarkMode(newValue);
        } catch (error) {
            appLogger.error('Failed to toggle dark mode', {error});
        }
    };

    const theme = darkMode ? darkTheme : lightTheme;

    const onLayoutRootView = useCallback(async () => {
        if (isAppInitialized && isDatabaseInitialized) {
            appLogger.debug('Hiding splash screen - app and database ready');
            await SplashScreen.hideAsync();
        }
    }, [isAppInitialized, isDatabaseInitialized]);

    if (!isAppInitialized || !isDatabaseInitialized) {
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

export function App() {
    useFetchFonts();

    return (
        <RecipeDatabaseProvider>
            <AppContent/>
        </RecipeDatabaseProvider>
    );
}

export default App;
