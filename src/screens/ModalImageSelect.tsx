import {pickImage, takePhoto} from "@utils/ImagePicker";
import React, {useState} from "react";
import {View} from "react-native";
import HorizontalList from "@components/molecules/HorizontalList";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import {Modal, Portal, Text, useTheme} from "react-native-paper";
import {padding, viewsSplitScreen} from "@styles/spacing";
import {VariantProp} from "react-native-paper/lib/typescript/components/Typography/types";

export type ModalImageSelectProps = {
    arrImg: Array<string>,
    onSelectFunction: (img: string) => void,
    onDismissFunction: () => void,
}

// TODO to test
export default function ModalImageSelect({arrImg, onSelectFunction, onDismissFunction}: ModalImageSelectProps) {

    const [selectedImages, setSelectedImages] = useState(arrImg);

    const {colors} = useTheme();
    const textVariant: VariantProp<never> = "titleMedium";

    async function takePhotoInModal() {
        callSetStateWithUri(await takePhoto(colors));
    }

    async function pickImageInModal() {
        callSetStateWithUri(await pickImage(colors));

    }

    function callSetStateWithUri(uri: string) {
        if (uri.length > 0) {
            console.log("uri: " + uri);
            setSelectedImages([...selectedImages, uri]);
        }
    }


    return (
        <Portal>
            <Modal visible={true} contentContainerStyle={{
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: "center",
                marginHorizontal: padding.veryLarge
            }} onDismiss={onDismissFunction}>
                <Text variant={textVariant} style={{marginVertical: padding.medium}}>Choose a picture among one of
                    these:</Text>
                <HorizontalList propType={'Image'} item={selectedImages} onPress={(imgPressed) => {
                    onSelectFunction(imgPressed);
                }}/>
                <View style={[viewsSplitScreen.viewInRow, {marginVertical: padding.veryLarge}]}>
                    <View style={[viewsSplitScreen.splitIn2View, {marginVertical: padding.medium}]}>
                        <RoundButton onPressFunction={takePhotoInModal}
                                     size={"medium"} icon={Icons.cameraIcon}/>
                        <Text variant={textVariant}>Take a new photo</Text>
                    </View>
                    <View style={[viewsSplitScreen.splitIn2View, {marginVertical: padding.medium}]}>
                        <RoundButton onPressFunction={pickImageInModal}
                                     size={"medium"} icon={Icons.galleryIcon}/>
                        <Text variant={textVariant}>Choose from gallery</Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}
