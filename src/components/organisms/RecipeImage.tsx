import {Image, View} from "react-native"
import React from "react";
import {imageStyle} from "@styles/images";
import {recipeColumnsNames} from "@customTypes/DatabaseElementTypes";
import RoundButton from "@components/atomic/RoundButton";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/images/Icons";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";


export type RecipeImageAddingProps = {
    setImgUri: (newUri: string) => void,
    openModal: (field: recipeColumnsNames) => void,
}

export type RecipeImageProps =
    {
        imgUri: string,
        addProps?: RecipeImageAddingProps
        testID?: string
    };

export default function RecipeImage(imgProps: RecipeImageProps) {


    return (
        <View style={imageStyle.containerFullStyle} testID={imgProps.testID}>
            {imgProps.addProps ?
                <RoundButton style={{...viewButtonStyles.centeredView, flex: 1}}
                             diameter={mediumButtonDiameter} icon={{
                    type: enumIconTypes.materialCommunity,
                    name: plusIcon,
                    size: iconsSize.small,
                    color: "#414a4c"
                    // @ts-ignore  TODO addProps isn't told as set
                }} onPressFunction={() => imgProps.addProps.openModal(recipeColumnsNames.image)}/> : null}
            <Image source={{uri: imgProps.imgUri}} style={imageStyle.imageInsideView}/>
        </View>
    )
}
