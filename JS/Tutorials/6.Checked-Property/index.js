const myCB = document.getElementById("checkbox");
const visaB = document.getElementById("visa");
const mastercardB = document.getElementById("mastercard");
const troyB = document.getElementById("troy");
const button = document.getElementById("button");
const paymentResult = document.getElementById("paymentResult");

button.onclick = function(){
    if(!myCB.checked){
        paymentResult.textContent = `You are BELOW 18 years old`;
        return;
    }

    if(visaB.checked){
        paymentResult.textContent = `You are paying with visa`;
    }    
    else if(mastercardB.checked){
        paymentResult.textContent = `You are paying with mastercard`;
    } 
    else if(troyB.checked){
        paymentResult.textContent = `You are paying with troy`;
    }
    else{
        paymentResult.textContent = `You MUST choose a payment method`;
    }
};