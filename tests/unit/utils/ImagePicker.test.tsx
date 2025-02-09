import * as ImagePicker from 'expo-image-picker';
import {imagePickerCall} from '@utils/ImagePicker';
import {enumForImgPick} from "@customTypes/ImageTypes";

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
        Videos: 'Videos',
        All: 'All',
    },
}));

jest.mock('@utils/AsyncAlert', () => ({
    __esModule: true, // Ensure the module is treated as ES6
    AsyncAlert: jest.fn(() => Promise.resolve(1)),
}));

describe('ImagePicker Utility Functions', () => {
    const mockPermissionGranted = {granted: true};
    const mockPermissionNonGranted = {granted: false};

    const mockResponseLibraryOK = {
        canceled: false,
        assets: [{uri: 'file://mock-library-image.jpg', height: 100, width: 100}]
    };
    const mockResponseCameraOK = {
        canceled: false,
        assets: [{uri: 'file://mock-camera-image.jpg', height: 100, width: 100}]
    };
    const mockResponseCancelled = {canceled: true, assets: []};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------- TESTS FOR IMAGE LIBRARY --------
    test('imagePickerCall invokes pickImage when type is "library" and permission is granted', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionGranted);
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResponseLibraryOK);

        const result = await imagePickerCall(enumForImgPick.gallery);

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(result).toEqual(mockResponseLibraryOK.assets[0]);
    });

    test('imagePickerCall returns null for "library" when permission is denied', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionNonGranted);

        const result = await imagePickerCall(enumForImgPick.gallery);

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    test('imagePickerCall returns null for "library" when user cancels image selection', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionGranted);
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResponseCancelled);

        const result = await imagePickerCall(enumForImgPick.gallery);

        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    // -------- TESTS FOR CAMERA --------
    test('imagePickerCall invokes takePhoto when type is "camera" and permission is granted', async () => {
        (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionGranted);
        (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockResponseCameraOK);

        const result = await imagePickerCall(enumForImgPick.camera);

        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
        expect(result).toEqual(mockResponseCameraOK.assets[0]);
    });

    test('imagePickerCall returns null for "camera" when permission is denied', async () => {
        (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionNonGranted);

        const result = await imagePickerCall(enumForImgPick.camera);

        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    test('imagePickerCall returns null for "camera" when user cancels photo capture', async () => {
        (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue(mockPermissionGranted);
        (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(mockResponseCancelled);

        const result = await imagePickerCall(enumForImgPick.camera);

        expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
        expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });


    // -------- INVALID TYPE TEST --------
    test('imagePickerCall returns null for an invalid type', async () => {
        const result = await imagePickerCall('invalid' as any);
        expect(result).toBeUndefined();
    });
});
