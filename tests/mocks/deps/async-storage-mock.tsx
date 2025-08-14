export function asyncStorageMock() {
    return {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        getAllKeys: jest.fn(),
        multiGet: jest.fn(),
        multiSet: jest.fn(),
        multiRemove: jest.fn(),
    };
}


