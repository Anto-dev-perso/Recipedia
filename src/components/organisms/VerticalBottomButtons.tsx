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


export default function VerticalBottomButtons () {

    const [multipleLayout, setMultipleLayout] = useState(false);

    return(
        <View>
            {multipleLayout ? (
                <View>
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} onPressFunction={() => setMultipleLayout(false)}/>
                    
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={BottomButtonOffset} onPressFunction={() => null}/>
                    
                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={2*BottomButtonOffset} onPressFunction={pickImage}/>

                    <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} buttonOffset={3*BottomButtonOffset} onPressFunction={takePhoto}/>
                </View>
            ) : (
                <BottomButton as={RoundButton} position={bottomPosition.right} diameter={BottomButtonDiameter} onPressFunction={() => setMultipleLayout(true)}/>
            )
            }
        </View>

    )
}