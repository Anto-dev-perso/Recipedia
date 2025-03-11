import {Text, View} from "react-native"
import React, {useState} from "react";
import RoundButton from "@components/atomic/RoundButton";
import {mediumButtonDiameter, viewButtonStyles} from "@styles/buttons";
import {enumIconTypes, Icons, iconsSize, plusIcon} from "@assets/images/Icons";
import {padding, screenViews} from "@styles/spacing";
import HorizontalList from "@components/molecules/HorizontalList";
import {typoStyles} from "@styles/typography";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";
import {FlashList} from "@shopify/flash-list";


export type RecipeTagsAddOrEditProps =
    {
        type: 'addOrEdit',
        randomTags: string,
        addNewTag: (newTag: string) => void,
        removeTag: (tag: string) => void
    };

export type RecipeTagsReadOnlyProps = { type: 'readOnly' };

export type RecipeTagProps =
    { tagsList: Array<string>, testID?: string } & (RecipeTagsReadOnlyProps | RecipeTagsAddOrEditProps);

let tagsAddedCounter = 0;
export default function RecipeTags
(tagsProps: RecipeTagProps) {

    const [newTags, setNewTags] = useState(new Array<number>());
    const [allTagsNamesSorted, setAllTagsNamesSorted] = useState(RecipeDatabase.getInstance().get_tags().map(tag => tag.tagName).filter(dbTag => !tagsProps.tagsList.includes(dbTag)).sort());

    return (
        <View style={screenViews.sectionView} testID={tagsProps.testID}>
            {tagsProps.type === 'readOnly' ?
                <HorizontalList propType={"Tag"} item={tagsProps.tagsList}/>
                :
                <View>
                    <Text testID={"RecipeTags::AddOrEdit::HeaderText"} style={typoStyles.header}>Tags of the recipe
                        : </Text>
                    <Text testID={"RecipeTags::AddOrEdit::ElementText"} style={typoStyles.element}>Tags are a way to
                        identify a recipe and make easier its
                        search.{"\n"}Here are some examples of tags you can have : {tagsProps.randomTags}</Text>

                    <View style={{padding: padding.small, marginBottom: 100}}>
                        <View style={screenViews.tabView}>
                            <HorizontalList propType={"Tag"} item={tagsProps.tagsList} icon={Icons.crossIcon}
                                            onTagPress={tagsProps.removeTag}/>
                        </View>
                        {newTags.length > 0 ?
                            <FlashList data={newTags} estimatedItemSize={100} nestedScrollEnabled={true}
                                       keyboardShouldPersistTaps={"handled"} renderItem={({item}) => (
                                <View key={item} style={{padding: padding.small}}> <TextInputWithDropDown
                                    testID={"RecipeTags::AddOrEdit::List::" + item} absoluteDropDown={false}
                                    referenceTextArray={allTagsNamesSorted} onValidate={(newText: string) => {
                                    tagsProps.addNewTag(newText);
                                    setNewTags(newTags.filter(itemToFilter => itemToFilter !== item));
                                    setAllTagsNamesSorted(allTagsNamesSorted.filter(itemToFilter => itemToFilter !== newText));
                                }}/> </View>)}/> : null}

                        <RoundButton
                            style={{...viewButtonStyles.centeredView, flex: 1}}
                            diameter={mediumButtonDiameter} icon={{
                            type: enumIconTypes.materialCommunity,
                            name: plusIcon,
                            size: iconsSize.small,
                            color: "#414a4c"
                        }} onPressFunction={() => {
                            setNewTags([...newTags, tagsAddedCounter]);
                            ++tagsAddedCounter;
                        }}/>
                    </View>
                </View>
            }
        </View>
    )
}
