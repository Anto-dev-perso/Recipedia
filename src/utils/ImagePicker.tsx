import {openCamera, openCropper, openPicker, Options} from "react-native-image-crop-picker";
import {palette} from "@styles/colors";

const imageOptions: Options = {
    mediaType: "photo",
    cropping: true,
    avoidEmptySpaceAroundImage: false,
    cropperActiveWidgetColor: palette.primary,
    cropperStatusBarColor: palette.primary,
    cropperToolbarColor: palette.secondary,
    cropperToolbarWidgetColor: palette.primary,
    cropperToolbarTitle: 'Crop Image',
    cropperTintColor: 'red',
    freeStyleCropEnabled: true,
    cropperCancelText: 'Cancel',
    cropperChooseText: 'Choose',
    showCropGuidelines: true,
    disableCropperColorSetters: true,
    showCropFrame: false, enableRotationGesture: false, compressImageQuality: 1,
};


export async function pickImage(): Promise<string> {
    try {
        const pickResult = await openPicker(imageOptions);
        console.log("pickImage: pick result", pickResult);
        return pickResult.path;
    } catch (error) {
        console.warn(`pickImage: user cancelled ${error}`);
        return '';
    }
}

export async function cropImage(uri: string): Promise<string> {
    try {
        const cropResult = await openCropper({...imageOptions, path: uri});
        console.log("cropImage: cropResult", cropResult);
        return cropResult.path;
    } catch (error) {
        console.warn(`cropImage: user cancelled ${error}`);
        return '';
    }
}


export async function takePhoto(): Promise<string> {
    // TODO redirect user of re-open the po-up
    try {
        const cameraResult = await openCamera(imageOptions);
        console.log("takePhoto: pick result", cameraResult);
        return cameraResult.path;
    } catch (error) {
        console.warn(`takePhoto: user cancelled ${error}`);
        return '';
    }
}
