/**
 * Import from youtue video : https://www.youtube.com/watch?v=h14TLh47nY4
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Linking, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { Camera, CameraPermissionStatus, useCameraDevices } from 'react-native-vision-camera';


const YoutubeCamera = () => {
  
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  
  const [showCamera, setShowCamera] = useState(false);
  const [imageSource, setImageSource] = useState('');
  
  useEffect(() => {
    async function getPermission() {
      const permission = await Camera.requestCameraPermission();
      console.log(`Camera permission status : ${permission}`);
      if (permission === 'denied') await Linking.openSettings();
    }
    getPermission();
  }, []);
  
  const capturePhoto = async () => {
    console.log('Going into capturePhoto');
    if (camera.current !== null){
        try{
          const photo = await camera.current.takeSnapshot();
          setImageSource(photo.path);
          setShowCamera(false);
          console.log(photo.path);
        } catch (e){
          switch (e.code) {
            case "capture/file-io-error":
              console.error("Failed to write photo to disk!")
              break
            default:
              console.error(e)
              break
          }
        }
    }
  }

  return(
    <View style={styles.container}>
          {showCamera ? (
            <>
              <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={showCamera}
              photo={true}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                style={styles.camButton}
                onPress={() => capturePhoto()}/> 
              </View>
            </>
          ) : (
            <>
              {imageSource !== '' ? (
                <Image style={styles.image} source={{uri: `file://${imageSource}`}}/>) : null}

              <View style={styles.backButton}>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#fff',
                    width: 100,
                  }}
                  onPress={() => setShowCamera(true)}>
                  <Text style={{color: 'white', fontWeight: '500'}}>Back</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#fff',
                      padding: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: '#77c3ec',
                    }}
                    onPress={() => setShowCamera(true)}>
                      <Text style={{color: '#77c3ec', fontWeight: '500'}}>Retake</Text>
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#77c3ec',
                      padding: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: 'white',
                    }}
                    onPress={() => setShowCamera(true)}>
                      <Text style={{color: 'white', fontWeight: '500'}}>Use Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  button: {
    backgroundColor: 'gray',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute', 
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    // color gray
    backgroundColor: '#B2BEB5',
aligneSelf: 'center',
borderWidth: 4,
borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
});

export default YoutubeCamera;