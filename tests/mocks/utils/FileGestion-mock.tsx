export function fileGestionMock() {
  const mockInstance = {
    get_directoryUri: jest.fn().mockReturnValue(''),
    get_cacheUri: jest.fn().mockReturnValue(''),
    isTemporaryImageUri: jest.fn().mockImplementation(function (this: any, uri: string): boolean {
      const directoryUri = this.get_directoryUri();
      return !uri.includes(directoryUri);
    }),
    clearCache: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
    saveRecipeImage: jest.fn().mockResolvedValue('/mock/directory/saved_image.jpg'),
    backUpFile: jest.fn().mockResolvedValue(''),
    rotateImage: jest.fn().mockResolvedValue({ uri: './rotated.jpg' }),
    flipImageHorizontally: jest.fn().mockResolvedValue({ uri: './flipped-horizontal.jpg' }),
    flipImageVertically: jest.fn().mockResolvedValue({ uri: './flipped-vertical.jpg' }),
    cropImage: jest.fn().mockResolvedValue({ uri: './cropped.jpg' }),
    init: jest.fn().mockResolvedValue(undefined),
  };
  mockInstance.isTemporaryImageUri = mockInstance.isTemporaryImageUri.bind(mockInstance);
  return {
    getInstance: jest.fn(() => mockInstance),
    transformDatasetRecipeImages: jest.fn((recipes: any[], directoryUri: string) =>
      recipes.map(recipe => ({
        ...recipe,
        image_Source: directoryUri + recipe.image_Source,
      }))
    ),
  };
}
