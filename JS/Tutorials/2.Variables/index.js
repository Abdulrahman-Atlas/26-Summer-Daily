// Variables
let age;
age=25;
console.log(`My age is ${age}.`);
console.log(typeof age);

let name = "ABDULRAHMAN";
console.log(`My name is ${name}.`);
console.log(typeof name);

let online = true;
console.log(`Am I online? ${online}.`);
console.log(typeof online);

let x = null;
console.log(`The value of x is ${x}.`);
console.log(typeof x);

document.getElementById("p1").textContent = `My Name is ${name}.`;

document.getElementById("p2").textContent = `My age is ${age}.`;

document.getElementById("p3").textContent = `Am I online? ${online}.`;
