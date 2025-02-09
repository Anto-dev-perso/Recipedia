import {cameraIcon, enumIconTypes, galleryIcon, iconsSize} from "@assets/images/Icons";
import RoundButton from "@components/atomic/RoundButton";
import HorizontalList from "@components/molecules/HorizontalList";
import {enumForImgPick, localImgData} from "@customTypes/ImageTypes";
import {ModalScreenProp, StackScreenNavigation} from "@customTypes/ScreenTypes";
import {LargeButtonDiameter} from "@styles/buttons";
import {typoStyles} from "@styles/typography";
import {imagePickerCall} from "@utils/ImagePicker";
import React from "react";
import {LogBox, Text, View} from "react-native";

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.'])

export type ModalImageSelectProps = {
    arrImg: Array<localImgData>,
    onSelectFunction: (img: localImgData, nav: StackScreenNavigation) => void,
    setState: (img: Array<localImgData>) => void
}

export default function ModalImageSelect({route}: ModalScreenProp) {
    const prop: ModalImageSelectProps = route.params;

    async function takePhotoInModal(type: enumForImgPick) {
        try {
            const pickerRes = await imagePickerCall(type);
            if (pickerRes !== undefined) {
                prop.setState(new Array(...prop.arrImg, pickerRes));
            }
        } catch (e) {
            console.warn("takePhotoInModal:: Error : ", e);
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
            <HorizontalList propType={'Image'} item={prop.arrImg} onImgPress={prop.onSelectFunction}/>

            <Text style={typoStyles.modal}>Wanna add another image ?{'\n'}Click on the camera to take a picture or click
                on the image to explore the gallery</Text>
            <View style={{flexDirection: 'row'}}>

                <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                             onPressFunction={async () => await takePhotoInModal(enumForImgPick.camera)}
                             diameter={LargeButtonDiameter} icon={{
                    type: enumIconTypes.entypo,
                    name: cameraIcon,
                    size: iconsSize.medium,
                    color: "#414a4c"
                }}/>
                <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                             onPressFunction={async () => await takePhotoInModal(enumForImgPick.gallery)}
                             diameter={LargeButtonDiameter} icon={{
                    type: enumIconTypes.fontAwesome,
                    name: galleryIcon,
                    size: iconsSize.medium,
                    color: "#414a4c"
                }}/>
            </View>
        </View>
    )
}
