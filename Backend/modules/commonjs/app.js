// ====== CommonJS - Sử dụng require() để import ======

// Import toàn bộ module
const math = require('./math');

// Hoặc destructuring
const { add, subtract, multiply, divide, PI } = require('./math');

console.log("====== COMMONJS MODULE DEMO ======\n");

// Sử dụng các hàm
console.log("5 + 3 =", math.add(5, 3));
console.log("10 - 4 =", math.subtract(10, 4));
console.log("6 * 7 =", math.multiply(6, 7));
console.log("20 / 4 =", math.divide(20, 4));
console.log("Giá trị PI:", math.PI);

console.log("\n--- Sử dụng destructuring ---");
console.log("add(10, 20) =", add(10, 20));
console.log("PI =", PI);
