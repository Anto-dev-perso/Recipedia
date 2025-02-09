import React, {useState} from "react";
import RoundButton from "@components/atomic/RoundButton";
import BottomTopButton from "@components/molecules/BottomTopButton";
import {BottomTopButtonOffset, bottomTopPosition, LargeButtonDiameter} from "@styles/buttons";
import {View} from "react-native";
import {imagePickerCall} from "@utils/ImagePicker";
import {cameraIcon, enumIconTypes, galleryIcon, iconsSize, minusIcon, pencilIcon, plusIcon} from "@assets/images/Icons";
import {HomeScreenProp} from "@customTypes/ScreenTypes";
import {enumForImgPick} from "@customTypes/ImageTypes";


export default function VerticalBottomButtons({navigation}: HomeScreenProp) {

    const [multipleLayout, setMultipleLayout] = useState(false);

    async function pickImageAndOpenNewRecipe(mode: enumForImgPick) {
        // TODO add a loading because camera can takes a while
        try {
            const imgPick = await imagePickerCall(mode);
            if (imgPick !== undefined) {
                navigation.navigate('Recipe', {mode: "addFromPic", img: imgPick});
            }
        } catch (error) {
            console.log("Cancel press by user. Catch receive ", error);
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
                    }} onPressFunction={() => navigation.navigate('Recipe', {
                        mode: 'addManually', recipe: {
                            image_Source: '', title: '',
                            description: "",
                            tags: [],
                            persons: 0,
                            ingredients: [],
                            season: [],
                            preparation: [],
                            time: 0
                        }
                    })}/>

                    <BottomTopButton testID={'GalleryButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} buttonOffset={2 * BottomTopButtonOffset} icon={{
                        type: enumIconTypes.fontAwesome,
                        name: galleryIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={() => pickImageAndOpenNewRecipe(enumForImgPick.gallery)}/>

                    <BottomTopButton testID={'CameraButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                     diameter={LargeButtonDiameter} buttonOffset={3 * BottomTopButtonOffset} icon={{
                        type: enumIconTypes.entypo,
                        name: cameraIcon,
                        size: iconsSize.medium,
                        color: "#414a4c"
                    }} onPressFunction={() => pickImageAndOpenNewRecipe(enumForImgPick.camera)}/>
                </View>
            ) : (
                <BottomTopButton testID={'ExpandButton'} as={RoundButton} position={bottomTopPosition.bottom_right}
                                 diameter={LargeButtonDiameter} icon={{
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
