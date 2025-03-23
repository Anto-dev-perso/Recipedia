import * as ImagePicker from 'expo-image-picker';
import {ImagePickerResult} from 'expo-image-picker';
import {AsyncAlert} from '@utils/AsyncAlert';
import {enumForImgPick, localImgData} from '@customTypes/ImageTypes';

async function pickImage(): Promise<ImagePicker.ImagePickerResult> {
    const permissionsResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionsResult.granted) {
        return await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "livePhotos"],
            // allowsEditing: false,
            allowsEditing: true,
            quality: 1,
        })
    } else {
        // TODO redirect user or re-open the po-up
        console.warn("ImagePicker: PERMISSION REFUSED");
        await AsyncAlert("Permission refused", "You've refused library permissions so you can't use this functionality !\n\nTo fix this, go to your settings and allow permission.");
        return {canceled: true, assets: null}
    }
}


async function takePhoto(): Promise<ImagePickerResult> {
    const permissionsResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionsResult.granted) {
        return await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })
    } else {
        // TODO redirect user of re-open the po-up
        console.warn("takePhoto: PERMISSION REFUSED");
        await AsyncAlert("Permission refused", "You've refused camera permissions so you can't use this functionality !\n\nTo fix this, go to your settings and allow permission");
        return {canceled: true, assets: null};
    }
}

export async function imagePickerCall(type: enumForImgPick): Promise<localImgData | undefined> {

    let pickerResult: ImagePicker.ImagePickerResult;
    switch (type) {
        case enumForImgPick.camera:
            pickerResult = await takePhoto();
            break;
        case enumForImgPick.gallery:
            pickerResult = await pickImage();
            break;
        default:
            pickerResult = {canceled: true, assets: null};
            break;
    }
    if (pickerResult.canceled) {
        console.log("imagePickerCall: Canceled");
        return;
    } else {
        return {
            uri: pickerResult.assets[0].uri,
            height: pickerResult.assets[0].height,
            width: pickerResult.assets[0].width
        }
    }
}
