// ====== CommonJS Module ======
// Using module.exports to export

// Basic calculation functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) throw new Error("Cannot divide by 0!");
    return a / b;
};

// Constant
const PI = 3.14159;

// Export multiple items at once
module.exports = {
    add,
    subtract,
    multiply,
    divide,
    PI
};


