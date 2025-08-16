# Testing Guide

This document provides comprehensive guidelines for testing the Recipedia app, covering unit tests, integration tests,
and end-to-end testing strategies.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Structure](#testing-structure)
- [Unit Testing](#unit-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Data and Mocks](#test-data-and-mocks)
- [Running Tests](#running-tests)
- [Writing Good Tests](#writing-good-tests)
- [Continuous Integration](#continuous-integration)

## 🎯 Testing Philosophy

Recipedia follows a comprehensive testing strategy with multiple layers:

```
    /\
   /  \     E2E Tests (Few, Expensive, High Confidence)
  /    \
 /______\   Integration Tests (Some, Medium Cost)
/__________\ Unit Tests (Many, Fast, Low Cost)
```

### Testing Principles

- **Test Pyramid**: More unit tests, fewer E2E tests
- **Test Behavior**: Focus on what the code does, not how
- **Maintainable Tests**: Tests should be easy to understand and modify
- **Fast Feedback**: Unit tests should run quickly for immediate feedback
- **Real-World Scenarios**: E2E tests should cover actual user workflows

## 📁 Testing Structure

```
tests/
├── unit/                 # Unit tests
│   ├── components/      # Component tests
│   ├── utils/          # Utility function tests
│   ├── screens/        # Screen tests
│   └── customTypes/    # Type validation tests
├── e2e/                 # End-to-end tests
│   ├── flows/          # User workflow tests
│   ├── asserts/        # Assertion helpers
│   └── *.yaml         # Maestro test files
├── mocks/              # Mock implementations
│   ├── components/     # Component mocks
│   ├── utils/         # Utility mocks
│   └── deps/          # Dependency mocks
├── data/               # Test data sets
└── assets/            # Test images and files
```

## 🧪 Unit Testing

Unit tests focus on testing individual components and functions in isolation.

### Test Framework

- **Jest**: JavaScript testing framework
- **React Native Testing Library**: Component testing utilities
- **TypeScript**: Type-safe test development

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit-watch

# Run with coverage report
npm run test:unit-coverage

# Run specific test file
npm run test:unit -- CustomTextInput.test.tsx

# Run tests matching pattern
npm run test:unit -- --testNamePattern="should render"
```

### Component Testing

#### Basic Component Test Structure

See [`tests/unit/components/atomic/CustomTextInput.test.tsx`](../tests/unit/components/atomic/CustomTextInput.test.tsx) for a complete example of component testing patterns.

#### Testing with Context

See [`tests/unit/components/molecules/RecipeCard.test.tsx`](../tests/unit/components/molecules/RecipeCard.test.tsx) for examples of testing components with React Native Paper theme context.

### Utility Function Testing

See [`tests/unit/utils/Quantity.test.tsx`](../tests/unit/utils/Quantity.test.tsx) for examples of testing utility functions with edge cases and error handling.

### Database Testing

See [`tests/unit/utils/RecipeDatabase.test.tsx`](../tests/unit/utils/RecipeDatabase.test.tsx) for examples of testing database operations with proper mocking of expo-sqlite.

### Screen Testing

See [`tests/unit/screens/Home.test.tsx`](../tests/unit/screens/Home.test.tsx) for examples of testing screens with navigation mocking and async operations.

## 🎭 End-to-End Testing

E2E tests verify complete user workflows using Maestro.

### Maestro Setup

```bash
# Install Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

### E2E Test Structure

See [`tests/e2e/1_launchApp.yaml`](../tests/e2e/1_launchApp.yaml) for the basic app launch test structure.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e:android

# Run specific test file
maestro test tests/e2e/1_launchApp.yaml

# Run with debug output
maestro test --debug-output=maestro_logs tests/e2e/
```

### Common E2E Test Patterns

Refer to the various test files in [`tests/e2e/`](../tests/e2e/) for examples of:

- Language switching flows
- Recipe creation and editing workflows
- Search and filtering functionality
- Navigation patterns

## 🎭 Test Data and Mocks

### Mock Data

Test data is centralized in [`tests/data/recipesDataset.tsx`](../tests/data/recipesDataset.tsx) with mock recipes, ingredients, and other test fixtures.

```

### Component Mocks

Component mocks are available in [`tests/mocks/components/`](../tests/mocks/components/) following the same structure as the main component hierarchy.
```

### Utility Mocks

Utility mocks are available in [`tests/mocks/utils/`](../tests/mocks/utils/) for mocking file operations, database calls, and external dependencies.

## 🏃‍♂️ Running Tests

### Test Scripts

```json
{
  "scripts": {
    "test:unit": "jest --verbose --config jest.config.js",
    "test:unit-watch": "jest --watchAll --silent --config jest.config.js",
    "test:unit-coverage": "jest --silent --coverage --json --outputFile=jest-results.json --config jest.config.js",
    "test:e2e:android": "maestro test --debug-output=maestro_logs --format junit tests/e2e/*",
    "build-install-and-test:e2e:android": "npm run build:android && npm run install:android && npm run test:e2e:android"
  }
}
```

### Jest Configuration

The Jest configuration is defined in [`jest.config.js`](../jest.config.js) with proper path mappings and React Native presets.

### Coverage Reports

Generate coverage reports with `npm run test:unit-coverage`. View the HTML report at `coverage/lcov-report/index.html`.

## ✍️ Writing Good Tests

### Test Naming Conventions

Follow the pattern:

- `describe('ComponentName', () => {})`
- `describe('when condition', () => {})`
- `it('should behavior', () => {})`

### Test Structure (AAA Pattern)

Use the Arrange-Act-Assert pattern for clear test structure. See existing test files for examples.

### Testing Async Operations

Use `waitFor` from React Native Testing Library for async operations. See component tests for examples.

### Testing Error States

Test error handling by mocking rejected promises and verifying error messages are displayed.

## 🚀 Continuous Integration

The project uses GitHub Actions for CI/CD. See [`.github/workflows/android-ci.yml`](../.github/workflows/android-ci.yml) for the complete workflow configuration that runs unit tests and E2E tests on pull requests.

## 📊 Test Metrics and Reporting

### Coverage Reporting

- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of code branches taken
- **Function Coverage**: Percentage of functions called
- **Statement Coverage**: Percentage of statements executed

### Test Health Monitoring

Use `--verbose --detectOpenHandles` flags to monitor test flakiness and identify performance issues.

## 🔧 Debugging Tests

### Debug Unit Tests

```bash
# Run single test with debugging
npm run test:unit -- --runInBand --detectOpenHandles ComponentName.test.tsx

# Debug with VS Code
# Add breakpoint and run "Debug Jest Tests" configuration
```

### Debug E2E Tests

```bash
# Run with debug output
maestro test --debug-output=maestro_logs tests/e2e/

# Interactive debugging
maestro studio
```

## 📚 Testing Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Maestro Documentation](https://maestro.mobile.dev/getting-started/installing-maestro)

### Best Practices

- [Testing React Native Apps](https://reactnative.dev/docs/testing-overview)
- [Effective Unit Testing](https://testing-library.com/docs/guiding-principles/)
- [E2E Testing Strategies](https://martinfowler.com/articles/practical-test-pyramid.html)

This comprehensive testing guide ensures that Recipedia maintains high quality and reliability through robust testing
practices at all levels.
