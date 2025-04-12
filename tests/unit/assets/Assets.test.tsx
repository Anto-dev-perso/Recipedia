// Assets.test.ts
import {Asset} from 'expo-asset';
import {Assets, getAssetUri} from '@assets/Assets';

jest.mock('expo-asset', () => require('@mocks/deps/expo-asset-mock').expoAssetMock());

describe('getAssetUri', () => {
    const mockLoadAsync = Asset.loadAsync as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the localUri if it is provided', async () => {
        const expectedUri = 'file:///local/path/image.jpg';
        // Configure the mock to resolve with a single asset that has a localUri.
        mockLoadAsync.mockResolvedValue([{localUri: expectedUri, uri: 'fallback'}]);

        const result = await getAssetUri(Assets.placeholder);
        expect(result).toBe(expectedUri);
        expect(mockLoadAsync).toHaveBeenCalledWith(Assets.placeholder);
    });

    it('returns the asset uri if localUri is not provided', async () => {
        const fallbackUri = 'http://example.com/image.jpg';
        mockLoadAsync.mockResolvedValue([{uri: fallbackUri}]);

        const result = await getAssetUri(Assets.icon);
        expect(result).toBe(fallbackUri);
        expect(mockLoadAsync).toHaveBeenCalledWith(Assets.icon);
    });

    it('returns an empty string if loaded assets array has length != 1 (multiple assets)', async () => {
        mockLoadAsync.mockResolvedValue([{uri: 'uri1'}, {uri: 'uri2'}]);

        const result = await getAssetUri(Assets.favicon);
        expect(result).toBe("");
    });

    it('returns an empty string if loaded assets array is empty', async () => {
        mockLoadAsync.mockResolvedValue([]);

        const result = await getAssetUri(Assets.splash);
        expect(result).toBe("");
    });

    it('returns an empty string and logs an error when Asset.loadAsync throws', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        mockLoadAsync.mockRejectedValue(new Error('Test error'));

        const result = await getAssetUri(Assets.placeholder);
        expect(result).toBe("");
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    });
});
