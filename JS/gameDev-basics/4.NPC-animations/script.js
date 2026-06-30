// this lets VScode suggest canvas methods while coding
/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");

const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
// range 0-10
const animationSpeed = 1;
let enemyCount = 10;

// enemies
let enemies = [];

class Enemy{
    constructor(type, iWidth, iHeight, iCount){
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = 10;
        this.width = 100;
        this.height = 100;
        this.speed = Math.random() * 1 + 1;
        this.angle = Math.random() * 90;
        this.currentFrame = 0;
        this.staggeredFrames = 3;
        this.image = new Image();
        this.image.src = `enemies/enemy${type}.png`;
        this.iCount = iCount;
        this.frameWidth = iWidth / iCount;
        this.frameHeight = iHeight;
        this.jumpHeight = Math.random() * 200 + 100;
    }
    update(){
        this.x -= this.speed;
        if(this.x < -this.width) this.x = CANVAS_WIDTH;
        // if(this.y < CANVAS_HEIGHT - this.frameHeight/1.5) this.y += this.speed;
        this.y = Math.sin(this.angle) * this.jumpHeight + (CANVAS_HEIGHT - this.jumpHeight - this.height);
        this.angle += 0.05;
        this.currentFrame = (Math.floor(gameFrame * animationSpeed / this.staggeredFrames) % this.iCount) * this.frameWidth;
    }
    draw(){
        ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight, 
            this.x, this.y, this.width, this.height);
    }
}

const e1 = new Enemy(1, 1758, 155, 6);

for(let i=0; i<enemyCount; i++){
    enemies.push(new Enemy(1, 1758, 155, 6));
}

let gameFrame=0;

function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // let position = Math.floor(gameFrame / staggeredFrames) % 6;
    enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw();
    });
    // e1.update();
    // e1.draw();
    
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();