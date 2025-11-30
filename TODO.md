# TODO: New Features to Explore

## Refactor

- Change size of typography to be more standard
- Bottom buttons on real phone has a big spacing. Maybe get rid of the calculus using screen height
- On real phone, location of highlight of onboarding is weird
- FileGestion could be a pure function file with constants defined instead of using a singleton
- Add/Validate button of recipe could be enhance. Currrently, we see that view is greater than necessary
- Add buttons of tag and ingredient in settings should always be visible, not at the bottom
- Buttons in Recipe looks weird with edge to edge
- Modal adding ingredient doesn't allow to have an empty unit but it is allowed

## React 19 Features

- TODO: Use React 19 `useOptimistic()` hook in Shopping list for instant UI feedback
- TODO: Consider React 19 `use()` hook to simplify async recipe loading
- TODO: Simplify context providers using React 19 `<Context>` syntax (no `.Provider`)
- TODO: Consider React 19 Actions for SearchBar form handling

## Database & Offline (expo-sqlite)

- TODO: Enable expo-sqlite web support for browser testing (wa-sqlite)
- TODO: Evaluate Turso offline sync for expo-sqlite when it exits beta (SDK 54+)

## Image & Media (expo-image, expo-asset)

- TODO: Add `placeholderContentFit` prop to Image components for better placeholder handling
- TODO: Implement Live Text interaction on recipe images (iOS) for text extraction
- TODO: Explore Rive animations (.riv) support from expo-asset 11.1 for interactive UI elements
- TODO: Add dark mode splash screen variant using expo-splash-screen dark mode support
- TODO: Configure animated splash screen fade using `setOptions()` API

## Navigation & UI (react-native-screens 4.11, Android 15)

**Android 15 Compatibility (API 35):**

- TODO: Implement predictive back gesture support (OnBackInvokedCallback) for native stack

**Other UI Improvements:**

- TODO: Evaluate pageSheet presentation for recipe detail modals (iOS)
- TODO: Add fitToContents sheet height for dynamic content in bottom sheets

## Performance & Lists (@shopify/flash-list)

- TODO: Consider upgrading to FlashList v2 for 50% reduced blank area while scrolling
- TODO: Explore masonry layout for recipe grid with varying card heights
- TODO: Use FlashList v2 hooks (`useRecyclingState`, `useLayoutState`) for better state management
