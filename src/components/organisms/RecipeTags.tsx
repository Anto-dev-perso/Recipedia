import {View} from "react-native"
import React, {useState} from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons, plusIcon} from "@assets/Icons";
import HorizontalList from "@components/molecules/HorizontalList";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";
import {FlashList} from "@shopify/flash-list";
import {recipeTagsStyles} from "@styles/recipeComponents";
import {Text, useTheme} from "react-native-paper";

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

    const {colors} = useTheme();

    return (
        <View style={recipeTagsStyles.containerSection} testID={tagsProps.testID}>
            {tagsProps.type === 'readOnly' ?
                <HorizontalList propType={"Tag"} item={tagsProps.tagsList}/>
                :
                <View>
                    <Text testID={"RecipeTags::AddOrEdit::HeaderText"} variant={"headlineSmall"}
                          style={recipeTagsStyles.containerElement}>Tags:</Text>
                    <Text testID={"RecipeTags::AddOrEdit::ElementText"} variant={"labelMedium"}
                          style={[recipeTagsStyles.containerElement, {color: colors.outline}]}>Tags are a
                        way to
                        identify a recipe and make easier its
                        search.{"\n"}Here are some examples of tags you can have : {tagsProps.randomTags}</Text>

                    <View style={recipeTagsStyles.tagsContainer}>
                        <View style={recipeTagsStyles.tagsList}>
                            <HorizontalList propType={"Tag"} item={tagsProps.tagsList} icon={Icons.crossIcon}
                                            onPress={tagsProps.removeTag}/>
                        </View>
                        {newTags.length > 0 ?
                            <FlashList data={newTags} estimatedItemSize={100} nestedScrollEnabled={true}
                                       keyboardShouldPersistTaps={"handled"} renderItem={({item}) => (
                                <View key={item} style={recipeTagsStyles.containerSection}>
                                    <TextInputWithDropDown
                                        testID={"RecipeTags::AddOrEdit::List::" + item} absoluteDropDown={false}
                                        referenceTextArray={allTagsNamesSorted} onValidate={(newText: string) => {
                                        tagsProps.addNewTag(newText);
                                        setNewTags(newTags.filter(itemToFilter => itemToFilter !== item));
                                        setAllTagsNamesSorted(allTagsNamesSorted.filter(itemToFilter => itemToFilter !== newText));
                                    }}/>
                                </View>)}/> : null}

                        <RoundButton testID={tagsProps.testID} size={"medium"} icon={plusIcon}
                                     onPressFunction={() => {
                                         setNewTags([...newTags, tagsAddedCounter]);
                                         ++tagsAddedCounter;
                                     }}/>
                    </View>
                </View>
            }
        </View>
    )
}
