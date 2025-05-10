import {StyleSheet, View} from "react-native"
import React from "react";
import {recipeColumnsNames} from "@customTypes/DatabaseElementTypes";
import {IconName} from "@assets/Icons";
import CustomImage from "@components/atomic/CustomImage";
import RoundButton from "@components/atomic/RoundButton";
import {padding, screenHeight} from "@styles/spacing";

export type RecipeImageProps =
    {
        imgUri: string,
        openModal: (field: recipeColumnsNames) => void,
        buttonIcon?: IconName,
    };

export default function RecipeImage({imgUri, openModal, buttonIcon}: RecipeImageProps) {
    const [validUri, setValidUri] = React.useState(imgUri.length > 0);

    const imageTestID = "RecipeImage";
    return (
        <View style={styles.recipeImageContainer} testID={imageTestID}>
            <CustomImage testID={imageTestID} uri={imgUri} onLoadError={() => {
                setValidUri(false)
            }} onLoadSuccess={() => setValidUri(true)}/>
            {buttonIcon ?
                <View style={validUri ? styles.topRightButtonContainer : styles.centerButtonContainer}>
                    <RoundButton testID={imageTestID} size={"medium"} icon={buttonIcon}
                                 onPressFunction={() => openModal(recipeColumnsNames.image)}/>
                </View>
                : null}
        </View>
    )
}

const styles = StyleSheet.create({
    recipeImageContainer: {height: screenHeight / 2},
    centerButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topRightButtonContainer: {
        position: 'absolute',
        top: padding.small,
        right: padding.small,
    }
});
