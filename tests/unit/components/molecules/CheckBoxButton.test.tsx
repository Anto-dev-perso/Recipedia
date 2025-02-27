import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CheckBoxButton, {CheckBoxButtonProps} from '@components/atomic/CheckBoxButton';
import {palette} from "@styles/colors";

jest.mock('@expo/vector-icons', () => require('@mocks/expo/expo-vector-icons-mock'));

describe('CheckBoxButton Component', () => {
    const mockOnPress = jest.fn();
    const mockOnActivation = jest.fn();
    const mockOnDeActivation = jest.fn();

    const defaultPropsUseState: CheckBoxButtonProps = {
        stateInitialValue: false,
        testID: "CheckBoxButton",
        title: 'Default Button',
        onActivation: mockOnActivation,
        onDeActivation: mockOnDeActivation
    };

    const defaultPropsDontUseState: CheckBoxButtonProps = {
        stateInitialValue: false,
        testID: "CheckBoxButton",
        title: 'Default Button',
        onActivation: mockOnActivation,
        onDeActivation: mockOnDeActivation
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

// TODO add onLongPressData tests
    test('renders correctly with useState', () => {
        const {queryByTestId, getByTestId} = render(<CheckBoxButton {...defaultPropsUseState}/>);

        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();

        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });
    });

    test('triggers onPress when clicked with useState', () => {
        const {queryByTestId, getByTestId} = render(
            <CheckBoxButton {...defaultPropsUseState}/>
        );

        fireEvent.press(getByTestId('CheckBoxButton::Pressable'));

        expect(mockOnActivation).toHaveBeenCalledTimes(1);
        expect(mockOnDeActivation).toHaveBeenCalledTimes(0);

        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });

        fireEvent.press(getByTestId('CheckBoxButton::Pressable'));

        expect(mockOnActivation).toHaveBeenCalledTimes(1);
        expect(mockOnDeActivation).toHaveBeenCalledTimes(1);
    });

    test('triggers onPressIn and onPressOut events with UseState', () => {
        const {queryByTestId, getByTestId} = render(<CheckBoxButton {...defaultPropsUseState}/>);

        fireEvent(getByTestId('CheckBoxButton::Pressable'), 'onPressIn');


        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.progressGrey,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });

        // Simulate onPressOut
        fireEvent(getByTestId('CheckBoxButton::Pressable'), 'onPressOut');
        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });
    });

    test('renders correctly without useState', () => {
        const {queryByTestId, getByTestId} = render(<CheckBoxButton {...defaultPropsDontUseState}/>);

        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();

        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });
    });

    test('triggers onPress when clicked without useState', () => {
        const {queryByTestId, getByTestId} = render(
            <CheckBoxButton {...defaultPropsDontUseState}/>
        );

        fireEvent.press(getByTestId('CheckBoxButton::Pressable'));

        expect(mockOnActivation).toHaveBeenCalledTimes(1);
        expect(mockOnDeActivation).toHaveBeenCalledTimes(0);

        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });

        fireEvent.press(getByTestId('CheckBoxButton::Pressable'));

        expect(mockOnActivation).toHaveBeenCalledTimes(1);
        expect(mockOnDeActivation).toHaveBeenCalledTimes(1);
    });

    test('triggers onPressIn and onPressOut events without UseState', () => {
        const {queryByTestId, getByTestId} = render(<CheckBoxButton {...defaultPropsDontUseState}/>);

        fireEvent(getByTestId('CheckBoxButton::Pressable'), 'onPressIn');


        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.progressGrey,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });

        // Simulate onPressOut
        fireEvent(getByTestId('CheckBoxButton::Pressable'), 'onPressOut');
        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(queryByTestId('CheckBoxButton::LongPressData')).toBeNull();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });
    });

    test('renders correctly with long data', () => {
        const {getByTestId} = render(<CheckBoxButton {...defaultPropsUseState} onLongPressData={{
            multiplesData: true,
            bulletListData: ['Data1', 'Data2', 'Data3', 'Data4', 'Data5'],
            shortData: 'MultipleData'
        }}/>);

        expect(getByTestId('CheckBoxButton::Title').props.children).toEqual(defaultPropsUseState.title);
        expect(getByTestId('CheckBoxButton::LongPressData').props.children).toEqual('MultipleData');

        expect(getByTestId('CheckBoxButton::Pressable').props.style).toBeTruthy();
        expect(getByTestId('CheckBoxButton::Pressable').props.style).toEqual({
            alignItems: "center",
            backgroundColor: palette.backgroundColor,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        });
    });

});
