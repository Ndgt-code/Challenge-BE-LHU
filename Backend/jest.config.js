module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Coverage directory
    coverageDirectory: 'coverage',

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'html'],

    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js'
    ],

    // Files to collect coverage from
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/config/**',
        '!src/app.js',
        '!**/node_modules/**'
    ],

    // Setup files before tests
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Timeout for tests (30 seconds)
    testTimeout: 30000,

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Reset mocks between tests
    resetMocks: true
};
