import CheckListsButtonsRender, {ChecklistsButtonsRenderProps} from "@components/molecules/CheckListsButtonsRender";
import {shoppingDataset} from "@test-data/shoppingListsDataset";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {listFilter, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {tagsDataset} from "@test-data/tagsDataset";
import {fireEvent, render} from "@testing-library/react-native";
import React from "react";
import {bulletListDataType} from "@styles/typography";
import {shoppingListTableElement} from "@customTypes/DatabaseElementTypes";

jest.mock('@components/atomic/CheckBoxButton', () => require('@mocks/components/atomic/CheckBoxButton-mock').checkBoxButtonMock);
describe('SectionClickableList Component', () => {
    const mockAddFilter = jest.fn();
    const mockRemoveFilter = jest.fn();
    const mockUpdateIngredientFromShopping = jest.fn();


    const defaultPropsSearch: ChecklistsButtonsRenderProps = {
        testID: '',
        testMode: true,
        filterTitle: listFilter.tags,
        arrayToDisplay: tagsDataset.map(tag => tag.tagName),

        route: {
            type: 'search',
            filtersState: new Map<TListFilter, Array<string>>([[listFilter.tags, ['Italian', 'Vegetarian']], [listFilter.vegetable, ['Potatoes']], [listFilter.cheese, ['Parmesan']]]),
            addFilter: mockAddFilter,
            removeFilter: mockRemoveFilter,

        }
    };
    const defaultPropsShopping: ChecklistsButtonsRenderProps = {
        testID: '',
        testMode: true,
        filterTitle: listFilter.grainOrCereal,
        arrayToDisplay: ingredientsDataset.map(ing => ing.ingName),
        route: {
            type: 'shopping',
            checkBoxInitialValue: false,
            ingList: shoppingDataset[shoppingDataset.length - 1],

            updateIngredientFromShopping: mockUpdateIngredientFromShopping,
        }
    };


    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly in search mode', () => {
        const {queryByTestId, getByTestId} = render(<CheckListsButtonsRender {...defaultPropsSearch} />);

        for (let i = 0; i < defaultPropsSearch.arrayToDisplay.length; i++) {
            const currentName = defaultPropsSearch.arrayToDisplay[i];

            //@ts-ignore the route is always search in this tests
            const isFilterExist = defaultPropsSearch.route.filtersState.get(listFilter.tags);

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);

            if (isFilterExist === undefined) {
                expect(queryByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`)).toBeNull();
            } else {
                expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(isFilterExist.includes(currentName));
            }

            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toBeUndefined();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();
        }
    });

    test('check onActivation/DeActivation in search mode', () => {
        const {queryByTestId, getByTestId} = render(<CheckListsButtonsRender {...defaultPropsSearch}/>);

        const namePress = defaultPropsSearch.arrayToDisplay[11];
        fireEvent.press(getByTestId(`CheckBoxButton - ${namePress}::OnActivation`));

        expect(mockAddFilter).toHaveBeenCalledWith(defaultPropsSearch.filterTitle, namePress);

        // Component isn't changed
        for (let i = 0; i < defaultPropsSearch.arrayToDisplay.length; i++) {
            const currentName = defaultPropsSearch.arrayToDisplay[i];

            //@ts-ignore the route is always search in this tests
            const isFilterExist = defaultPropsSearch.route.filtersState.get(listFilter.tags);

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);

            if (isFilterExist === undefined) {
                expect(queryByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`)).toBeNull();
            } else {
                expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(isFilterExist.includes(currentName));
            }

            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toBeUndefined();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();
        }
        fireEvent.press(getByTestId(`CheckBoxButton - ${namePress}::OnDeActivation`));

        expect(mockRemoveFilter).toHaveBeenCalledWith(defaultPropsSearch.filterTitle, namePress);

        // Component isn't changed
        for (let i = 0; i < defaultPropsSearch.arrayToDisplay.length; i++) {
            const currentName = defaultPropsSearch.arrayToDisplay[i];

            //@ts-ignore the route is always search in this tests
            const isFilterExist = defaultPropsSearch.route.filtersState.get(listFilter.tags);

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);

            if (isFilterExist === undefined) {
                expect(queryByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`)).toBeNull();
            } else {
                expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(isFilterExist.includes(currentName));
            }

            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toBeUndefined();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();
        }
    });

    test('renders correctly in shopping mode', () => {
        const {getByTestId} = render(<CheckListsButtonsRender {...defaultPropsShopping} />);

        for (let i = 0; i < defaultPropsShopping.arrayToDisplay.length; i++) {
            const currentName = defaultPropsShopping.arrayToDisplay[i];
            //@ts-ignore the route is always shopping in this tests
            const expectedTitlesForThisIng = (defaultPropsShopping.route.ingList.find(ing => ing.name === currentName) as shoppingListTableElement).recipesTitle.map(title => "\n\t- " + title);
            const expectedData: bulletListDataType = {
                bulletListData: expectedTitlesForThisIng,
                multiplesData: expectedTitlesForThisIng.length > 1,
                shortData: expectedTitlesForThisIng.length + " recipe" + (expectedTitlesForThisIng.length > 1 ? "s" : ""),
            };

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);
            expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(false);
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toEqual(JSON.stringify(expectedData));
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();
        }

    });

    test('check onActivation/DeActivation in shopping mode', () => {
        const {getByTestId} = render(<CheckListsButtonsRender {...defaultPropsShopping}/>);

        const namePress = defaultPropsShopping.arrayToDisplay[6];
        fireEvent.press(getByTestId(`CheckBoxButton - ${namePress}::OnActivation`));

        expect(mockUpdateIngredientFromShopping).toHaveBeenCalledTimes(1);
        expect(mockUpdateIngredientFromShopping).toHaveBeenCalledWith(namePress);
        // Component isn't changed

        for (let i = 0; i < defaultPropsShopping.arrayToDisplay.length; i++) {
            const currentName = defaultPropsShopping.arrayToDisplay[i];
            //@ts-ignore the route is always shopping in this tests
            const expectedTitlesForThisIng = (defaultPropsShopping.route.ingList.find(ing => ing.name === currentName) as shoppingListTableElement).recipesTitle.map(title => "\n\t- " + title);
            const expectedData: bulletListDataType = {
                bulletListData: expectedTitlesForThisIng,
                multiplesData: expectedTitlesForThisIng.length > 1,
                shortData: expectedTitlesForThisIng.length + " recipe" + (expectedTitlesForThisIng.length > 1 ? "s" : ""),
            };

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);
            expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(false);
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toEqual(JSON.stringify(expectedData));
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();

        }

        fireEvent.press(getByTestId(`CheckBoxButton - ${namePress}::OnDeActivation`));

        expect(mockUpdateIngredientFromShopping).toHaveBeenCalledTimes(2);
        expect(mockUpdateIngredientFromShopping).toHaveBeenCalledWith(namePress);
        // Component isn't changed
        for (let i = 0; i < defaultPropsShopping.arrayToDisplay.length; i++) {
            const currentName = defaultPropsShopping.arrayToDisplay[i];
            //@ts-ignore the route is always shopping in this tests
            const expectedTitlesForThisIng = (defaultPropsShopping.route.ingList.find(ing => ing.name === currentName) as shoppingListTableElement).recipesTitle.map(title => "\n\t- " + title);
            const expectedData: bulletListDataType = {
                bulletListData: expectedTitlesForThisIng,
                multiplesData: expectedTitlesForThisIng.length > 1,
                shortData: expectedTitlesForThisIng.length + " recipe" + (expectedTitlesForThisIng.length > 1 ? "s" : ""),
            };

            expect(getByTestId(`CheckBoxButton - ${currentName}::Title`).props.children).toEqual(currentName);
            expect(getByTestId(`CheckBoxButton - ${currentName}::StateInitialValue`).props.children).toEqual(false);
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnLongPressData`).props.children).toEqual(JSON.stringify(expectedData));
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnActivation`).props.children).toBeTruthy();
            expect(getByTestId(`CheckBoxButton - ${currentName}::OnDeActivation`).props.children).toBeTruthy();

        }

    });

});
