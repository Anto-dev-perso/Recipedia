import {pickImage, takePhoto} from "@utils/ImagePicker";
import React from "react";
import {View} from "react-native";
import HorizontalList from "@components/molecules/HorizontalList";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import {Modal, Portal, Text, useTheme} from "react-native-paper";
import {padding, viewsSplitScreen} from "@styles/spacing";
import {VariantProp} from "react-native-paper/lib/typescript/components/Typography/types";
import {useI18n} from "@utils/i18n";

export type ModalImageSelectProps = {
    arrImg: Array<string>,
    onSelectFunction: (img: string) => void,
    onDismissFunction: () => void,
    onImagesUpdated: (imageUri: string) => void,
}

// TODO to test
export default function ModalImageSelect({
                                             arrImg,
                                             onSelectFunction,
                                             onDismissFunction,
                                             onImagesUpdated
                                         }: ModalImageSelectProps) {

    const {t} = useI18n();


    const {colors} = useTheme();
    const textVariant: VariantProp<never> = "titleMedium";

    async function takePhotoInModal() {
        callSetSelectedImageWithUri(await takePhoto(colors));
    }

    async function pickImageInModal() {
        callSetSelectedImageWithUri(await pickImage(colors));

    }

    function callSetSelectedImageWithUri(uri: string) {
        if (uri.length > 0) {
            onImagesUpdated(uri);
        }
    }

    const ocrTranslationsPrefix = 'alerts.ocrRecipe.';

    const modalTestID = "Modal";
    const testID = "ModalImageSelect";

    return (
        <Portal>
            <Modal visible={true} contentContainerStyle={{
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: "center",
                marginHorizontal: padding.veryLarge
            }} onDismiss={onDismissFunction}>
                <Text testID={testID + "::ExplanationText"} variant={textVariant}
                      style={{marginVertical: padding.medium}}>{t(ocrTranslationsPrefix + 'explanationText')}</Text>
                <HorizontalList testID={modalTestID} propType={'Image'} item={arrImg}
                                onPress={(imgPressed) => {
                                    onSelectFunction(imgPressed);
                                }}/>
                <View style={[viewsSplitScreen.viewInRow, {marginVertical: padding.veryLarge}]}>
                    <View style={[viewsSplitScreen.splitIn2View, {marginVertical: padding.medium}]}>
                        <RoundButton testID={modalTestID + "::Camera"} onPressFunction={takePhotoInModal}
                                     size={"medium"} icon={Icons.cameraIcon}/>
                        <Text testID={modalTestID + "::Camera::Text"}
                              variant={textVariant}>{t(ocrTranslationsPrefix + 'photo')}</Text>
                    </View>
                    <View style={[viewsSplitScreen.splitIn2View, {marginVertical: padding.medium}]}>
                        <RoundButton testID={modalTestID + "::Gallery"} onPressFunction={pickImageInModal}
                                     size={"medium"} icon={Icons.galleryIcon}/>
                        <Text testID={modalTestID + "::Gallery::Text"}
                              variant={textVariant}>{t(ocrTranslationsPrefix + 'gallery')}</Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}
