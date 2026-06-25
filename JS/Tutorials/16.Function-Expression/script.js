//  function expression = a way to define functions 
//                        as variables or values



// const hello = function(){
//     console.log("HELLO");
// }

// hello();

// setTimeout(function(){
//     console.log("Hello");
// }, 3000);

const numbers = [1,2,3,4,5,6];
const cubes = numbers.map(function cube(element){
    return Math.pow(element, 3);
});

console.log(cubes);

const evenNums = numbers.filter(function (element){
    return element % 2 === 0;
});

const total = numbers.reduce(function(prev, next){
    return prev + next;
});

console.log(`Total: ${total}`);

console.log(evenNums);


