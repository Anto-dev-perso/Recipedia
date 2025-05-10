import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import FiltersSelection, {FiltersSelectionProps} from '@components/organisms/FiltersSelection';
import {listFilter, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {tagsDataset} from "@test-data/tagsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";

jest.mock('@components/molecules/HorizontalList', () => require('@mocks/components/molecules/HorizontalList-mock').horizontalListMock);
jest.mock('@components/molecules/SectionClickableList', () => require('@mocks/components/molecules/SectionClickableList-mock').sectionClickableListMock);
jest.mock('@components/atomic/TagButton', () => require('@mocks/components/atomic/TagButton-mock').tagButtonMock);

describe('FiltersSelection Component', () => {
    const mockSetPrintSectionClickable = jest.fn();
    // Ignore  these functions as they just come through childrens (no visible effect)
    const mockRemoveFilter = jest.fn();
    const mockAddFilter = jest.fn();

    const defaultProps: FiltersSelectionProps = {
        printSectionClickable: false,
        setPrintSectionClickable: mockSetPrintSectionClickable,
        filtersState: new Map<TListFilter, Array<string>>([[listFilter.tags, tagsDataset.map(tag => tag.tagName)]]),
        addFilter: mockAddFilter,
        removeFilter: mockRemoveFilter,
        tagsList: tagsDataset.map(tag => tag.tagName),
        ingredientsList: ingredientsDataset,
    } as const;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with default props', () => {
        const {getByTestId} = render(<FiltersSelection {...defaultProps} />);

        expect(getByTestId('FiltersSelection')).toBeTruthy();

        expect(getByTestId('HorizontalList::PropType').props.children).toEqual('Tag');
        expect(getByTestId('HorizontalList::Item').props.children).toEqual(JSON.stringify(defaultProps.tagsList));

        expect(getByTestId('HorizontalList::Icon').props.children).toEqual('close');
        expect(getByTestId('HorizontalList::OnPress')).toBeTruthy();

        expect(getByTestId('TagButton::Text').props.children).toEqual('"Add a filter"');
        expect(getByTestId('TagButton::LeftIcon').props.children).toEqual('"filter-plus-outline"');

        expect(getByTestId('TagButton::RightIcon').props.children).toBeUndefined();

        expect(getByTestId('TagButton::OnPressFunction')).toBeTruthy();

    });

    test('toggles printSectionClickable on button press', () => {
        let props = {...defaultProps};
        const {rerender, getByTestId} = render(<FiltersSelection {...props} />);

        // Simulate pressing the "Add a filter" button
        fireEvent.press(getByTestId('TagButton::OnPressFunction'));
        expect(mockSetPrintSectionClickable).toHaveBeenCalledWith(true);
        props.printSectionClickable = true;
        rerender(<FiltersSelection {...props} />);

        expect(getByTestId('SectionClickableList::Screen').props.children).toEqual('"search"');
        expect(getByTestId('SectionClickableList::Icon').props.children).toEqual(JSON.stringify(["plus", "minus"]));
        expect(getByTestId('SectionClickableList::TagsList').props.children).toEqual(JSON.stringify(defaultProps.tagsList));
        expect(getByTestId('SectionClickableList::IngredientsList').props.children).toEqual(JSON.stringify(defaultProps.ingredientsList));

        // Simulate pressing the button again
        fireEvent.press(getByTestId('TagButton::OnPressFunction'));
        expect(mockSetPrintSectionClickable).toHaveBeenCalledWith(false);


    });

    test('remove tag on press', () => {
        const props = {...defaultProps};
        const {rerender, getByTestId} = render(<FiltersSelection {...defaultProps} />);

        for (let i = 0; i < props.tagsList.length; i++) {
            // Simulate pressing the "Add a filter" button
            fireEvent.press(getByTestId('HorizontalList::OnPress'));
            expect(mockRemoveFilter).toHaveBeenCalledWith(listFilter.tags, tagsDataset[i].tagName);
            props.tagsList.splice(0, 1);
            rerender(<FiltersSelection {...props} />);
        }
    });


});
