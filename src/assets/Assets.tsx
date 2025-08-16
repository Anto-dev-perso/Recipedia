import {Asset} from "expo-asset";
import {filesystemLogger} from '@utils/logger';

export type AssetsType = {
    placeholder: number;
    icon: number;
    favicon: number;
    splash: number;
};

const appDirectory = "./app";
const imagesDirectory = "./images";

export const Assets: AssetsType = {
    placeholder: require(imagesDirectory + '/bike.jpg'),
    icon: require(appDirectory + '/icon.png'),
    favicon: require(appDirectory + '/favicon.png'),
    splash: require(appDirectory + '/splash.png'),
};

export type AssetValue = typeof Assets[keyof typeof Assets];

/**
 * Safely loads an asset identified by the given key.
 * @param assetValue - The asset reference (e.g., AppAssets.placeholder)
 * @returns A Promise that resolves to the loaded Asset's uri. If something went wrong, returns an empty string value
 */

export async function getAssetUri(assetValue: AssetValue): Promise<string> {
    try {
        const loadedAsset: Array<Asset> = await Asset.loadAsync(assetValue);
        if (loadedAsset.length == 1) {
            return loadedAsset[0].localUri ? loadedAsset[0].localUri : loadedAsset[0].uri;
        } else {
            return "";
        }
    } catch (error) {
        filesystemLogger.error('Failed to load asset', { assetValue, error });
        return "";
    }
}
