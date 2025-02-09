import {Text, View} from "react-native"
import React from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {crossIcon, enumIconTypes, iconsColor, iconsSize, plusIcon} from "@assets/images/Icons";
import {padding, screenViews} from "@styles/spacing";
import HorizontalList from "@components/molecules/HorizontalList";
import {typoStyles} from "@styles/typography";


export type RecipeTagsAddOrEditProps =
    {
        type: 'addOrEdit',
        randomTags: string,
        addNewTag: () => void,
        changeTag: (oldParam: string, newParam: string) => void
    };

export type RecipeTagsReadOnlyProps = { type: 'readOnly', onPress: () => void, };

export type RecipeTagProps =
    { tagsList: Array<string>, testID?: string } & (RecipeTagsReadOnlyProps | RecipeTagsAddOrEditProps);

export default function RecipeTags
(tagsProps: RecipeTagProps) {

    return (
        <View style={screenViews.sectionView} testID={tagsProps.testID}>
            {tagsProps.type === 'readOnly' ?
                <HorizontalList propType={"Tag"} item={tagsProps.tagsList} onTagPress={tagsProps.onPress}/>
                :
                <View>
                    <Text style={typoStyles.header}>Tags of the recipe : </Text>
                    <Text style={typoStyles.element}>Tags are a way to identify a recipe and make easier its
                        search.{"\n"}Here are some examples of tags you can have : {tagsProps.randomTags}</Text>

                    {/* TODO make a cleaner UI  */}
                    <View style={screenViews.tabView}>
                        {tagsProps.tagsList.length == 0 ? null :
                            <View style={{flex: 3}}>
                                <HorizontalList propType={"Tag"} item={tagsProps.tagsList}
                                                icon={{
                                                    type: enumIconTypes.entypo,
                                                    name: crossIcon,
                                                    size: padding.large,
                                                    color: iconsColor,
                                                    style: {paddingRight: 5}
                                                }} editText={{
                                    withBorder: true, onChangeFunction: tagsProps.changeTag,
                                }} onTagPress={() => console.log("Not implemented")}/>
                            </View>
                        }
                        {/* TODO icon doesn't work */}
                        <RoundButton style={{...viewButtonStyles.centeredView, flex: 1}}
                                     diameter={mediumButtonDiameter} icon={{
                            type: enumIconTypes.materialCommunity,
                            name: plusIcon,
                            size: iconsSize.small,
                            color: "#414a4c"
                        }} onPressFunction={tagsProps.addNewTag}/>
                    </View>
                </View>

            }
        </View>
    )
}
