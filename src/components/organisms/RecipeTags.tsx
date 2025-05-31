import {View} from "react-native"
import React, {useState} from "react";
import RoundButton from "@components/atomic/RoundButton";
import {Icons} from "@assets/Icons";
import HorizontalList from "@components/molecules/HorizontalList";
import TextInputWithDropDown from "@components/molecules/TextInputWithDropDown";
import RecipeDatabase from "@utils/RecipeDatabase";
import {FlashList} from "@shopify/flash-list";
import {recipeTagsStyles} from "@styles/recipeComponents";
import {Text, useTheme} from "react-native-paper";
import {useI18n} from "@utils/i18n";

export type RecipeTagsEditProps = { editType: "edit" }
export type RecipeTagsAddProps = { editType: "add", openModal: () => void }

export type RecipeTagsAddOrEditProps =
    {
        type: 'addOrEdit',
        randomTags: string,
        addNewTag: (newTag: string) => void,
        removeTag: (tag: string) => void
    } & (RecipeTagsEditProps | RecipeTagsAddProps);

export type RecipeTagsReadOnlyProps = { type: 'readOnly' };

export type RecipeTagProps =
    { tagsList: Array<string> } & (RecipeTagsReadOnlyProps | RecipeTagsAddOrEditProps);


let tagsAddedCounter = 0;
export default function RecipeTags
(tagsProps: RecipeTagProps) {

    const [newTags, setNewTags] = useState(new Array<number>());
    const [allTagsNamesSorted, setAllTagsNamesSorted] = useState(RecipeDatabase.getInstance().get_tags().map(tag => tag.name).filter(dbTag => !tagsProps.tagsList.includes(dbTag)).sort());

    const {t} = useI18n();
    const {colors} = useTheme();
    const tagsTestID = "RecipeTags";

    return (
        <View style={recipeTagsStyles.containerSection}>
            {tagsProps.type === 'readOnly' ?
                <HorizontalList testID={tagsTestID} propType={"Tag"} item={tagsProps.tagsList}/>
                :
                <View>
                    <Text testID={tagsTestID + "::HeaderText"} variant={"headlineSmall"}
                          style={recipeTagsStyles.containerElement}>{t('tags')}:</Text>
                    <Text testID={tagsTestID + "::ElementText"} variant={"labelMedium"}
                          style={[recipeTagsStyles.containerElement, {color: colors.outline}]}>{t('tagExplanation')}{tagsProps.randomTags}</Text>

                    <View style={recipeTagsStyles.tagsContainer}>
                        <View style={recipeTagsStyles.tab}>
                            <HorizontalList testID={"RecipeTags"} propType={"Tag"} item={tagsProps.tagsList}
                                            icon={Icons.crossIcon}
                                            onPress={tagsProps.removeTag}/>
                        </View>
                        {newTags.length > 0 ?
                            <FlashList data={newTags} estimatedItemSize={100} nestedScrollEnabled={true}
                                       keyboardShouldPersistTaps={"handled"} renderItem={({item}) => (
                                <View key={item}>
                                    <TextInputWithDropDown
                                        style={recipeTagsStyles.containerSection}
                                        testID={tagsTestID + "::List::" + item} absoluteDropDown={false}
                                        referenceTextArray={allTagsNamesSorted} onValidate={(newText: string) => {
                                        tagsProps.addNewTag(newText);
                                        setNewTags(newTags.filter(itemToFilter => itemToFilter !== item));
                                        setAllTagsNamesSorted(allTagsNamesSorted.filter(itemToFilter => itemToFilter !== newText));
                                    }}/>
                                </View>)}/> : null}

                        <View style={recipeTagsStyles.roundButtonsContainer}>
                            {tagsProps.editType === "add" ?
                                <View style={recipeTagsStyles.roundButton}>
                                    <RoundButton testID={tagsTestID + "::OpenModal"} size={"medium"}
                                                 icon={Icons.scanImageIcon}
                                                 onPressFunction={tagsProps.openModal}/>
                                </View>
                                : null}
                            <View style={recipeTagsStyles.roundButton}>
                                <RoundButton testID={tagsTestID} size={"medium"} icon={Icons.plusIcon}
                                             onPressFunction={() => {
                                                 setNewTags([...newTags, tagsAddedCounter]);
                                                 ++tagsAddedCounter;
                                             }}/>
                            </View>

                        </View>
                    </View>
                </View>
            }
        </View>
    )
}
