/**
 * TODO fill this part
 * @format
 */

import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import BottomButton from "@components/molecules/BottomButton";
import { BottomButtonDiameter, BottomButtonOffset, bottomPosition } from "@styles/buttons";
import { useState } from "react"
import { View } from "react-native";
import { pickImage, takePhoto } from "@utils/ImagePicker";
import { enumIconTypes, cameraIcon, iconsSize, plusIcon, minusIcon, pencilIcon, galleryIcon } from "@assets/images/Icons";
import { backIcon } from '../../assets/images/Icons';


export default function VerticalBottomButtons () {

    const [multipleLayout, setMultipleLayout] = useState(false);

    return(
        <View>
            {multipleLayout ? (
                <View>
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.materialCommunity, name: minusIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => setMultipleLayout(false)}/>
                    
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={BottomButtonOffset} icon={{type: enumIconTypes.materialCommunity, name: pencilIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => null}/>
                    
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={2*BottomButtonOffset} icon={{type: enumIconTypes.fontAwesome, name: galleryIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={pickImage}/>

                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={3*BottomButtonOffset} icon={{type: enumIconTypes.entypo, name: cameraIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={takePhoto}/>
                </View>
            ) : (
                <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} icon={{type: enumIconTypes.materialCommunity, name: plusIcon, size: iconsSize.medium, color: "#414a4c"}} onPressFunction={() => setMultipleLayout(true)}/>
            )
            }
        </View>

    )
}