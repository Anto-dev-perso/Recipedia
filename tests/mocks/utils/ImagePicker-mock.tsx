export function imagePickerMock() {
    return {
        pickImage: jest.fn().mockResolvedValue({canceled: true, assets: ''}),
        takePhoto: jest.fn().mockResolvedValue({canceled: true, assets: ''}),
        imagePickerCall: jest.fn().mockResolvedValue({uri: 'path/to/img', width: 100, height: 100})
    };
}
