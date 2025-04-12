import {IconName} from "@assets/Icons"
import SquareButton from "@components/atomic/SquareButton"
import {smallCardWidth, viewButtonStyles} from "@styles/buttons"
import React from "react"
import {View, ViewStyle} from "react-native"
import TagButton from "@components/atomic/TagButton";

export type TagProp = {
    propType: "Tag"
    item: Array<string>,
    icon?: IconName,
    onTagPress?: (elem: string) => void,
}

export type ImageProp = {
    propType: "Image"
    item: Array<string>,
    onImgPress: (elem: string) => void,
}

export type HorizontalListProps = { propType: "Tag" | "Image", } & (TagProp | ImageProp);

// TODO to test
export default function HorizontalList(props: HorizontalListProps) {

    const horizontalView: ViewStyle = props.propType == "Image" ? {
        ...viewButtonStyles.wrappingListOfButton,
        justifyContent: 'center',
        alignItems: 'center'
    } : viewButtonStyles.wrappingListOfButton;


    function renderItem(item: string, index: number, icon?: IconName) {
        return (
            <View key={index} style={viewButtonStyles.viewContainingButton}>
                {props.propType == "Tag" ?
                    <TagButton text={item as string} rightIcon={icon} onPressFunction={() => selectOnPress(item)}/>
                    :
                    <SquareButton side={smallCardWidth} imgSrc={item}
                                  onPressFunction={() => selectOnPress(item)} type={'image'}/>
                }
            </View>
        )
    }


    function selectOnPress(item: string) {
        switch (props.propType) {
            case "Tag":
                props.onTagPress?.(item as string);
                break;
            case "Image":
                props.onImgPress(item);
                break;
        }
    }

    return (
        <View style={horizontalView}>
            {/*TODO a list type would be more appropriate here*/}
            {props.item.map((item: string, index: number) => renderItem(item, index, (props.propType == "Tag" ? props.icon : undefined)))}
        </View>
    )
} 
