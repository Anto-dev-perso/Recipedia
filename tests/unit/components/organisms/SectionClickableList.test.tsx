import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import SectionClickableList, {SectionClickableListProps} from "@components/molecules/SectionClickableList";
import {tagsDataset} from "@test-data/tagsDataset";
import {filtersCategories, listFilter, TListFilter} from "@customTypes/RecipeFiltersTypes";
import {extractTagsName} from "@customTypes/DatabaseElementTypes";
import {PlusMinusIcons} from "@assets/Icons";
import {shoppingDataset} from "@test-data/shoppingListsDataset";

jest.mock('@components/atomic/RectangleButton', () => require('@mocks/components/atomic/RectangleButton-mock').rectangleButtonMock);
jest.mock('@components/molecules/CheckListsButtonsRender', () => require('@mocks/components/molecules/CheckListsButtonsRender-mock').checkListsButtonMock);
jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());


describe('SectionClickableList Component', () => {
    const mockAddFilter = jest.fn();
    const mockRemoveFilter = jest.fn();
    const updateIngredientFromShopping = jest.fn();

    const defaultPropsSearch: SectionClickableListProps = {
        testMode: true,
        screen: "search",
        tagsList: extractTagsName(tagsDataset),
        ingredientsList: ingredientsDataset,
        filtersState: new Map<TListFilter, Array<string>>(),
        addFilter: mockAddFilter,
        removeFilter: mockRemoveFilter,
    } as const;
    const defaultPropsShopping: SectionClickableListProps = {
        testMode: true,
        screen: "shopping",
        ingList: shoppingDataset[shoppingDataset.length - 1],
        icon: PlusMinusIcons,
        updateIngredientFromShopping: updateIngredientFromShopping,
    } as const;


    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly in search mode', () => {
        let props: SectionClickableListProps = {
            ...defaultPropsSearch,
            filtersState: new Map([...defaultPropsSearch.filtersState])
        };
        const {rerender, queryByTestId, getByTestId} = render(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{}');
                expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
            }
        }

        props.filtersState.set(listFilter.sauce, ['Tomato ingredientTypes.sauce']);
        props.filtersState.set(listFilter.recipeTitleInclude, ['Pizza']);
        rerender(<SectionClickableList {...props}/>);

        for (let i = 0; i < filtersCategories.length; i++) {
            if (filtersCategories[i] == listFilter.sauce) {

            }
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{"ingredientTypes.sauce":["Tomato ingredientTypes.sauce"],"filterTypes.recipeTitleInclude":["Pizza"]}');
                expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
            }
        }

    });

    test('add and remove works correctly in search mode', () => {
        let props: SectionClickableListProps = {
            ...defaultPropsSearch,
            filtersState: new Map([...defaultPropsSearch.filtersState])
        };
        const {rerender, queryByTestId, getByTestId} = render(<SectionClickableList {...props} />);

        props.filtersState.set(listFilter.oilAndFat, ['Butter']);
        fireEvent.press(getByTestId(`CheckListForCategory - ${listFilter.oilAndFat}::AddFilter`));

        expect(mockAddFilter).toHaveBeenCalledTimes(1);
        rerender(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                if (filtersCategories[i] == listFilter.oilAndFat) {
                    expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{"ingredientTypes.oilAndFat":["Butter"]}');
                    expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                    expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
                }

            }
        }

        props.filtersState.set(listFilter.tags, [tagsDataset[0].tagName, tagsDataset[9].tagName]);
        fireEvent.press(getByTestId('CheckListForCategory - filterTypes.tags::AddFilter'));

        expect(mockAddFilter).toHaveBeenCalledTimes(2);
        rerender(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{"ingredientTypes.oilAndFat":["Butter"],"filterTypes.tags":["Italian","Seafood"]}');
                expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
            }
        }

        props.filtersState.delete(listFilter.oilAndFat);
        fireEvent.press(getByTestId('CheckListForCategory - filterTypes.tags::RemoveFilter'));

        expect(mockRemoveFilter).toHaveBeenCalledTimes(1);
        rerender(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{"filterTypes.tags":["Italian","Seafood"]}');
                expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
            }
        }

    });

    test('handles empty tagsList and ingredientsList gracefully for search mode', () => {
        const props = {...defaultPropsSearch, tagsList: [], ingredientsList: []};
        const {getByTestId, queryByTestId} = render(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.prepTime || category == listFilter.inSeason) {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toBeUndefined();
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::FiltersState`).props.children).toEqual('{}');
                expect(getByTestId(`CheckListForCategory - ${category}::AddFilter`).props.children).toBeTruthy();
                expect(getByTestId(`CheckListForCategory - ${category}::RemoveFilter`).props.children).toBeTruthy();
            } else {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::FiltersState`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::AddFilter`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::RemoveFilter`)).toBeNull();
            }
        }

    });

    test('renders correctly in shopping mode', () => {
        const {queryByTestId, getByTestId} = render(<SectionClickableList {...defaultPropsShopping} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.prepTime || category == listFilter.inSeason || category == listFilter.tags || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::CheckBoxInitialValue`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::IngList`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::updateIngredientFromShopping`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toEqual('minus');
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::CheckBoxInitialValue`).props.children).toEqual(false);
                expect(getByTestId(`CheckListForCategory - ${category}::IngList`).props.children).toEqual(JSON.stringify(shoppingDataset[shoppingDataset.length - 1]));
                expect(getByTestId(`CheckListForCategory - ${category}::updateIngredientFromShopping`).props.children).toBeTruthy();
            }
        }

    });

    test('updateIngredientFromShopping works correctly in shopping mode', () => {
        let props = {...defaultPropsShopping};
        const {queryByTestId, getByTestId} = render(<SectionClickableList {...props} />);


        fireEvent.press(getByTestId(`RectangleButtonForCategory - ${listFilter.grainOrCereal}::OnPressFunction`));
        for (let i = 0; i < filtersCategories.length; i++) {
            const category = filtersCategories[i];
            if (category == listFilter.recipeTitleInclude || category == listFilter.purchased || category == listFilter.prepTime || category == listFilter.inSeason || category == listFilter.tags || category == listFilter.seafood || category == listFilter.sweetener || category == listFilter.undefined) {
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Text`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Icon`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Centered`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::Border`)).toBeNull();
                expect(queryByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`)).toBeNull();

                expect(queryByTestId(`CheckListForCategory - ${category}::CheckBoxInitialValue`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::IngList`)).toBeNull();
                expect(queryByTestId(`CheckListForCategory - ${category}::updateIngredientFromShopping`)).toBeNull();
            } else {
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Text`).props.children).toEqual(category);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Icon`).props.children).toEqual('minus');
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Centered`).props.children).toEqual(false);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::Border`).props.children).toEqual(true);
                expect(getByTestId(`RectangleButtonForCategory - ${category}::OnPressFunction`).props.children).toBeTruthy();

                expect(getByTestId(`CheckListForCategory - ${category}::CheckBoxInitialValue`).props.children).toEqual(false);
                expect(getByTestId(`CheckListForCategory - ${category}::IngList`).props.children).toEqual(JSON.stringify(shoppingDataset[shoppingDataset.length - 1]));
                expect(getByTestId(`CheckListForCategory - ${category}::updateIngredientFromShopping`).props.children).toBeTruthy();
            }
        }

        fireEvent.press(getByTestId(`CheckListForCategory - ${listFilter.grainOrCereal}::updateIngredientFromShopping`), 'Pasta');

        expect(updateIngredientFromShopping).toHaveBeenCalledWith('Pasta');

    });

    test('handles empty ingList gracefully for shopping mode', () => {
        const props = {...defaultPropsShopping, ingList: []};
        const {queryByTestId} = render(<SectionClickableList {...props} />);

        for (let i = 0; i < filtersCategories.length; i++) {
            expect(queryByTestId(`RectangleButtonForCategory - ${filtersCategories[i]}::Text`)).toBeNull();
            expect(queryByTestId(`RectangleButtonForCategory - ${filtersCategories[i]}::Icon`)).toBeNull();
            expect(queryByTestId(`RectangleButtonForCategory - ${filtersCategories[i]}::Centered`)).toBeNull();
            expect(queryByTestId(`RectangleButtonForCategory - ${filtersCategories[i]}::Border`)).toBeNull();
            expect(queryByTestId(`RectangleButtonForCategory - ${filtersCategories[i]}::OnPressFunction`)).toBeNull();

            expect(queryByTestId(`CheckListForCategory - ${filtersCategories[i]}::CheckBoxInitialValue`)).toBeNull();
            expect(queryByTestId(`CheckListForCategory - ${filtersCategories[i]}::IngList`)).toBeNull();
            expect(queryByTestId(`CheckListForCategory - ${filtersCategories[i]}::updateIngredientFromShopping`)).toBeNull();
        }
    });
});
