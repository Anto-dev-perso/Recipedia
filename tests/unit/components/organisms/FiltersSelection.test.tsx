import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {FiltersSelection, FiltersSelectionProps} from '@components/organisms/FiltersSelection';

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());

describe('FiltersSelection Component', () => {
    const mockSetAddingAFilter = jest.fn();
    const mockOnRemoveFilter = jest.fn();

    const defaultProps: FiltersSelectionProps = {
        testId: 'FiltersSelection',
        filters: ['Italian', 'Vegetarian'],
        addingFilterMode: false,
        setAddingAFilter: mockSetAddingAFilter,
        onRemoveFilter: mockOnRemoveFilter,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with filters', () => {
        const {getByTestId} = render(<FiltersSelection {...defaultProps} />);

        // Check that filter chips are rendered
        expect(getByTestId('FiltersSelection::FiltersSelection::0::Chip')).toBeTruthy();
        expect(getByTestId('FiltersSelection::FiltersSelection::1::Chip')).toBeTruthy();
        expect(getByTestId('FiltersSelection::FiltersToggleButtons')).toBeTruthy();
    });

    test('toggles filter mode on button press', () => {
        const {getByTestId} = render(<FiltersSelection {...defaultProps} />);

        // Should show "Add Filter" button when not in adding mode
        fireEvent.press(getByTestId('FiltersSelection::FiltersToggleButtons'));
        expect(mockSetAddingAFilter).toHaveBeenCalledWith(true);
    });

    test('shows show results button when in adding filter mode', () => {
        const props = {...defaultProps, addingFilterMode: true};
        const {getByTestId} = render(<FiltersSelection {...props} />);

        fireEvent.press(getByTestId('FiltersSelection::FiltersToggleButtons'));
        expect(mockSetAddingAFilter).toHaveBeenCalledWith(false);
    });

    test('calls onRemoveFilter when filter is removed', () => {
        const {getByTestId} = render(<FiltersSelection {...defaultProps} />);
        
        // Click on the remove button of the first filter
        fireEvent.press(getByTestId('FiltersSelection::FiltersSelection::0::Chip'));
        expect(mockOnRemoveFilter).toHaveBeenCalledWith('Italian');
    });

});