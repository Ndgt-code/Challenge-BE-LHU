// ====== CommonJS Module ======
// Sử dụng module.exports để export

// Các hàm tính toán cơ bản
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) throw new Error("Không thể chia cho 0!");
    return a / b;
};

// Constant
const PI = 3.14159;

// Export nhiều items cùng lúc
module.exports = {
    add,
    subtract,
    multiply,
    divide,
    PI
};

// Hoặc có thể export từng item:
// module.exports.add = add;
// module.exports.subtract = subtract;
