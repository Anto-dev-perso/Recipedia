import React, {useEffect, useState} from 'react';
import {StatusBar, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@screens/Home';
import Parameters from '@screens/Parameters';
import Shopping from '@screens/Shopping';
// import {YoutubeCamera, OCRComponent, RecipeList} from '../index';
import Recipe from '@screens/Recipe';
import Search from '@screens/Search';
import {StackScreen, TabScreen} from '@customTypes/ScreenTypes';
import {Icons, iconsSize} from '@assets/Icons';
import RecipeDatabase from "@utils/RecipeDatabase";
import FileGestion from "@utils/FileGestion";
import {Icon, PaperProvider, useTheme} from "react-native-paper";
import {lightTheme} from "@styles/theme";
import {fetchFonts} from "@styles/typography";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {padding, screenHeight} from "@styles/spacing";


// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO add translations
// TODO use eslint-config-expo ?
// TODO replace react-navigation by expo-router


// TODO add special gastronomy (gluten free, lactose, etc)

//  const initI18n = i18n; // instanciate the i18n instance

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

export default function App() {

    const [isInitialized, setIsInitialized] = useState(false);

    fetchFonts();

    useEffect(() => {
        FileGestion.getInstance().init().then(async () => {

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
        });
    }, []);

    function Root() {

        const {colors, fonts} = useTheme();

        return (
            <>
                <StatusBar backgroundColor={colors.primaryContainer} barStyle={"dark-content"}
                />
                <TabScreen.Navigator initialRouteName='Home' screenOptions={({route}) => ({
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
                    tabBarInactiveTintColor: colors.onPrimaryContainer
                    , tabBarStyle: {
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

                })}>
                    <TabScreen.Screen name="Home" component={Home}/>
                    <TabScreen.Screen name="Shopping" component={Shopping}/>
                    {/*<TabScreen.Screen name="Plannification" component={Plannification}/>*/}
                    <TabScreen.Screen name="Parameters" component={Parameters}/>
                </TabScreen.Navigator>
            </>)

    }

    // const { t, i18n } = useTranslation();

    // i18n.changeLanguage('fr'); // Can be use in parameter
    // TODO Good idea to pass translation through components props

    if (!isInitialized) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <PaperProvider theme={lightTheme}>
            <NavigationContainer>
                <StackScreen.Navigator initialRouteName='Root' screenOptions={{headerShown: false}}>
                    <StackScreen.Screen name="Recipe" component={Recipe}/>
                    <StackScreen.Screen name="Root" component={Root}/>
                    <StackScreen.Screen name="Search" component={Search}/>
                </StackScreen.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};
