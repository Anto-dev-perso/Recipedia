import React, {useState} from "react";
import BottomTopButton from "@components/molecules/BottomTopButton";
import {BottomTopButtonOffset, bottomTopPosition, LargeButtonDiameter} from "@styles/buttons";
import {View} from "react-native";
import {pickImage, takePhoto} from "@utils/ImagePicker";
import {cameraIcon, enumIconTypes, galleryIcon, iconsSize, minusIcon, pencilIcon, plusIcon} from "@assets/images/Icons";
import {StackScreenNavigation} from "@customTypes/ScreenTypes";
import {useNavigation} from "@react-navigation/native";
import RoundButton from "@components/atomic/RoundButton";


export default function VerticalBottomButtons() {
    const {navigate} = useNavigation<StackScreenNavigation>();

    const [multipleLayout, setMultipleLayout] = useState(false);

    // TODO add a loading because camera can takes a while
    async function takePhotoAndOpenNewRecipe() {
        openRecipeWithUri(await takePhoto());
    }

    async function pickImageAndOpenNewRecipe() {
        openRecipeWithUri(await pickImage());
    }

    function openRecipeWithUri(uri: string) {
        if (uri.length > 0) {
            navigate('Recipe', {mode: "addFromPic", imgUri: uri});
        }
    }

    return (
        <View>
            {multipleLayout ? (
                <View>
                    <BottomTopButton testID={'ReduceButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} icon={{
                        type: enumIconTypes.materialCommunity,
                        name: minusIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={() => setMultipleLayout(false)}/>

                    <BottomTopButton testID={'EditButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} buttonOffset={BottomTopButtonOffset} icon={{
                        type: enumIconTypes.materialCommunity,
                        name: pencilIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={() => navigate('Recipe', {
                        mode: 'addManually'
                    })}/>

                    <BottomTopButton testID={'GalleryButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} buttonOffset={2 * BottomTopButtonOffset} icon={{
                        type: enumIconTypes.materialCommunity,
                        name: galleryIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={pickImageAndOpenNewRecipe}/>

                    <BottomTopButton testID={'CameraButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} buttonOffset={3 * BottomTopButtonOffset} icon={{
                        type: enumIconTypes.materialCommunity,
                        name: cameraIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={takePhotoAndOpenNewRecipe}/>
                </View>
            ) : (
                <BottomTopButton testID={'ExpandButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                 diameter={LargeButtonDiameter}
                                 icon={{
                                     type: enumIconTypes.materialCommunity,
                                     name: plusIcon,
                                     size: iconsSize.medium,
                                     color: "#414a4c"
                                 }} onPressFunction={() => setMultipleLayout(true)}/>
            )
            }
        </View>

    )
}
