

import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import BottomTopButton from "@components/molecules/BottomTopButton";
import { LargeButtonDiameter, BottomTopButtonOffset, bottomTopPosition } from "@styles/buttons";
import { useState } from "react"
import { View } from "react-native";
import { enumforImgPick, imagePickerCall} from "@utils/ImagePicker";
import { enumIconTypes, cameraIcon, iconsSize, plusIcon, minusIcon, pencilIcon, galleryIcon } from "@assets/images/Icons";
import { StackScreenNavigation } from "@customTypes/ScreenTypes";
import { useNavigation } from "@react-navigation/native";


export default function VerticalBottomButtons () {
    
    const [multipleLayout, setMultipleLayout] = useState(false);
    
    
    const { navigate } = useNavigation<StackScreenNavigation>();

    const pickImageAndOpenNewRecipe = async (mode: enumforImgPick) => {
        // TODO add a loading because camera can takes a while
        try {
            imagePickerCall(mode).then(imgPick => navigate('Recipe', {mode: "addfromPic", img: imgPick}));
        } catch (error) {
            console.log("Cancel press by user. Catch receive ", error);
        }
    }

    return(
        <View>
            {multipleLayout ? (
                <View>
                    <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} diameter={LargeButtonDiameter} icon={{type: enumIconTypes.materialCommunity, name: minusIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => setMultipleLayout(false)}/>
                    
                    <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} diameter={LargeButtonDiameter} buttonOffset={BottomTopButtonOffset} icon={{type: enumIconTypes.materialCommunity, name: pencilIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => navigate('Recipe', {mode: 'addManually'})}/>
                    
                    <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} diameter={LargeButtonDiameter} buttonOffset={2*BottomTopButtonOffset} icon={{type: enumIconTypes.fontAwesome, name: galleryIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => pickImageAndOpenNewRecipe(enumforImgPick.gallery)}/>

                    <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} diameter={LargeButtonDiameter} buttonOffset={3*BottomTopButtonOffset} icon={{type: enumIconTypes.entypo, name: cameraIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => pickImageAndOpenNewRecipe(enumforImgPick.camera)}/>
                </View>
            ) : (
                <BottomTopButton as={RoundButton} position={bottomTopPosition.bottom_right} diameter={LargeButtonDiameter} icon={{type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => setMultipleLayout(true)}/>
            )
            }
        </View>

    )
}