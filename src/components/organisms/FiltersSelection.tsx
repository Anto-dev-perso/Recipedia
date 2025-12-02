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

import React, {useEffect, useRef} from 'react';
import TagButton from '@components/atomic/TagButton';
import {Icons} from '@assets/Icons';
import {useI18n} from '@utils/i18n';
import {TUTORIAL_DEMO_INTERVAL, TUTORIAL_STEPS} from '@utils/Constants';
import {FlatList, View} from 'react-native';
import {padding} from '@styles/spacing';
import {Button} from 'react-native-paper';
import {CopilotStep, walkthroughable} from 'react-native-copilot';
import {useSafeCopilot} from '@hooks/useSafeCopilot';
import {CopilotStepData} from '@customTypes/TutorialTypes';
import {listFilter, prepTimeValues} from '@customTypes/RecipeFiltersTypes';

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
const CopilotView = walkthroughable(View);

export function FiltersSelection({
                                     testId,
                                     filters,
                                     addingFilterMode,
                                     setAddingAFilter,
                                     onRemoveFilter,
                                 }: FiltersSelectionProps) {
    const {t} = useI18n();
    const copilotData = useSafeCopilot();
    const copilotEvents = copilotData?.copilotEvents;
    const currentStep = copilotData?.currentStep;

    const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stepOrder = TUTORIAL_STEPS.Search.order;
    const selectionTestID = testId + '::FiltersSelection';

    const getDisplayText = (filterValue: string): string => {
        if (prepTimeValues.includes(filterValue) || filterValue === listFilter.inSeason) {
            return t(filterValue);
        }
        return filterValue;
    };

    const triggerToggle = () => {
        setAddingAFilter(prev => !prev);
    };

    const startDemo = () => {
        if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
        }

        demoIntervalRef.current = setInterval(triggerToggle, TUTORIAL_DEMO_INTERVAL);
    };

    const stopDemo = () => {
        if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
            demoIntervalRef.current = null;
        }
        setAddingAFilter(false);
    };

    const handleStepChange = (step: CopilotStepData | undefined) => {
        if (step?.order === stepOrder) {
            startDemo();
        } else {
            stopDemo();
        }
    };

    /**
     * Filter Toggle Button - Internal component for filter mode switching
     *
     * Renders the toggle button that switches between filter selection and results view.
     * Clean separation of concerns:
     * - Button handles only its main responsibility (toggling mode)
     * - Demo system manages itself through dedicated trigger function
     */
    function FilterToggleButton() {
        return (
            <Button
                testID={testId + '::FiltersToggleButtons'}
                mode={'contained'}
                onPress={triggerToggle}
                icon={addingFilterMode ? Icons.removeFilterIcon : Icons.addFilterIcon}
                style={{margin: padding.medium, alignSelf: 'flex-start', borderRadius: 20}}
            >
                {t(addingFilterMode ? 'seeFilterResult' : 'addFilter')}
            </Button>
        );
    }

    useEffect(() => {
        if (!copilotData || !copilotEvents) {
            return;
        }

        // Start demo if we're already on our step when component mounts
        if (currentStep?.order === stepOrder) {
            startDemo();
        }

        copilotEvents.on('stepChange', handleStepChange);
        copilotEvents.on('stop', stopDemo);

        return () => {
            copilotEvents.off('stepChange', handleStepChange);
            copilotEvents.off('stop', stopDemo);
            stopDemo();
        };
    }, [currentStep, copilotData, copilotEvents, handleStepChange, startDemo, stepOrder, stopDemo]);

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
                renderItem={({item, index}) => (
                    <TagButton
                        key={index}
                        text={getDisplayText(item)}
                        testID={selectionTestID + '::' + index}
                        rightIcon={Icons.crossIcon}
                        onPressFunction={() => onRemoveFilter(item)}
                    />
                )}
            />

            {copilotData ? (
                <View>
                    <CopilotStep text={t('tutorial.search.description')} order={stepOrder} name={'Search'}>
                        <CopilotView testID={selectionTestID + '::Tutorial'}>
                            <FilterToggleButton/>
                        </CopilotView>
                    </CopilotStep>
                </View>
            ) : (
                <FilterToggleButton/>
            )}
        </>
    );
}

export default FiltersSelection;
