// = assignment
// == comparison
// === compare if value and datatype are equal
// != inequality
// !== strict inequality

const PI = 3.14;

// normal
if  (PI == "3.14") console.log("That is PI");
else 
    console.log("that is not PI")

//strict number vs string
if  (PI === "3.14") console.log("That is PI");
else 
    console.log("that is not PI")

//              Inequality
if  (PI != "3.14") console.log("That isn't PI");
else 
    console.log("that is PI")

//strict number vs string
if  (PI !== "3.14") console.log("That isn't PI");
else 
    console.log("that is PI")



// Examples
// Different values, same type
// 5 !== 10
// // true

// Same value, same type
// 5 !== 5
// // false

// Same value, different types
// 5 !== "5"
// // true