const mockRemove = jest.fn();
const mockAddEventListener = jest.fn(() => ({
  remove: mockRemove,
}));

const mockBackHandler = {
  addEventListener: mockAddEventListener,
  removeEventListener: jest.fn(),
};

module.exports = mockBackHandler;
