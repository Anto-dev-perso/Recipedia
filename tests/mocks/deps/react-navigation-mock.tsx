export const mockNavigate = jest.fn();
export const mockAddListener = jest.fn((event, handler) => {
  // Store the handler for testing
  if (event === 'state') {
    setTimeout(() => handler(), 0);
  }
  return jest.fn(); // Return unsubscribe function
});

export function reactNavigationMock() {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
      addListener: mockAddListener,
    }),
    useFocusEffect: jest.fn(() => {
      // Don't call the callback - this simulates a screen that's already focused
      // and won't receive focus/blur events during the test
    }),
    useIsFocused: () => true,
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
