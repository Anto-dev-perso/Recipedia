import { FileGestion } from '@utils/FileGestion';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { Asset } from 'expo-asset';

jest.mock('expo-file-system', () =>
  require('@mocks/deps/expo-file-system-mock').expoFileSystemMock()
);

jest.mock('expo-constants', () => require('@mocks/deps/expo-constants-mock').expoConstantsMock());

jest.mock('expo-asset', () => require('@mocks/deps/expo-asset-mock').expoAssetMock());

jest.mock('@app/package.json', () => require('@mocks/app/package-json-mock').packageJsonMock());

jest.mock('@utils/Constants', () => require('@mocks/utils/Constants-mock').constantsMock());

describe('FileGestion Utility', () => {
  let fileGestion: FileGestion;

  const mockGetInfoAsync = FileSystem.getInfoAsync as jest.Mock;
  const mockMakeDirectoryAsync = FileSystem.makeDirectoryAsync as jest.Mock;
  const mockReadDirectoryAsync = FileSystem.readDirectoryAsync as jest.Mock;
  const mockCopyAsync = FileSystem.copyAsync as jest.Mock;
  const mockDeleteAsync = FileSystem.deleteAsync as jest.Mock;
  const mockWriteAsStringAsync = FileSystem.writeAsStringAsync as jest.Mock;
  const mockReadAsStringAsync = FileSystem.readAsStringAsync as jest.Mock;
  const mockAssetFromModule = Asset.fromModule as jest.Mock;
  const mockAssetLoadAsync = Asset.loadAsync as jest.Mock;

  const defaultDocumentsPath = '/documents/TestRecipedia/';
  const defaultCachePath = '/cache/TestRecipedia/';

  const mockDirectoryExists = (exists: boolean = false) => {
    mockGetInfoAsync.mockResolvedValue({ exists, isDirectory: exists });
  };

  const mockFileExists = (exists: boolean = false, isDirectory: boolean = false) => {
    mockGetInfoAsync.mockResolvedValue({ exists, isDirectory });
  };

  const assertDirectoryPaths = (instance: FileGestion = fileGestion) => {
    expect(instance.get_directoryUri()).toBe(defaultDocumentsPath);
    expect(instance.get_cacheUri()).toBe(defaultCachePath);
  };

  const resetAllMocks = () => {
    jest.clearAllMocks();
    mockGetInfoAsync.mockReset();
    mockMakeDirectoryAsync.mockReset();
    mockReadDirectoryAsync.mockReset();
    mockCopyAsync.mockReset();
    mockDeleteAsync.mockReset();
    mockWriteAsStringAsync.mockReset();
    mockReadAsStringAsync.mockReset();
    mockAssetFromModule.mockReset();
    mockAssetLoadAsync.mockReset();
  };

  const setupInitializationMocks = (directoryExists: boolean = false) => {
    mockDirectoryExists(directoryExists);
    mockMakeDirectoryAsync.mockResolvedValue(undefined);
  };

  const setupImageSavingMocks = () => {
    mockCopyAsync.mockResolvedValue(undefined);
  };

  beforeEach(() => {
    resetAllMocks();
    // Reset singleton instance
    (FileGestion as any).instance = undefined;
    fileGestion = FileGestion.getInstance();
  });

  afterEach(() => {
    resetAllMocks();
  });

  test('implements singleton pattern correctly', () => {
    const instance1 = FileGestion.getInstance();
    const instance2 = FileGestion.getInstance();
    const instance3 = FileGestion.getInstance();

    expect(instance1).toBe(instance2);
    expect(instance2).toBe(instance3);
    expect(instance1).toBe(instance3);
    expect(instance1).toBe(fileGestion);
  });

  test('initializes directory paths correctly from expo config', () => {
    const instance = FileGestion.getInstance();

    expect(instance.get_directoryUri()).toBe(defaultDocumentsPath);
    expect(instance.get_cacheUri()).toBe(defaultCachePath);
    assertDirectoryPaths(instance);
  });

  test('falls back to package.json name when expo config is unavailable', () => {
    (Constants as any).expoConfig = null;

    const instanceWithoutConfig = new FileGestion();

    expect(instanceWithoutConfig.get_directoryUri()).toBe('/documents/recipedia/');
    expect(instanceWithoutConfig.get_cacheUri()).toBe('/cache/recipedia/');
  });

  test('creates main directory when it does not exist during initialization', async () => {
    setupInitializationMocks(false);

    await fileGestion.init();

    expect(mockGetInfoAsync).toHaveBeenCalledWith(defaultDocumentsPath);
    expect(mockMakeDirectoryAsync).toHaveBeenCalledWith(defaultDocumentsPath, {
      intermediates: true,
    });
  });

  test('skips directory creation when it already exists', async () => {
    setupInitializationMocks(true);

    await fileGestion.init();

    expect(mockGetInfoAsync).toHaveBeenCalledWith(defaultDocumentsPath);
    expect(mockMakeDirectoryAsync).not.toHaveBeenCalled();
  });

  test('copies initial recipe images during initialization', async () => {
    setupInitializationMocks(false);
    mockFileExists(false);

    const mockAssets = [
      { name: 'image1', type: 'jpg', localUri: '/asset/path/image1.jpg' },
      { name: 'image2', type: 'jpg', localUri: '/asset/path/image2.jpg' },
      { name: 'image3', type: 'jpg', localUri: '/asset/path/image3.jpg' },
    ];
    mockAssetLoadAsync.mockResolvedValue(mockAssets);
    mockCopyAsync.mockResolvedValue(undefined);

    await fileGestion.init();

    expect(mockAssetLoadAsync).toHaveBeenCalledTimes(1);
    expect(mockCopyAsync).toHaveBeenCalledTimes(3);
    expect(mockCopyAsync).toHaveBeenCalledWith({
      from: '/asset/path/image1.jpg',
      to: defaultDocumentsPath + 'image1.jpg',
    });
  });

  test('saves recipe image with proper naming and file operations', async () => {
    const sourceUri = '/temp/recipe-photo.jpg';
    const recipeName = 'Chocolate Cake';
    const expectedImageName = 'chocolate_cake.jpg';
    const expectedDestination = defaultDocumentsPath + 'chocolate_cake.jpg';

    setupImageSavingMocks();

    const result = await fileGestion.saveRecipeImage(sourceUri, recipeName);

    expect(result).toBe(expectedImageName);
    expect(mockCopyAsync).toHaveBeenCalledWith({ from: sourceUri, to: expectedDestination });
    expect(mockCopyAsync).toHaveBeenCalledTimes(1);
  });

  test('sanitizes recipe names correctly for filename generation', async () => {
    const testCases = [
      { input: 'Simple Recipe', expected: 'simple_recipe.jpg' },
      {
        input: 'Recipe with Special@#$%Characters',
        expected: 'recipe_with_special@#$%characters.jpg',
      },
      { input: '   Spaced   Recipe   ', expected: '___spaced___recipe___.jpg' },
      { input: 'Recipe/With\\Slashes', expected: 'recipe/with\\slashes.jpg' },
      { input: 'Recipe:With;Colons,And<More>', expected: 'recipe:with;colons,and<more>.jpg' },
    ];

    setupImageSavingMocks();

    for (const { input, expected } of testCases) {
      const result = await fileGestion.saveRecipeImage('/temp/test.jpg', input);
      expect(result).toBe(expected);
      jest.clearAllMocks();
    }
  });

  test('clears cache directories completely', async () => {
    mockDeleteAsync.mockResolvedValue(undefined);
    mockMakeDirectoryAsync.mockResolvedValue(undefined);

    await fileGestion.clearCache();

    expect(mockDeleteAsync).toHaveBeenCalledWith('/cache/ImageManipulator/');
    expect(mockDeleteAsync).toHaveBeenCalledWith('/cache/ExperienceData/');
    expect(mockMakeDirectoryAsync).toHaveBeenCalledWith('/cache/ImageManipulator/');
    expect(mockMakeDirectoryAsync).toHaveBeenCalledWith('/cache/ExperienceData/');
    expect(mockDeleteAsync).toHaveBeenCalledTimes(2);
    expect(mockMakeDirectoryAsync).toHaveBeenCalledTimes(2);
  });

  test('handles file system errors gracefully during initialization', async () => {
    mockGetInfoAsync.mockRejectedValue(new Error('File system error'));

    await expect(fileGestion.init()).resolves.toBeUndefined();
    expect(mockGetInfoAsync).toHaveBeenCalledWith(defaultDocumentsPath);
  });

  test('handles errors during image saving operations', async () => {
    const sourceUri = '/temp/failing-image.jpg';
    const recipeName = 'Test Recipe';

    mockCopyAsync.mockRejectedValue(new Error('Copy operation failed'));

    const result = await fileGestion.saveRecipeImage(sourceUri, recipeName);
    expect(result).toBe('test_recipe.jpg');
    expect(mockCopyAsync).toHaveBeenCalledWith({
      from: sourceUri,
      to: defaultDocumentsPath + 'test_recipe.jpg',
    });
  });

  test('handles errors during cache clearing operations', async () => {
    mockDeleteAsync
      .mockRejectedValueOnce(new Error('Delete failed'))
      .mockResolvedValueOnce(undefined);

    await expect(fileGestion.clearCache()).resolves.toBeUndefined();
    expect(mockDeleteAsync).toHaveBeenCalledTimes(2);
  });

  test('maintains consistent directory structure across operations', async () => {
    setupInitializationMocks(false);
    setupImageSavingMocks();
    mockDeleteAsync.mockResolvedValue(undefined);

    await fileGestion.init();
    await fileGestion.saveRecipeImage('/temp/test.jpg', 'Test Recipe');
    await fileGestion.clearCache();

    assertDirectoryPaths();
    expect(mockMakeDirectoryAsync).toHaveBeenCalledWith(defaultDocumentsPath, {
      intermediates: true,
    });
    expect(mockCopyAsync).toHaveBeenCalledWith({
      from: '/temp/test.jpg',
      to: defaultDocumentsPath + 'test_recipe.jpg',
    });
    expect(mockDeleteAsync).toHaveBeenCalledWith('/cache/ImageManipulator/');
  });

  test('handles concurrent operations safely', async () => {
    setupInitializationMocks(false);
    setupImageSavingMocks();
    mockFileExists(false);

    const initPromise = fileGestion.init();
    const savePromise1 = fileGestion.saveRecipeImage('/temp/image1.jpg', 'Recipe 1');
    const savePromise2 = fileGestion.saveRecipeImage('/temp/image2.jpg', 'Recipe 2');

    const results = await Promise.all([initPromise, savePromise1, savePromise2]);

    expect(results[1]).toBe('recipe_1.jpg');
    expect(results[2]).toBe('recipe_2.jpg');
    expect(mockCopyAsync).toHaveBeenCalledTimes(2);
  });

  test('validates directory URI getters return correct paths', () => {
    const instance = FileGestion.getInstance();

    expect(instance.get_directoryUri()).toBe(defaultDocumentsPath);
    expect(instance.get_cacheUri()).toBe(defaultCachePath);
    expect(instance.get_directoryUri()).toMatch(/\/TestRecipedia\/$/);
    expect(instance.get_cacheUri()).toMatch(/\/TestRecipedia\/$/);
    expect(instance.get_directoryUri()).toMatch(/^\/documents\//);
    expect(instance.get_cacheUri()).toMatch(/^\/cache\//);
  });

  test('handles edge cases in recipe name sanitization', async () => {
    const edgeCases = [
      { input: '', expected: '.jpg' },
      { input: '   ', expected: '___.jpg' },
      { input: '!@#$%^&*()', expected: '!@#$%^&*().jpg' },
      { input: 'Recipe.with.dots', expected: 'recipe.with.dots.jpg' },
      { input: 'Recipe\nwith\nnewlines', expected: 'recipe\nwith\nnewlines.jpg' },
      { input: 'Recipe\twith\ttabs', expected: 'recipe\twith\ttabs.jpg' },
    ];

    setupImageSavingMocks();

    for (const { input, expected } of edgeCases) {
      const result = await fileGestion.saveRecipeImage('/temp/test.jpg', input);
      expect(result).toBe(expected);
      jest.clearAllMocks();
    }
  });
});
