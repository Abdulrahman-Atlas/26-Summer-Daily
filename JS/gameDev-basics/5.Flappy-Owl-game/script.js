const canvas = document.getElementById("canvas1");
ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 700;
const CANVAS_HEIGHT = canvas.height = 900;
let gameSpeed = 3;
let animationSpeed = 2;
let gameFrame = 0;



addEventListener('change', function () {

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

// const slider = document.getElementById("slider");
// slider.value = gameSpeed;
// let showGameSpeed = document.getElementById("gameSpeed");
// showGameSpeed.textContent = gameSpeed;

// slider.addEventListener('change', function () {
//     gameSpeed = slider.value;
//     showGameSpeed.textContent = gameSpeed;
// })

addEventListener('load', function () {
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
        draw(){
            ctx.drawImage(this.image1, this.x, this.y1, this.width, this.height);
            ctx.drawImage(this.image2, this.x, this.y2, this.width, this.height);
        }
    }

    const piepGap = 200;
    const p1 = new Pipe(300, piepGap);
    const p2 = new Pipe(CANVAS_WIDTH, piepGap);
    const pieps = [p1, p2];

    let image1 = new Image();
    image1.src = 'assets/pipe1.png';

    let image2 = new Image();
    image2.src = 'assets/pipe2.png';

    class Player {
        constructor(iWidth, iHeight, iCount) {
            this.x = 100;
            this.y = 300;
            this.width = 100;
            this.height = 100;
            this.speed = Math.random() * 1 + 1;
            this.angle = 0;
            this.currentFrame = 0;
            this.staggeredFrames = 3;
            this.image = new Image();
            this.image.src = `assets/player.png`;
            this.iCount = iCount;
            this.frameWidth = iWidth / iCount;
            this.frameHeight = iHeight;
            this.jumpHeight = 5;
        }
        update() {
            // this.x -= this.speed;
            // if (this.x < -this.width) this.x = CANVAS_WIDTH;
            // if(this.y < CANVAS_HEIGHT - this.frameHeight/1.5) this.y += this.speed;
            this.y += Math.sin(this.angle) * this.jumpHeight;
            this.angle += 0.1;
            this.currentFrame = (Math.floor(gameFrame * animationSpeed / this.staggeredFrames) % this.iCount) * this.frameWidth;
        }
        draw() {
            ctx.drawImage(this.image, this.currentFrame, 0, this.frameWidth, this.frameHeight,
                this.x, this.y, this.width, this.height);
        }
    }

    const player = new Player(1596, 188, 6);




    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (let i = 0; i < 4; i++){
            layers[i].update();
            layers[i].draw();
        }
        // layers.forEach((element) => {
        //     element.update();
        //     element.draw();
        // })

        pieps.forEach((element) => {
            element.update();
            element.draw();
        })

        

        // ctx.drawImage(image1, 350, 250, 100, 500);
        // ctx.drawImage(image1, 350, 600, 100, 500);
        // ctx.drawImage(image2, 350, 600 - 200 - 500, 100, 500);

        layers[4].update();
        layers[4].draw();

        player.update();
        player.draw();


        gameFrame++;
        requestAnimationFrame(animate);
    }
    animate();
})

