export function expoAssetMock() {
  return {
    Asset: {
      fromModule: jest.fn(() => ({ uri: 'mocked-app-icon-uri' })),
      loadAsync: jest.fn(),
    },
  };
}
