// forEach() = method used to iterate over the elements of and array
// and apply a specified function (callback) to each element
// 
// it provides => element, index, array 

// .map() does the same but preserves the source array and returns the new one

// -----------------------------------------------------------------
// let numbers = [1, 2, 3, 4, 5];

// numbers.forEach(triple);
// numbers.forEach(double);
// numbers.forEach(print);

// function print(x){
//     console.log(x);
// }

// // in order: element, index, array
// // can be named whatever
// function double(e, i, a){
//     a[i] = e * 2;
// }

// function triple(elem, idx, arr){
//     arr[idx] = elem * 3;
// }

// -----------------------------------------------------------------

// let food = ["pizza", "spaghetti", "burger", "doner"];


// food.forEach(upperCase);
// food.forEach(print);


// function upperCase(element, index, array){
//     array[index] = element.toUpperCase();
// }

// function print(element){
//     console.log(element);
// }


// ------------------------------------------------------------------

// map example:

const numbers = [10, 20, 30];

console.log(`Source array: ${numbers}`);
// 1. Define the function on its own
function doubleWithDetails(element, index, array) {
    console.log(`Processing index ${index}`);
    return element * 2;
}

// 2. Pass it directly into map
const result = numbers.map(doubleWithDetails);
console.log(`Resulting array ${result}`);

// OUTPUT:
// Source array: 10,20,30 
// Processing index 0 
// Processing index 1 
// Processing index 2 
// Resulting array 20,40,60