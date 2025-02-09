export function fileGestionMock() {
    const mockInstance = {
        get_directoryUri: jest.fn().mockReturnValue(''),
        get_cacheUri: jest.fn().mockReturnValue(''),
        clearCache: jest.fn(),
        moveFile: jest.fn(),
        copyFile: jest.fn(),
        saveRecipeImage: jest.fn().mockResolvedValue(''),
        backUpFile: jest.fn().mockResolvedValue(''),
        rotateImage: jest.fn().mockResolvedValue({uri: './rotated.jpg'}),
        flipImageHorizontally: jest.fn().mockResolvedValue({uri: './flipped-horizontal.jpg'}),
        flipImageVertically: jest.fn().mockResolvedValue({uri: './flipped-vertical.jpg'}),
        cropImage: jest.fn().mockResolvedValue({uri: './cropped.jpg'}),
        init: jest.fn(),
    };
    return {
        getInstance: jest.fn(() => mockInstance),
    };
}
