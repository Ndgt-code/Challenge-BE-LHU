// ====== ES Modules ======
// Sử dụng export để xuất module
// File có đuôi .mjs hoặc cấu hình "type": "module" trong package.json

// Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => {
    if (b === 0) throw new Error("Không thể chia cho 0!");
    return a / b;
};

export const PI = 3.14159;

// Default export (chỉ có 1 default export mỗi file)
const calculator = {
    add,
    subtract,
    multiply,
    divide,
    PI,
    power: (base, exp) => Math.pow(base, exp)
};

export default calculator;
