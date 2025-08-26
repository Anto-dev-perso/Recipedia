// Global test setup

// Store original console methods for tests that need to verify console calls
global.originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

// Mock console methods to reduce noise in tests, but allow tests to override
if (!global.console._isMocked) {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    _isMocked: true,
  };
}