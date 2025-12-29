// ====== ES Modules - Using import to import modules ======

// Import default export
import calculator from './math.mjs';

// Import named exports
import { add, subtract, multiply, PI } from './math.mjs';

// Import all with alias
import * as mathModule from './math.mjs';

console.log("====== ES MODULES DEMO ======\n");

// Using default import
console.log("--- Default Import ---");
console.log("calculator.add(5, 3) =", calculator.add(5, 3));
console.log("calculator.power(2, 8) =", calculator.power(2, 8));

// Using named imports
console.log("\n--- Named Imports ---");
console.log("add(10, 20) =", add(10, 20));
console.log("subtract(50, 25) =", subtract(50, 25));
console.log("PI =", PI);

// Using namespace import
console.log("\n--- Namespace Import (mathModule.*) ---");
console.log("mathModule.multiply(7, 8) =", mathModule.multiply(7, 8));
