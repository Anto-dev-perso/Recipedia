export const mockSetLocale = jest.fn();

export function i18nMock() {
    return {
        useI18n: () => ({
            t: (key: string) => key, // Return the key as the translation for testing
            getLocale: () => jest.fn().mockReturnValue('en'),
            setLocale: mockSetLocale,
            getAvailableLocales: jest.fn().mockReturnValue(['en', 'fr']),
            getLocaleName: jest.fn().mockImplementation((locale: string) => "locale name")
        }),
    }
}

export function i18nFilterTimeMock() {
    const translations: Record<string, string> = {
        'preparationTimes.noneToTen': '0-10 min',
        'preparationTimes.tenToFifteen': '10-15 min',
        'preparationTimes.FifteenToTwenty': '15-20 min',
        'preparationTimes.twentyToTwentyFive': '20-25 min',
        'preparationTimes.twentyFiveToThirty': '25-30 min',
        'preparationTimes.thirtyToFourty': '30-40 min',
        'preparationTimes.fourtyToFifty': '40-50 min',
        'preparationTimes.oneHourPlus': '+60 min',
        'timeSuffixEdit': 'min',
    };
    return {
        useI18n: () => ({
            t: (key: string) => {
                return translations[key] ?? key; // Return translation or key if missing
            }

        }),
    }
}
