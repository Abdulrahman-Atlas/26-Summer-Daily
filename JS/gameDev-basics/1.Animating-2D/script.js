const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); //context

// console.log(ctx);

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

let x=0, y=0;
let backNforth = true;
function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillRect(x, y, 100, 100);
    if(backNforth && x < 505){
        x++;
        y++;
        if(x+1 >= 505) backNforth = !backNforth;
    }

    if(!backNforth && x > -1){
        x--;
        y--;
        if(x-1 <= -1) backNforth = !backNforth
    }
    
    requestAnimationFrame(animate);
};
animate();
