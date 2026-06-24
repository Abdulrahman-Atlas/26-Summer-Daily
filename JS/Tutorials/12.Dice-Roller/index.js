

const button = document.getElementById("button");

const diceImage = new Image();
diceImage.src = "./dice/1.png";




function rollDice(){
    const numOfDice = document.getElementById("textBox").value;
    const result = document.getElementById("result");
    const diceImages = document.getElementById("diceImages");
    const values = [];
    const images = [];

    for(let i = 0; i<numOfDice; i++){
        const value = Math.floor(Math.random() * 6) + 1;
        values.push(value);
        images.push(`<img src="dice/${value}.png" alt="Dice ${value}">`);
        // diceImages.add(images[0]);
    }

    result.textContent = `dice: ${values.join(', ')}`;
    diceImages.innerHTML = images.join('');
};