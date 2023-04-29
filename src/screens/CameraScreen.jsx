/**
 * TODO fill this part
 * @format
 */

import React, { Component, useEffect, useRef, useState } from "react";
import { Button, PendingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevices } from "react-native-vision-camera";
import CameraComponent from "../components/CameraComponent";

const CameraScreen = () => {
  const [status, setStatus] = useState('');
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
        const {cameraDevices} = await useCameraDevices();
        const cameraDevice = cameraDevice[0];
        const camera = new Camera(cameraDevice);
        await camera.start();
        setCamera(camera);
        setStatus('READY');
    })();
    return async () => {
        if(camera){
            await camera.stop();
        }
    };
  }, []);

    if (!camera) return null;

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={camera} style={{ flex: 1 }} onInitialized={status => setStatus(status)}>
        <CameraComponent camera={camera} status={status}/>
      </Camera>
    </View>
  );
}

export default CameraScreen;
