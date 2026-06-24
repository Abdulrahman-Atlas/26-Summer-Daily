const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //context

// console.log(ctx);

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = "shadow_dog.png";
let gameFrame = 0;
let staggeredFrames = 7;
// 6876 width
// 5230 Height

let frameX = 0;
let imageWidth = 6900 / 12;
let imageHeight = 5230 / 10;
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
//  the Horizontal image position index 0-6 (changes every 'staggeredFrames' frames)
    let position = Math.floor(gameFrame/ staggeredFrames) % 6;

//  frame x position in pixels
    frameX = position * imageWidth;

//  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); s=source, d=destination
    ctx.drawImage(playerImage, frameX, 0 * imageHeight, imageWidth, imageHeight, 
                             0, 0, imageWidth, imageHeight);

// // slow down animation by "staggerFrames" times
//     if(gameFrame % staggeredFrames == 0){
//         if(gameFrame < 6) gameFrame++;
//         else gameFrame=0;
//     }

    gameFrame++;
    requestAnimationFrame(animate);
};
animate();
