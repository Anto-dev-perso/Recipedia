import {cameraIcon, enumIconTypes, galleryIcon, iconsSize} from "@assets/Icons";
import RoundButton from "@components/atomic/RoundButton";
import HorizontalList from "@components/molecules/HorizontalList";
import {ModalScreenProp} from "@customTypes/ScreenTypes";
import {LargeButtonDiameter} from "@styles/buttons";
import {typoStyles} from "@styles/typography";
import {pickImage, takePhoto} from "@utils/ImagePicker";
import React, {useState} from "react";
import {Text, View} from "react-native";

// LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.']);

export type ModalImageSelectProps = {
    arrImg: Array<string>,
    onSelectFunction: (img: string) => void,
}

export default function ModalImageSelect({navigation, route}: ModalScreenProp) {
    const prop: ModalImageSelectProps = route.params;

    const [selectedImages, setSelectedImages] = useState(prop.arrImg);

    async function takePhotoInModal() {
        callSetStateWithUri(await takePhoto());
    }

    async function pickImageInModal() {
        callSetStateWithUri(await pickImage());

    }

    function callSetStateWithUri(uri: string) {
        if (uri.length > 0) {
            setSelectedImages(new Array(...selectedImages, uri));
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
            <HorizontalList propType={'Image'} item={prop.arrImg} onImgPress={(imgPressed) => {
                prop.onSelectFunction(imgPressed);
                navigation.goBack();
            }}/>

            <Text style={typoStyles.modal}>Wanna add another image ?{'\n'}Click on the camera to take a picture or click
                on the image to explore the gallery</Text>
            <View style={{flexDirection: 'row'}}>

                <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                             onPressFunction={takePhotoInModal}
                             diameter={LargeButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: cameraIcon,
                    size: iconsSize.medium,
                    color: "#414a4c"
                }}/>
                <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                             onPressFunction={pickImageInModal}
                             diameter={LargeButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: galleryIcon,
                    size: iconsSize.medium,
                    color: "#414a4c"
                }}/>
            </View>
        </View>
    )
}
