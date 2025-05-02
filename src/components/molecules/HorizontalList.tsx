import {IconName} from "@assets/Icons"
import SquareButton from "@components/atomic/SquareButton"
import {smallCardWidth, viewButtonStyles} from "@styles/buttons"
import React from "react"
import {View} from "react-native"
import TagButton from "@components/atomic/TagButton";

export type TagProp = {
    propType: "Tag"
    item: Array<string>,
    icon?: IconName,
}

export type ImageProp = {
    propType: "Image"
    item: Array<string>,
}

export type HorizontalListProps =
    { propType: "Tag" | "Image", onPress?: (elem: string) => void, }
    & (TagProp | ImageProp);

// TODO to test
export default function HorizontalList(props: HorizontalListProps) {

    function renderItem(item: string, index: number) {
        return (
            <View key={index} style={viewButtonStyles.viewContainingButton}>
                {props.propType == "Tag" ?
                    <TagButton text={item as string} rightIcon={props.icon}
                               onPressFunction={() => props.onPress?.(item)}/>
                    :
                    <SquareButton side={smallCardWidth} imgSrc={item}
                                  onPressFunction={() => props.onPress?.(item)} type={'image'}/>
                }
            </View>
        )
    }

    return (
        <View style={viewButtonStyles.wrappingListOfButton}>
            {/* FlatList doesn't respond to the dynamic multi-line behavior, so keep the mapping. This doesn't allow a lot of optimization, but the list will likely have a short number of elements. */}
            {props.item.map(renderItem)}
        </View>
    )
} 
