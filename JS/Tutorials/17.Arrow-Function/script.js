// arrow func = (parameters) => {code block} 
// or           (parameters) => return expression


const hello = (name) => {console.log(`Hello ${name}`)
                              };

hello("ABDUL");

// setTimeout(() => {
//     console.log("Waited 1 seconds!");
// }, 1000);

const numbers = [1,2,3,4,5,6];

const squares = numbers.map((element) => Math.pow(element, 2));

console.log(squares);


// direct return of x*2 (no curly braces)
const double = (x) => x*2;

console.log(double(2));

// What happens under the hood?

// Since you used curly braces {} and didn't write the word return, 
// JavaScript runs your console.log() and then implicitly returns 
// undefined at the very end of the block.