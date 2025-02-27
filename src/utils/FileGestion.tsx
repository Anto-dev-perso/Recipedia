import {Layout, localImgData, panType} from '@customTypes/ImageTypes';
import * as FileSystem from 'expo-file-system';
import {FlipType, manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import {LayoutRectangle} from 'react-native';
import {Asset} from "expo-asset";
// import { Asset } from 'expo-asset';
//  TODO is new version changing stuff for image manipulator ?
// TODO asset could be loaded at compile time ?
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
        const imgUri: string = this._directoryUri + recName.replace(/ /g, "_").toLowerCase() + '.' + extension[extension.length - 1];
        try {
            await this.copyFile(cacheFileUri, imgUri);
            return imgUri;
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

    public async rotateImage(imgUri: string): Promise<localImgData> {
        return new Promise(async (resolve, reject) => {
            try {
                if (imgUri.length > 0) {
                    const manipulateRes: localImgData = await manipulateAsync(imgUri, [{rotate: 90}], {
                        compress: 1,
                        format: SaveFormat.PNG
                    });

                    resolve(manipulateRes)
                } else {
                    reject("Uri empty !")
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    public async flipImageHorizontally(imgUri: string): Promise<localImgData> {
        return new Promise(async (resolve, reject) => {
            try {
                if (imgUri.length > 0) {
                    const manipulateRes: localImgData = await manipulateAsync(imgUri, [{flip: FlipType.Horizontal}], {
                        compress: 1,
                        format: SaveFormat.PNG
                    });

                    resolve(manipulateRes);
                } else {
                    reject("Uri empty !")
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    public async flipImageVertically(imgUri: string): Promise<localImgData> {
        return new Promise(async (resolve, reject) => {
            try {
                if (imgUri.length > 0) {
                    const manipulateRes: localImgData = await manipulateAsync(imgUri, [{flip: FlipType.Vertical}], {
                        compress: 1,
                        format: SaveFormat.PNG
                    });

                    resolve(manipulateRes)
                } else {
                    reject("Uri empty !")
                }
            } catch (error) {
                console.log(error);
            }
        })
    }

    public async cropImage(imgUri: string, accumulatedPan: panType, imageBounds: LayoutRectangle, imageScaleFactor: number, cropSize: Layout): Promise<localImgData> {
        return new Promise(async (resolve, reject) => {
            try {
                const croppingBounds = {
                    originX: Math.round((accumulatedPan.x - imageBounds.x) * imageScaleFactor),
                    originY: Math.round((accumulatedPan.y - imageBounds.y) * imageScaleFactor),
                    width: Math.round(cropSize.width * imageScaleFactor),
                    height: Math.round(cropSize.height * imageScaleFactor)
                };

                const manipulateRes: localImgData = await manipulateAsync(imgUri, [{crop: croppingBounds}], {
                    compress: 1,
                    format: SaveFormat.PNG
                });

                resolve(manipulateRes);
            } catch (error) {
                reject(error);
            }
        })
    }

    public async init() {
        try {
            const dirFiles = await FileSystem.readDirectoryAsync(this._directoryUri);
            dirFiles.forEach(file => {
                //     TODO temporary for tests
                FileSystem.deleteAsync(this._directoryUri + file);
            });
        } catch (error) {
            console.warn("init: ", error);
            await FileSystem.makeDirectoryAsync(this._directoryUri);
        }
        // TODO temporary for tests
        const assetLoaded = await Asset.loadAsync([
            require("../assets/images/architecture.jpg"),
            require("../assets/images/bike.jpg"),
            require("../assets/images/cat.jpg"),
            require("../assets/images/child.jpg"),
            require("../assets/images/church.jpg"),
            require("../assets/images/coffee.jpg"),
            require("../assets/images/crimson.jpg"),
            require("../assets/images/dog.jpg"),
            require("../assets/images/monastery.jpg"),
            require("../assets/images/motocross.jpg"),
            require("../assets/images/mushrooms.jpg"),
            require("../assets/images/scooter.jpg"),
            require("../assets/images/strawberries.jpg"),
            require("../assets/images/tree.jpg"),
            require("../assets/images/waves.jpg"),
        ]);
        for (let i = 0; i < assetLoaded.length; i++) {
            const newUri = this._directoryUri + '/' + assetLoaded[i].name + '.' + assetLoaded[i].type;
            //     console.log("localUri : ", assetLoaded[i].localUri, ", newUri : ", newUri);
            await FileSystem.copyAsync({from: assetLoaded[i].localUri as string, to: newUri})
        }

        try {
            const cacheFiles = await FileSystem.readDirectoryAsync(this._cacheUri);

            cacheFiles.forEach(file => {
                FileSystem.deleteAsync(this._cacheUri + file);

            });
        } catch (error) {
            console.warn("init: ", error);
            await FileSystem.makeDirectoryAsync(this._cacheUri);
        }
    }

    /* PROTECTED METHODS */
}
