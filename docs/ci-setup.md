# CI Setup Documentation

## Overview

This document explains the CI (Continuous Integration) setup for the Recipedia app. The CI pipeline is implemented using
GitHub Actions and is designed to run unit tests and E2E (End-to-End) tests on Android.

## CI Workflow

The CI workflow is defined in `.github/workflows/android-ci.yml` and consists of the following jobs:

1. **Install and Unit Tests**: Installs dependencies and runs unit tests
2. **E2E Tests Part 1**: Runs the first set of E2E tests using Maestro
3. **E2E Tests Part 2**: Runs the second set of E2E tests using Maestro
4. **E2E Tests Part 3**: Runs the third set of E2E tests using Maestro

The workflow is triggered on:

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
