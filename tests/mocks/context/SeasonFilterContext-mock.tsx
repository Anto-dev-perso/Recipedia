export const mockSetSeasonFilter = jest.fn();

export const useSeasonFilter = () => ({
  seasonFilter: true,
  setSeasonFilter: mockSetSeasonFilter,
});
