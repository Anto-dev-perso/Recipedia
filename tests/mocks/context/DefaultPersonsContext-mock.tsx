export const mockSetDefaultPersons = jest.fn().mockResolvedValue(undefined);

export const useDefaultPersons = () => ({
  defaultPersons: 4,
  setDefaultPersons: mockSetDefaultPersons,
});
