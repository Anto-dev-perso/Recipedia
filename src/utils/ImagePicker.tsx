/**
 * TODO fill this part
 * @format
*/

import * as ImagePicker from 'expo-image-picker';
import recognizeText from './OCR';

async function pickImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
    })

    if(result.canceled){
        console.warn("Canceled picking");
    }else{
        console.log("Result of ImagePicker : ", result.assets[0]);
        recognizeText(result.assets[0].uri);
    }
}

async function takePhoto() {
    const permissionsResult = await ImagePicker.requestCameraPermissionsAsync();

    if(permissionsResult.granted === false){
        // TODO redirect user of re-open the po-up
        alert("You've refused camera permissions so you can't use this functionality !\n\nTo fix this, go to your settings and allow permission.")
    }else{
        let result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1,})
        if(result.canceled){
            console.warn("Canceled picking");
        }else{
            console.log("Result of ImagePicker : ", result);
        }
    }
}

export { pickImage, takePhoto }