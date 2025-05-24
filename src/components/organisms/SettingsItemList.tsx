import React from 'react';
import {FlatList, View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import {Icons} from '@assets/Icons';
import {padding} from '@styles/spacing';
import {BottomScreenTitle} from '@styles/typography';
import SettingsItemCard, {SettingsItem, SettingsItemCardProps} from '../molecules/SettingsItemCard';
import {useI18n} from "@utils/i18n";


export type SettingsItemListProps<T extends SettingsItem> = Omit<SettingsItemCardProps<T>, 'index' | 'item'> & {
    items: Array<T>,
    onAddPress: () => void,
};

/**
 * A reusable component for displaying a list of settings items
 * Generic component that can work with different item types
 */
export default function SettingsItemList<T extends SettingsItem>({
                                                                     testIdPrefix,
                                                                     onEdit,
                                                                     onDelete,
                                                                     type,
                                                                     items,
                                                                     onAddPress,
                                                                 }: SettingsItemListProps<T>) {
    const {t} = useI18n();
    const {colors} = useTheme();

    const title = (type === 'ingredient' ? t('ingredients') : t('tags'));

    const addButtonLabel = type === 'ingredient' ? t('add_ingredient') : t('add_tag');

    return (
        <View style={{height: '100%', backgroundColor: colors.background}}>
            <Text testID={testIdPrefix + "::Title"} variant={BottomScreenTitle}
                  style={{padding: padding.small}}>{title}</Text>

            <FlatList
                data={items}
                contentContainerStyle={{padding: padding.small}}
                renderItem={({item, index}) => (
                    <SettingsItemCard key={index} item={item} index={index} testIdPrefix={testIdPrefix} type={type}
                                      onEdit={onEdit} onDelete={onDelete}/>
                )}
                ListFooterComponent={<Button testID={testIdPrefix + "::AddButton"} mode="contained"
                                             style={{marginTop: padding.medium}}
                                             icon={Icons.plusIcon} onPress={onAddPress}>
                    {addButtonLabel}</Button>}
            />
        </View>
    );
}
