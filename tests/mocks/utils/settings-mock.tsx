export const mockSetDefaultPersons = jest.fn();
export const mockSetLanguage = jest.fn();
export const mockGetLanguage = jest.fn().mockResolvedValue('en');

export function settingsMock() {
    return {
        getDefaultPersons: () => 2,
        setDefaultPersons: mockSetDefaultPersons,
        getLanguage: () => mockGetLanguage(),
        setLanguage: (value: string) => mockSetLanguage(value)
    };
}
