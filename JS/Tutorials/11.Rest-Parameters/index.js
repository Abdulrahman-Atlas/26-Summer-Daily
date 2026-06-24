// rest parameters allow a function to accept an indefinite number of arguments 
// as an array, 
// providing a way to represent variadic functions in JavaScript.

function openFridge(...items) {
    console.log("Opening the fridge...");
    console.log("Items in the fridge:", items);
}

// combines items into an Array
function getFood(...items) {
    return items;
}

openFridge("Milk", "Eggs", "Cheese", "Butter");

console.log(getFood("Pizza", "Burger", "Pasta"));


function sum(...numbers) {
    let ret = 0;
    for (let number of numbers) {
        ret += number;
    }
    return ret;
}

const total = sum(1, 2, 3, 4, 5);
console.log("Total sum:", total);
//Total sum: 15

function combineString(...strings){
    let result = "";
    for(let str of strings){
        result += str;
    }

    return result;
}

console.log(combineString("My name is ", "Leo Messi"));
// My name is Leo Messi
