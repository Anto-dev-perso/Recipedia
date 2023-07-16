/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import { typoStyles } from '@styles/typography';
import { roundButtonStyles, squareButtonStyles, rectangleRoundedButtonStyles } from '@styles/buttons';
import { NavigationContainer } from '@react-navigation/native';

import RoundButton from '@components/RoundButton';
import SquareButton from '@components/SquareButton';
import RectangleRoundedButton from '@components/RectangleRoundedButton';

import { useTranslation } from 'react-i18next';
import i18n from '@i18n/i18n';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@screens/Home';
import Parameters from '@screens/Parameters';
import Plannification from '@screens/Plannification';
import Recipe from '@screens/Recipe';
import Search from '@screens/Search';
import Shopping from '@screens/Shopping';

import { SQLiteDatabase } from 'react-native-sqlite-storage';


// import {YoutubeCamera, OCRComponent, RecipeList} from '../index';
// import LightModeStyle from '../index';


import {openConnection, createTable, deleteTable} from '@utils/DatabaseManipulation';
import { recipeDatabaseElement } from '@types/DatabaseElementTypes';
// import CalendarComponent from './components/CalendarComponent';

// TODO take care of warnings

// TODO expo go to consider

const initI18n = i18n; // instanciate the i18n instance

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const recipeDatabaseName = "RecipeDatabase";
const db = openConnection(recipeDatabaseName);


const dbTest: Array<recipeDatabaseElement> = [
  {
    id: 0,
    imageSource: require('./assets/images/architecture.jpg'),
    title: "Architecture take from far away",
    description: "This is an architecture",
    ingredients: "A photograph",
    preparation: "Go on a good spot and take the picture",
  },
  {
    id: 1,
    imageSource: require('./assets/images/bike.jpg'),
    title: "Bike on a beach",
    description: "For all our \"bobo\", here is your partner in crime : a bike. On a beach beacause why not",
    ingredients: "A beach, a bike",
    preparation: "Go to the beach with your bike. Park it and that's it !",
  },
  {
    id: 2,
    imageSource: require('./assets/images/cat.jpg'),
    title: "Beatiful cat",
    description: "It's a cat you know ...",
    ingredients: "A cat ... obviously",
    preparation: "Harm with patience and wiat for him to look at you",
  },
  {
    id: 3,
    imageSource: require('./assets/images/child.jpg'),
    title: "Child wearing a purple coat",
    description: "On a purple room, this child is centered with its own purple coat",
    ingredients: "The room, the child, the coat",
    preparation: "But the coat on the child, place him front to the camera",
  },
  {
    id: 4,
    imageSource: require('./assets/images/church.jpg'),
    title: "Inside the church",
    description: "Coupole inside the church",
    ingredients: "A church, you neck",
    preparation: "Got to the chruch and look up",
  },
  {
    id: 5,
    imageSource: require('./assets/images/coffee.jpg'),
    title: "Wanna take a coffee break ?",
    description: "Set of coffee with everything you can possibly need",
    ingredients: "Cup of coffee",
    preparation: "Nothing",
  },
  {
    id: 6,
    imageSource: require('./assets/images/crimson.jpg'),
    title: "Is this King Crimson ?",
    description: "Little bird call Crimson on its branch",
    ingredients: "A very good objective",
    preparation: "Wait for it and good luck",
  },
  {
    id: 7,
    imageSource: require('./assets/images/dog.jpg'),
    title: "Cute dog",
    description: "Look a him, he is sooooooo cute",
    ingredients: "Dog",
    preparation: "Put the dog inside a flower garden",
  },
  {
    id: 8,
    imageSource: require('./assets/images/monastery.jpg'),
    title: "Monastery",
    description: "Picture of a monastery during a sunset",
    ingredients: "Monastery, sunset",
    preparation: "When time is ok, take this masterpiece",
  },
  {
    id: 9,
    imageSource: require('./assets/images/motocross.jpg'),
    title: "Biker during a drift",
    description: "Fabulous drift",
    ingredients: "A good biker",
    preparation: "During a hard virage, take this while a drift in ongoing",
  },
  {
    id: 10,
    imageSource: require('./assets/images/mushrooms.jpg'),
    title: "Brown mushrooms",
    description: "Mushrooms that's grows to much",
    ingredients: "This kind of mushromms all packed togethers",
    preparation: "If you find it while randonning, don't wait !",
  },
  {
    id: 11,
    imageSource: require('./assets/images/scooter.jpg'),
    title: "Parisians riding",
    description: "Look a those parisians with theirs scooters. What is this seriously",
    ingredients: "Parisians, Scooters",
    preparation: "It should be easy to find them in Paris.\nBe prepared to be insulted",
  },
  {
    id: 12,
    imageSource: require('./assets/images/strawberries.jpg'),
    title: "Strawberries verrine",
    description: "Beautiful and appetizing strawberries verrine",
    ingredients: "Strawberries",
    preparation: "Cook the verrrine",
  },
  {
    id: 13,
    imageSource: require('./assets/images/tree.jpg'),
    title: "Tree in the snow",
    description: "In a snow valley, those trees are rising",
    ingredients: "Trees, Snow",
    preparation: "Find this valley, look hard for thos trees",
  },
  {
    id: 14,
    imageSource: require('./assets/images/waves.jpg'),
    title: "Waves on the rock",
    description: "Riple waves arriving to the rocks",
    ingredients: "Rocks, Waves",
    preparation: "On a rainy day, go to these rocks",
  },

]

export default function App (){
  const [database, setDatabase] = useState<SQLiteDatabase>();
  // const [showCamera, setShowCamera] = useState(false);
  // const [showTextRecognition, setShowTextRecognition] = useState(false);
  // const [showSQL, setShowSQL] = useState(false);
  
  // const [showTestText, setShowTestText] = useState(false);
  
  // const { t, i18n } = useTranslation();

  // i18n.changeLanguage('fr'); // Can be use in parameter
  // TODO Good idea to pass translation through components props

  useEffect(() => {
    // let db = openConnection(recipeDatabaseName);
    deleteTable(db);
    createTable(db);
    // setDatabase(db);
    }, [])


  const pressFunction = () => {
    console.log("Button pressed");
  }

  return(

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
      <Tab.Navigator initialRouteName='Home'>
        <Tab.Screen name="Home" component={Home}/>
        <Tab.Screen name="Shopping" component={Shopping}/>
        <Tab.Screen name="Plannification" component={Plannification}/>
        <Tab.Screen name="Parameters" component={Parameters}/>
      </Tab.Navigator>
        {/* <Stack.Navigator>
          <Stack.Screen name="Recipe" component={Recipe}/>
          <Stack.Screen name="Search" component={Search}/>
        </Stack.Navigator> */}
    </NavigationContainer>
  )
}

const styles = (circleDiameter: number) => StyleSheet.create({
  rbutton: {
    ...roundButtonStyles(circleDiameter).roundButton,
  },
})
  const styles2 = (side: number) => StyleSheet.create({
  sbutton: {
    ...squareButtonStyles(side).squareButton,
  },
})
  const styles3 = (length: number) => StyleSheet.create({
  rectButton: {
    ...rectangleRoundedButtonStyles(length).rectangleRoundedButton,
  }
})