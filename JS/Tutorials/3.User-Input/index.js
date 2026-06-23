
//          1 Easy way using popup window prompt

// let userName;
// userName = window.prompt("What is your userName?");
// console.log("Hello " + userName + "!");



//          2 way using textbox and a button

let userName;

document.getElementById("myButton").onclick = function(){
    // define action onclick
    userName = document.getElementById("myInput").value;
    console.log(`Hello ${userName}`);
    //change the header
    document.getElementById("myH1").textContent = `Hello ${userName}`;
};

