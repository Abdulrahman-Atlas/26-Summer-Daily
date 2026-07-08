// this lets VScode suggest canvas methods while coding
/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 700;
const CANVAS_HEIGHT = canvas.height = 900;
let gameSpeed = 4;
let playerAnimationSpeed = 2;
let gameFrame = 0;
let score = 0;
let isGameOver = false;
// Saving
localStorage.setItem("highScore", score);


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

addEventListener('load', function () {
//                                        Background LOGIC
    class Layer {
        constructor(image, speedModifier) {
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 900;
            // this.x2 = this.width;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update() {
            this.speed = gameSpeed * this.speedModifier;
            if (this.x <= -this.width) this.x = 0;
            else this.x -= this.speed;
            // the issue with the gameFrame method is that changing the speed will make it skip frames and cut
            // this.x = gameFrame * this.speed % this.width;
        }
        draw() {
            //  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); s=source, d=destination
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
    }

    const l1 = new Layer(layer1, 0.1);
    const l2 = new Layer(layer2, 0.1);
    const l3 = new Layer(layer3, 0.2);
    const l4 = new Layer(layer4, 0.3);
    const l5 = new Layer(layer5, 1.0);

    const layers = [l1, l2, l3, l4, l5];

//                                     OBSTACLE LOGIC
    class Pipe {
        constructor(start, gap) {
            this.width = 100;
            this.height = 500;
            this.x = start;
            this.y1 = Math.random() * 350 + 250;
            this.y2 = this.y1 - gap - this.height;
            this.gap = gap;
            this.speed = gameSpeed;
            this.image1 = new Image();
            this.image1.src = 'assets/pipe1.png';
            this.image2 = new Image();
            this.image2.src = 'assets/pipe2.png';
        }

        update() {
            if (this.x < -this.width) {
                this.x = CANVAS_WIDTH;
                this.y1 = Math.random() * 350 + 250;
                this.y2 = this.y1 - this.gap - this.height;
            }
            else this.x -= gameSpeed;
        }
        draw() {
            ctx.drawImage(this.image1, this.x, this.y1, this.width, this.height);
            ctx.drawImage(this.image2, this.x, this.y2, this.width, this.height);
            // ctx.strokeStyle = "white";
            // ctx.strokeRect(this.x, this.y1, this.width, this.height);
            // ctx.strokeRect(this.x, this.y2, this.width, this.height);
        }
    }

    const piepGap = 200;
    let p1 = new Pipe(400, piepGap);
    let p2 = new Pipe(CANVAS_WIDTH + 100, piepGap);
    let pieps = [p1, p2];

    const image1 = new Image();
    image1.src = 'assets/pipe1.png';

    const image2 = new Image();
    image2.src = 'assets/pipe2.png';

    window.addEventListener('keydown', (event) => {
        if (event.code === "Space" && !isGameOver)
            player.yVelocity = -player.jumpHeight;

        else if (event.code === "Space" && isGameOver) {
            resetGame();
        }

    })

//                                      PLAYER LOGIC
    class Player {
        constructor(iWidth, iHeight, iCount) {
            this.x = 100;
            this.y = 300;
            this.width = 50;
            this.height = 50;
            // this.angle = 0;
            this.velocityChangeFactor = 0.1;
            this.yVelocity = 0;
            this.currentFrame = 0;
            this.image = new Image();
            this.image.src = `assets/player.png`;
            this.iCount = iCount;
            this.frameWidth = iWidth / iCount;
            this.frameHeight = iHeight;
            this.jumpHeight = 5;
        }
        update() {
            // this.y += Math.sin(this.angle) * this.jumpHeight;
            // this.angle += 0.1;
            this.y += this.yVelocity;
            this.yVelocity += this.velocityChangeFactor;
            this.velocityChangeFactor += 0.0001;
            this.jumpHeight += 0.001;
            this.currentFrame = (Math.floor(gameFrame * playerAnimationSpeed / 5) % this.iCount) * this.frameWidth;
        }
        draw() {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight,
                this.x, this.y, this.width, this.height);
            
            // ctx.strokeRect(this.x + 10, this.y + 5, this.width - 20  , this.height - 10);
        }
    }

    let player = new Player(1596, 188, 6);

//                                  COLLISIONS CHECKS
    function checkCollision(owl, pipeX, pipeY1, pipeY2, pipeX1, pipeY11, pipeY21) {
        const pipeWidth = 100;
        const pipeHeight = 500;
        const owlX = owl.x + 10;
        const owlY = owl.y + 5;
        const owlWidth = owl.width - 20;
        const owlHeight = owl.height - 10

        // 1. Check if the owl is horizontally inside the pipe column
        // (This is the same for both pipes, so we only check it once)
        const inPipeXRange = owlX < pipeX + pipeWidth &&
            owlX + owlWidth > pipeX;

        // 2. Check if the owl overlaps the FIRST pipe vertically
        const hitPipe1 = owlY < pipeY1 + pipeHeight &&
            owlY + owlHeight > pipeY1;

        // 3. Check if the owl overlaps the SECOND pipe vertically
        const hitPipe2 = owlY < pipeY2 + pipeHeight &&
            owlY + owlHeight > pipeY2;
        
        // repeat for the second pipe (there are 2 pipes repeating)


        const inPipeXRange1 = owlX < pipeX1 + pipeWidth &&
            owlX + owlWidth > pipeX1;

        // 2. Check if the owl overlaps the FIRST pipe vertically
        const hitPipe11= owlY < pipeY11 + pipeHeight &&
            owlY + owlHeight > pipeY11;

        // 3. Check if the owl overlaps the SECOND pipe vertically
        const hitPipe21 = owlY < pipeY21 + pipeHeight &&
            owlY + owlHeight > pipeY21;

        // If the owl is in the X range AND hits either the top or bottom pipe...
        if ((inPipeXRange && (hitPipe1 || hitPipe2)) || 
            (inPipeXRange1 && (hitPipe11 || hitPipe21))) {
            return true; // Crash!
        }

        // the floor/ceiling bounds!
        if (owl.y < -100 || owl.y + owl.height + 150 > canvas.height) {
            return true; // Crash!
        }

        if (score > localStorage.getItem("highScore"))
            localStorage.setItem("highScore", score);

        score += gameSpeed / 300;

        return false; // Safe!
    }
    
    function drawScore() {
        ctx.textAlign = "left"; 
        ctx.fillStyle = "black";
        ctx.font = "24px Arial";
        // Draw text: "Score: 100" at x=10, y=30
        ctx.fillText("Score: " + score.toFixed(0), 10, 30); 
        ctx.fillStyle = "white";
        ctx.fillText("Score: " + score.toFixed(0), 10, 31);
    }

    function GameOverScreen() {
        // Semi-transparent black background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Game Over Text
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        // Instructions to restart
        ctx.font = "20px Arial";
        ctx.fillText("Press Spacebar Restart", canvas.width / 2, canvas.height / 2 + 30);

        // Loading later
        let best = localStorage.getItem("highScore") || 0;
        best = Number(best);

        ctx.font = "20px Arial";
        ctx.fillText(`High Score: ${best.toFixed(0)}`, canvas.width / 2, canvas.height / 2 + 55);

    }

    function resetGame() {
        player = new Player(1596, 188, 6);
        p1 = new Pipe(400, piepGap);
        p2 = new Pipe(CANVAS_WIDTH + 100, piepGap);
        pieps = [p1, p2];
        gameSpeed = 4;
        playerAnimationSpeed = 2;
        gameFrame = 0;
        score = 0;
        isGameOver = false; 
        // animate();
    };





//                                   game LOOP
    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (!isGameOver) {
            // Draw everything but the floor to not let the pipes over it.
            for (let i = 0; i < 4; i++) {
                layers[i].update();
                layers[i].draw();
            }

            // Draw pipes
            pieps.forEach((element) => {
                element.update();
                element.draw();
            });

            // Draw floor
            layers[4].update();
            layers[4].draw();
            // Draw Player
            player.update();
            player.draw();
            drawScore();
            if (checkCollision(player, p1.x, p1.y1, p1.y2, p2.x, p2.y1, p2.y2)) {
                isGameOver = true;
            }


            gameSpeed += 0.001;
            gameFrame++;
        }
        else {
            // --GAMEOVER STATE--
            // Draw everything without updating so the screen stays frozen
            
            for (let i = 0; i < 4; i++) layers[i].draw();
            pieps.forEach((element) => element.draw());
            layers[4].draw();
            player.draw();
            drawScore();

            GameOverScreen();
        }
        requestAnimationFrame(animate);
    }
    animate();
})

