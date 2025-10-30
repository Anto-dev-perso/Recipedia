# E2E Testing Guide for Recipedia

This guide provides comprehensive documentation for AI agents and developers
working with End-to-End (E2E) tests in the Recipedia React Native app using
Maestro.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [TestID Conventions](#testid-conventions)
- [File Types](#file-types)
- [Adding New Tests](#adding-new-tests)
- [Editing Existing Tests](#editing-existing-tests)
- [Reusability Patterns](#reusability-patterns)
- [OCR Testing Patterns](#ocr-testing-patterns)
- [Platform-Specific Testing](#platform-specific-testing)
- [Language Support](#language-support)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

Recipedia uses **Maestro** for E2E testing. Maestro is a mobile UI testing
framework that uses YAML configuration files to define test flows.

### Key Commands

```bash
# Run all E2E tests on Android (uses config.yaml)
npm run test:e2e:android

# Build and test in one command
npm run workflow:build-test:android

# Run specific feature directory
maestro test tests/e2e/search/

# Run specific test case
maestro test tests/e2e/search/04_open_close.yaml

# Run tests by tag
maestro test --include-tags search tests/e2e/
```

### Current Test Organization

Tests are organized by feature in subdirectories:

- **app-init/** - App launch, onboarding, FAB menu (3 tests)
- **search/** - Search bar and filters (10 tests)
- **recipe-view/** - Recipe display and viewing (5 tests)
- **recipe-create/** - Recipe creation manual and OCR (5 tests)
- **shopping/** - Shopping list functionality (3 tests)
- **settings/** - App parameters and preferences (5 tests)
- **tags-db/** - Tag database management (5 tests)
- **ingredients-db/** - Ingredient database management (5 tests)
- **edge-cases/** - Duplicate detection and validation (7 tests)

Test execution order is controlled by `config.yaml` which orchestrates all 48
test cases.

## Architecture

The E2E test architecture follows a hierarchical structure that promotes
reusability and maintainability following Maestro best practices.

```
tests/e2e/
├── config.yaml                    # Test orchestration and execution order
├── {feature}/                     # Feature-organized test cases
│   └── {test_name}.yaml          # Individual test cases (one per test)
├── cases/                         # Reusable test scenarios
│   ├── {feature}/                # Feature-specific test cases
│   │   └── {action}.yaml         # Individual test case logic
├── flows/                         # Reusable action sequences
│   ├── {feature}/                # Feature-specific flows
│   │   └── {action}.yaml         # Reusable flow
├── asserts/                       # UI state verifications
│   ├── {screen}/                 # Screen-specific assertions
│   │   ├── common/               # Common reusable assertions
│   │   ├── en/                   # English-specific assertions
│   │   └── fr/                   # French-specific assertions
└── assets/                        # Test data (for OCR tests)
```

### Design Principles

1. **Isolated Test Cases**: Each test case runs independently with its own app
   launch
2. **Feature Organization**: Tests grouped by feature in subdirectories
3. **Configured Execution**: `config.yaml` controls test order and discovery
4. **Separation of Concerns**: Test cases orchestrate reusable cases, flows, and
   assertions
5. **Reusability**: Common actions and assertions are extracted into separate
   files
6. **Language Independence**: Language-specific assertions are separated
7. **Platform Awareness**: Android and iOS implementations are conditionally
   executed
8. **Tag-Based Filtering**: Tests tagged by feature for selective execution

## Directory Structure

### config.yaml (Root Level)

The `config.yaml` file orchestrates test execution, defining which tests run and
in what order.

**Example**: `config.yaml`

```yaml
appId: com.recipedia.app

flows:
  # App Initialization
  - app-init/01_onboarding.yaml
  - app-init/02_bottom_tabs.yaml

  # Search & Discovery
  - search/04_open_close.yaml
  - search/05_scroll_independence.yaml

  # Additional test groups...

excludeFlows:
  - flows/**
  - asserts/**
  - cases/**
```

### Test Case Files (Feature Directories)

Individual test cases in feature-organized subdirectories. Each test case:

- Starts with `launchApp` for isolation
- Has feature tags for filtering
- Uses consistent label patterns

**Example**: `search/open_close.yaml`

```yaml
appId: com.recipedia.app
tags:
  - search
---
- launchApp:
    label: 'Search::OpenClose::Launch'

- runFlow:
    file: '../cases/searchBar/openAndClose.yaml'
    label: 'Search::OpenClose::TestSearchBarDropdown'
```

### Cases Directory

Complete test scenarios that represent user journeys. Cases combine flows and
assertions to test specific functionality.

**Structure**:

```
cases/
├── bottomButtons/         # FAB menu expansion/collapse
├── filters/              # Search filtering by ingredients/tags
├── launchApp/            # Initial app launch scenarios
├── parameters/           # Settings screen interactions
├── recipeAdding/         # Recipe creation flows
│   ├── manual/          # Manual recipe entry
│   └── validation/      # Form validation tests
├── recipeRendering/      # Recipe display scenarios
├── searchBar/            # Search bar interactions
└── shopping/             # Shopping list operations
```

### Flows Directory

Reusable sequences of actions that can be composed into larger test scenarios.
Flows should be atomic and focused on a single feature.

**Structure**:

```
flows/
├── navigation/           # Screen navigation helpers
├── parameters/          # Settings interactions
│   └── language/        # Language switching flows
├── Recipe/              # Recipe-related flows
│   └── Adding/         # Recipe creation flows
│       ├── Manual/     # Manual input flows
│       ├── OCR/        # OCR-based input flows
│       │   ├── android/  # Android-specific OCR
│       │   ├── Camera/   # Camera mode OCR
│       │   └── Gallery/  # Gallery mode OCR
│       ├── en/         # English-specific flows
│       └── fr/         # French-specific flows
├── Search/              # Search-related flows
│   └── Filters/        # Filter manipulation flows
└── Shopping/            # Shopping list flows
    ├── en/             # English-specific flows
    └── fr/             # French-specific flows
```

### Asserts Directory

UI state verification files. Assertions check that the UI displays the expected
elements and data.

**Structure**:

```
asserts/
├── Alerts/              # Alert dialog assertions
│   ├── en/             # English alert messages
│   └── fr/             # French alert messages
├── BottomTabs/          # Bottom navigation assertions
├── Home/                # Home screen assertions
│   └── common/         # Reusable home assertions
├── Modal/               # Modal dialog assertions
├── Parameters/          # Settings screen assertions
│   └── language/       # Language-specific parameter checks
├── Recipe/              # Recipe screen assertions
│   ├── common/         # Reusable recipe assertions
│   ├── Edit/           # Edit mode assertions
│   ├── OCR/            # OCR mode assertions
│   └── ReadOnly/       # Read-only mode assertions
│       └── en/         # English recipe content
├── Search/              # Search screen assertions
│   ├── SearchBar/      # Search bar state
│   └── en/             # English search assertions
│       └── Filters/    # Filter state assertions
└── Shopping/            # Shopping list assertions
```

## TestID Conventions

The app uses a **consistent hierarchical TestID pattern** that makes elements
easy to locate in tests.

### Pattern

```
{Screen|Component}::{Element}[::{Type|Modifier}]
```

### Examples

```yaml
# Screen-level elements
id: "SearchScreen::SearchBar"
id: "SearchScreen::RecipeCards::0"
id: "BottomTabs::Home"

# Component-level elements
id: "RecipeTitle::Text"
id: "RecipeTitle::CustomTextInput"
id: "RecipeTitle::OpenModal::RoundButton"

# Indexed elements (for lists)
id: "RecipeIngredients::TextRender::0::QuantityInput::NumericTextInput"
id: "Modal::List#2::SquareButton::Image"

# Button types
id: "BackButton::RoundButton"
id: "ExpandButton::RoundButton"
id: "RecipeValidate-text"  # Text button
```

### TestID Best Practices

1. **Be Specific**: Use the full hierarchy to avoid ambiguity
2. **Use Indices**: For list items, include the index (`::0`, `::1`, `#2`)
3. **Include Type**: Append element type when multiple elements share a name
   (`::RoundButton`, `::CustomTextInput`)
4. **Consistency**: Follow the established pattern for new components

## File Types

### 1. Test Suite Files

**Purpose**: Orchestrate multiple test cases into a coherent test suite
**Location**: Root of `tests/e2e/` **Naming**: `{number}_{feature}.yaml`

**Structure**:

```yaml
appId: 'com.recipedia'
name: 'Descriptive test suite name'
---
- launchApp # Reset app state

- runFlow:
    file: 'cases/feature/testCase.yaml'
    label: 'Description of what this case tests'
# Additional test cases...
```

### 2. Case Files

**Purpose**: Complete test scenarios representing user journeys **Location**:
`cases/{feature}/` **Naming**: `{action}.yaml` (camelCase)

**Structure**:

```yaml
appId: 'com.recipedia'
---
# Navigation
- tapOn:
    id: 'BottomTabs::Search'
    label: 'Navigate to Search screen'

# Action
- tapOn:
    id: 'SearchScreen::SearchBar'
    label: 'Focus on search bar'

# Assertion
- runFlow:
    file: '../../asserts/Search/en/assertSearchScreen.yaml'
    label: 'Verify search screen state'

# Cleanup
- tapOn:
    id: 'BottomTabs::Home'
    label: 'Return to Home'
```

### 3. Flow Files

**Purpose**: Reusable sequences of actions **Location**: `flows/{feature}/`
**Naming**: `{action}.yaml` (camelCase)

**Structure**:

```yaml
appId: 'com.recipedia'
---
# Focused on a single action or sequence
- tapOn:
    id: 'SomeButton::RoundButton'
    label: 'Perform specific action'

- runFlow:
    file: '../common/helper.yaml'
    label: 'Use shared helper'

# Can accept environment variables
- runFlow:
    file: 'subFlow.yaml'
    env:
      PARAM_NAME: value
    label: 'Parameterized flow'
```

### 4. Assert Files

**Purpose**: Verify UI state and content **Location**: `asserts/{screen}/`
**Naming**: Descriptive names indicating what's being asserted

**Structure**:

```yaml
appId: 'com.recipedia'
---
# Positive assertions
- assertVisible:
    id: 'Element::ID'
    label: 'Description of expected state'

- assertVisible:
    text: 'Expected Text'
    label: 'Text content is displayed'

# Negative assertions
- assertNotVisible:
    id: 'Element::ID'
    label: 'Element should not be visible'

# Text pattern matching
- assertVisible:
    text: "[\\s\\S]+" # Regex for non-empty text
    label: 'Content is present'
```

## Adding New Tests

### Adding a New Test Case

1. **Choose appropriate feature directory** or create a new one
2. **Create test case file** with descriptive name: `{test_name}.yaml`
3. **Add to config.yaml** in appropriate position
4. **Structure the test**: LaunchApp → RunFlow → Tags
5. **Use consistent label pattern**: `{Feature}::{TestName}::{Action}`

**Example**: Creating a new favorites test in `favorites/add_to_favorites.yaml`

```yaml
appId: com.recipedia.app
tags:
  - favorites
---
- launchApp:
    label: 'Favorites::AddToFavorites::Launch'

- runFlow:
    file: '../cases/favorites/addToFavorites.yaml'
    label: 'Favorites::AddToFavorites::Execute'
```

**Then add to config.yaml**:

```yaml
flows:
  # ... existing tests ...

  # Favorites
  - favorites/add_to_favorites.yaml
  - favorites/remove_from_favorites.yaml
  - favorites/view_list.yaml
```

### Adding a New Test Case

1. **Create case directory** if needed: `cases/{feature}/`
2. **Create case file**: `cases/{feature}/{action}.yaml`
3. **Structure the test**: Navigate → Act → Assert → Cleanup

**Example**: `cases/favorites/addToFavorites.yaml`

```yaml
appId: 'com.recipedia'
---
# Navigate to recipe
- tapOn:
    id: 'BottomTabs::Search'
    label: 'Navigate to Search'

- tapOn:
    id: 'SearchScreen::RecipeCards::0'
    label: 'Open first recipe'

# Perform action
- tapOn:
    id: 'Recipe::FavoriteButton::RoundButton'
    label: 'Tap favorite button'

# Assert result
- runFlow:
    file: '../../asserts/Recipe/favoriteAdded.yaml'
    label: 'Verify recipe marked as favorite'

# Cleanup
- tapOn:
    id: 'BackButton::RoundButton'
    label: 'Return to search'
```

### Adding a New Flow

1. **Identify reusable action sequence**
2. **Create flow file** in appropriate directory
3. **Keep it focused** on single responsibility
4. **Add clear labels** for debugging

**Example**: `flows/favorites/toggleFavorite.yaml`

```yaml
appId: 'com.recipedia'
---
- tapOn:
    id: 'Recipe::FavoriteButton::RoundButton'
    label: 'Toggle favorite state'

- runFlow:
    file: '../../asserts/Alerts/en/favoriteToggled.yaml'
    label: 'Verify favorite toggle alert'
```

### Adding New Assertions

1. **Determine scope**: Screen-specific or common?
2. **Choose location**: `asserts/{screen}/` or `asserts/{screen}/common/`
3. **Consider language**: Need en/fr variants?
4. **Create assertion file**

**Example**: `asserts/Recipe/favoriteAdded.yaml`

```yaml
appId: 'com.recipedia'
---
- assertVisible:
    id: 'Recipe::FavoriteButton::RoundButton'
    label: 'Favorite button is visible'

- assertVisible:
    text: '󰋑' # Filled heart icon
    label: 'Favorite button shows filled heart'

- assertVisible:
    id: 'Recipe::FavoriteIndicator'
    label: 'Favorite indicator is displayed'
```

## Editing Existing Tests

### Best Practices for Editing

1. **Understand the hierarchy**: Know if you're editing a suite, case, flow, or
   assert
2. **Check dependencies**: Search for files that reference the one you're
   editing
3. **Maintain consistency**: Follow existing patterns and naming
4. **Update related files**: If changing a flow, update all cases that use it
5. **Test locally**: Run affected tests before committing

### Finding File Usage

```bash
# Find all references to a file
grep -r "fileName.yaml" tests/e2e --include="*.yaml"

# Find files referencing a specific TestID
grep -r "TestID::Name" tests/e2e --include="*.yaml"
```

### Common Edit Scenarios

#### Updating a TestID Reference

When the app's TestID changes, update all test files:

```bash
# Find all occurrences
grep -r "OldTestID" tests/e2e --include="*.yaml"

# Update manually or with sed (be careful!)
find tests/e2e -name "*.yaml" -exec sed -i '' 's/OldTestID/NewTestID/g' {} +
```

#### Adding a Step to Existing Flow

**Before**:

```yaml
- tapOn:
    id: 'Button::RoundButton'
    label: 'Tap button'

- runFlow:
    file: 'assert.yaml'
```

**After**:

```yaml
- tapOn:
    id: 'Button::RoundButton'
    label: 'Tap button'

- hideKeyboard: # New step
    label: 'Dismiss keyboard'

- runFlow:
    file: 'assert.yaml'
```

#### Updating Assertion Text

When UI text changes:

```yaml
# Old
- assertVisible:
    text: 'Add to Cart'

# New
- assertVisible:
    text: 'Add to Menu' # Updated text
```

## Reusability Patterns

### Common Assertion Flows

Extract repeated assertions into common files for reusability.

**Example**: Recipe common buttons

**File**: `asserts/Recipe/common/buttonsReadOnly.yaml`

```yaml
appId: 'com.recipedia'
---
- assertVisible:
    id: 'BackButton::RoundButton'
    label: 'Back button is displayed'

- assertVisible:
    id: 'RecipeValidate-text'
    text: 'Add to the menu'
    label: 'Add recipe button is displayed'

- assertVisible:
    id: 'RecipeDelete::RoundButton'
    label: 'Delete button is displayed'
```

**Usage**:

```yaml
- runFlow:
    file: '../common/buttonsReadOnly.yaml'
    label: 'Assert common ReadOnly buttons'
```

### Environment Variables

Pass parameters to flows for flexibility.

**Flow**: `flows/navigation/openRecipe.yaml`

```yaml
appId: 'com.recipedia'
---
- tapOn:
    id: 'SearchScreen::RecipeCards::${RECIPE_INDEX}'
    label: 'Open recipe at index ${RECIPE_INDEX}'
```

**Usage**:

```yaml
- runFlow:
    file: 'flows/navigation/openRecipe.yaml'
    env:
      RECIPE_INDEX: 0
    label: 'Open first recipe'
```

### Conditional Execution

Execute different flows based on conditions.

**Platform-specific**:

```yaml
- runFlow:
    file: 'android/androidFlow.yaml'
    when:
      platform: Android

- runFlow:
    file: 'iOS/iOSFlow.yaml'
    when:
      platform: iOS
```

**Custom conditions**:

```yaml
- evalScript: ${output.needsValidation = true}

- runFlow:
    file: 'validate.yaml'
    when:
      true: ${output.needsValidation}
```

## OCR Testing Patterns

OCR (Optical Character Recognition) tests have special patterns due to Android
MediaStore behavior and the complexity of image-based input.

### The Gallery Ordering Problem

**Issue**: When multiple images are added to Android gallery in quick succession
(within ~500ms), they may receive similar timestamps, causing unpredictable
"Recent" sorting.

**Solution**: Add media **on-demand** (right before selection) and always select
index 0 (most recent).

### OCR Test Architecture

```
OCR Testing Flow:
1. Expand FAB menu (if needed)
2. Open OCR Camera or Gallery
3. For each field:
   a. Add media file to device gallery
   b. Tap OCR button for field
   c. Select most recent from gallery (index 0)
   d. Select from app modal using counter
   e. Increment modal counter
```

### Key OCR Files

**Android Media Addition**: `flows/Recipe/Adding/OCR/android/addMedia.yaml`

- Adds media file to device gallery
- Uses conditional logic to select correct file path
- Waits 500ms for Android MediaStore to index

**Gallery Selection**: `flows/Recipe/Adding/OCR/android/selectFromGallery.yaml`

- Selects most recent image from Android gallery (index 0)
- Validates without cropping

**Modal Selection with Counter**:
`flows/Recipe/Adding/OCR/android/selectMostRecentFromModal.yaml`

- Opens app's image selection modal
- Uses `modalImageCounter` to select correct image
- Increments counter for next field

### OCR Field Pattern

Each OCR field (title, description, ingredients, etc.) follows this pattern:

```yaml
appId: 'com.recipedia'
---
# Tap OCR button for this field
- tapOn:
    id: 'RecipeField::OpenModal::RoundButton'
    label: 'Tap on OCR button of recipe field'

# Add media file
- runFlow:
    file: ../android/addMedia.yaml
    env:
      FIELD_NAME: fieldName # Used to select correct image
    when:
      platform: Android
# TODO iOS

# Select from gallery and modal using counter
- runFlow:
    file: ../android/selectMostRecentFromModal.yaml
    label: 'Select field from modal for OCR'
    when:
      platform: Android
# TODO iOS
```

### Modal Counter Pattern

The modal counter tracks which image to select from the app's internal modal.

**Initialization** (in `ocrImage.yaml`):

```yaml
# After first image selection
- evalScript: ${output.modalImageCounter = 1}
```

**Usage** (in `selectMostRecentFromModal.yaml`):

```yaml
# Select using current counter value
- tapOn:
    id: 'Modal::List#${output.modalImageCounter}::SquareButton::Image'
    label: 'Select picture ${output.modalImageCounter} from app modal'

# Increment for next field
- evalScript: ${output.modalImageCounter = output.modalImageCounter + 1}
```

### Adding New OCR Recipe Assets

To add new OCR test recipes:

1. **Create asset directory**: `assets/{recipeName}/`
2. **Add images**: Place images for each field (image.jpg, title.jpg,
   ingredients.jpg, etc.)
3. **Update addMedia.yaml**: Add conditional blocks for new recipe

```yaml
# New recipe paths
- runFlow:
    when:
      true: ${RECIPE_NAME == "newRecipe" && FIELD_NAME == "image"}
    commands:
      - addMedia:
          - '../../../../../../assets/newRecipe/image.jpg'

- runFlow:
    when:
      true: ${RECIPE_NAME == "newRecipe" && FIELD_NAME == "title"}
    commands:
      - addMedia:
          - '../../../../../../assets/newRecipe/title.jpg'
# Add more fields...
```

4. **Create assertion file**: `asserts/Recipe/OCR/{recipeName}.yaml`
5. **Create test flow**: Add to `9_recipeAddingOCR.yaml`

### Camera vs Gallery OCR

**Gallery Mode** (`OCR/Gallery/`):

- Opens gallery from FAB menu
- User already on empty recipe screen
- First field (ocrImage) opens gallery button

**Camera Mode** (`OCR/Camera/`):

- Opens camera from FAB menu
- Already on empty recipe screen, no gallery button needed
- First field (ocrImage) special case: screen already open
- Reuses Gallery flows for all other fields

**Camera ocrImage.yaml** (special case):

```yaml
# No gallery button tap needed - screen already open

- runFlow:
    file: ../android/addMedia.yaml
    env:
      FIELD_NAME: image
    when:
      platform: Android

- tapOn:
    id: 'RecipeImage::RoundButton'
    label: 'Tap on OCR button'

- runFlow:
    file: ../android/selectFromGallery.yaml
    when:
      platform: Android

# Select first image from modal (index 0, not using counter yet)
- tapOn:
    id: 'Modal::List#0::SquareButton::Image'
    label: 'Select first image from app modal'

# Initialize counter for subsequent fields
- evalScript: ${output.modalImageCounter = 1}
```

### Maestro addMedia Limitation

**Important**: The `addMedia` command does NOT support variable substitution.

**This won't work**:

```yaml
- addMedia:
    - '${ASSET_PATH}' # Variable NOT supported
```

**This works**:

```yaml
# Use conditional logic with hardcoded paths
- runFlow:
    when:
      true: ${RECIPE_NAME == "hellofresh" && FIELD_NAME == "image"}
    commands:
      - addMedia:
          - '../../../../../../assets/aiguillettesTeriyaki/image.jpg'
```

## Platform-Specific Testing

### Current Status

- **Android**: Fully implemented and tested
- **iOS**: Prepared with TODO comments, awaiting implementation

### Conditional Platform Execution

Use `when: platform:` to execute platform-specific flows:

```yaml
- runFlow:
    file: 'android/androidSpecificFlow.yaml'
    when:
      platform: Android
    label: 'Android-specific implementation'

# TODO iOS
- runFlow:
    file: 'iOS/iOSSpecificFlow.yaml'
    when:
      platform: iOS
    label: 'iOS-specific implementation'
```

### Platform-Specific Directory Structure

```
flows/Recipe/Adding/OCR/
├── android/              # Android-specific implementations
│   ├── addMedia.yaml
│   ├── selectFromGallery.yaml
│   ├── selectMostRecentFromModal.yaml
│   ├── takePhoto.yaml
│   └── validateWithoutCropping.yaml
└── iOS/                  # iOS implementations (TODO)
    └── (pending implementation)
```

### Adding iOS Support

When implementing iOS support:

1. **Create iOS directory**: `flows/{feature}/iOS/`
2. **Implement iOS-specific flows**: Adapt Android patterns
3. **Remove TODO comments**: Replace with actual iOS implementation
4. **Test on iOS device**: Verify flows work correctly
5. **Update documentation**: Note any iOS-specific quirks

## Language Support

The app supports English and French with language-specific test assertions.

### Language-Specific Directories

```
asserts/
├── Alerts/
│   ├── en/              # English alert messages
│   └── fr/              # French alert messages
├── Home/
│   ├── en/              # English home screen
│   └── fr/              # French home screen
├── Search/
│   ├── en/              # English search UI
│   └── fr/              # French search UI
└── Shopping/
    ├── en/              # English shopping list
    └── fr/              # French shopping list
```

### Language Testing Pattern

**Language Switch Test** (`cases/parameters/languageChange.yaml`):

```yaml
# Switch to French
- runFlow:
    file: '../../flows/parameters/language/switchToFrench.yaml'
    label: 'Switch language to French'

# Verify French translations
- runFlow:
    file: '../../flows/parameters/language/homeIsTranslated.yaml'
    label: 'Verify Home screen in French'

- runFlow:
    file: '../../flows/parameters/language/searchIsTranslated.yaml'
    label: 'Verify Search screen in French'

# Switch back to English
- runFlow:
    file: '../../flows/parameters/language/switchToEnglish.yaml'
    label: 'Switch language back to English'
```

### Adding New Language Support

1. **Create language directories**: `asserts/{screen}/{langCode}/`
2. **Create translated assertions**: Duplicate English files with translations
3. **Add language switch flow**:
   `flows/parameters/language/switchTo{Language}.yaml`
4. **Add verification flows**:
   `flows/parameters/language/{screen}IsTranslated.yaml`
5. **Update language test**: Add new language to
   `cases/parameters/languageChange.yaml`

## Common Patterns

### Navigation Pattern

```yaml
# Navigate to screen
- tapOn:
    id: 'BottomTabs::ScreenName'
    label: 'Navigate to ScreenName'

# Perform action
# ...

# Return to previous screen
- tapOn:
    id: 'BackButton::RoundButton'
    label: 'Return to previous screen'

# Or return to specific screen
- tapOn:
    id: 'BottomTabs::Home'
    label: 'Return to Home'
```

### Scroll Pattern

```yaml
# Scroll until element is visible
- scrollUntilVisible:
    element:
      id: 'Element::ID'
    direction: DOWN # or UP
    speed: 60
    centerElement: true # Optional
    label: 'Scroll to element'
```

### Input Pattern

```yaml
# Tap on input field
- tapOn:
    id: 'Input::CustomTextInput'
    label: 'Focus on input field'

# Enter text
- inputText:
    text: 'Sample text'
    label: 'Enter text'

# Dismiss keyboard
- hideKeyboard:
    label: 'Dismiss keyboard'
```

### List Item Selection Pattern

```yaml
# Select item by index
- tapOn:
    id: 'List::Item::${INDEX}'
    label: 'Select item at index ${INDEX}'

# Or specific index
- tapOn:
    id: 'RecipeCards::0'
    label: 'Select first recipe card'
```

### Wait Pattern

```yaml
# Wait for element to appear
- extendedWaitUntil:
    visible: 'Element::ID'
    timeout: 5000 # milliseconds
    label: 'Wait for element to appear'

# Wait for element to disappear
- extendedWaitUntil:
    visible: 'Element::ID'
    timeout: 5000
    optional: true # Don't fail if not found
    label: 'Wait for element to disappear'
```

### Modal Pattern

```yaml
# Open modal
- tapOn:
    id: 'OpenModal::RoundButton'
    label: 'Open modal'

# Interact with modal content
- tapOn:
    id: 'Modal::ConfirmButton'
    label: 'Confirm action'

# Modal usually closes automatically, but can close manually
- pressKey: 'BACK'
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: Test fails with "Element not found"

**Possible causes**:

1. **TestID changed in app**: Update test files with new TestID
2. **Element not visible**: Add scrollUntilVisible before assertion
3. **Timing issue**: Add extendedWaitUntil before interaction
4. **Wrong screen**: Verify navigation steps are correct

**Solution**:

```yaml
# Add wait before assertion
- extendedWaitUntil:
    visible: 'Element::ID'
    timeout: 3000
    label: 'Wait for element'

# Then assert or interact
- assertVisible:
    id: 'Element::ID'
```

#### Issue: File path not found

**Error**: `Flow file does not exist: path/to/file.yaml`

**Cause**: Incorrect relative path in runFlow

**Solution**:

- Count directory levels carefully
- Use `../` to go up one level
- Verify file exists at expected location

```yaml
# If current file is: cases/feature/test.yaml
# And target is: flows/feature/flow.yaml

# Wrong:
file: "flows/feature/flow.yaml"  # Absolute path doesn't work

# Correct:
file: "../../flows/feature/flow.yaml"  # Relative from current location
```

#### Issue: OCR test shows wrong recipe data

**Cause**: Gallery ordering issue - wrong image selected

**Solution**:

- Verify `addMedia` is called before selection
- Check `modalImageCounter` is properly incremented
- Ensure selecting index 0 from gallery (most recent)
- Verify correct RECIPE_NAME and FIELD_NAME env variables

#### Issue: Platform-specific test not running

**Symptom**: Test skipped or runs wrong platform code

**Solution**:

```yaml
# Ensure correct platform condition
- runFlow:
    file: 'android/flow.yaml'
    when:
      platform: Android # Capital A
    label: 'Android flow'
```

#### Issue: Variable not substituted

**Symptom**: `${VARIABLE_NAME}` appears literally instead of value

**Causes**:

1. **Environment variable not passed**: Add `env:` block to runFlow
2. **Maestro limitation**: Some commands don't support variables (e.g.,
   addMedia)

**Solution**:

```yaml
# Pass environment variable
- runFlow:
    file: 'targetFlow.yaml'
    env:
      VARIABLE_NAME: value
    label: 'Flow with parameter'

# For addMedia, use conditional logic instead
- runFlow:
    when:
      true: ${RECIPE_NAME == "value"}
    commands:
      - addMedia:
          - 'hardcoded/path.jpg'
```

#### Issue: Test fails intermittently

**Possible causes**:

1. **Timing issues**: Add waits/delays
2. **Animation interference**: Wait for animations to complete
3. **State from previous test**: Ensure proper cleanup
4. **Gallery ordering**: For OCR tests, verify media addition timing

**Solutions**:

```yaml
# Add explicit waits
- extendedWaitUntil:
    visible: 'Element::ID'
    timeout: 5000

# Reset app state between tests
- launchApp # In test suite file
```

### Debugging Tips

1. **Add verbose labels**: Every action should have a descriptive label

   ```yaml
   - tapOn:
       id: 'Button::ID'
       label: 'Descriptive label explaining what this does'
   ```

2. **Test incrementally**: Add one step at a time and test
3. **Use Maestro Studio**: Visual test recorder to verify selectors

   ```bash
   maestro studio
   ```

4. **Check Maestro logs**: Look for detailed error messages
5. **Verify TestIDs in app**: Use React Native Debugger to inspect elements
6. **Test in isolation**: Run single test file to isolate issues
   ```bash
   maestro test tests/e2e/path/to/test.yaml
   ```

### Getting Help

- **Maestro Documentation**: https://maestro.mobile.dev/
- **Project Issues**: Check TODOs in test files for known limitations
- **Test Output**: Maestro provides detailed step-by-step output on failure

## Best Practices Summary

1. ✅ **Always add descriptive labels** to every action
2. ✅ **Use common assertion flows** to reduce duplication
3. ✅ **Follow TestID conventions** consistently
4. ✅ **Add TODO comments** for pending iOS implementations
5. ✅ **Test one thing per case** - keep tests focused
6. ✅ **Use relative paths correctly** in runFlow
7. ✅ **Add waits for dynamic content** to prevent flakiness
8. ✅ **Clean up after tests** - return to known state
9. ✅ **Pass parameters via env** for reusable flows
10. ✅ **Keep flows atomic** - single responsibility
11. ✅ **Update all references** when changing shared files
12. ✅ **Test locally** before committing changes
13. ✅ **Document complex patterns** with comments
14. ✅ **Use platform conditionals** for platform-specific code
15. ✅ **For OCR: add media on-demand**, always select index 0

---

**Last Updated**: 2025-10-28

**Key Changes**: Restructured test suite from 12 numbered files to
feature-organized subdirectories with `config.yaml` orchestration, following
Maestro best practices for isolated test execution and clear failure reporting.

**Maintainer**: Development Team

**Questions**: Refer to CLAUDE.md for additional project conventions
