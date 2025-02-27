import React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@screens/Home';
import Parameters from '@screens/Parameters';
import Shopping from '@screens/Shopping';
// TODO use eslint-config-expo ?
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


// TODO manage horizontal mode

// TODO search for functions define as const lambda
// TODO search for loops with indices
// TODO assert lambda functions usage
// TODO useMemo for time consuming function

// TODO add translations
// const initI18n = i18n; // instanciate the i18n instance


export default function App() {


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

    // const [showCamera, setShowCamera] = useState(false);
    // const [showTextRecognition, setShowTextRecognition] = useState(false);
    // const [showSQL, setShowSQL] = useState(false);

    // const [showTestText, setShowTestText] = useState(false);

    // const { t, i18n } = useTranslation();

    // i18n.changeLanguage('fr'); // Can be use in parameter
    // TODO Good idea to pass translation through components props

    return (
        // <>
        // <StatusBar barStyle={"dark-content"}/>
        //   <SafeAreaView>
        //     <ScrollView>
        //     {showCamera ? (
        //       <YoutubeCamera onBackPress={() => setShowCamera(false)}/>) : (
        //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //         <Button title="Ouvrir la caméra" onPress={() => setShowCamera(true)} />
        //         </View>
        //       )}
        //     </ScrollView>
        //   </SafeAreaView>
        // </>


        // <ScrollView>
        // {showCamera ? (<YoutubeCamera onBackPress={() => setShowCamera(false)} />) : (
        //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //       <Button title="Open the camera" onPress={() => setShowCamera(true)} />
        //     </View>
        //   )}
        //  {showTextRecognition ? (
        //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //     <OCRComponent onBackPress={() => setShowTextRecognition(false)} />
        //   </View>
        // ) : (
        //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //     <Button title="Recognize the text of a picture" onPress={() => setShowTextRecognition(true)} />
        // </View> )}
        //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //     <Button title="Open the database" onPress={() => openConnection()} />
        //     <Button title="Create the database" onPress={() => createTable()} />
        //     <Button title="Insert in the database" onPress={() => insertRecipe()} />
        //     <Button title="Search in the database" onPress={() => selectRecipes()} />
        //     <Button title="Delete the database" onPress={() => deleteTable()} />
        //   </View>
        // </ScrollView>

        // <View style={{flex:1, flexDirection: 'column'}}>
        //   {/* <Button title="Open the database" onPress={() => openConnection()} />
        //   <Button title="Create the database" onPress={() => createTable()} />
        //   <Button title="Search in the database" onPress={() => selectRecipes()} /> */}
        //   {/* <RecipeList/>
        //   <CalendarComponent/> */}
        //     {/* <Button title={t('common.translated-text')}/> */}
        //     {/* <Button title="Button for E2E test" testID='test_id' onPress={() => setShowTestText(true)} />
        //     {showTestText ?  <Text>The button has been pressed</Text> : null} */}
        //   {/* <View>
        //     <Text style={typoStyles.title}>
        //       Test of custom font</Text>
        //   </View> */}

        // {/* Debug */}
        // <View style={{backgroundColor: 'blue', flex:1, flexDirection:'row'}}>
        //     <RoundButton diameter={100} text='Text to display' icon={{name: "rocket", size: 50, color: "#900"}} onPressFunction={pressFunction}/>
        //     <RoundButton diameter={200} text='Another text' onPressFunction={pressFunction}/>
        //     <RoundButton diameter={70} onPressFunction={pressFunction}/>
        //   </View>
        //   <View style={{backgroundColor: 'orange', flex:1, flexDirection:'row'}}>
        //     <SquareButton side={100} onPressFunction={pressFunction}/>
        //     <SquareButton side={200} image={require('./assets/images/Test.jpg')} onPressFunction={pressFunction}/>
        //   </View>
        //   <View style={{backgroundColor: 'green', flex:1.3, flexDirection:'column'}}>
        //     <RectangleRoundedButton length={100} text='Rectangle square button'/>
        //     <RectangleRoundedButton length={150}/>
        //   </View>

        // </View>


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
    )
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
