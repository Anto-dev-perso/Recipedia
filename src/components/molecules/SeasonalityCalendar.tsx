/**
 * SeasonalityCalendar - Interactive month selection component for ingredient seasonality
 *
 * A versatile calendar component that allows users to select and display which months
 * an ingredient is available or in season. Features both interactive selection mode
 * and read-only display mode with intelligent layout optimization.
 *
 * Key Features:
 * - Interactive month selection with chip-based UI
 * - Read-only display mode for viewing existing seasonality data
 * - Internationalization support for month names
 * - Smart layout: compact for all-year ingredients, expanded for specific months
 * - Material Design chip styling with theme integration
 * - Accessibility support with comprehensive test IDs
 *
 * @example
 * ```typescript
 * // Interactive mode for editing ingredient seasonality
 * <SeasonalityCalendar
 *   testID="tomato-seasonality"
 *   selectedMonths={['6', '7', '8', '9']}
 *   onMonthsChange={(months) => updateIngredientSeasonality(months)}
 * />
 *
 * // Read-only mode for displaying existing data
 * <SeasonalityCalendar
 *   testID="apple-seasonality"
 *   selectedMonths={['9', '10', '11']}
 *   readOnly={true}
 * />
 *
 * // All-year ingredient (displays compact format)
 * <SeasonalityCalendar
 *   testID="rice-seasonality"
 *   selectedMonths={['1','2','3','4','5','6','7','8','9','10','11','12']}
 *   readOnly={true}
 * />
 * ```
 */

import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import { padding } from '@styles/spacing';

/**
 * Props for the SeasonalityCalendar component
 */
export type SeasonalityCalendarProps = {
  /** Unique identifier for testing and accessibility */
  testID: string;
  /** Array of month numbers ('1' to '12') that are selected */
  selectedMonths: string[];
  /** Callback fired when month selection changes (omit for read-only mode) */
  onMonthsChange?: (months: string[]) => void;
  /** Whether the calendar should be read-only (default: false) */
  readOnly?: boolean;
};
/**
 * SeasonalityCalendar component for ingredient month selection
 *
 * @param props - The component props
 * @returns JSX element representing an interactive or read-only month selection calendar
 */
export default function SeasonalityCalendar({
  testID,
  selectedMonths,
  onMonthsChange,
  readOnly = false,
}: SeasonalityCalendarProps) {
  const { t } = useI18n();
  const { colors } = useTheme();

  // All months data
  const allMonths = [
    { num: '1', name: t('month_1') },
    { num: '2', name: t('month_2') },
    { num: '3', name: t('month_3') },
    { num: '4', name: t('month_4') },
    { num: '5', name: t('month_5') },
    { num: '6', name: t('month_6') },
    { num: '7', name: t('month_7') },
    { num: '8', name: t('month_8') },
    { num: '9', name: t('month_9') },
    { num: '10', name: t('month_10') },
    { num: '11', name: t('month_11') },
    { num: '12', name: t('month_12') },
  ];
  const allYearReadOnly = readOnly && selectedMonths.length === 12;

  const allYearStyle: StyleProp<ViewStyle> = allYearReadOnly ? { flexDirection: 'row' } : {};
  const monthToDisplay = readOnly
    ? allMonths.filter(month => selectedMonths.includes(month.num))
    : allMonths;

  /**
   * Toggles month selection state with intelligent add/remove logic
   *
   * This function manages the complex state transitions for month selection,
   * handling both selection and deselection with proper state updates.
   * It only operates in interactive mode (not read-only).
   *
   * @param month - Month number as string ('1' to '12') to toggle
   *
   * Toggle Logic:
   * - If month is currently selected: removes it from selection
   * - If month is not selected: adds it to selection
   * - Maintains array immutability with proper copying
   * - No-op in read-only mode for safety
   *
   * State Management:
   * - Creates new array to trigger React re-render
   * - Preserves existing selections while modifying target month
   * - Calls onMonthsChange callback with updated selection
   *
   * Side Effects:
   * - Updates parent component state through callback
   * - Triggers re-render of month chips with new selection state
   * - Maintains component responsiveness during interactions
   */
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

  const calendarTestId = testID + '::SeasonalityCalendar';
  return (
    <View style={[{ marginVertical: padding.small }, allYearStyle]}>
      {/* Display mode - show only selected months */}
      <Text
        testID={calendarTestId + '::SeasonalityText'}
        style={{ fontWeight: 'bold', marginRight: padding.small }}
      >
        {t('seasonality')}:
      </Text>
      {allYearReadOnly ? (
        <Text testID={calendarTestId + '::AllYear'}>{t('all_year')}</Text>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: padding.small }}>
          {monthToDisplay.map(month => (
            <Chip
              key={month.num}
              testID={calendarTestId + `::${month.num}`}
              style={[
                { margin: padding.verySmall },
                !readOnly &&
                  selectedMonths.includes(month.num) && {
                    backgroundColor: colors.primaryContainer,
                  },
              ]}
              selected={selectedMonths.includes(month.num)}
              showSelectedCheck={false}
              mode='outlined'
              onPress={() => toggleMonth(month.num)}
              selectedColor={colors.primary}
            >
              {month.name}
            </Chip>
          ))}
        </View>
      )}
    </View>
  );
}
