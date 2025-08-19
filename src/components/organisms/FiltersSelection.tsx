/**
 * FiltersSelection - Active filter display with toggle functionality
 *
 * A compact component that displays currently active filters as removable tags
 * with a toggle button to switch between filter selection and results view.
 * Features horizontal scrolling for multiple filters and intuitive filter management.
 *
 * Key Features:
 * - Horizontal scrollable list of active filters
 * - Removable filter tags with cross icons
 * - Mode toggle button (add filters vs view results)
 * - Dynamic button text and icons based on mode
 * - Responsive layout with proper spacing
 * - Internationalization support
 *
 * @example
 * ```typescript
 * // Basic filter selection display
 * const [filtersMode, setFiltersMode] = useState(false);
 * const [activeFilters, setActiveFilters] = useState(['vegetarian']);
 *
 * <FiltersSelection
 *   testId="recipe-filters"
 *   filters={activeFilters}
 *   addingFilterMode={filtersMode}
 *   setAddingAFilter={setFiltersMode}
 *   onRemoveFilter={(filter) => {
 *     setActiveFilters(filters.filter(f => f !== filter));
 *   }}
 * />
 *
 * // Integration with search results
 * <FiltersSelection
 *   testId="search-filters"
 *   filters={appliedFilters}
 *   addingFilterMode={showFilterPanel}
 *   setAddingAFilter={setShowFilterPanel}
 *   onRemoveFilter={handleFilterRemoval}
 * />
 * ```
 */

import React from 'react';
import TagButton from '@components/atomic/TagButton';
import { Icons } from '@assets/Icons';
import { useI18n } from '@utils/i18n';
import { FlatList } from 'react-native';
import { padding } from '@styles/spacing';
import { Button } from 'react-native-paper';

/**
 * Props for the FiltersSelection component
 */
export type FiltersSelectionProps = {
  /** Unique identifier for testing and accessibility */
  testId: string;
  /** Array of currently active filter strings */
  filters: Array<string>;
  /** Whether the component is in filter-adding mode */
  addingFilterMode: boolean;
  /** State setter for toggling filter adding mode */
  setAddingAFilter: React.Dispatch<React.SetStateAction<boolean>>;
  /** Callback fired when a filter is removed */
  onRemoveFilter: (filter: string) => void;
};

/**
 * FiltersSelection component for active filter management
 *
 * @param props - The component props with filter state and management functions
 * @returns JSX element representing active filters with toggle functionality
 */
export function FiltersSelection({
  testId,
  filters,
  addingFilterMode,
  setAddingAFilter,
  onRemoveFilter,
}: FiltersSelectionProps) {
  const { t } = useI18n();

  const selectionTestID = testId + '::FiltersSelection';

  return (
    <>
      <FlatList
        horizontal={true}
        data={filters}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: padding.verySmall,
          marginLeft: padding.small,
        }}
        renderItem={({ item, index }) => (
          <TagButton
            key={index}
            text={item}
            testID={selectionTestID + '::' + index}
            rightIcon={Icons.crossIcon}
            onPressFunction={() => onRemoveFilter(item)}
          />
        )}
      />

      <Button
        testID={testId + '::FiltersToggleButtons'}
        mode={'contained'}
        onPress={() => setAddingAFilter(!addingFilterMode)}
        icon={addingFilterMode ? Icons.removeFilterIcon : Icons.addFilterIcon}
        style={{ margin: padding.medium, alignSelf: 'flex-start', borderRadius: 20 }}
      >
        {t(addingFilterMode ? 'seeFilterResult' : 'addFilter')}
      </Button>
    </>
  );
}

export default FiltersSelection;
