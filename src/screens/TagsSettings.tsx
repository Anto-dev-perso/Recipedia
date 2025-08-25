/**
 * TagsSettings - Recipe tag management and organization screen
 *
 * A dedicated screen for managing the app's tag system with full CRUD operations
 * and organizational capabilities. Features dialog-based editing, alphabetical
 * organization, and real-time synchronization with recipe data.
 *
 * Key Features:
 * - Complete tag CRUD operations (Create, Read, Update, Delete)
 * - Alphabetical sorting for organized navigation
 * - Dialog-based editing with validation
 * - Real-time database synchronization
 * - Usage tracking for deletion warnings
 * - Batch operations for tag management
 * - Comprehensive error handling and logging
 *
 * Tag Management:
 * - Create new tags for recipe categorization
 * - Edit existing tag names and properties
 * - Delete unused tags with safety checks
 * - View tag usage across recipes
 *
 * @example
 * ```typescript
 * // Navigation from Parameters screen
 * <List.Item
 *   title="Tags"
 *   onPress={() => navigation.navigate('TagsSettings')}
 * />
 * ```
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import RecipeDatabase from '@utils/RecipeDatabase';
import { tagTableElement } from '@customTypes/DatabaseElementTypes';
import SettingsItemList from '@components/organisms/SettingsItemList';
import ItemDialog, { DialogMode } from '@components/dialogs/ItemDialog';
import { tagsSettingsLogger } from '@utils/logger';

/**
 * TagsSettings screen component - Recipe tag management
 *
 * @returns JSX element representing the tag management interface
 */
export function TagsSettings() {
  const database = RecipeDatabase.getInstance();

  // State for managing tags
  const [tags, setTags] = useState(
    [...database.get_tags()].sort((a, b) => a.name.localeCompare(b.name))
  );
  // TODO database could return a sorted array directly

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [currentTag, setCurrentTag] = useState<tagTableElement>({ name: '' });

  const testId = 'TagsSettings';

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
      tagsSettingsLogger.warn('Failed to update tag in database', {
        tagName: newTag.name,
        tagId: newTag.id,
      });
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
    setCurrentTag({ name: '' });
    setDialogMode('add');
    setDialogVisible(true);
  };

  const openEditDialog = (tag: tagTableElement) => {
    setCurrentTag(tag);
    setDialogMode('edit');
    setDialogVisible(true);
  };

  const openDeleteDialog = (tag: tagTableElement) => {
    setCurrentTag(tag);
    setDialogMode('delete');
    setDialogVisible(true);
  };

  // Close dialog handler
  const closeDialog = () => {
    setDialogVisible(false);
  };

  // Dialog action handlers
  const handleDialogConfirm = async (mode: DialogMode, newTag: tagTableElement) => {
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
    closeDialog();
  };

  // TODO add a counter of how many recipes use this element before deleting it
  return (
    <View>
      <SettingsItemList
        items={tags}
        testIdPrefix={testId}
        onAddPress={openAddDialog}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        type='tag'
      />

      {/* ItemDialog for add/edit/delete operations */}
      <ItemDialog
        testId={testId + '::ItemDialog'}
        isVisible={dialogVisible}
        mode={dialogMode}
        onClose={closeDialog}
        item={{
          type: 'Tag',
          value: currentTag,
          onConfirmTag: handleDialogConfirm,
        }}
      />
    </View>
  );
}

export default TagsSettings;
