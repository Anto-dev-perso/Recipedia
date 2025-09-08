export const mockNavigate = jest.fn();

export function reactNavigationMock() {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn(callback => {
      const mockNav = {
        addListener: jest.fn((event, handler) => {
          if (event === 'focus') {
            setTimeout(() => handler(), 10);
          }
          return jest.fn();
        }),
      };
      callback(mockNav);
    }),
  };
}

export const mockNavigationFunctions = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => false),
  dispatch: jest.fn(),
  getState: jest.fn(),
  getParent: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn((event, handler) => {
    if (event === 'focus') {
      setTimeout(() => handler(), 10);
    }
    return jest.fn();
  }),
  removeListener: jest.fn(),
  getId: jest.fn(() => 'mock-id'),
};
