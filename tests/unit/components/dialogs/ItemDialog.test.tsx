import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import ItemDialog, {ItemDialogProps} from '@components/dialogs/ItemDialog';
import {ingredientTableElement, ingredientType, tagTableElement} from '@customTypes/DatabaseElementTypes';

// Mock the dependencies
jest.mock('@utils/i18n', () => require("@mocks/utils/i18n-mock").i18nMock());

jest.mock('@components/atomic/CustomTextInput', () => require("@mocks/components/atomic/CustomTextInput-mock").customTextInputMock);

jest.mock('@components/molecules/SeasonalityCalendar', () => require("@mocks/components/molecules/SeasonalityCalendar-mock").seasonalityCalendarMock);

jest.mock('react-native-paper', () => require("@mocks/deps/react-native-paper-mock").reactNativePaperMock);

describe('ItemDialog Component', () => {
    // Test data
    const mockIngredient: ingredientTableElement = {
        id: 1,
        name: 'Test Ingredient',
        type: ingredientType.fruit,
        unit: 'kg',
        season: ['1', '2', '3']
    };

    const mockTag: tagTableElement = {
        id: 2,
        name: 'Test Tag'
    };

    const mockOnClose = jest.fn();
    const mockOnConfirmIngredient = jest.fn();
    const mockOnConfirmTag = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe('ingredient dialog ', () => {
        const props: ItemDialogProps = {
            testId: 'IngredientDialog',
            mode: 'add',
            onClose: mockOnClose,
            item: {
                type: 'ingredient',
                value: mockIngredient,
                onConfirmIngredient: mockOnConfirmIngredient
            }
        };


        describe('render in ', () => {
            test('add mode with correct elements', () => {
                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} />);

                expect(getByTestId('IngredientDialog::AddModal::Title').props.children).toEqual('add_ingredient');
                expect(queryByTestId('IngredientDialog::AddModal::Text')).toBeNull();
                expect(getByTestId('IngredientDialog::AddModal::Name::TextInput')).toBeTruthy();
                expect(getByTestId('IngredientDialog::AddModal::Type').props.children).toEqual(["type", ":"]);
                expect(getByTestId('IngredientDialog::AddModal::Unit::TextInput')).toBeTruthy();

                expect(getByTestId('IngredientDialog::AddModal::SeasonalityCalendar::SelectedMonths').props.children).toEqual(JSON.stringify(mockIngredient.season));

                expect(getByTestId('IngredientDialog::AddModal::CancelButton')).toBeTruthy();
                expect(getByTestId('IngredientDialog::AddModal::ConfirmButton')).toBeTruthy();
            });

            test('edit mode with correct elements', () => {
                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                expect(getByTestId('IngredientDialog::EditModal::Title')).toBeTruthy();
                expect(queryByTestId('IngredientDialog::EditModal::Text')).toBeNull();
                expect(getByTestId('IngredientDialog::EditModal::Name::TextInput')).toBeTruthy();
                expect(getByTestId('IngredientDialog::EditModal::Type').props.children).toEqual(["type", ":"]);
                expect(getByTestId('IngredientDialog::EditModal::Unit::TextInput')).toBeTruthy();

                expect(getByTestId('IngredientDialog::EditModal::SeasonalityCalendar::SelectedMonths').props.children).toEqual(JSON.stringify(mockIngredient.season));

                expect(getByTestId('IngredientDialog::EditModal::CancelButton')).toBeTruthy();
                expect(getByTestId('IngredientDialog::EditModal::ConfirmButton')).toBeTruthy();
            });

            test('delete mode with correct elements', () => {
                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                expect(getByTestId('IngredientDialog::DeleteModal::Title')).toBeTruthy();
                expect(getByTestId('IngredientDialog::DeleteModal::Text').props.children).toEqual(["confirmDelete", " Test IngredientinterrogationMark"]);
                expect(queryByTestId('IngredientDialog::DeleteModal::Name::TextInput')).toBeNull();
                expect(queryByTestId('IngredientDialog::DeleteModal::Type')).toBeNull();
                expect(queryByTestId('IngredientDialog::DeleteModal::Unit::TextInput')).toBeNull();

                expect(queryByTestId('IngredientDialog::DeleteModal::SeasonalityCalendar::SelectedMonths')).toBeNull();

                expect(getByTestId('IngredientDialog::DeleteModal::CancelButton')).toBeTruthy();
                expect(getByTestId('IngredientDialog::DeleteModal::ConfirmButton')).toBeTruthy();
            });
        });
        describe('calls onConfirm when confirm button is pressed in ', () => {
            test('add mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} />);

                fireEvent.press(getByTestId('IngredientDialog::AddModal::ConfirmButton'));

                expect(mockOnConfirmIngredient).toHaveBeenCalled();
            });
            test('edit mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                fireEvent.press(getByTestId('IngredientDialog::EditModal::ConfirmButton'));

                expect(mockOnConfirmIngredient).toHaveBeenCalled();
            });
            test('delete mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                fireEvent.press(getByTestId('IngredientDialog::DeleteModal::ConfirmButton'));

                expect(mockOnConfirmIngredient).toHaveBeenCalled();
            });
        });
        describe('calls onClose when cancel button is pressed in ', () => {
                test('add mode', () => {

                    const {getByTestId} = render(<ItemDialog {...props} />);

                    fireEvent.press(getByTestId('IngredientDialog::AddModal::CancelButton'));

                    expect(mockOnClose).toHaveBeenCalled();
                });
                test('edit mode', () => {

                    const {getByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                    fireEvent.press(getByTestId('IngredientDialog::EditModal::CancelButton'));

                    expect(mockOnClose).toHaveBeenCalled();
                });
                test('delete mode', () => {

                    const {getByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                    fireEvent.press(getByTestId('IngredientDialog::DeleteModal::CancelButton'));

                    expect(mockOnClose).toHaveBeenCalled();
                });
            }
        );

    });

    describe('tag dialog ', () => {

        const props: ItemDialogProps = {
            testId: 'TagDialog',
            mode: 'add',
            onClose: mockOnClose,
            item: {
                type: 'tag',
                value: mockTag,
                onConfirmTag: mockOnConfirmTag
            }
        };

        describe('render in ', () => {
            test('add mode with correct elements', () => {

                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} />);

                expect(getByTestId('TagDialog::AddModal::Title').props.children).toEqual('add_tag');
                expect(queryByTestId('TagDialog::AddModal::Text')).toBeNull();
                expect(getByTestId('TagDialog::AddModal::Name::TextInput')).toBeTruthy();
                expect(queryByTestId('TagDialog::AddModal::Menu')).toBeFalsy();
                expect(queryByTestId('TagDialog::AddModal::Unit')).toBeFalsy();

                expect(queryByTestId('TagDialog::AddModal::SeasonalityCalendar::SelectedMonths')).toBeNull();

                expect(getByTestId('TagDialog::AddModal::CancelButton')).toBeTruthy();
                expect(getByTestId('TagDialog::AddModal::ConfirmButton')).toBeTruthy();
            });
            test('edit mode with correct elements', () => {
                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                expect(getByTestId('TagDialog::EditModal::Title').props.children).toEqual('edit_tag');
                expect(queryByTestId('TagDialog::EditModal::Text')).toBeNull();
                expect(getByTestId('TagDialog::EditModal::Name::TextInput')).toBeTruthy();
                expect(queryByTestId('TagDialog::EditModal::Menu')).toBeFalsy();
                expect(queryByTestId('TagDialog::EditModal::Unit')).toBeFalsy();

                expect(queryByTestId('TagDialog::EditModal::SeasonalityCalendar::SelectedMonths')).toBeNull();

                expect(getByTestId('TagDialog::EditModal::CancelButton')).toBeTruthy();
                expect(getByTestId('TagDialog::EditModal::ConfirmButton')).toBeTruthy();
            });
            test('delete mode with correct elements', () => {

                const {getByTestId, queryByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                expect(getByTestId('TagDialog::DeleteModal::Title').props.children).toEqual('delete');
                expect(getByTestId('TagDialog::DeleteModal::Text')).toBeTruthy();

                expect(queryByTestId('TagDialog::DeleteModal::Name::TextInput')).toBeNull();
                expect(queryByTestId('TagDialog::DeleteModal::Menu')).toBeNull();
                expect(queryByTestId('TagDialog::DeleteModal::Unit')).toBeNull();

                expect(queryByTestId('TagDialog::DeleteModal::SeasonalityCalendar::SelectedMonths')).toBeNull();

                expect(getByTestId('TagDialog::DeleteModal::CancelButton')).toBeTruthy();
                expect(getByTestId('TagDialog::DeleteModal::ConfirmButton')).toBeTruthy();
            });
        });

        describe('calls onConfirm when confirm button is pressed in ', () => {

            test('add mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} />);

                // Simulate clicking on the confirm button
                fireEvent.press(getByTestId('TagDialog::AddModal::ConfirmButton'));

                // Check that onConfirmTag was called with the correct mode and values
                expect(mockOnConfirmTag).toHaveBeenCalledWith('add', mockTag);
            });
            test('edit mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                fireEvent.press(getByTestId('TagDialog::EditModal::ConfirmButton'));

                expect(mockOnConfirmTag).toHaveBeenCalledWith('edit', mockTag);
            });
            test('delete mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                fireEvent.press(getByTestId('TagDialog::DeleteModal::ConfirmButton'));

                expect(mockOnConfirmTag).toHaveBeenCalledWith('delete', mockTag);
            });

        });

        describe('calls onClose when confirm button is pressed in ', () => {

            test('add mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} />);

                fireEvent.press(getByTestId('TagDialog::AddModal::CancelButton'));

                expect(mockOnClose).toHaveBeenCalled();
            });
            test('edit mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'edit'}/>);

                fireEvent.press(getByTestId('TagDialog::EditModal::CancelButton'));

                expect(mockOnClose).toHaveBeenCalled();
            });
            test('delete mode', () => {

                const {getByTestId} = render(<ItemDialog {...props} mode={'delete'}/>);

                fireEvent.press(getByTestId('TagDialog::DeleteModal::CancelButton'));

                expect(mockOnClose).toHaveBeenCalled();
            });
        });

    });

    test('calls onClose when cancel button is pressed', () => {
        const props: ItemDialogProps = {
            testId: 'IngredientDialog',
            mode: 'add',
            onClose: mockOnClose,
            item: {
                type: 'ingredient',
                value: mockIngredient,
                onConfirmIngredient: mockOnConfirmIngredient
            }
        };

        const {getByTestId} = render(<ItemDialog {...props} />);

        // Simulate clicking on the cancel button (which should trigger onClose)
        fireEvent.press(getByTestId('IngredientDialog::AddModal::CancelButton'));

        // Check that onClose was called
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onConfirmIngredient when confirm button is pressed in add mode', () => {
        const props: ItemDialogProps = {
            testId: 'IngredientDialog',
            mode: 'add',
            onClose: mockOnClose,
            item: {
                type: 'ingredient',
                value: mockIngredient,
                onConfirmIngredient: mockOnConfirmIngredient
            }
        };

        const {getByTestId} = render(<ItemDialog {...props} />);

        // Simulate clicking on the confirm button
        fireEvent.press(getByTestId('IngredientDialog::AddModal::ConfirmButton'));

        // Check that onConfirmIngredient was called with the correct mode and values
        expect(mockOnConfirmIngredient).toHaveBeenCalledWith('add', mockIngredient);
    });

    test('calls onConfirmIngredient when confirm button is pressed in edit mode', () => {
        const props: ItemDialogProps = {
            testId: 'IngredientDialog',
            mode: 'edit',
            onClose: mockOnClose,
            item: {
                type: 'ingredient',
                value: mockIngredient,
                onConfirmIngredient: mockOnConfirmIngredient
            }
        };

        const {getByTestId} = render(<ItemDialog {...props} />);

        // Simulate clicking on the confirm button
        fireEvent.press(getByTestId('IngredientDialog::EditModal::ConfirmButton'));

        // Check that onConfirmIngredient was called with the correct mode and values
        expect(mockOnConfirmIngredient).toHaveBeenCalledWith('edit', mockIngredient);
    });
    test('calls onConfirmIngredient when confirm button is pressed in delete mode', () => {
        const props: ItemDialogProps = {
            testId: 'IngredientDialog',
            mode: 'delete',
            onClose: mockOnClose,
            item: {
                type: 'ingredient',
                value: mockIngredient,
                onConfirmIngredient: mockOnConfirmIngredient
            }
        };

        const {getByTestId} = render(<ItemDialog {...props} />);

        // Simulate clicking on the confirm button
        fireEvent.press(getByTestId('IngredientDialog::DeleteModal::ConfirmButton'));

        // Check that onConfirmIngredient was called with the correct mode and values
        expect(mockOnConfirmIngredient).toHaveBeenCalledWith('delete', mockIngredient);
    });
});
