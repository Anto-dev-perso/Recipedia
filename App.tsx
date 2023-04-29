/**
 * TODO fill this part
 * @format
 */

import React from 'react';
import {Image, ScrollView, Text, TextInput, View} from 'react-native';
// import { Camera } from 'react-native-vision-camera';
import Cat from './src/components/Cat';

// const cameraPermission = await Camera.getCameraPermissionStatus()
// const microphonePermission = await Camera.getMicrophonePermissionStatus()

const App = () => {
  return(
    <ScrollView>
      <Text> Test text</Text>
      <View>
        <Text> Some more text</Text>
        <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png'
          }}
          style={{width: 200, height: 200}}
          />
      </View>
      <Cat name="Maru"/>
      <Cat name="Jellylorum"/>
      <Cat name="Spot"/>
    </ScrollView>
  )
  }

export default App;
