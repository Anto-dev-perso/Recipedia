import {scaleQuantityForPersons} from '@utils/Quantity';

describe('scaleQuantityForPersons', () => {
    test('returns original when persons are equal', () => {
        expect(scaleQuantityForPersons('200', 4, 4)).toBe('200');
    });

    test('scales integers up and down', () => {
        expect(scaleQuantityForPersons('200', 2, 4)).toBe('400');
        expect(scaleQuantityForPersons('200', 4, 2)).toBe('100');
    });

    test('scales decimals with dot and outputs comma', () => {
        expect(scaleQuantityForPersons('0.5', 2, 3)).toBe('0,75');
    });

    test('scales decimals with comma and outputs comma', () => {
        expect(scaleQuantityForPersons('1,5', 6, 4)).toBe('1');
    });

    test('preserves non-numeric strings', () => {
        expect(scaleQuantityForPersons('some salt', 2, 4)).toBe('some salt');
    });

    test('does not scale ranges (multiple numbers)', () => {
        expect(scaleQuantityForPersons('1à3', 2, 4)).toBe('1à3');
        expect(scaleQuantityForPersons('1 - 3', 2, 4)).toBe('1 - 3');
    });

    test('preserves surrounding text and unit', () => {
        expect(scaleQuantityForPersons('200 g', 2, 3)).toBe('300 g');
        expect(scaleQuantityForPersons('1,5 cup', 3, 2)).toBe('1 cup');
    });
});


