import {View} from "react-native"
import React from "react";
import {imageStyle} from "@styles/images";
import {recipeColumnsNames} from "@customTypes/DatabaseElementTypes";
import RoundButton from "@components/atomic/RoundButton";
import {enumIconTypes, iconsSize, plusIcon} from "@assets/Icons";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import CustomImage from "@components/atomic/CustomImage";

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

    // TODO do not show image is uri is empty to prevent warning
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
            <CustomImage propsTestID={imgProps.testID}/>
        </View>
    )
}
