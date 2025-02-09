import {
    backIcon,
    displayIcon,
    enumIconTypes,
    flipHorizontalIcon as flipHorizontalIcon,
    flipVerticalIcon,
    iconsSize,
    rotateIcon
} from "@assets/images/Icons";
import {CropScreenProp} from "@customTypes/ScreenTypes";
import {cameraPalette} from "@styles/colors";
import {cropView, remValue, screenViews} from "@styles/spacing";
import {cropText} from "@styles/typography";
import {Image} from 'expo-image';
import React, {useEffect, useState} from "react";
import {LayoutRectangle, LogBox, Pressable, SafeAreaView, StatusBar, Text, View} from "react-native";
import {CropRectangle} from "@components/molecules/CropRectangle";
import {Layout, localImgData, panType} from "@customTypes/ImageTypes";
import FileGestion from "@utils/FileGestion";

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.'])

export type CropPropsType = {
    imageToCrop: localImgData,
    validateFunction(newImg: localImgData): void,
}

// TODO rework with native and test
export default function Crop({route, navigation}: CropScreenProp) {

    const prop: CropPropsType = route.params;

    const [localImage, setLocalImage] = useState<localImgData>(prop.imageToCrop);
    const [croppingImage, setCroppingImage] = useState<LayoutRectangle>({x: 0, y: 0, width: 0, height: 0});
    const [imageLayout, setImageLayout] = useState<Layout>({width: localImage.width, height: localImage.height});
    const [imageScaleFactor, setImageScaleFactor] = useState<number>(0.66);

    const [cropSize, setCropSize] = useState<Layout>({height: 0, width: 0});
    const [accumulatedPan, setAccumulatedPan] = useState<panType>({x: 0, y: 0});

    const fileGestion = FileGestion.getInstance();

    useEffect(() => {
        calculateCropBounds(imageLayout);
    }, [localImage]);


    useEffect(() => {
        fileGestion.backUpFile(localImage.uri).then(uri => {
            setLocalImage({...localImage, uri: uri});
        });
    }, []);

    function backPress() {
        fileGestion.clearCache();
        navigation.goBack();
    }

    function rotatePress() {
        fileGestion.rotateImage(localImage.uri).then(img => {
            setLocalImage(img);
        });
    }

    function flipVerticalPress() {
        fileGestion.flipImageVertically(localImage.uri).then(img => {
            setLocalImage(img);
        });
    }

    function flipHorizontalPress() {
        fileGestion.flipImageHorizontally(localImage.uri).then(img => {
            setLocalImage(img);
        });
    }

    async function validatePress() {
        // TODO take a loooong time because camera take short videos
        if (localImage.uri.length > 0) {
            try {
                const imgToReturn = await fileGestion.cropImage(localImage.uri, accumulatedPan, croppingImage, imageScaleFactor, cropSize);
                // console.log("Crop image done : ", imgToReturn);
                await prop.validateFunction(imgToReturn);
            } catch (error) {
                console.warn("validatePress: ", error);
            }
        }
        navigation.goBack();
    }

    function calculateCropBounds(layout: Layout | undefined) {
        if (layout) {
            const editingWindowAspectRatio = layout.height / layout.width;
            const imageAspectRatio = localImage.height / localImage.width;
            const bounds: LayoutRectangle = {x: 0, y: 0, width: 0, height: 0};
            let imageScaleFactor: number;
            if (imageAspectRatio > editingWindowAspectRatio) {
                bounds.x =
                    (((imageAspectRatio - editingWindowAspectRatio) / imageAspectRatio) * layout.width) / 2
                bounds.width = layout.height / imageAspectRatio;
                bounds.height = layout.height;
                imageScaleFactor = localImage.height / layout.height
            } else {
                bounds.y =
                    ((((1 / imageAspectRatio) - (1 / editingWindowAspectRatio)) / (1 / imageAspectRatio)) * layout.height) / 2;
                bounds.width = layout.width;
                bounds.height = layout.width * imageAspectRatio;
                imageScaleFactor = localImage.width / layout.width
            }

            setCroppingImage(bounds);
            setImageScaleFactor(imageScaleFactor);
            setImageLayout({height: layout.height, width: layout.width})
        }
    }

    return (
        <SafeAreaView style={cropView.background}>
            <StatusBar animated={true} backgroundColor={cameraPalette.statusBarColor}/>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                height: 60 * remValue,
                backgroundColor: cameraPalette.overlayColor
            }}>
                <View style={cropView.overlay}>
                    {displayIcon(enumIconTypes.materialCommunity, backIcon, iconsSize.medium, cameraPalette.buttonsColor, {}, backPress)}
                </View>
                <View style={screenViews.tabView}>
                    <View style={cropView.overlay}>
                        {displayIcon(enumIconTypes.materialCommunity, rotateIcon, iconsSize.medium, cameraPalette.buttonsColor, {}, () => rotatePress())}
                    </View>

                    <View style={cropView.overlay}>
                        {displayIcon(enumIconTypes.materialCommunity, flipHorizontalIcon, iconsSize.medium, cameraPalette.buttonsColor, {}, flipHorizontalPress)}
                    </View>

                    <View style={cropView.overlay}>
                        {displayIcon(enumIconTypes.materialCommunity, flipVerticalIcon, iconsSize.medium, cameraPalette.buttonsColor, {}, flipVerticalPress)}
                    </View>

                    <Pressable style={cropView.overlay} onPress={() => validatePress()}>
                        <Text style={cropText.overlay}>Redimensionner</Text>
                    </Pressable>
                </View>
            </View>

            <View style={{flex: 1}}>
                {localImage.uri.length > 0 ?
                    <Image source={{uri: localImage.uri}} style={{flex: 1}} contentFit="contain"
                           onLayout={({nativeEvent}) => {
                               calculateCropBounds(nativeEvent.layout);
                           }}/> : null}
                {imageLayout ? <CropRectangle imageBounds={croppingImage} datas={{
                    rectSize: cropSize, pan: accumulatedPan,
                    rectSizeSetter: setCropSize, panSetter: setAccumulatedPan
                }}/> : null}
            </View>
        </SafeAreaView>
    )
}
