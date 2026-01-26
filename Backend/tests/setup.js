// Test setup file
// This file runs before all tests

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
global.console = {
    ...console,
    log: jest.fn(), // Mock console.log
    error: jest.fn(), // Mock console.error
    warn: jest.fn(), // Mock console.warn
};

// Clean up after all tests
afterAll(async () => {
    // Close any open connections, etc.
    await new Promise(resolve => setTimeout(resolve, 500));
});
