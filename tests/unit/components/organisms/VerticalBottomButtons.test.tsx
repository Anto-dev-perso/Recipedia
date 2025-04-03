import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import VerticalBottomButtons from "@components/organisms/VerticalBottomButtons";
import {mockNavigate} from "@mocks/deps/react-navigation-mock";
import {RecipePropType} from "@screens/Recipe";


jest.mock('expo-sqlite', () => require('@mocks/deps/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());

jest.mock('@react-navigation/native', () => require('@mocks/deps/react-navigation-mock').reactNavigationMock());

jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);


describe('VerticalBottomButtons Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all buttons correctly (multi OFF)', () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons/>);

        expect(getByTestId('ExpandButton::OnPressFunction').props.children).toBeTruthy();
    });
    test('renders all buttons correctly (multi ON)', () => {
        //@ts-ignore navigation are not useful for UT
        const {queryByTestId, getByTestId} = render(<VerticalBottomButtons/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

        expect(getByTestId('ReduceButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('EditButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('GalleryButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('CameraButton::OnPressFunction').props.children).toBeTruthy();

        expect(queryByTestId('ExpandButton::OnPressFunction')).toBeNull();
    });

    test('reduce button press', () => {
        //@ts-ignore navigation are not useful for UT
        const {queryByTestId, getByTestId} = render(<VerticalBottomButtons/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('ReduceButton::OnPressFunction'));

        expect(getByTestId('ExpandButton::OnPressFunction').props.children).toBeTruthy();

        expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('EditButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('GalleryButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('CameraButton::OnPressFunction')).toBeNull();
    });

    test('edit button press', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('EditButton::OnPressFunction'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
            mode: 'addManually'
        } as RecipePropType);
    });

    test('gallery button press', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('GalleryButton::OnPressFunction'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
            mode: "addFromPic",
            imgUri: '/path/to/picked/img'
        } as RecipePropType);
    });

    test('camera button press', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('CameraButton::OnPressFunction'));

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());

        expect(mockNavigate).toHaveBeenCalledWith('Recipe', {
            mode: "addFromPic",
            imgUri: '/path/to/photo'
        } as RecipePropType);
    });
});
