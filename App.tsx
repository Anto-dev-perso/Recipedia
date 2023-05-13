/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import {YoutubeCamera, OCRComponent} from './index';
import {openTable, createTable, insertRecipe, selectRecipes, deleteTable} from './src/components/SQLComponent';

const Stack = createNativeStackNavigator();

// TODO take care of warnings

// TODO expo go to consider


export default function App (){
  const [showCamera, setShowCamera] = useState(false);
  const [showTextRecognition, setShowTextRecognition] = useState(false);
  const [showSQL, setShowSQL] = useState(false);

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
    <View style={{ flex: 1}}>
    {showCamera ? (<YoutubeCamera onBackPress={() => setShowCamera(false)} />) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Button title="Open the camera" onPress={() => setShowCamera(true)} />
        </View>
      )}
     {showTextRecognition ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <OCRComponent onBackPress={() => setShowTextRecognition(false)} />
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Recognize the text of a picture" onPress={() => setShowTextRecognition(true)} />
    </View> )}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Open the database" onPress={() => openTable()} />
        <Button title="Create the database" onPress={() => createTable()} />
        <Button title="Insert in the database" onPress={() => insertRecipe()} />
        <Button title="Search in the database" onPress={() => selectRecipes()} />
        <Button title="Delete the database" onPress={() => deleteTable()} />
      </View>
    </View>
        
  )
}