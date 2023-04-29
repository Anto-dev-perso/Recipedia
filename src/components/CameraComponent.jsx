/**
 * TODO fill this part
 * @format
 */

import React, { Component, useRef } from "react";
import { Button, PendingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Camera } from "react-native-vision-camera";


const CameraComponent = (camera, status) => {
    if (status !== 'READY') return <PendingView/>;
    return ( 
        <View>
            <TouchableOpacity onPress={() => takePicture(camera)}>
                <Text>Take picture</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CameraComponent;