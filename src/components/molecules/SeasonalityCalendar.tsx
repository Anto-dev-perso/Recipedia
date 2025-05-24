import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Chip, Text, useTheme} from 'react-native-paper';
import {useI18n} from '@utils/i18n';
import {padding} from "@styles/spacing";

export type  SeasonalityCalendarProps = {
    testID: string,
    selectedMonths: string[];
    onMonthsChange?: (months: string[]) => void;
    readOnly?: boolean;
}

/**
 * A simple component for selecting and displaying which months an ingredient is available
 * Uses chips for a clean, material design approach
 */
export default function SeasonalityCalendar({
                                                testID, selectedMonths,
                                                onMonthsChange,
                                                readOnly = false
                                            }: SeasonalityCalendarProps) {
    const {t} = useI18n();
    const {colors} = useTheme();

    // All months data
    const allMonths = [
        {num: '1', name: t('month_1')},
        {num: '2', name: t('month_2')},
        {num: '3', name: t('month_3')},
        {num: '4', name: t('month_4')},
        {num: '5', name: t('month_5')},
        {num: '6', name: t('month_6')},
        {num: '7', name: t('month_7')},
        {num: '8', name: t('month_8')},
        {num: '9', name: t('month_9')},
        {num: '10', name: t('month_10')},
        {num: '11', name: t('month_11')},
        {num: '12', name: t('month_12')}
    ];
    const allYearReadOnly = readOnly && selectedMonths.length === 12;

    const allYearStyle: StyleProp<ViewStyle> = allYearReadOnly ? {flexDirection: 'row'} : {};
    const monthToDisplay = readOnly ? allMonths.filter(month => selectedMonths.includes(month.num)) : allMonths;

    // Toggle a month in the selection
    const toggleMonth = (month: string) => {
        if (readOnly) {
            return;
        }

        let newSelectedMonths: string[];

        if (selectedMonths.includes(month)) {
            // Remove month if already selected
            newSelectedMonths = selectedMonths.filter(m => m !== month);
        } else {
            // Add month if not selected
            newSelectedMonths = [...selectedMonths, month];
        }

        if (onMonthsChange) {
            onMonthsChange(newSelectedMonths);
        }
    };

    const calendarTestId = testID + "::SeasonalityCalendar";
    return (
        <View style={[{marginVertical: padding.small}, allYearStyle]}>
            {/* Display mode - show only selected months */}
            <Text testID={calendarTestId + "::SeasonalityText"}
                  style={{fontWeight: 'bold', marginRight: padding.small,}}>{t('seasonality')}:</Text>
            {allYearReadOnly ? <Text testID={calendarTestId + "::AllYear"}>{t('all_year')}</Text> :
                <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: padding.small,}}>
                    {monthToDisplay.map(month => (
                        <Chip key={month.num} testID={calendarTestId + `::${month.num}`}
                              style={[{margin: padding.verySmall,}, !readOnly && selectedMonths.includes(month.num) && {backgroundColor: colors.primaryContainer}]}
                              selected={selectedMonths.includes(month.num)} showSelectedCheck={false}
                              mode="outlined" onPress={() => toggleMonth(month.num)}
                              selectedColor={colors.primary}>{month.name}</Chip>
                    ))}
                </View>
            }

        </View>
    );
};
