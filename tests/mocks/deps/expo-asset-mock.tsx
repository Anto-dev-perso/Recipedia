export function expoAssetMock() {
    return {
        Asset: {
            loadAsync: jest.fn(),
        }
    }
}
