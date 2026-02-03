// Test setup file
// This file runs before all tests

const mongoose = require('mongoose');

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
    // Close mongoose connection to prevent Jest hanging
    await mongoose.connection.close();
});
