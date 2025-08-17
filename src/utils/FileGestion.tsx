/**
 * FileGestion - File system management and image storage utilities
 *
 * This singleton class provides comprehensive file system management for the Recipedia app.
 * It handles image storage, cache management, asset initialization, and file operations
 * with proper error handling and logging.
 *
 * Key Features:
 * - Organized directory structure for app data and cache
 * - Recipe image storage with automatic naming
 * - Cache management for temporary files
 * - Asset initialization for bundled images
 * - File copy, move, and backup operations
 * - Singleton pattern for consistent file paths
 *
 * Directory Structure:
 * - Documents: `/documents/Recipedia/` - Permanent app data
 * - Cache: `/cache/Recipedia/` - Temporary app cache
 * - Image Manipulator Cache: `/cache/ImageManipulator/` - Image processing temp files
 * - Camera Cache: `/cache/ExperienceData/` - Camera temp files
 *
 * @example
 * ```typescript
 * const fileManager = FileGestion.getInstance();
 * await fileManager.init();
 *
 * // Save a recipe image
 * const imageName = await fileManager.saveRecipeImage(tempUri, "Chocolate Cake");
 *
 * // Clear cache
 * await fileManager.clearCache();
 * ```
 */

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import pkg from '@app/package.json';
import { initialRecipesImages } from '@utils/Constants';
import { filesystemLogger } from '@utils/logger';

export default class FileGestion {
  static #instance: FileGestion;

  protected _directoryName: string;
  protected _directoryUri: string;
  protected _cacheUri: string;
  protected _imageManipulatorCacheUri: string;
  protected _cameraCacheUri: string;

  /**
   * Creates a new FileGestion instance (private - use getInstance())
   *
   * Initializes all directory paths based on the app name from config or package.json.
   * Sets up separate directories for permanent storage and various cache types.
   */
  public constructor() {
    this._directoryName = Constants.expoConfig?.name || pkg.name;
    this._directoryUri = FileSystem.documentDirectory + this._directoryName + '/';
    this._cacheUri = FileSystem.cacheDirectory + this._directoryName + '/';
    this._imageManipulatorCacheUri = FileSystem.cacheDirectory + 'ImageManipulator/';
    this._cameraCacheUri = FileSystem.cacheDirectory + 'ExperienceData/';
  }

  /**
   * Gets the singleton instance of FileGestion
   *
   * @returns The singleton FileGestion instance
   */
  public static getInstance(): FileGestion {
    if (!FileGestion.#instance) {
      FileGestion.#instance = new FileGestion();
    }
    return FileGestion.#instance;
  }

  /* PUBLIC METHODS */

  /**
   * Gets the main app directory URI for permanent storage
   *
   * @returns URI path to the main app directory
   */
  public get_directoryUri() {
    return this._directoryUri;
  }

  /**
   * Gets the app cache directory URI for temporary storage
   *
   * @returns URI path to the app cache directory
   */
  public get_cacheUri() {
    return this._cacheUri;
  }

  /**
   * Clears all cache directories
   *
   * Removes and recreates the image manipulator cache and camera cache directories.
   * Used for freeing up storage space and clearing temporary files.
   *
   * @example
   * ```typescript
   * await fileManager.clearCache();
   * console.log('Cache cleared successfully');
   * ```
   */
  public async clearCache() {
    filesystemLogger.info('Clearing cache directories');
    try {
      await FileSystem.deleteAsync(this._imageManipulatorCacheUri);
      await FileSystem.makeDirectoryAsync(this._imageManipulatorCacheUri);
    } catch (error) {
      filesystemLogger.warn('Failed to clear image manipulator cache', {
        cacheUri: this._imageManipulatorCacheUri,
        error,
      });
    }
    try {
      await FileSystem.deleteAsync(this._cameraCacheUri);
      await FileSystem.makeDirectoryAsync(this._cameraCacheUri);
    } catch (error) {
      filesystemLogger.warn('Failed to clear camera cache', {
        cacheUri: this._cameraCacheUri,
        error,
      });
    }
  }

  /**
   * Moves a file from one location to another
   *
   * Deletes the destination file if it exists, then moves the source file.
   * Useful for relocating files from cache to permanent storage.
   *
   * @param oldUri - Source file URI
   * @param newUri - Destination file URI
   *
   * @example
   * ```typescript
   * await fileManager.moveFile(
   *   'file:///cache/temp-image.jpg',
   *   'file:///documents/recipe-image.jpg'
   * );
   * ```
   */
  public async moveFile(oldUri: string, newUri: string) {
    try {
      // If needed, remove existing file
      await FileSystem.deleteAsync(newUri, { idempotent: true });
      await FileSystem.moveAsync({ from: oldUri, to: newUri });
    } catch (error) {
      filesystemLogger.warn('Failed to move file', { from: oldUri, to: newUri, error });
    }
  }

