const canvas = document.getElementById("canvas1");
ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gameSpeed = 5;
// let gameFrame = 0;



addEventListener('change', function(){

})

const layer1 = new Image();
layer1.src = 'backgroundLayers/1.png';
const layer2 = new Image();
layer2.src = 'backgroundLayers/2.png';
const layer3 = new Image();
layer3.src = 'backgroundLayers/3.png';
const layer4 = new Image();
layer4.src = 'backgroundLayers/4.png';
const layer5 = new Image();
layer5.src = 'backgroundLayers/5.png';

const slider = document.getElementById("slider");
slider.value = gameSpeed;
let showGameSpeed = document.getElementById("gameSpeed");
showGameSpeed.textContent = gameSpeed;

slider.addEventListener('change', function(){
    gameSpeed = slider.value;
    showGameSpeed.textContent = gameSpeed;
})

addEventListener('load', function(){
    class Layer{
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        // this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;        
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width) this.x = 0;
        else this.x -= this.speed;
        // the issue with the gameFrame method is that changing the speed will make it skip frames and cut
        // this.x = gameFrame * this.speed % this.width;
    }
    draw(){
    //  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); s=source, d=destination
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const l1 = new Layer(layer1, 0.2);
const l2 = new Layer(layer2, 0.2);
const l3 = new Layer(layer3, 0.3);
const l4 = new Layer(layer4, 0.5);
const l5 = new Layer(layer5, 1.5);

const layers = [l1, l2, l3, l4, l5];


function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    layers.forEach((element) => {
        element.update();
        element.draw();
    })


    
    // gameFrame--;
    requestAnimationFrame(animate);
}
animate();
})

