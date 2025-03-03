import React, {act} from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import TextInputWithDropDown, {TextInputWithDropDownType} from '@components/molecules/TextInputWithDropDown';
import RecipeDatabase from "@utils/RecipeDatabase";
import {ingredientsDataset} from "@test-data/ingredientsDataset";
import {tagsDataset} from "@test-data/tagsDataset";
import {recipesDataset} from "@test-data/recipesDataset";

jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());

jest.mock('react-native-paper', () => require('@mocks/deps/react-native-paper-mock').reactNativePaperMock);

describe('TextInputWithDropDown Component', () => {
    const mockOnChangeText = jest.fn();

    const defaultProps: TextInputWithDropDownType = {
        label: 'Ingredient',
        outline: true,
        onChangeText: mockOnChangeText,
    };
    const dbInstance = RecipeDatabase.getInstance();
    beforeEach(async () => {
        jest.clearAllMocks();

        await dbInstance.init();
        await dbInstance.addMultipleIngredients(ingredientsDataset);
        await dbInstance.addMultipleTags(tagsDataset);
        await dbInstance.addMultipleRecipes(recipesDataset);
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await dbInstance.reset();
    });

    test('renders correctly with default props', () => {
        const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...defaultProps} />);

        expect(getByTestId('TextInputWithDropDown::TextInput')).toBeTruthy();
        expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
        for (const ingredient of dbInstance.get_ingredients()) {
            expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
            expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
        }
    });

    test('renders correctly with value in props', async () => {
        const props: TextInputWithDropDownType = {...defaultProps, value: 'Salm'};
        // await act(async () => {
        //     const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...props} />);
        // });
        const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...props} />);

        await waitFor(() => expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Salm'));
        expect(mockOnChangeText).not.toHaveBeenCalled();
        expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
        for (const ingredient of dbInstance.get_ingredients()) {
            expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
            expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
        }

        await act(async () => {
            fireEvent(getByTestId('TextInputWithDropDown::TextInput'), 'focus');
        });
        await waitFor(() => expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy());
        expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Salm');
        expect(mockOnChangeText).not.toHaveBeenCalled();

        for (const ingredient of dbInstance.get_ingredients()) {
            if (ingredient.ingName == 'Salmon') {
                expect(getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).toBeTruthy();
                expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).toBeTruthy();
                expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName + "-content").props.children[0].props.children).toEqual(ingredient.ingName);
            } else {
                expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
                expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
            }
        }
    });

    test('shows dropdown when text input is on focus and hiding when input no more have elements in the array', async () => {
        const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...defaultProps} />);

        const input = getByTestId('TextInputWithDropDown::TextInput');
        await act(async () => {
            fireEvent(input, 'focus');
        });

        await waitFor(() => expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy());
        expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('');
        expect(mockOnChangeText).not.toHaveBeenCalled();
        for (const ingredient of dbInstance.get_ingredients()) {
            expect(getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).toBeTruthy();
            expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).toBeTruthy();
            expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName + "-content").props.children[0].props.children).toEqual(ingredient.ingName);
        }

        const textInput = 'notexistingrecipe';
        await act(async () => {
            fireEvent.changeText(input, textInput);
        });

        await waitFor(() => expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy());
        expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput);
        expect(mockOnChangeText).toHaveBeenCalledWith(textInput);
        for (const ingredient of dbInstance.get_ingredients()) {
            expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
            expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
        }
    });

    test('shows dropdown when typing and hides when selecting an item', async () => {
        const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...defaultProps} />);

        const input = getByTestId('TextInputWithDropDown::TextInput');
        const textInput = 'past';
        await act(async () => {
            fireEvent.changeText(input, textInput);
        });

        await waitFor(() => expect(getByTestId('TextInputWithDropDown::DropdownContainer')).toBeTruthy());
        expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput);
        expect(mockOnChangeText).toHaveBeenCalledWith(textInput);
        for (const ingredient of dbInstance.get_ingredients()) {
            if (ingredient.ingName.toLowerCase().includes('past')) {
                expect(getByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).toBeTruthy();
                expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).toBeTruthy();
                expect(getByTestId('TextInputWithDropDown::List::' + ingredient.ingName + "-content").props.children[0].props.children).toEqual(ingredient.ingName);
            } else {
                expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
                expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
            }
        }


        await act(async () => {
            fireEvent.press(getByTestId('TextInputWithDropDown::TouchableOpacity::Pasta'));
        });
        await waitFor(() => expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual('Pasta'));
        expect(mockOnChangeText).toHaveBeenCalledWith('Pasta');
        expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy()
    });

    test('hides dropdown on submit', async () => {
        const {getByTestId, queryByTestId} = render(<TextInputWithDropDown {...defaultProps} />);

        const input = getByTestId('TextInputWithDropDown::TextInput');
        const textInput = 'banana';
        await act(async () => {
            fireEvent.changeText(input, textInput);
        });

        await waitFor(() => expect(getByTestId('TextInputWithDropDown::TextInput').props.value).toEqual(textInput)
        );
        expect(queryByTestId('TextInputWithDropDown::DropdownContainer')).not.toBeTruthy();
        expect(mockOnChangeText).toHaveBeenCalledWith(textInput);
        for (const ingredient of dbInstance.get_ingredients()) {
            expect(queryByTestId('TextInputWithDropDown::TouchableOpacity::' + ingredient.ingName)).not.toBeTruthy();
            expect(queryByTestId('TextInputWithDropDown::List::' + ingredient.ingName)).not.toBeTruthy();
        }

        await act(async () => {
            fireEvent(input, 'submitEditing');
        });
        expect(mockOnChangeText).toHaveBeenCalledWith(textInput);
        expect(mockOnChangeText).toHaveBeenCalledTimes(2);
    });
});
