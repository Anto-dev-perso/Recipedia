import React, {useState} from 'react';
import {View} from 'react-native';
import {TagsSettingsProp} from "@customTypes/ScreenTypes";
import RecipeDatabase from "@utils/RecipeDatabase";
import {tagTableElement} from "@customTypes/DatabaseElementTypes";
import SettingsItemList from "@components/organisms/SettingsItemList";
import TagDialog, {TagDialogData, TagDialogMode} from "@components/dialogs/TagDialog";

export default function TagsSettings({}: TagsSettingsProp) {
    const database = RecipeDatabase.getInstance();

    // State for managing tags
    const [tags, setTags] = useState([...database.get_tags()].sort((a, b) => a.name.localeCompare(b.name)));
    // TODO database could return a sorted array directly

    const [tagDialogData, setTagDialogData] = useState<TagDialogData>({
        isOpen: false,
        tag: {name: ""},
        mode: 'add',
    });

    const testId = "TagsSettings";

    const handleEditTag = async (newTag: tagTableElement) => {
        const success = await database.editTag(newTag);
        if (success) {
            const idx = tags.findIndex(t => t.id === newTag.id);
            if (idx !== -1) {
                const updatedTags = [...tags];
                updatedTags[idx] = newTag;
                setTags(updatedTags);
            }
        } else {
            console.warn('Failed to update tag in database');
        }
    };


    const handleDeleteTag = async (tag: tagTableElement) => {
        if (await database.deleteTag(tag)) {
            setTags(tags.filter(t => t.id !== tag.id));
        }
    };

    const handleAddtag = async (newTag: tagTableElement) => {
        // TODO database could return this
        newTag.id = Math.max(0, ...tags.map(t => t.id ?? 0)) + 1;
        setTags([...tags, newTag]);
        await database.addTag(newTag);
    };


    // Open dialog handlers
    const openAddDialog = () => {
        setTagDialogData({
            isOpen: true,
            tag: {name: ""},
            mode: 'add',
        });
    };

    const openEditDialog = (tag: tagTableElement) => {
        setTagDialogData({
            isOpen: true,
            tag: tag,
            mode: 'edit',
        });
    };

    const openDeleteDialog = (tag: tagTableElement) => {
        setTagDialogData({
            isOpen: true,
            tag: tag,
            mode: 'delete',
        });
    };

    // Close dialog handler
    const closeDialog = () => {
        setTagDialogData(prev => ({...prev, isOpen: false}));
    };

    // Dialog action handlers
    const handleDialogConfirm = async (mode: TagDialogMode, newTag: tagTableElement) => {
        switch (mode) {
            case 'add':
                await handleAddtag(newTag);
                break;
            case 'edit':
                await handleEditTag(newTag);
                break;
            case 'delete':
                await handleDeleteTag(newTag);
                break;
        }
        setTagDialogData(prev => ({...prev, isOpen: false}));
    };

    // TODO add a counter of how many recipes use this element before deleting it
    return (
        <View>
            <SettingsItemList items={tags} testIdPrefix={testId} onAddPress={openAddDialog}
                              onEdit={openEditDialog} onDelete={openDeleteDialog} type="tag"/>

            {/* TagDialog for add/edit/delete operations */}
            <TagDialog data={tagDialogData} onClose={closeDialog} testId={testId}
                       onConfirmTag={handleDialogConfirm}/>

        </View>
    );
}
