/**
 * TODO fill this part
 * @format
*/

import * as FileSystem from 'expo-file-system';
// import { Asset } from 'expo-asset';

export default class FileGestion {


    protected _directoryName: string;
    protected _directoryUri: string;

    public constructor() {
        this._directoryName = "RecipesManager";
        this._directoryUri = FileSystem.documentDirectory + this._directoryName + "/";
        
        try {
            FileSystem.readDirectoryAsync(this._directoryUri);
        } catch (error) {
            console.warn(error);
            FileSystem.makeDirectoryAsync(this._directoryUri);
        }
    }
    
    /* PROTECTED METHODS */
    
    
    /* PUBLIC METHODS */
    public get_directoryUri() {
        return this._directoryUri;
    }

    public async init() {
        // const assetLoaded = await Asset.loadAsync([
            //     require("../assets/images/architecture.jpg"),
            //     require("../assets/images/bike.jpg"),
            //     require("../assets/images/cat.jpg"),
            //     require("../assets/images/child.jpg"),
            //     require("../assets/images/church.jpg"),
            //     require("../assets/images/coffee.jpg"),
            //     require("../assets/images/crimson.jpg"),
            //     require("../assets/images/dog.jpg"),
            //     require("../assets/images/monastery.jpg"),
            //     require("../assets/images/motocross.jpg"),
            //     require("../assets/images/mushrooms.jpg"),
            //     require("../assets/images/scooter.jpg"),
            //     require("../assets/images/strawberries.jpg"),
            //     require("../assets/images/tree.jpg"),
            //     require("../assets/images/waves.jpg"),
            // ]
            // );
            // for (let i = 0; i < assetLoaded.length; i++) {
                //     const newUri = this._directoryUri + '/' + assetLoaded[i].name + '.' + assetLoaded[i].type
                //     console.log("localUri : ", assetLoaded[i].localUri, ", newUri : ", newUri);
                //     await FileSystem.copyAsync({from: assetLoaded[i].localUri as string, to: newUri})
                // }
                
                try {
                    await FileSystem.readDirectoryAsync(this._directoryUri)
                } catch (error) {
                    console.warn(error);
                    await FileSystem.makeDirectoryAsync(this._directoryUri);
                }
                
            }
}

export const fileGestion = new FileGestion();