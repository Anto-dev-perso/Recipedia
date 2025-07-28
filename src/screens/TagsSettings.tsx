import React, {useState} from 'react';
import {View} from 'react-native';
import {TagsSettingsProp} from "@customTypes/ScreenTypes";
import RecipeDatabase from "@utils/RecipeDatabase";
import {tagTableElement} from "@customTypes/DatabaseElementTypes";
import SettingsItemList from "@components/organisms/SettingsItemList";
import ItemDialog, {DialogMode} from "@components/dialogs/ItemDialog";

export default function TagsSettings({}: TagsSettingsProp) {
    const database = RecipeDatabase.getInstance();

    // State for managing tags
    const [tags, setTags] = useState([...database.get_tags()].sort((a, b) => a.name.localeCompare(b.name)));
    // TODO database could return a sorted array directly

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedTag, setSelectedTag] = useState<tagTableElement>(tags[0]);

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
        setDialogMode('add');
        setIsDialogOpen(true);
    };

    const openEditDialog = (tag: tagTableElement) => {
        setSelectedTag(tag);
        setDialogMode('edit');
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (tag: tagTableElement) => {
        setSelectedTag(tag);
        setDialogMode('delete');
        setIsDialogOpen(true);
    };

    // Close dialog handler
    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    // Dialog action handlers
    const handleDialogConfirm = async (mode: DialogMode, newTag: tagTableElement) => {
        switch (mode) {
            case 'add':
                await handleAddtag(newTag);
                break;
            case 'edit':
                if (selectedTag) {
                    handleEditTag(newTag);
                }
                break;
            case 'delete':
                if (selectedTag) {
                    await handleDeleteTag(newTag);
                }
                break;
        }
    };

    // TODO add a counter of how many recipes use this element before deleting it
    return (
        <View>
            <SettingsItemList items={tags} testIdPrefix={testId} onAddPress={openAddDialog}
                              onEdit={openEditDialog} onDelete={openDeleteDialog} type="tag"/>

            {/* Dialog for add/edit/delete operations */}
            <ItemDialog isVisible={isDialogOpen} onClose={closeDialog} testId={testId} mode={dialogMode}
                        item={{type: "tag", value: selectedTag, onConfirmTag: handleDialogConfirm}}/>

        </View>
    );
}
