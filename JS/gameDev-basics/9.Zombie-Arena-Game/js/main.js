import { Game } from './Game.js';
import { input } from './Input.js';
import { audio } from './Audio.js';

const canvas = document.getElementById('gameCanvas');
// Fixed logical size for consistent gameplay and arena
canvas.width = 1200;
canvas.height = 800;
const game = new Game(canvas);

function resize() {
    const scale = Math.min(window.innerWidth / 1200, window.innerHeight / 800);
    const container = document.getElementById('game-container');
    container.style.transform = `scale(${scale})`;
    
    // Resize the wrapper so it takes up exactly the scaled size in the DOM
    const wrapper = document.getElementById('game-wrapper');
    if (wrapper) {
        wrapper.style.width = `${1200 * scale}px`;
        wrapper.style.height = `${800 * scale}px`;
    }
}
window.addEventListener('resize', resize);
resize();

let lastTime = 0;

function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (dt < 0.1) { // Prevent huge jumps if tab was inactive
        game.update(dt);
        game.draw();
    }
    
    input.update(); // clear frame-specific inputs

    requestAnimationFrame(gameLoop);
}

// UI Event Listeners
document.getElementById('start-btn').addEventListener('click', () => {
    audio.enable();
    game.start();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    game.start();
});

document.getElementById('buy-ammo-btn').addEventListener('click', () => {
    if (game.player.gold >= 50) {
        game.player.gold -= 50;
        game.player.purchaseCounts.ammo++;
        document.getElementById('bought-ammo').innerText = game.player.purchaseCounts.ammo;
        
        // Refill reserve ammo
        const sg = game.player.weapons.find(w => w.name === 'SHOTGUN');
        if (sg) sg.reserveAmmo += 24;
        
        const ar = game.player.weapons.find(w => w.name === 'ASSAULT RIFLE');
        if (ar) ar.reserveAmmo += 90;
        
        game.player.updateUI();
        game.updateUI();
    }
});

document.getElementById('buy-grenade-btn').addEventListener('click', () => {
    if (game.player.gold >= 100) {
        game.player.gold -= 100;
        game.player.purchaseCounts.grenade++;
        document.getElementById('bought-grenade').innerText = game.player.purchaseCounts.grenade;
        game.player.grenadeCount++;
        game.player.updateUI();
        game.updateUI();
    }
});

document.getElementById('buy-shotgun-btn').addEventListener('click', () => {
    const price = game.player.shopPrices.shotgun;
    if (game.player.gold >= price) {
        game.player.gold -= price;
        game.player.purchaseCounts.shotgun++;
        
        // Increase price by 50% for next purchase
        game.player.shopPrices.shotgun = Math.floor(price * 1.5);
        document.getElementById('buy-shotgun-btn').innerText = `BUY - ${game.player.shopPrices.shotgun}G`;
        
        document.getElementById('bought-shotgun').innerText = game.player.purchaseCounts.shotgun;
        
        const sg = game.player.weapons.find(w => w.name === 'SHOTGUN');
        if (sg) {
            sg.pellets += 2;
            sg.damage += 5;
        }
        
        game.player.updateUI();
        game.updateUI();
    }
});

document.getElementById('buy-ar-btn').addEventListener('click', () => {
    const price = game.player.shopPrices.ar;
    if (game.player.gold >= price) {
        game.player.gold -= price;
        game.player.purchaseCounts.ar++;
        
        // Increase price by 50% for next purchase
        game.player.shopPrices.ar = Math.floor(price * 1.5);
        document.getElementById('buy-ar-btn').innerText = `BUY - ${game.player.shopPrices.ar}G`;
        
        document.getElementById('bought-ar').innerText = game.player.purchaseCounts.ar;
        
        const ar = game.player.weapons.find(w => w.name === 'ASSAULT RIFLE');
        if (ar) {
            ar.fireRate = Math.max(20, ar.fireRate - 15);
            ar.maxAmmo += 10;
        }
        
        game.player.updateUI();
        game.updateUI();
    }
});

// Start loop
requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    gameLoop(timestamp);
});
