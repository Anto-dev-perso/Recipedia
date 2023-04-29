/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';
import YoutubeCamera from './src/components/YoutubeCamera';

// const cameraPermission = await Camera.getCameraPermissionStatus()
// const microphonePermission = await Camera.getMicrophonePermissionStatus()

const App = () => {
  return(
      /* <StatusBar barStyle={"dark-content"}/>
      <SafeAreaView>
        <ScrollView>
        </ScrollView> */
        /* <TouchableOpacity onPress={() => youtubeCamera()}>
          <Image
            source={{
              uri: 'https://reactnative.dev/docs/assets/p_cat2.png'
            }}
            style={{width: 200, height: 200}}
          />
        </TouchableOpacity> */
        <YoutubeCamera/>
      /* </SafeAreaView> */
  )
  }

export default App;
