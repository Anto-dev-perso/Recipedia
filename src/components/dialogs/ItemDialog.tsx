import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Dialog, Menu, Portal, Text} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import CustomTextInput from '@components/atomic/CustomTextInput';
import {ingredientTableElement, ingredientType, tagTableElement} from '@customTypes/DatabaseElementTypes';
import {shoppingCategories} from '@customTypes/RecipeFiltersTypes';
import {padding} from '@styles/spacing';
import SeasonalityCalendar from "@components/molecules/SeasonalityCalendar";

export type DialogMode = 'add' | 'edit' | 'delete';
export type ItemIngredientType = {
    type: 'ingredient',
    value: ingredientTableElement,
    onConfirmIngredient: (mode: DialogMode, newItem: ingredientTableElement) => void,
};
export type ItemTagType = {
    type: 'tag',
    value: tagTableElement,
    onConfirmTag: (mode: DialogMode, newItem: tagTableElement) => void,
};

export type ItemDialogProps =
    {
        testId: string,
        mode: DialogMode,
        onClose: () => void,
        item: ItemIngredientType | ItemTagType,
    };

/**
 * A unified dialog component that can be used for adding, editing, or deleting items
 */
export default function ItemDialog({onClose, testId, mode, item}: ItemDialogProps) {
    const [visible, setVisible] = useState(true);
    const [typeMenuVisible, setTypeMenuVisible] = useState(false);

    const [itemName, setItemName] = useState(item.type === 'ingredient' ? item.value.ingName : item.value.tagName);

    const [ingType, setIngType] = useState<ingredientType>(item.type === 'ingredient' ? item.value.type : ingredientType.undefined);
    const [ingUnit, setIngUnit] = useState(item.type === 'ingredient' ? item.value.unit : '');
    const [ingSeason, setIngSeason] = useState(item.type === 'ingredient' ? item.value.season : []);

    // Handle dialog dismissal
    const handleDismiss = () => {
        setVisible(false);
        onClose();
    };

    // Handle confirmation action
    const handleConfirm = () => {
        setVisible(false);
        callOnConfirmWithNewItem();
    };

    const callOnConfirmWithNewItem = () => {
        switch (item.type) {
            case 'ingredient':
                item.onConfirmIngredient(mode, {
                    id: item.value.id,
                    ingName: itemName,
                    type: ingType,
                    unit: ingUnit,
                    season: ingSeason
                });
                break;
            case 'tag':
                item.onConfirmTag(mode, {id: item.value.id, tagName: itemName} as tagTableElement);
                break;
            default:
                console.warn("Unreachable code.");
        }
    };

    const {t} = useI18n();


    // Get dialog properties based on the current mode
    const dialogTitle = (() => {
        switch (mode) {
            case 'add':
                return item.type === 'ingredient' ? t('add_ingredient') : t('add_tag');
            case 'edit':
                return item.type === 'ingredient' ? t('edit_ingredient') : t('edit_tag');
            case 'delete':
                return t('delete');
            default:
                console.warn("Unreachable code.");
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
            default:
                console.warn("Unreachable code.");
                return "";
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
            default:
                console.warn("Unreachable code.");
                return '';
        }
    })();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleDismiss}>
                <Dialog.Title testID={modalTestId + "::Title"}>{dialogTitle}</Dialog.Title>
                <Dialog.Content>
                    {mode === 'delete' ?
                        <Text testID={modalTestId + "::Text"}
                              variant="bodyMedium">{t('confirmDelete')}{` ${itemName}${t('interrogationMark')}`}</Text>
                        :
                        <View>
                            <CustomTextInput
                                label={t('tag_name')}
                                value={itemName}
                                onChangeText={setItemName}
                                testID={modalTestId + "::Name"}
                            />
                            {item.type === 'ingredient' ?
                                <View>
                                    <View style={styles.inputRow}>
                                        <Text testID={modalTestId + "::Type"} variant="bodyMedium"
                                              style={styles.inputLabel}>{t('type')}:</Text>
                                        <Menu
                                            testID={modalTestId + "::Menu"}
                                            visible={typeMenuVisible}
                                            onDismiss={() => setTypeMenuVisible(false)}
                                            anchor={<Button testID={modalTestId + "::Menu::Button"}
                                                            onPress={() => setTypeMenuVisible(true)}>{t(item.type)}</Button>}>
                                            <FlatList data={shoppingCategories} renderItem={({item, index}) => (
                                                <Menu.Item key={index} title={t(ingType)} onPress={() => {
                                                    setIngType(item);
                                                    setTypeMenuVisible(false);
                                                }}/>)}/>
                                        </Menu>
                                    </View>

                                    <CustomTextInput testID={modalTestId + "::Unit"} label={t('unit')} value={ingUnit}
                                                     onChangeText={setIngUnit}/>

                                    <SeasonalityCalendar testID={modalTestId} selectedMonths={ingSeason}
                                                         onMonthsChange={setIngSeason}/>
                                </View>
                                : null}
                        </View>
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button testID={modalTestId + "::CancelButton"} onPress={handleDismiss}>{t('cancel')}</Button>
                    <Button testID={modalTestId + "::ConfirmButton"}
                            onPress={handleConfirm}>{confirmButtonText}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: padding.small,
    },
    inputLabel: {
        marginRight: padding.small,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: padding.small,
    }
});
