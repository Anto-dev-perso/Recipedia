import {iconProp} from "@assets/images/Icons"
import SquareButton from "@components/atomic/SquareButton"
import TagButton from "@components/atomic/TagButton"
import {localImgData} from "@customTypes/ImageTypes"
import {StackScreenNavigation} from "@customTypes/ScreenTypes"
import {useNavigation} from "@react-navigation/native"
import {smallCardWidth, viewButtonStyles} from "@styles/buttons"
import {editableText} from "@styles/typography"
import React from "react"
import {View, ViewStyle} from "react-native"

export type TagProp = {
    propType: "Tag"
    item: Array<string>,
    icon?: iconProp,
    editText?: editableText,
    onTagPress: (elem: string) => void,
}

export type ImageProp = {
    propType: "Image"
    item: Array<localImgData>,
    onImgPress: (elem: localImgData, nav: StackScreenNavigation) => void,
}

export type HorizontalListProps = { propType: "Tag" | "Image", } & (TagProp | ImageProp);

// TODO to test
export default function HorizontalList(props: HorizontalListProps) {

    const horizontalView: ViewStyle = props.propType == "Image" ? {
        ...viewButtonStyles.wrappingListOfButton,
        justifyContent: 'center',
        alignItems: 'center'
    } : viewButtonStyles.wrappingListOfButton;


    const navigation = useNavigation<StackScreenNavigation>();

    function renderItem(item: string | localImgData, index: number, icon?: iconProp) {
        return (
            <View key={index} style={viewButtonStyles.viewContainingButton}>
                {props.propType == "Tag" ?
                    <TagButton text={item as string} rightIcon={icon} onPressFunction={() => selectOnPress(item)}
                               editText={props.editText}/>
                    :
                    <SquareButton side={smallCardWidth} imgSrc={item as localImgData}
                                  onPressFunction={() => selectOnPress(item)} type={'image'}/>
                }
            </View>
        )
    }


    function selectOnPress(item: string | localImgData) {
        switch (props.propType) {
            case "Tag":
                props.onTagPress(item as string);
                break;
            case "Image":
                props.onImgPress(item as localImgData, navigation);
                break;
        }
    }

    return (
        <View style={horizontalView}>
            {/*TODO a list type would be more appropriate here*/}
            {props.item.map((item: string | localImgData, index: number) => renderItem(item, index, (props.propType == "Tag" ? props.icon : undefined)))}
        </View>
    )
} 
