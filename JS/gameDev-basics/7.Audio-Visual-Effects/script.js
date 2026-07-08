const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const explosions = [];

class Explosion {
    constructor(x, y) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.sound = new Audio();
        this.sound.src = 'boom.mp3';
        this.sound.volume = 0.3;
        this.frame = 0;
        this.timer = 0;
    }

    update() {
        if (this.frame === 0) this.sound.play();
        this.timer++;
        if (this.timer % 10 === 0) this.frame++;
    }
    draw() {
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

window.addEventListener('click', function (e) {
    explosions.push(new Explosion(e.offsetX, e.offsetY));
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update();
        explosions[i].draw();
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
};
animate();

