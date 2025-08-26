export function expoAssetMock() {
  return {
    Asset: {
      fromModule: jest.fn(),
      loadAsync: jest.fn(),
    },
  };
}
