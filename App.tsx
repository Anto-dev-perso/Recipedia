import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@screens/Home';
import Parameters from '@screens/Parameters';
import Shopping from '@screens/Shopping';
// import {YoutubeCamera, OCRComponent, RecipeList} from '../index';
import Recipe from '@screens/Recipe';
import Search from '@screens/Search';
import Crop from '@screens/Crop';
import {StackScreen, TabScreen} from '@customTypes/ScreenTypes';
import {
    crossIcon,
    displayIcon,
    enumIconTypes,
    homeIcon,
    iconsSize,
    parametersIcon,
    plannerIcon,
    shoppingIcon
} from '@assets/images/Icons';
import {palette} from '@styles/colors';
import ModalImageSelect from '@screens/ModalImageSelect';
import EStyleSheet from "react-native-extended-stylesheet";
import RecipeDatabase from "@utils/RecipeDatabase";
import {fetchFonts} from "@styles/typography";
import FileGestion from "@utils/FileGestion";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";
import {PaperProvider} from "react-native-paper";


// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO add translations
// TODO use eslint-config-expo ?
// TODO replace react-navigation by expo-router

//  const initI18n = i18n; // instanciate the i18n instance


export default function App() {

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        FileGestion.getInstance().init().then(async () => {

            const recipeDb = RecipeDatabase.getInstance();
            await recipeDb.reset();
            await recipeDb.init();

            await recipeDb.addMultipleIngredients(ingredientsDataset);
            await recipeDb.addMultipleTags(tagsDataset);
            await recipeDb.addMultipleRecipes(recipesDataset);

            setIsInitialized(true);
        });
    }, []);

    fetchFonts();

    function Root() {
        return (
            <TabScreen.Navigator initialRouteName='Home' screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let iconColor;
                    let iconSize;
                    let iconType: enumIconTypes;

                    if (focused) {
                        iconColor = palette.primary;
                        iconSize = iconsSize.medium;
                    } else {
                        iconColor = "#414a4c";
                        iconSize = iconsSize.small;
                    }

                    switch (route.name) {
                        case 'Home':
                            iconType = enumIconTypes.materialCommunity;
                            iconName = homeIcon;
                            break;
                        case 'Shopping':
                            iconType = enumIconTypes.entypo;
                            iconName = shoppingIcon;
                            break;
                        case 'Plannification':
                            iconType = enumIconTypes.materialCommunity;
                            iconName = plannerIcon;
                            break;
                        case 'Parameters':
                            iconType = enumIconTypes.fontAwesome;
                            iconName = parametersIcon;
                            break;
                        default:
                            iconType = enumIconTypes.entypo;
                            iconName = crossIcon
                            break;

                    }

                    return displayIcon(iconType, iconName, iconSize, iconColor);
                },
                tabBarActiveTintColor: palette.primary,
                tabBarInactiveTintColor: 'gray',
            })}>
                <TabScreen.Screen name="Home" component={Home}/>
                <TabScreen.Screen name="Shopping" component={Shopping} options={({navigation}) => ({
                    headerRight: () =>
                        (
                            <Button onPress={async () => {
                                await RecipeDatabase.getInstance().resetShoppingList();
                                navigation.setParams({refresh: Date.now()});
                            }} title="Delete"/>
                        )
                })}/>
                {/*<TabScreen.Screen name="Plannification" component={Plannification}/>*/}
                <TabScreen.Screen name="Parameters" component={Parameters}/>
            </TabScreen.Navigator>
        )
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
        <PaperProvider>
            <NavigationContainer>
                <StackScreen.Navigator initialRouteName='Root' screenOptions={{headerShown: false}}>
                    <StackScreen.Group screenOptions={{
                        presentation: 'transparentModal',
                        contentStyle: {backgroundColor: palette.modalBackground}
                    }}>
                        <StackScreen.Screen name="Modal" component={ModalImageSelect}/>
                    </StackScreen.Group>
                    <StackScreen.Screen name="Recipe" component={Recipe}/>
                    <StackScreen.Screen name="Root" component={Root}/>
                    <StackScreen.Screen name="Search" component={Search}/>
                    <StackScreen.Screen name="Crop" component={Crop} options={{
                        // headerStyle: {backgroundColor: cameraPalette.overlayColor},
                        headerShown: false,
                        // headerTitle: "",

                        // headerRight: () => (
                        //   <View style={screenViews.tabView}>
                        //     <View style={cropView.overlay}>
                        //       {displayIcon(enumIconTypes.materialCommunity, rotateIcon, iconsSize.medium, cameraPalette.buttonsColor)}
                        //     </View>

                        //     <View style={cropView.overlay}>
                        //       {displayIcon(enumIconTypes.materialCommunity, flipIcon, iconsSize.medium, cameraPalette.buttonsColor)}
                        //     </View>

                        //     <Pressable style={cropView.overlay} onPress={() => console.warn("TODO")}>
                        //       <Text style={cropText.overlay}>Redimensionner</Text>
                        //     </Pressable>
                        //   </View>
                        // )
                    }}/>
                </StackScreen.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};
const styles = EStyleSheet.create({
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Set the background color
    },
    splashText: {
        marginTop: 20,
        fontSize: 18,
        color: '#000000',
    },
});
