# CI/CD Pipeline Documentation

## Overview

This document explains the CI/CD (Continuous Integration/Continuous Deployment) setup for the Recipedia app. The pipeline is implemented using GitHub Actions and consists of separate workflows for code quality, build & test, and releases.

## Workflow Structure

Our CI/CD pipeline is split into three main workflows:

### 1. Code Quality (`.github/workflows/quality.yml`)
Focuses on code quality and standards:
- **Commit Validation**: Validates conventional commit messages on PRs
- **ESLint**: Code linting and style checking
- **Prettier**: Code formatting validation
- **TypeScript**: Type checking and compilation validation
- **Security Audit**: NPM vulnerability scanning with GitHub Security integration

### 2. Build & Test Pipeline (`.github/workflows/build-test.yml`)
Handles building and testing:
- **Unit Tests**: Jest-based unit testing
- **Coverage**: Test coverage reporting with GitHub integration
- **Android Build**: APK building using EAS local builds
- **E2E Tests**: End-to-end testing using Maestro on Android emulator

### 3. Release (`.github/workflows/release.yml`)
Automated versioning and releases:
- **Semantic Release**: Automated versioning based on conventional commits
- **Changelog Generation**: Automatic changelog updates
- **GitHub Releases**: Creates GitHub releases with release notes

All workflows are triggered on:
- Push to the `main` branch
- Pull requests to the `main` branch

## E2E Testing with Maestro

The E2E tests use [Maestro](https://maestro.mobile.dev/), a UI testing framework for mobile apps. The tests are defined
in YAML files in the `tests/e2e/` directory.

### How it Works

For each E2E test job:

1. The environment is set up with Node.js, Java, and the Android SDK
2. The Maestro CLI is installed
3. An Android APK is built using Expo's prebuild and Gradle
4. An Android emulator is started using
   the [ReactiveCircus/android-emulator-runner](https://github.com/ReactiveCircus/android-emulator-runner) action
5. The APK is installed on the emulator
6. Maestro tests are run on the emulator
7. Test results and artifacts (including logs and screenshots) are uploaded

### Test Results and Artifacts

After the tests run, the following artifacts are available:

- JUnit XML test results
- Maestro logs and screenshots (in the `maestro/` directory)

These artifacts can be downloaded from the GitHub Actions workflow run page.

## Local Development

### Code Quality Checks

Run quality checks locally before committing:

```bash
# Check all quality gates
npm run quality:check

# Auto-fix formatting and linting
npm run quality:fix

# Individual checks
npm run lint              # ESLint
npm run format:check      # Prettier
npm run typecheck         # TypeScript
npm audit                 # Security audit
```

### Pre-commit Hooks

The project uses Husky and lint-staged for automatic code quality:

- **Automatic formatting**: Prettier runs on staged files
- **Automatic linting**: ESLint fixes are applied to staged files
- **Pre-commit validation**: Prevents commits with quality issues

Setup is automatic after `npm install`.

### Running Tests Locally

```bash
# Unit tests
npm run test:unit              # Run all unit tests
npm run test:unit-watch        # Watch mode
npm run test:unit-coverage     # With coverage

# E2E tests (requires Android setup)
npm run build:android          # Build APK
npm run install:android        # Install on device/emulator
npm run test:e2e:android       # Run E2E tests
```

### Running E2E Tests Locally

To run E2E tests locally:

1. Install Maestro:
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. Build and install the app:
   ```bash
   npm run build:android
   npm run install:android
   ```

3. Run the tests:
   ```bash
   npm run test:e2e:android
   ```

## Troubleshooting

### Common Issues

1. **Emulator fails to start**: Make sure you have enough disk space and memory. The emulator requires at least 2GB of
   RAM.

2. **Tests fail with timeout**: Some tests might take longer to run. You can increase the timeout in the Maestro test
   files.

3. **APK installation fails**: Make sure the APK is built correctly and the emulator is running.

## Migrating from EAS Builds

This CI setup replaces the previous approach that used EAS builds for E2E testing. The main advantages are:

1. **Cost-effective**: No EAS build minutes are consumed
2. **Faster**: Tests run directly on GitHub-hosted runners
3. **Integrated**: Test results and artifacts are stored within GitHub Actions

The test structure and Maestro test files remain the same, so no changes to the tests themselves are needed.
