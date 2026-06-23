const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //context

// console.log(ctx);

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();

// playerImage.src = null;
let x=0, y=0;
function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillRect(x, y, 100, 100);
    x++;
    y++;
    if(x > 600) x=0;
    if(y > 600) y=0;
    requestAnimationFrame(animate);
};
animate();
