import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import DefaultPersonsSettings from '@screens/DefaultPersonsSettings';
import {mockNavigationFunctions} from "@mocks/deps/react-navigation-mock";
import {mockSetDefaultPersons} from "@mocks/utils/settings-mock";


jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('@utils/settings', () => require('@mocks/utils/settings-mock').settingsMock());
jest.mock('@react-native-community/slider', () => require('@mocks/deps/slider-mock').default);

jest.mock('react-native-paper', () => require('@mocks/deps/react-native-paper-mock').reactNativePaperMock);
jest.mock('@react-navigation/native', () => require('@mocks/deps/react-navigation-mock').reactNavigationMock());


// Create props object that matches DefaultPersonsSettingsProp
const defaultProps = {
    navigation: mockNavigationFunctions,
    route: {
        key: 'DefaultPersonsSettings',
        name: 'DefaultPersonsSettings',
        params: {}
    }
};

describe('DefaultPersonsSettings Screen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly with default values', async () => {
        const {getByTestId} = render(
            <DefaultPersonsSettings {...defaultProps as any} />
        );

        await waitFor(() => {
            expect(getByTestId('DefaultPersonSettings::Slider')).toBeTruthy();
        });

        expect(getByTestId('DefaultPersonSettings::Title').props.children).toEqual('default_persons');
        expect(getByTestId('DefaultPersonSettings::PersonsValue').props.children).toEqual([2, " ", "persons"]);

        expect(getByTestId('DefaultPersonSettings::Slider::Text').props.children).toEqual(2);

        expect(getByTestId('DefaultPersonSettings::MinValue').props.children).toEqual('1');
        expect(getByTestId('DefaultPersonSettings::MaxValue').props.children).toEqual('10');


        expect(getByTestId('DefaultPersonSettings::Cancel')).toBeTruthy();
        expect(getByTestId('DefaultPersonSettings::Save')).toBeTruthy();
    });


    test('updates persons value when slider changes', async () => {
        const {getByTestId} = render(
            <DefaultPersonsSettings {...defaultProps as any} />
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(getByTestId('DefaultPersonSettings::Slider')).toBeTruthy();
        });

        // Get the slider and simulate a value change
        fireEvent.press(getByTestId('DefaultPersonSettings::Slider'));

        // Check if the displayed value is updated
        await waitFor(() => {
            expect(getByTestId('DefaultPersonSettings::PersonsValue').props.children).toEqual([3, " ", "persons"]);
        });
    });

    test('calls navigation.goBack when cancel button is pressed', async () => {
        const {getByTestId} = render(
            <DefaultPersonsSettings {...defaultProps as any} />
        );

        // Press the cancel button
        fireEvent.press(getByTestId('DefaultPersonSettings::Cancel'));

        // Verify that navigation.goBack was called
        expect(mockNavigationFunctions.goBack).toHaveBeenCalled();
    });

    test('saves persons value and navigates back when save button is pressed', async () => {
        const {getByTestId} = render(
            <DefaultPersonsSettings {...defaultProps as any} />
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(getByTestId('DefaultPersonSettings::Slider')).toBeTruthy();
        });

        fireEvent.press(getByTestId('DefaultPersonSettings::Slider'));

        // Press the save button
        fireEvent.press(getByTestId('DefaultPersonSettings::Save'));
        await waitFor(() => {
            expect(mockNavigationFunctions.goBack).toHaveBeenCalled();
        });

        expect(mockSetDefaultPersons).toHaveBeenCalledWith(3);
    });

});
