const mockBackHandler = {
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  removeEventListener: jest.fn(),
};

module.exports = mockBackHandler;
