import * as FileSystem from 'expo-file-system';
import {Asset} from "expo-asset";
import Constants from 'expo-constants';
import pkg from '@app/package.json';
import {initialRecipesImages} from "@utils/Constants";
import {filesystemLogger} from '@utils/logger';
//  TODO is new version changing stuff for image manipulator ?
//  TODO is expo-file-system/next better ?

// TODO to test
export default class FileGestion {

    static #instance: FileGestion;

    protected _directoryName: string;
    protected _directoryUri: string;
    protected _cacheUri: string;
    protected _imageManipulatorCacheUri: string;
    protected _cameraCacheUri: string;

    public constructor() {
        this._directoryName = Constants.expoConfig?.name || pkg.name;
        this._directoryUri = FileSystem.documentDirectory + this._directoryName + "/";
        this._cacheUri = FileSystem.cacheDirectory + this._directoryName + "/";
        this._imageManipulatorCacheUri = FileSystem.cacheDirectory + "ImageManipulator/";
        this._cameraCacheUri = FileSystem.cacheDirectory + "ExperienceData/";
    }

    public static getInstance(): FileGestion {
        if (!FileGestion.#instance) {
            FileGestion.#instance = new FileGestion();
        }
        return FileGestion.#instance;
    }

    /* PUBLIC METHODS */
    public get_directoryUri() {
        return this._directoryUri;
    }

    public get_cacheUri() {
        return this._cacheUri;
    }

    public async clearCache() {
        filesystemLogger.info('Clearing cache directories');
        try {
            await FileSystem.deleteAsync(this._imageManipulatorCacheUri);
            await FileSystem.makeDirectoryAsync(this._imageManipulatorCacheUri);
        } catch (error) {
            filesystemLogger.warn("Failed to clear image manipulator cache", {
                cacheUri: this._imageManipulatorCacheUri,
                error
            });
        }
        try {
            await FileSystem.deleteAsync(this._cameraCacheUri);
            await FileSystem.makeDirectoryAsync(this._cameraCacheUri);
        } catch (error) {
            filesystemLogger.warn("Failed to clear camera cache", {cacheUri: this._cameraCacheUri, error});
        }
    }

    public async moveFile(oldUri: string, newUri: string) {
        try {
            // If needed, remove existing file
            await FileSystem.deleteAsync(newUri, {idempotent: true});
            await FileSystem.moveAsync({from: oldUri, to: newUri});
        } catch (error) {
            filesystemLogger.warn("Failed to move file", {from: oldUri, to: newUri, error});
        }
    }

    public async copyFile(oldUri: string, newUri: string) {
        try {
            await FileSystem.copyAsync({from: oldUri, to: newUri});
        } catch (error) {
            filesystemLogger.warn("Failed to copy file", {from: oldUri, to: newUri, error});
        }
    }

    public async saveRecipeImage(cacheFileUri: string, recName: string): Promise<string> {
        filesystemLogger.debug('Saving recipe image', {cacheFileUri, recipeName: recName});

        const extension = cacheFileUri.split('.');
        const imgName = recName.replace(/ /g, "_").toLowerCase() + '.' + extension[extension.length - 1]
        const imgUri: string = this._directoryUri + imgName;
        try {
            await this.copyFile(cacheFileUri, imgUri);
            filesystemLogger.debug('Recipe image saved successfully', {imageName: imgName, imageUri: imgUri});
            return imgName;
        } catch (error) {
            filesystemLogger.warn("Failed to save recipe image", {cacheFileUri, recipeName: recName, error});
            return "";
        }
    }

    public async backUpFile(uriToBackUp: string): Promise<string> {
        // TODO remove return new Promise from codebase
        return new Promise(async (resolve, reject) => {

            const oldUriSplit = uriToBackUp.split("/");
            const backUpUri = this.get_cacheUri() + oldUriSplit[oldUriSplit.length - 1];

            try {
                await this.copyFile(uriToBackUp, backUpUri);
                resolve(backUpUri);
            } catch (error) {
                reject(error);
            }
        })
    }

    public async init() {
        filesystemLogger.info('Initializing file system', {
            directoryUri: this._directoryUri,
            cacheUri: this._cacheUri
        });
        try {
            await this.ensureDirExists(this._directoryUri);
            await this.ensureDirExists(this._cacheUri);

            const assetModules = await Asset.loadAsync(initialRecipesImages);
            if (assetModules.length !== initialRecipesImages.length) {
                throw new Error("Some assets could not be loaded, please check the list of assets in Constants.tsx and make sure they are all listed in the AppAssets object. Missing assets: ",);
            }

            for (const asset of assetModules) {
                const destinationUri = this._directoryUri + asset.name + '.' + asset.type;
                const fileInfo = await FileSystem.getInfoAsync(destinationUri);

                if (fileInfo.exists) {
                    filesystemLogger.debug('Asset file already exists, skipping', {assetName: asset.name});
                    continue;
                }
                await FileSystem.copyAsync({from: asset.localUri as string, to: destinationUri});
                filesystemLogger.debug('Asset file copied successfully', {assetName: asset.name, destinationUri});
            }
        } catch (error) {
            filesystemLogger.error("FileGestion initialization failed", {error});
        }
    }

    private async ensureDirExists(dirUri: string) {
        const dirInfo = await FileSystem.getInfoAsync(dirUri);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dirUri, {intermediates: true});
            filesystemLogger.info('Directory created', {directory: dirUri});
        } else if (!dirInfo.isDirectory) {
            throw new Error(`${dirUri} exists but is not a directory`);
        } else {
            filesystemLogger.debug('Directory already exists', {directory: dirUri});
        }
    }

    /* PROTECTED METHODS */
}
