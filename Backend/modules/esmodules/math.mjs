// ====== ES Modules ======
// Use export to export module
// File has .mjs extension or set "type": "module" in package.json

// Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
    if (b === 0) throw new Error("Cannot divide by 0!");
    return a / b;
};

export const PI = 3.14159;

// Default export (only 1 default export per file)
const calculator = {
    add,
    subtract,
    multiply,
    divide,
    PI,
    power: (base, exp) => Math.pow(base, exp)
};

export default calculator;
