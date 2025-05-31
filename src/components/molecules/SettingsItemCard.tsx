import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {padding} from '@styles/spacing';
import {useI18n} from '@utils/i18n';
import {ingredientTableElement, tagTableElement} from "@customTypes/DatabaseElementTypes";
import SeasonalityCalendar from "@components/molecules/SeasonalityCalendar";

// Type constraint for items that can be used in SettingsItemCard
export type SettingsItem = ingredientTableElement | tagTableElement;

// Generic props for SettingsItemCard
export type SettingsItemCardProps<T extends SettingsItem> = {
    type: 'ingredient' | 'tag',
    index: number,
    testIdPrefix: string,
    item: T,
    onEdit: (item: T) => void,
    onDelete: (item: T) => void,
};

/**
 * A reusable card component for displaying settings items
 * Generic component that can work with different item types
 */
export default function SettingsItemCard<T extends SettingsItem>({
                                                                     item,
                                                                     index,
                                                                     testIdPrefix,
                                                                     onEdit,
                                                                     onDelete,
                                                                     type
                                                                 }: SettingsItemCardProps<T>) {
    const {t} = useI18n();

    const itemCardTestId = testIdPrefix + `::${index}`;

    return (
        <Card style={{marginBottom: padding.medium}}>
            <Card.Content>
                {type === 'tag' && 'name' in item ?
                    <Text testID={itemCardTestId + `::TagName`} variant="titleLarge"
                          style={{fontWeight: 'bold'}}>
                        {item.name}
                    </Text>
                    :
                    type === 'ingredient' && 'unit' in item ? (
                        <View>
                            <Text testID={itemCardTestId + `::IngredientName`}
                                  variant={"titleLarge"} style={{fontWeight: 'bold', marginBottom: padding.small}}>
                                {item.name}
                            </Text>
                            <View style={styles.infoRow}>
                                <Text testID={itemCardTestId + "::IntroType"}
                                      style={styles.infoLabel}>{t('type')}:</Text>
                                <Text testID={itemCardTestId + "::Type"}>{t(item.type)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text testID={itemCardTestId + "::IntroUnit"}
                                      style={styles.infoLabel}>{t('unit')}:</Text>
                                <Text testID={itemCardTestId + "::Unit"}>{item.unit}</Text>
                            </View>
                            <SeasonalityCalendar testID={itemCardTestId} selectedMonths={item.season} readOnly={true}/>
                        </View>
                    ) : (
                        <Text testID={itemCardTestId + "::Unsupported"}>Unsupported item type:{type}</Text>
                    )}
            </Card.Content>
            <Card.Actions>
                <Button
                    testID={itemCardTestId + `::EditButton`}
                    onPress={() => onEdit(item)}
                >
                    {t('edit')}
                </Button>
                <Button
                    testID={itemCardTestId + `::DeleteButton`}
                    onPress={() => onDelete(item)}
                >
                    {t('delete')}
                </Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: padding.verySmall,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginRight: padding.small,
    },
});
