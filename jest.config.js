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
        '^fuse.js/dist/fuse.js$': '<rootDir>/node_modules/fuse.js/dist/fuse.js',
        '^@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@context/(.*)$': '<rootDir>/src/context/$1',
        '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
        '^@screens/(.*)$': '<rootDir>/src/screens/$1',
        '^@styles/(.*)$': '<rootDir>/src/styles/$1',
        '^@customTypes/(.*)$': '<rootDir>/src/customTypes/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@test-data/(.*)$': '<rootDir>/tests/data/$1',
        '^@mocks/(.*)$': '<rootDir>/tests/mocks/$1',
        '^@translations/(.*)$': '<rootDir>/src/translations/$1',
        '^@app/(.*)$': '<rootDir>/$1',
        '^expo-font$': '<rootDir>/tests/mocks/deps/expo-font-mock',
        '^react-native-paper$': '<rootDir>/tests/mocks/deps/react-native-paper-mock.tsx',
        '^react-native-reanimated$': '<rootDir>/tests/mocks/deps/react-native-reanimated-mock.ts',
        '^react-native-gesture-handler$': '<rootDir>/tests/mocks/deps/react-native-gesture-handler-mock',
        '^@react-native-async-storage/async-storage$': '<rootDir>/tests/mocks/deps/async-storage-mock'
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
