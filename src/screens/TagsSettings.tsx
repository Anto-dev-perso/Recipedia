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
    const [tags, setTags] = useState(database.get_tags().sort((a, b) => a.tagName.localeCompare(b.tagName)));

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'delete'>('add');
    const [selectedTag, setSelectedTag] = useState<tagTableElement>(tags[0]);

    const testId = "TagsSettings";

    const handleEditItem = (newTag: tagTableElement) => {
        setTags(tags.map(t =>
            t.id === newTag.id
                ? {...t, tagName: newTag.tagName.trim()}
                : t
        ));
        // TODO edit the database
    };

    const handleDeleteItem = (tag: tagTableElement) => {
        setTags(tags.filter(t => t.id !== tag.id));
        // TODO delete from database
    };

    const handleAddItem = async (newTag: tagTableElement) => {
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
                await handleAddItem(newTag);
                break;
            case 'edit':
                if (selectedTag) {
                    handleEditItem(newTag);
                }
                break;
            case 'delete':
                if (selectedTag) {
                    handleDeleteItem(newTag);
                }
                break;
        }
    };

    return (
        <View>
            <SettingsItemList items={tags} testIdPrefix={testId} onAddPress={openAddDialog}
                              onEdit={openEditDialog} onDelete={openDeleteDialog} type="tag"/>

            {/* Dialog for add/edit/delete operations */}
            {isDialogOpen ?
                <ItemDialog onClose={closeDialog} testId={testId} mode={dialogMode}
                            item={{type: "tag", value: selectedTag, onConfirmTag: handleDialogConfirm}}/>
                : null}
        </View>
    );
}
