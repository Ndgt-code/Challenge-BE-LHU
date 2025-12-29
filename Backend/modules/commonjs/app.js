// ====== CommonJS - Using require() to import ======

// Import entire module
const math = require('./math');

// Or destructuring
const { add, subtract, multiply, divide, PI } = require('./math');

console.log("====== COMMONJS MODULE DEMO ======\n");

// Using the functions
console.log("5 + 3 =", math.add(5, 3));
console.log("10 - 4 =", math.subtract(10, 4));
console.log("6 * 7 =", math.multiply(6, 7));
console.log("20 / 4 =", math.divide(20, 4));
console.log("PI value:", math.PI);

console.log("\n--- Using destructuring ---");
console.log("add(10, 20) =", add(10, 20));
console.log("PI =", PI);
