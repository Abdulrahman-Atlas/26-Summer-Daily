// forEach() = method used to iterate over the elements of and array
// and apply a specified function (callback) to each element
// 
// it provides => element, index, array 

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

let food = ["pizza", "spaghetti", "burger", "doner"];


food.forEach(upperCase);
food.forEach(print);


function upperCase(element, index, array){
    array[index] = element.toUpperCase();
}

function print(element){
    console.log(element);
}