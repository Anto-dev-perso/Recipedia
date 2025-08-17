module.exports = {
    preset: 'jest-expo',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/tests/unit/**/*.test.{js,jsx,ts,tsx}'],
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
    ],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.{js,ts}',
        '!src/translations/**/*',
        '!src/assets/**/*',
        '!src/navigation/**/*',
        '!App.tsx',
    ],
    coverageReporters: ['json', 'lcov', 'cobertura', 'text'],
    moduleNameMapper: {
        '^fuse.js/dist/fuse.js$': '<rootDir>/node_modules/fuse.js/dist/fuse.js'
    },
};
