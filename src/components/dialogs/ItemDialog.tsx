import React, {useEffect, useState} from 'react';
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
    type: 'Ingredient',
    value: ingredientTableElement,
    onConfirmIngredient: (mode: DialogMode, newItem: ingredientTableElement) => void,
};

export type ItemTagType = {
    type: 'Tag',
    value: tagTableElement,
    onConfirmTag: (mode: DialogMode, newItem: tagTableElement) => void,
};

export type ItemDialogProps =
    {
        testId: string,
        isVisible: boolean,
        mode: DialogMode,
        onClose: () => void,
        item: ItemIngredientType | ItemTagType,
    };

/**
 * A unified dialog component that can be used for adding, editing, or deleting items
 */
export default function ItemDialog({onClose, isVisible, testId, mode, item}: ItemDialogProps) {
    const {t} = useI18n();

    const [typeMenuVisible, setTypeMenuVisible] = useState(false);

    const [itemName, setItemName] = useState(item.value.name);

    useEffect(() => {
        if (isVisible) {
            setItemName(item.value.name);
        }
    }, [item.value.name, isVisible]);

    const [ingType, setIngType] = useState<ingredientType>(item.type === 'Ingredient' ? item.value.type : ingredientType.undefined);
    const [ingUnit, setIngUnit] = useState(item.type === 'Ingredient' ? item.value.unit : '');
    const [ingSeason, setIngSeason] = useState(item.type === 'Ingredient' ? item.value.season : []);

    const handleDismiss = () => {
        onClose();
    };

    const handleConfirm = () => {
        callOnConfirmWithNewItem();
        onClose();
    };

    const callOnConfirmWithNewItem = () => {
        switch (item.type) {
            case 'Ingredient':
                item.onConfirmIngredient(mode, {
                    id: item.value.id,
                    name: itemName,
                    type: ingType,
                    unit: ingUnit,
                    season: ingSeason
                });
                break;
            case 'Tag':
                item.onConfirmTag(mode, {id: item.value.id, name: itemName});
                break;
            default:
                console.warn("Unreachable code.");
        }
    };


    // Get dialog properties based on the current mode
    const dialogTitle = (() => {
        switch (mode) {
            case 'add':
                return item.type === 'Ingredient' ? t('add_ingredient') : t('add_tag');
            case 'edit':
                return item.type === 'Ingredient' ? t('edit_ingredient') : t('edit_tag');
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
            <Dialog visible={isVisible} onDismiss={handleDismiss}>
                <Dialog.Title testID={modalTestId + "::Title"}>{dialogTitle}</Dialog.Title>
                <Dialog.Content>
                    {mode === 'delete' ?
                        <Text testID={modalTestId + "::Text"}
                              variant="bodyMedium">{t('confirmDelete')}{` ${itemName}${t('interrogationMark')}`}</Text>
                        :
                        <View>
                            <CustomTextInput
                                label={item.type === 'Ingredient' ? t('ingredient_name') : t('tag_name')}
                                value={itemName}
                                onChangeText={setItemName}
                                testID={modalTestId + "::Name"}
                            />
                            {item.type === 'Ingredient' ?
                                <View>
                                    <View style={styles.inputRow}>
                                        <Text testID={modalTestId + "::Type"} variant="bodyMedium"
                                              style={styles.inputLabel}>{t('type')}:</Text>
                                        <Menu
                                            testID={modalTestId + "::Menu"}
                                            visible={typeMenuVisible}
                                            onDismiss={() => setTypeMenuVisible(false)}
                                            anchor={<Button testID={modalTestId + "::Menu::Button"}
                                                            onPress={() => setTypeMenuVisible(true)}>{t(ingType)}</Button>}>
                                            <FlatList data={shoppingCategories} renderItem={({item, index}) => (
                                                <Menu.Item key={index} title={t(item)} onPress={() => {
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
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between"
                    }}>
                        <Button testID={modalTestId + "::CancelButton"} mode={"outlined"}
                                onPress={handleDismiss}>{t('cancel')}</Button>
                        <Button testID={modalTestId + "::ConfirmButton"} mode={"contained"}
                                onPress={handleConfirm}
                                disabled={!itemName.trim()}>{confirmButtonText}</Button>
                    </View>
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
