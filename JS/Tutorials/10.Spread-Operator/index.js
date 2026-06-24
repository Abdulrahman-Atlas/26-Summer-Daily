// spread operator is used to expand an iterable (like an array or string) 
// into individual elements. It can be used in various contexts, 
// such as function calls, array literals, and object literals.

let numbers = [1, 2, 3, 4, 5];

let max = Math.max(...numbers); // Using spread operator to pass array elements as individual arguments
console.log(max); // Output: 5

let newNumbers = [...numbers, 6, 7, 8]; // Using spread operator to create a new array with additional elements
console.log(newNumbers); // Output: [1, 2, 3, 4, 5, 6, 7, 8]

let str = "Hello";
let chars = [...str]; // Using spread operator to convert string into an array of characters
console.log(chars); // Output: ['H', 'e', 'l', 'l', 'o']

let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3, d: 4 };
let mergedObj = { ...obj1, ...obj2 }; // Using spread operator to merge objects
console.log(mergedObj); // Output: { a: 1, b: 2, c: 3, d: 4 }