import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import VerticalBottomButtons from "@components/organisms/VerticalBottomButtons";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {TabScreenParamList} from "@customTypes/ScreenTypes";


jest.mock('expo-sqlite', () => require('@mocks/utils/expo-sqlite-mock').expoSqliteMock());
jest.mock('@utils/FileGestion', () => require('@mocks/utils/FileGestion-mock.tsx').fileGestionMock());
jest.mock('@utils/ImagePicker', () => require('@mocks/utils/ImagePicker-mock').imagePickerMock());

jest.mock('@components/molecules/BottomTopButton', () => require('@mocks/components/molecules/BottomTopButton-mock').bottomTopButtonMock);


describe('VerticalBottomButtons Component', () => {
    const mockNavigation: Partial<BottomTabNavigationProp<TabScreenParamList, 'Home'>> = {
        goBack: jest.fn(),
        navigate: jest.fn(),
        setOptions: jest.fn(),
        dispatch: jest.fn(),
        canGoBack: jest.fn(),
        getId: jest.fn(),
        getParent: jest.fn(),
        isFocused: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all buttons correctly (multi OFF)', () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        expect(getByTestId('ExpandButton::OnPressFunction').props.children).toBeTruthy();
    });
    test('renders all buttons correctly (multi ON)', () => {
        //@ts-ignore navigation are not useful for UT
        const {queryByTestId, getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));

        expect(getByTestId('ReduceButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('EditButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('GalleryButton::OnPressFunction').props.children).toBeTruthy();
        expect(getByTestId('CameraButton::OnPressFunction').props.children).toBeTruthy();

        expect(queryByTestId('ExpandButton::OnPressFunction')).toBeNull();
    });

    test('reduce button press', () => {
        //@ts-ignore navigation are not useful for UT
        const {queryByTestId, getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('ReduceButton::OnPressFunction'));

        expect(getByTestId('ExpandButton::OnPressFunction').props.children).toBeTruthy();

        expect(queryByTestId('ReduceButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('EditButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('GalleryButton::OnPressFunction')).toBeNull();
        expect(queryByTestId('CameraButton::OnPressFunction')).toBeNull();
    });

    test('edit button press', () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('EditButton::OnPressFunction'));

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Recipe', {
            mode: 'addManually', recipe: {
                image_Source: '', title: '',
                description: "",
                tags: [],
                persons: 0,
                ingredients: [],
                season: [],
                preparation: [],
                time: 0
            }
        });
    });

    test('gallery button press', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('GalleryButton::OnPressFunction'));

        await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalled());

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Recipe', {
            mode: "addFromPic",
            img: {uri: 'path/to/img', width: 100, height: 100}
        });
    });

    test('camera button press', async () => {
        //@ts-ignore navigation are not useful for UT
        const {getByTestId} = render(<VerticalBottomButtons navigation={mockNavigation}/>);

        fireEvent.press(getByTestId('ExpandButton::OnPressFunction'));
        fireEvent.press(getByTestId('CameraButton::OnPressFunction'));

        await waitFor(() => expect(mockNavigation.navigate).toHaveBeenCalled());

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Recipe', {
            mode: "addFromPic",
            img: {uri: 'path/to/img', width: 100, height: 100}
        });
    });
});
