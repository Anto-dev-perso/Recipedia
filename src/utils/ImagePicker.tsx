import {openCamera, openCropper, openPicker} from "react-native-image-crop-picker";
import {MD3Colors} from "react-native-paper/lib/typescript/types";
import {uiLogger} from '@utils/logger';


function createImageOptionsWithTheme(themeColors: MD3Colors) {
    const statusBarColor = themeColors.primaryContainer;
    const actionColor = themeColors.surface;
    const backgroundColor = themeColors.onSurface;
    return {
        mediaType: 'photo',
        cropperCancelText: 'Cancel',
        cropperChooseText: 'Choose',
        cropping: true,
        avoidEmptySpaceAroundImage: true,
        cropperToolbarTitle: '',
        freeStyleCropEnabled: true,
        showCropGuidelines: true,
        showCropFrame: true,
        enableRotationGesture: true,
        compressImageQuality: 1,
        cropperStatusBarColor: statusBarColor,
        cropperToolbarColor: backgroundColor,
        cropperToolbarWidgetColor: actionColor,
        cropperCircleOverlay: false,
        useFrontCamera: false,
        includeExif: true,
        hideBottomControls: true,
        waitAnimationEnd: true,
    };
}

export async function pickImage(themeColors: MD3Colors): Promise<string> {
    try {
        const pickResult = await openPicker({...createImageOptionsWithTheme(themeColors), mediaType: 'photo'});
        return pickResult.path;
    } catch (error) {
        uiLogger.debug(`pickImage: user cancelled ${error}`);
        return '';
    }
}

export async function cropImage(uri: string, themeColors: MD3Colors): Promise<string> {
    try {
        const cropResult = await openCropper({
            ...createImageOptionsWithTheme(themeColors), mediaType: 'photo',
            path: uri
        });
        return cropResult.path;
    } catch (error) {
        uiLogger.debug(`cropImage: user cancelled ${error}`);
        return '';
    }
}

export async function takePhoto(themeColors: MD3Colors): Promise<string> {
    try {
        const cameraResult = await openCamera({...createImageOptionsWithTheme(themeColors), mediaType: 'photo'});
        return cameraResult.path;
    } catch (error) {
        uiLogger.debug(`takePhoto: user cancelled ${error}`);
        return '';
    }
}