  /**
   * Copies a file from one location to another
   *
   * Creates a copy of the source file at the destination location.
   * Does not modify or remove the original file.
   *
   * @param oldUri - Source file URI
   * @param newUri - Destination file URI
   *
   * @example
   * ```typescript
   * await fileManager.copyFile(
   *   'file:///cache/temp-image.jpg',
   *   'file:///documents/recipe-image.jpg'
   * );
   * ```
   */
  public async copyFile(oldUri: string, newUri: string) {
    try {
      await FileSystem.copyAsync({ from: oldUri, to: newUri });
    } catch (error) {
      filesystemLogger.warn('Failed to copy file', { from: oldUri, to: newUri, error });
    }
  }

  /**
   * Saves a recipe image from cache to permanent storage
   *
   * Takes a temporary image file and saves it to the main app directory with
   * a standardized naming convention. The recipe name is sanitized and used
   * as the filename with the original file extension preserved.
   *
   * @param cacheFileUri - URI of the temporary image file
   * @param recName - Recipe name to use for the filename
   * @returns Promise resolving to the saved filename, or empty string if failed
   *
   * @example
   * ```typescript
   * const tempImageUri = "file:///cache/temp-image.jpg";
   * const imageName = await fileManager.saveRecipeImage(tempImageUri, "Chocolate Cake");
   * // Returns: "chocolate_cake.jpg"
   * ```
   */
  public async saveRecipeImage(cacheFileUri: string, recName: string): Promise<string> {
    filesystemLogger.debug('Saving recipe image', { cacheFileUri, recipeName: recName });

    const extension = cacheFileUri.split('.');
    const imgName =
      recName.replace(/ /g, '_').toLowerCase() + '.' + extension[extension.length - 1];
    const imgUri: string = this._directoryUri + imgName;
    try {
      await this.copyFile(cacheFileUri, imgUri);
      filesystemLogger.debug('Recipe image saved successfully', {
        imageName: imgName,
        imageUri: imgUri,
      });
      return imgName;
    } catch (error) {
      filesystemLogger.warn('Failed to save recipe image', {
        cacheFileUri,
        recipeName: recName,
        error,
      });
      return '';
    }
  }

  /**
   * Creates a backup copy of a file in the cache directory
   *
   * Copies a file to the cache directory, preserving the original filename.
   * Useful for creating temporary backups before file modifications.
   *
   * @param uriToBackUp - URI of the file to backup
   * @returns Promise resolving to the backup file URI
   *
   * @example
   * ```typescript
   * const backupUri = await fileManager.backUpFile('/documents/recipe-image.jpg');
   * console.log(`Backup created at: ${backupUri}`);
   * ```
   */
  public async backUpFile(uriToBackUp: string): Promise<string> {
    // TODO remove return new Promise from codebase
    return new Promise(async (resolve, reject) => {
      const oldUriSplit = uriToBackUp.split('/');
      const backUpUri = this.get_cacheUri() + oldUriSplit[oldUriSplit.length - 1];

      try {
        await this.copyFile(uriToBackUp, backUpUri);
        resolve(backUpUri);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initializes the file system and copies bundled assets
   *
   * Creates necessary directories and copies initial recipe images from the app bundle
   * to the file system. This method should be called during app startup.
   *
   * Assets are only copied if they don't already exist, making this operation
   * safe to call multiple times.
   *
   * @example
   * ```typescript
   * const fileManager = FileGestion.getInstance();
   * await fileManager.init();
   * console.log('File system initialized and assets loaded');
   * ```
   */
  public async init() {
    filesystemLogger.info('Initializing file system', {
      directoryUri: this._directoryUri,
      cacheUri: this._cacheUri,
    });
    try {
      await this.ensureDirExists(this._directoryUri);
      await this.ensureDirExists(this._cacheUri);

      const assetModules = await Asset.loadAsync(initialRecipesImages);
      if (assetModules.length !== initialRecipesImages.length) {
        throw new Error(
          'Some assets could not be loaded, please check the list of assets in Constants.tsx and make sure they are all listed in the AppAssets object. Missing assets: '
        );
      }

      for (const asset of assetModules) {
        const destinationUri = this._directoryUri + asset.name + '.' + asset.type;
        const fileInfo = await FileSystem.getInfoAsync(destinationUri);

        if (fileInfo.exists) {
          filesystemLogger.debug('Asset file already exists, skipping', { assetName: asset.name });
          continue;
        }
        await FileSystem.copyAsync({ from: asset.localUri as string, to: destinationUri });
        filesystemLogger.debug('Asset file copied successfully', {
          assetName: asset.name,
          destinationUri,
        });
      }
    } catch (error) {
      filesystemLogger.error('FileGestion initialization failed', { error });
    }
  }

  /**
   * Ensures a directory exists, creating it if necessary
   *
   * Checks if a directory exists and creates it (including intermediate directories)
   * if it doesn't. Throws an error if the path exists but is not a directory.
   *
   * @param dirUri - URI of the directory to ensure exists
   * @throws Error if the path exists but is not a directory
   */
  private async ensureDirExists(dirUri: string) {
    const dirInfo = await FileSystem.getInfoAsync(dirUri);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      filesystemLogger.info('Directory created', { directory: dirUri });
    } else if (!dirInfo.isDirectory) {
      throw new Error(`${dirUri} exists but is not a directory`);
    } else {
      filesystemLogger.debug('Directory already exists', { directory: dirUri });
    }
  }

  /* PROTECTED METHODS */
}
