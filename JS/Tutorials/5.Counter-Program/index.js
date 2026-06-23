// COUNTER

const decrease = document.getElementById("decrease");
const reset = document.getElementById("reset");
const increase = document.getElementById("increase");
const countLabel = document.getElementById("count");

let count = 0;

decrease.onclick = function(){
    count--;
    countLabel.textContent = count;
};

reset.onclick = function(){
    count=0;
    countLabel.textContent = count;
};

increase.onclick = function(){
    count++;
    countLabel.textContent = count;
};

document.getElementById("rand").onclick = function(){
    count = Math.round(Math.random() * 100);
    countLabel.textContent = count;
}