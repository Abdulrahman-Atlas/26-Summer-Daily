const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = 'bold 50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let ravens = [], smokes = [];
let ravenCount = 10;
let score = 0;
let gameOver = false;

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.4 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;   // 3-8
        this.directionY = Math.random() * 5 - 2.5; // 0-2.5
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.delete = false;
        this.lastFlap = 0;
        this.flapTime = Math.random() * 50 + 50;
        this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    update(deltatime) {
        this.lastFlap += deltatime;
        if (this.lastFlap >= this.flapTime) {
            if (this.frame >= 5) this.frame = 0;
            else this.frame++;
            this.lastFlap = 0;
            
            particles.push(new Particle(this.x + this.width / 1.5, this.y + this.height / 2, this.width, this.color));
        }
        // bounce once raven hits horizontal edge
        if (this.y > canvas.height - this.height || this.y < 0) this.directionY = -this.directionY;
        // mark for deletion once it leaves window
        if (this.x < -this.width) this.delete = true;

        this.x -= this.directionX;
        this.y += this.directionY;

        if (this.x < 0 - this.width) {
            gameOver = true;
        }
    }
    draw() {
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Smoke {
    constructor(x, y, width, height) {
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.delete = false;
        this.timer = 0;
        this.interval = 100;
    }

    update(deltatime) {
        if (this.timer > this.interval) {
            if (this.frame >= 5) {
                this.delete = true;
            } else {
                this.frame++;
                this.timer = 0;
            }
        } else {
            this.timer += deltatime;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let particles = [];
class Particle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = Math.random() * this.size / 10;
        this.delete = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.speedY = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.2;
        if (this.radius > this.size / 10) this.delete = true;

    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.addEventListener('click', function (e) {
    if (gameOver) return;
    if(e.offsetX > 0 && e.offsetX < canvas.width && e.offsetY > 0 && e.offsetY < canvas.height) {
        for (let i = 0; i < ravens.length; i++) {
            if (e.offsetX > ravens[i].x && e.offsetX < ravens[i].x + ravens[i].width && e.offsetY > ravens[i].y && e.offsetY < ravens[i].y + ravens[i].height) {
                // collision detected
                score++;
                smokes.push(new Smoke(ravens[i].x, ravens[i].y, ravens[i].width, ravens[i].height));
                var snd = new Audio("boom.mp3"); 
                snd.volume = 0.3;
                snd.play();
                ravens.splice(i, 1);
                break;
            }
        }
    }
})

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 52, 77);
}

function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.fillText(`Game Over!`, canvas.width / 2 - 150, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.fillText(`Game Over!`, canvas.width / 2 - 148, canvas.height / 2 + 2);
}

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // deltatime = change in time || how much each iteration is taking
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
    }
    // console.log(deltatime);
    [...particles, ...smokes, ...ravens].forEach((element) => {
        element.update(deltatime);
        element.draw();
    });
    ravens = ravens.filter(element => {return !element.delete;});
    smokes = smokes.filter(element => { return !element.delete; });
    particles = particles.filter(element => { return !element.delete; });

    
    drawScore();

    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);