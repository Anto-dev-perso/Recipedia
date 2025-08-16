import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import {ingredientTableElement, ingredientType, tagTableElement} from '@customTypes/DatabaseElementTypes';
import ItemDialog, {DialogMode} from './ItemDialog';
import RecipeDatabase from '@utils/RecipeDatabase';

export type SimilarityTagType = {
    type: 'Tag';
    newItemName: string;
    similarItem?: tagTableElement;
    onConfirm: (tag: tagTableElement) => void;
    onUseExisting?: (tag: tagTableElement) => void;
    onDismiss?: () => void;
};

export type SimilarityIngredientType = {
    type: 'Ingredient';
    newItemName: string;
    similarItem?: ingredientTableElement;
    onConfirm: (ingredient: ingredientTableElement) => void;
    onUseExisting?: (ingredient: ingredientTableElement) => void;
    onDismiss?: () => void;
};

export type SimilarityDialogProps = {
    testId: string;
    isVisible: boolean;
    onClose: () => void;
    item: SimilarityTagType | SimilarityIngredientType;
};

export default function SimilarityDialog({
                                             testId,
                                             isVisible,
                                             onClose,
                                             item
                                         }: SimilarityDialogProps) {
    const {t} = useI18n();
    const [showItemDialog, setShowItemDialog] = useState(false);

    const handleAddNew = () => {
        setShowItemDialog(true);
    };

    const handleUseExisting = () => {
        if (item.similarItem && item.onUseExisting) {
            if (item.type === 'Ingredient') {
                item.onUseExisting(item.similarItem as ingredientTableElement);
            } else {
                item.onUseExisting(item.similarItem as tagTableElement);
            }
        }
        onClose();
    };

    const handleDismiss = () => {
        if (item.onDismiss) {
            item.onDismiss();
        }
        onClose();
    };

    const handleItemDialogConfirm = async (mode: DialogMode, newItem: ingredientTableElement | tagTableElement) => {
        if (mode === 'add') {
            if (item.type === 'Ingredient') {
                await RecipeDatabase.getInstance().addIngredient(newItem as ingredientTableElement);
                item.onConfirm(newItem as ingredientTableElement);
            } else {
                await RecipeDatabase.getInstance().addTag(newItem as tagTableElement);
                item.onConfirm(newItem as tagTableElement);
            }
        }
        setShowItemDialog(false);
        onClose();
    };

    const modalTestId = `${testId}::SimilarityDialog`;
    const ingredientsTranslationPrefix = "alerts.ingredientSimilarity.";
    const tagsTranslationPrefix = "alerts.tagSimilarity.";

    const title = item.similarItem
        ? (item.type === 'Ingredient'
            ? t(ingredientsTranslationPrefix + 'similarIngredientFound')
            : t(tagsTranslationPrefix + 'similarTagFound'))
        : (item.type === 'Ingredient'
            ? t(ingredientsTranslationPrefix + 'newIngredientTitle')
            : t(tagsTranslationPrefix + 'newTagTitle'));

    const content = item.similarItem
        ? (item.type === 'Ingredient'
            ? t(ingredientsTranslationPrefix + 'similarIngredientFoundContent', {existingIngredient: item.similarItem.name})
            : t(tagsTranslationPrefix + 'similarTagFoundContent', {existingTag: item.similarItem.name}))
        : (item.type === 'Ingredient'
            ? t(ingredientsTranslationPrefix + 'newIngredientContent', {ingredientName: item.newItemName})
            : t(tagsTranslationPrefix + 'newTagContent', {tagName: item.newItemName}));

    return (
        <Portal>
            <Dialog visible={isVisible} onDismiss={handleDismiss}>
                <Dialog.Title testID={`${modalTestId}::Title`}>
                    {title}
                </Dialog.Title>
                <Dialog.Content>
                    <Text testID={`${modalTestId}::Content`} variant="bodyMedium">
                        {content}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    {item.similarItem ? (
                        <View style={styles.actionButton}>
                            <Button
                                testID={`${modalTestId}::AddButton`}
                                mode="outlined"
                                onPress={handleAddNew}>
                                {item.type === 'Ingredient'
                                    ? t(ingredientsTranslationPrefix + 'add')
                                    : t(tagsTranslationPrefix + 'add')}
                            </Button>
                            <Button
                                testID={`${modalTestId}::UseButton`}
                                mode="contained"
                                onPress={handleUseExisting}>
                                {item.type === 'Ingredient'
                                    ? t(ingredientsTranslationPrefix + 'use')
                                    : t(tagsTranslationPrefix + 'use')}
                            </Button>
                        </View>
                    ) : (
                        <View style={styles.actionButton}>
                            <Button
                                testID={`${modalTestId}::CancelButton`}
                                mode="outlined"
                                onPress={handleDismiss}>
                                {item.type === 'Ingredient'
                                    ? t(ingredientsTranslationPrefix + 'cancel')
                                    : t('cancel')}
                            </Button>
                            <Button
                                testID={`${modalTestId}::AddButton`}
                                mode="contained"
                                onPress={handleAddNew}>
                                {item.type === 'Ingredient'
                                    ? t(ingredientsTranslationPrefix + 'add')
                                    : t(tagsTranslationPrefix + 'add')}
                            </Button>
                        </View>
                    )}
                </Dialog.Actions>
            </Dialog>

            {/* ItemDialog for creating new items */}
            {showItemDialog && (
                <ItemDialog
                    testId={`${testId}::ItemDialog`}
                    isVisible={showItemDialog}
                    mode="add"
                    onClose={() => setShowItemDialog(false)}
                    item={item.type === 'Ingredient' ? {
                        type: item.type,
                        value: {
                            id: -1,
                            name: item.newItemName,
                            type: ingredientType.undefined,
                            unit: '',
                            season: []
                        },
                        onConfirmIngredient: (mode: DialogMode, newItem: ingredientTableElement) =>
                            handleItemDialogConfirm(mode, newItem)
                    } : {
                        type: item.type,
                        value: {
                            id: -1,
                            name: item.newItemName
                        },
                        onConfirmTag: (mode: DialogMode, newItem: tagTableElement) =>
                            handleItemDialogConfirm(mode, newItem)
                    }}
                />
            )}
        </Portal>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    }
});
