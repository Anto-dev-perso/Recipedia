import * as FileSystem from 'expo-file-system';
import {Asset} from "expo-asset";
import {initialRecipesImages} from "@utils/Constants";
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
        this._directoryName = "RecipesManager";
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
        try {
            await FileSystem.deleteAsync(this._imageManipulatorCacheUri);
            await FileSystem.makeDirectoryAsync(this._imageManipulatorCacheUri);
        } catch (error) {
            console.warn("Directory error : ", error);
        }
        try {
            await FileSystem.deleteAsync(this._cameraCacheUri);
            await FileSystem.makeDirectoryAsync(this._cameraCacheUri);
        } catch (error) {
            console.warn("Cache error : ", error);
        }
    }

    public async moveFile(oldUri: string, newUri: string) {
        try {
            // If needed, remove existing file
            await FileSystem.deleteAsync(newUri, {idempotent: true});
            await FileSystem.moveAsync({from: oldUri, to: newUri});
        } catch (error) {
            console.warn("moveFile:", error);
        }
    }

    public async copyFile(oldUri: string, newUri: string) {
        try {
            await FileSystem.copyAsync({from: oldUri, to: newUri});
        } catch (error) {
            console.warn("copyFile: ", error);
        }
    }

    public async saveRecipeImage(cacheFileUri: string, recName: string): Promise<string> {

        const extension = cacheFileUri.split('.');
        const imgName = recName.replace(/ /g, "_").toLowerCase() + '.' + extension[extension.length - 1]
        const imgUri: string = this._directoryUri + imgName;
        try {
            await this.copyFile(cacheFileUri, imgUri);
            return imgName;
        } catch (error) {
            console.warn("saveRecipeImage:", error);
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
                    console.debug(`File ${asset.name} already exists, skipping...`);
                    continue;
                }
                await FileSystem.copyAsync({from: asset.localUri as string, to: destinationUri});
                console.debug(`File ${asset.name} successfully copied to ${destinationUri}`);
            }
        } catch (error) {
            console.warn("init: ", error);
        }
    }

    private async ensureDirExists(dirUri: string) {
        const dirInfo = await FileSystem.getInfoAsync(dirUri);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dirUri, {intermediates: true});
            console.log(`Created directory: ${dirUri}`);
        } else if (!dirInfo.isDirectory) {
            throw new Error(`${dirUri} exists but is not a directory`);
        } else {
            console.debug(`Directory already exists: ${dirUri}`);
        }
    }

    /* PROTECTED METHODS */
}
