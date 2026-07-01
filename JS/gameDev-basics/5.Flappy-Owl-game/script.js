const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 1000;

const image = new Image();
image.src = 'assets/pipe.png';
console.log(CANVAS_WIDTH);


image.onload = function(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(image, 0, 50, 100, CANVAS_HEIGHT);
    ctx.drawImage(image, 300, 0, 100, CANVAS_HEIGHT);
}
