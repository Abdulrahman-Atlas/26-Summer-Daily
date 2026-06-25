// callback a function that is passed as an argument to another function. 
// Used to handle asynchronous operations.




// The issue:
// function hello takes more time than the bye function
// therefore we said bye before hello 

// hello();
// bye();

// function hello(){
//     setTimeout(() => {
//         console.log("hello");
//     }, 3000);
// }

// function bye(){
//     console.log("bye");
// }

// OUTPUT:

// bye
// hello


// the solution: callbacks

hello(bye);

function hello(callback){
    setTimeout(() => {
        console.log("hello");
        callback();
    }, 3000);
}

function bye(){
    console.log("bye");
}

// OUTPUT: 
// hello
// bye