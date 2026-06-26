const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //context

// console.log(ctx);

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = "shadow_dog.png";
let gameFrame = 0;
let staggeredFrames = 5;
// 6876 width
// 5230 Height

let dropdown = document.getElementById("animations");
let stateName = dropdown.value;
dropdown.addEventListener('change', function(e){
    stateName = e.target.value;
})

let frameX = 0;
let imageWidth = 6900 / 12;
let imageHeight = 5230 / 10;

const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    },
];

animationStates.forEach((element, index) => {
    let frames = {
        loc: [],
    }
    for(let i = 0; i<element.frames; i++){
        let x = i * imageWidth;
        let y = index * imageHeight;
        frames.loc.push({x: x, y: y});
    }

    spriteAnimations[element.name] = frames;
})
console.log(spriteAnimations);

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


//  the Horizontal image position index 0-6 (changes every 'staggeredFrames' frames)
    let position = Math.floor(gameFrame/ staggeredFrames) % spriteAnimations[stateName].loc.length;

//  frame x position in pixels
    frameX = position * imageWidth;
    let frameY = spriteAnimations[stateName].loc[1].y;
    
//  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh); s=source, d=destination
    ctx.drawImage(playerImage, frameX, frameY, imageWidth, imageHeight, 
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
