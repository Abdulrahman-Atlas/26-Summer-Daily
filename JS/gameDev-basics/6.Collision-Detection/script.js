// this lets VScode suggest canvas methods while coding
/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const w = 100, h = 100;

const rect1 = {
    width: w,
    height: h,
    x: Math.random() * (CANVAS_WIDTH - w),
    y: Math.random() * (CANVAS_WIDTH - h),
    
};

const rect2 = {
    width: w,
    height: h,
    x: Math.random() * (CANVAS_WIDTH - w),
    y: Math.random() * (CANVAS_WIDTH - h),

};

window.addEventListener('keydown', (event) => {
    console.log(event);

    if (event.key == "ArrowRight") {

        rect1.x++;

    }

    if (event.key == "ArrowLeft") {

        rect1.x--;

    }

    if (event.key == "ArrowUp") {

        rect1.y--;

    }

    if (event.key == "ArrowDown") {

        rect1.y++;

    }


    if (rect1.x + rect1.width  < rect2.x ||
        rect1.y + rect1.height < rect2.y ||
        rect2.y + rect2.height < rect1.y ||
        rect2.x + rect2.width  < rect1.x
    )
        console.log("No Collision");
    else {
        console.log("COLLISION DETECTED!!!!!!!!!!!!!!!");
    }
})


function draw(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "black";
    ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
    ctx.fillStyle = "red";
    ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);

}

function animate() {
    draw();

    requestAnimationFrame(animate);
}
animate();


