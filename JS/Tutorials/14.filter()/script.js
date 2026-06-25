// filter() = creates a new array by filtering out elements


// let numbers = [1,2,3,4,5,6,7];

// let evenNums = numbers.filter(isEven);

// console.log(evenNums);

// function isEven(element){
//     return element % 2 === 0; // true or false
// }

// const ages = [16, 17, 18, 18, 19, 20, 40];

// const adults = ages.filter(isAdult);

// console.log(adults);

// function isAdult(element){
//     return element >= 18;
// }


const words = ["apple", "banana", "car", "cat", "drone", "envolope"];

const short = words.filter(shortwords);

console.log(short)

function shortwords(element){
    return (element.length < 5);
}