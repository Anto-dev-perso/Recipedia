export const mockGetDefaultPersons = jest.fn().mockResolvedValue(4);
export const mockSetDefaultPersons = jest.fn().mockResolvedValue(undefined);
export const mockSetLanguage = jest.fn();
export const mockGetLanguage = jest.fn().mockResolvedValue('en');

export const getDefaultPersons = mockGetDefaultPersons;
export const setDefaultPersons = mockSetDefaultPersons;

export function settingsMock() {
  return {
    getDefaultPersons: jest.fn().mockResolvedValue(2),
    setDefaultPersons: mockSetDefaultPersons,
    getLanguage: mockGetLanguage,
    setLanguage: mockSetLanguage,
  };
}
