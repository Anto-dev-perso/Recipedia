import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import SeasonalityCalendar, {SeasonalityCalendarProps} from "@components/molecules/SeasonalityCalendar";

jest.mock('@utils/i18n', () => require('@mocks/utils/i18n-mock').i18nMock());
jest.mock('react-native-paper', () => require('@mocks/deps/react-native-paper-mock').reactNativePaperMock);

describe('SeasonalityCalendar Component', () => {
    const mockOnMonthsChange = jest.fn();
    const testIDProp = "SeasonalityCalendar";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const selectedMonthProp = ['1', '4'];
    const allYearProp = ['1', '2', '3', '4', '5', '6', '' +
    '7', '8', '9', '10', '11', '12',];
    const defaultProps: SeasonalityCalendarProps = {
        readOnly: true,
        selectedMonths: selectedMonthProp,
        testID: testIDProp,
        onMonthsChange: mockOnMonthsChange,
    };

    test('renders with readOnly prop', () => {
        const {getByTestId, queryByTestId} = render(
            <SeasonalityCalendar {...defaultProps}/>
        );

        expect(getByTestId(`${testIDProp}::SeasonalityCalendar::SeasonalityText`).props.children).toEqual(["seasonality", ":"]);
        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::AllYear`)).toBeNull();

        for (const month of selectedMonthProp) {
            expect(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(month)}`)).toBeTruthy();
            expect(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(month)}::Children`).props.children).toEqual('month_' + month);
        }
    });

    test('renders with readOnly all year prop', () => {
        const {getByTestId, queryByTestId} = render(
            <SeasonalityCalendar {...defaultProps} selectedMonths={allYearProp}/>
        );

        expect(getByTestId(`${testIDProp}::SeasonalityCalendar::SeasonalityText`).props.children).toEqual(["seasonality", ":"]);
        expect(getByTestId(`${testIDProp}::SeasonalityCalendar::AllYear`).props.children).toEqual('all_year');

        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::0`)).toBeNull();
        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::0::Children`)).toBeNull();
    });

    test('renders with edit prop', () => {
        const {getByTestId, queryByTestId} = render(
            <SeasonalityCalendar {...defaultProps} readOnly={false}/>
        );

        expect(getByTestId(`${testIDProp}::SeasonalityCalendar::SeasonalityText`).props.children).toEqual(["seasonality", ":"]);
        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::AllYear`)).toBeNull();

        for (const month of selectedMonthProp) {
            expect(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(month)}`)).toBeTruthy();
            expect(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(month)}::Children`).props.children).toEqual('month_' + month);
        }
    });

    test('renders with empty selectedMonths array', () => {
        const {getByTestId, queryByTestId} = render(
            <SeasonalityCalendar {...defaultProps} selectedMonths={[]}/>
        );

        expect(getByTestId(`${testIDProp}::SeasonalityCalendar::SeasonalityText`).props.children).toEqual(["seasonality", ":"]);
        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::AllYear`)).toBeNull();

        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::0`)).toBeNull();
        expect(queryByTestId(`${testIDProp}::SeasonalityCalendar::0::Children`)).toBeNull();
    });

    test('onPress on a month on edit', () => {
        const {getByTestId} = render(
            <SeasonalityCalendar {...defaultProps} readOnly={false}/>
        );

        fireEvent.press(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(selectedMonthProp[1])}`));

        expect(mockOnMonthsChange).toHaveBeenCalledTimes(1);
        expect(mockOnMonthsChange).toHaveBeenCalledWith([selectedMonthProp[0]]);
    });

    test('onPress on a month on readOnly', () => {
        const {getByTestId} = render(
            <SeasonalityCalendar {...defaultProps} />
        );

        fireEvent.press(getByTestId(`${testIDProp}::SeasonalityCalendar::${Number(selectedMonthProp[1])}`));

        expect(mockOnMonthsChange).toHaveBeenCalledTimes(0);
    });
});
