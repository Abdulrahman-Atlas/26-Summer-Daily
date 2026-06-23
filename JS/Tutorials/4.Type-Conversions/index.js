// In this example js assigns the type "String" to the variable age through promt

let age = window.prompt("How old are you?");
age = Number(age); // Convert to NUMBER
age = age + 1;
console.log(age);

let x = "0";
let y = "0";
let z = "";

x = Number(x);
y = String(y);
z = Boolean(z);

console.log(x, typeof x); // 0 'Number'
console.log(y, typeof y); // 0 string
console.log(z, typeof z); // if empty string -> false;