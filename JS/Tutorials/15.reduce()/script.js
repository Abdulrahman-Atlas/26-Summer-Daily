// reduce() = reduce the elements of an array to a single value



// const prices = [5, 30, 10, 25, 15, 20];

// const total = prices.reduce(sum);

// console.log(`$${total.toFixed(2)}`);

// function sum(accumulator, element){
//     return accumulator + element;
// }

//  accumulator -- element
// 1     0             5
// 2     5             30
// 3     35            10
// 4     45            25 
// ....
// ....


// another use case

const grades = [75, 50, 90, 80, 65, 95];

const max = grades.reduce(getMax);
const min = grades.reduce(getMin);


console.log(max);
console.log(min);

function getMax(prev, next){
    return Math.max(prev, next);
}

function getMin(prev, next){
    return Math.min(prev, next);
}