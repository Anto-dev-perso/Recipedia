import { enumIconTypes, galleryIcon, iconsSize, cameraIcon } from "@assets/images/Icons";
import RoundButton from "@components/atomic/RoundButton";
import SquareButton from "@components/atomic/SquareButton";
import BottomTopButton from "@components/molecules/BottomTopButton";
import HorizontalList from "@components/molecules/HorizontalList";
import { localImgData } from "@customTypes/ImageTypes";
import { ModalScreenProp, RecipeScreenProp, StackScreenNavigation } from "@customTypes/ScreenTypes";
import { useFocusEffect } from "@react-navigation/native";
import { BottomTopButtonOffset, LargeButtonDiameter, bottomTopPosition, mediumCardWidth, smallCardWidth, viewButtonStyles } from "@styles/buttons";
import { palette } from "@styles/colors";
import { screenViews } from "@styles/spacing";
import { typoStyles } from "@styles/typography";
import { fileGestion } from "@utils/FileGestion";
import { enumforImgPick, imagePickerCall} from "@utils/ImagePicker";
import { recipeDb } from "@utils/RecipeDatabase";
import React, { useEffect, useState } from "react";
import { Button, FlatList, Image, ListRenderItem, ListRenderItemInfo, LogBox, Modal, SafeAreaView, Text, View } from "react-native";

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.'])

export type ModalImageSelectProps = {
    arrImg: Array<localImgData>,
    onSelectFunction:(img: localImgData, nav: StackScreenNavigation) => void,
    setState:(img: Array<localImgData>) => void
}

export default function ModalImageSelect ({ route, navigation }: ModalScreenProp ) {
    const prop: ModalImageSelectProps = route.params;

    const [imgList, setImgList] = useState<Array<localImgData>>(prop.arrImg);

    const takePhotoInModal = async (type: enumforImgPick) => {
        try {
            const newImg = await imagePickerCall(type);
            
            const newArray = [...imgList, newImg]

            setImgList(newArray);
            prop.setState(newArray);

        } catch (e) {
            console.warn(e);
        }
    }

    return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: "center"}}>
                <HorizontalList list={{propType: "Image", item: imgList, onImgPress: prop.onSelectFunction}}/>

                <Text style={typoStyles.modal}>Wanna add another image ?{'\n'}Click on the camera to take a picture or click on the image to explore the gallery</Text>
                <View style={{flexDirection: 'row'}}>
                    
                    <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPressFunction={async () => await takePhotoInModal(enumforImgPick.camera)}
                         diameter={LargeButtonDiameter} icon={{type: enumIconTypes.entypo, name: cameraIcon, size: iconsSize.medium, color: "#414a4c"}} />
                    <RoundButton style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPressFunction={async () => await takePhotoInModal(enumforImgPick.gallery)} diameter={LargeButtonDiameter} icon={{type: enumIconTypes.fontAwesome, name: galleryIcon, size: iconsSize.medium, color: "#414a4c"}} />
                </View>
            </View>
        )}