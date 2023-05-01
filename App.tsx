/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import YoutubeCamera from './src/components/YoutubeCamera';


const Stack = createNativeStackNavigator();

// TODO take care of warnings


export default function App (){
  const [showCamera, setShowCamera] = useState(false);

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
    {showCamera ? (<YoutubeCamera onBackPress={() => setShowCamera(false)}/>) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Button title="Ouvrir la caméra" onPress={() => setShowCamera(true)} />
        </View>
      )}
    </View>
        
  )
}