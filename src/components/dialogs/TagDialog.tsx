import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import CustomTextInput from '@components/atomic/CustomTextInput';
import {tagTableElement} from '@customTypes/DatabaseElementTypes';

export type TagDialogMode = 'add' | 'edit' | 'delete' | 'validate';

export type TagDialogData = {
    isOpen: boolean,
    tag: tagTableElement,
    mode: TagDialogMode,
    similarTag?: tagTableElement
};

export type TagDialogProps = {
    testId: string,
    data: TagDialogData,
    onClose: () => void,
    onConfirmTag: (mode: TagDialogMode, newTag: tagTableElement) => void,
    onUseExistingTag?: (tag: tagTableElement) => void,
};

export default function TagDialog({
                                      onClose,
                                      testId,
                                      data,
                                      onConfirmTag,
                                      onUseExistingTag
                                  }: TagDialogProps) {
    const {t} = useI18n();

    const [tagName, setTagName] = useState(data.tag.name);
    const {isOpen: isVisible, mode, tag, similarTag} = data;

    useEffect(() => {
        if (isVisible) {
            setTagName(data.tag.name);
        }
    }, [data.tag.name, isVisible]);

    const handleDismiss = () => {
        onClose();
    };

    const handleConfirm = () => {
        const newTag: tagTableElement = {
            id: tag.id,
            name: tagName.trim()
        };
        onConfirmTag(mode, newTag);
        onClose();
    };

    const handleUseExisting = () => {
        if (similarTag && onUseExistingTag) {
            onUseExistingTag(similarTag);
        }
        onClose();
    };

    const dialogTitle = (() => {
        switch (mode) {
            case 'add':
                return t('add_tag');
            case 'edit':
                return t('edit_tag');
            case 'delete':
                return t('delete');
            case 'validate':
                return similarTag
                    ? t('alerts.tagSimilarity.similarTagFound')
                    : t('alerts.tagSimilarity.newTagTitle');
            default:
                return '';
        }
    })();

    const confirmButtonText = (() => {
        switch (mode) {
            case 'add':
                return t('add');
            case 'edit':
                return t('save');
            case 'delete':
                return t('delete');
            case 'validate':
                return t('alerts.tagSimilarity.add');
            default:
                return '';
        }
    })();

    const modalTestId = (() => {
        switch (mode) {
            case 'add':
                return testId + "::AddModal";
            case 'edit':
                return testId + "::EditModal";
            case 'delete':
                return testId + "::DeleteModal";
            case 'validate':
                return testId + "::ValidateModal";
            default:
                return '';
        }
    })();

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={handleDismiss}>
                <Dialog.Title testID={modalTestId + "::Title"}>{dialogTitle}</Dialog.Title>
                <Dialog.Content>
                    {mode === 'delete' ?
                        <Text testID={modalTestId + "::Text"}
                              variant="bodyMedium">{t('confirmDelete')}{` ${tagName}${t('interrogationMark')}`}</Text>
                        :
                        <View>
                            {mode === 'validate' && (
                                <Text testID={modalTestId + "::ValidationText"} variant="bodyMedium"
                                      style={{marginBottom: 16}}>
                                    {similarTag
                                        ? t('alerts.tagSimilarity.similarTagFoundContent', {existingTag: similarTag.name})
                                        : t('alerts.tagSimilarity.newTagContent', {tagName: data.tag.name})
                                    }
                                </Text>
                            )}
                            <CustomTextInput
                                label={t('tag_name')}
                                value={tagName}
                                onChangeText={setTagName}
                                testID={modalTestId + "::Name"}
                            />
                        </View>
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    {mode === 'validate' && similarTag ? (
                        // Similar tag found - show Add and Use buttons
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Button testID={modalTestId + "::ConfirmButton"} mode="outlined"
                                    onPress={handleConfirm}
                                    disabled={!tagName.trim()}>{confirmButtonText}</Button>
                            <Button testID={modalTestId + "::UseExistingButton"} mode="contained"
                                    onPress={handleUseExisting}>{t('alerts.tagSimilarity.use')}</Button>
                        </View>
                    ) : (
                        // Standard layout for all other modes
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between"
                        }}>
                            <Button testID={modalTestId + "::CancelButton"} mode="outlined"
                                    onPress={handleDismiss}>{t('cancel')}</Button>
                            <Button testID={modalTestId + "::ConfirmButton"} mode="contained"
                                    onPress={handleConfirm}
                                    disabled={mode === 'validate' && !tagName.trim()}>{confirmButtonText}</Button>
                        </View>
                    )}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
