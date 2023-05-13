/**
 * TODO fill this part
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';

import TextRecognition from '@react-native-ml-kit/text-recognition';

type OCRComponentProps = {
    onBackPress: () => void;
  }

export default function OCRComponents ({onBackPress} : OCRComponentProps) {
    const [imageSource, setImageSource] = useState();
    const [text, setText] = useState('');
    const [showTextRecognition, setShowTextRecognition] = useState(false);     

    const recognizeText = async () => {
        try{
            console.log('Enter recognizeText');
            // const visionImage = 'http://img.over-blog-kiwi.com/0/54/84/28/20160223/ob_f0bd8b_dialogue-1-jpg'
            const visionImage = 'content://com.android.providers.downloads.documents/document/msf%3A61'
            const _image = await launchImageLibrary({ mediaType: 'photo' },     async (response) => {
                console.log('Response = ', response.assets);

                if (response.didCancel) {
                  alert('User cancelled camera picker');
                  return;
                } else if (response.errorCode == 'camera_unavailable') {
                  alert('Camera not available on device');
                  return;
                } else if (response.errorCode == 'permission') {
                  alert('Permission not satisfied');
                  return;
                } else if (response.errorCode == 'others') {
                  alert(response.errorMessage);
                  return;
                }
                console.log('base64 -> ', response.assets[0].base64);
                console.log('uri -> ', response.assets[0].uri);
                console.log('width -> ', response.assets[0].width);
                console.log('height -> ', response.assets[0].height);
                console.log('fileSize -> ', response.assets[0].fileSize);
                console.log('type -> ', response.assets[0].type);
                console.log('fileName -> ', response.assets[0].fileName);

                setImageSource(response.assets[0].uri);

                const textRecognizer = await TextRecognition.recognize(response.assets[0].uri); // TODO URL doens't work ?
                console.log('textRecognizer passed. Text decoded is :');
                console.log(textRecognizer.text);
                setText(textRecognizer.text);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            {showTextRecognition ? (
            <>
            <Text>Selection</Text>
            <Button title='Back' onPress={() => onBackPress()}/>
            <Button title='Select Image' onPress={() => recognizeText()}/>
            {imageSource ? (
                <View>
                    <Image source={{ uri: imageSource}} style={{width: 300, height: 300}}/>
                    <Text>{text}</Text>
                    <Button title="OK" onPress={() => onBackPress()} />
                </View>
            ): (
                <View>
                    <Text>imageSource is still empty</Text>
                    <Button title="Retry" onPress={() => recognizeText()} />
                </View>
            )}
            </>): (
                <View>
                    <Button title="Take a picture" onPress={() => setShowTextRecognition(true)}/>
                </View>
            )}
        </View>
    );
}