/**
 * TODO fill this part
 * @format
*/

import * as ImagePicker from 'expo-image-picker';
import { AsyncAlert } from './AsyncAlert';
import { localImgData } from '@customTypes/ImageTypes';


export enum enumforImgPick {
    camera = "camera",
    gallery = "gallery"
}


async function pickImage() {
    let res: ImagePicker.ImagePickerResult = {canceled: true, assets: null};
    const permissionsResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(permissionsResult.granted === false){
        // TODO redirect user of re-open the po-up
        AsyncAlert("Permission refused", "You've refused library permissions so you can't use this functionality !\n\nTo fix this, go to your settings and allow permission.")
        console.warn("PERMISSION REFUSED")
    }else{
        res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        })
    }
    return res;
}


async function takePhoto() {
    let res: ImagePicker.ImagePickerResult = {canceled: true, assets: null} 
        const permissionsResult = await ImagePicker.requestCameraPermissionsAsync();

        if(permissionsResult.granted === false){
            // TODO redirect user of re-open the po-up
            AsyncAlert("Permission refused", "You've refused camera permissions so you can't use this functionality !\n\nTo fix this, go to your settings and allow permission")
            console.warn("PERMISSION REFUSED")
        }else{
            res = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1, mediaTypes: ImagePicker.MediaTypeOptions.Images})
        }
        return res;
}

export async function imagePickerCall(type: enumforImgPick): Promise<localImgData>{
    return new Promise(async (resolve, reject) => {

        let pickerResult: ImagePicker.ImagePickerResult;
        switch (type) {
            case enumforImgPick.camera:
                    pickerResult = await takePhoto();
                    break;
                case enumforImgPick.gallery:
                    pickerResult = await pickImage();
                    break;
                default:
                    pickerResult = {canceled: true, assets: null}
                    break;
                }
            if(pickerResult.canceled){
                reject("Canceled picking");
            }else{
                resolve({uri: pickerResult.assets[0].uri, height: pickerResult.assets[0].height, width: pickerResult.assets[0].width})
            }
    })
}