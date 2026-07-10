import { Player } from './Player.js';
import { Zombie } from './Zombie.js';
import { Grenade } from './Grenade.js';
import { input } from './Input.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.state = 'START'; // START, PLAYING, GAMEOVER
        
        this.score = 0;
        this.wave = 1;
        this.bestScore = localStorage.getItem('zombieArenaBestScore') || 0;
        document.getElementById('best-score').innerText = this.bestScore;
        
        this.reset();
    }

    reset() {
        this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
        this.zombies = [];
        this.projectiles = [];
        this.grenades = [];
        
        // Setup static obstacles (crates/barrels)
        this.obstacles = [
            { x: this.canvas.width/2 - 150, y: this.canvas.height/2 - 100, w: 40, h: 40 },
            { x: this.canvas.width/2 + 100, y: this.canvas.height/2 - 100, w: 60, h: 40 },
            { x: this.canvas.width/2 - 120, y: this.canvas.height/2 + 150, w: 40, h: 60 },
            { x: this.canvas.width/2 + 120, y: this.canvas.height/2 + 100, w: 40, h: 40 }
        ];
        
        this.score = 0;
        this.wave = 1;
        
        this.waveTimer = 0;
        this.zombiesToSpawn = 15; // start with more zombies
        this.zombiesSpawned = 0;
        this.spawnDelay = 1000; // start spawning faster
        this.lastSpawnTime = 0;
        
        this.updateUI();
        
        // Reset Shop UI
        document.getElementById('buy-shotgun-btn').innerText = `BUY - 250G`;
        document.getElementById('bought-shotgun').innerText = '0';
        document.getElementById('buy-ar-btn').innerText = `BUY - 400G`;
        document.getElementById('bought-ar').innerText = '0';
        document.getElementById('bought-ammo').innerText = '0';
        document.getElementById('bought-grenade').innerText = '0';
    }

    start() {
        this.state = 'PLAYING';
        this.reset();
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }

    gameOver() {
        this.state = 'GAMEOVER';
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-wave').innerText = this.wave;
        document.getElementById('final-score').innerText = this.score;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('zombieArenaBestScore', this.bestScore);
            document.getElementById('best-score').innerText = this.bestScore;
        }
    }

    startWaveTransition() {
        this.state = 'WAVE_TRANSITION';
        this.waveTransitionTimer = 2.0; // 2 seconds
        
        const banner = document.getElementById('wave-banner-screen');
        banner.classList.remove('hidden');
        document.getElementById('wave-banner-text').innerText = `WAVE ${this.wave}`;
        
        import('./Audio.js').then(m => m.audio.playWaveStart());
    }

    update(dt) {
        if (input.isJustPressed('p')) {
            if (this.state === 'PLAYING') {
                this.state = 'PAUSED';
                document.getElementById('pause-screen').classList.remove('hidden');
                return;
            } else if (this.state === 'PAUSED') {
                this.state = 'PLAYING';
                document.getElementById('pause-screen').classList.add('hidden');
            }
        }
    
        if (this.state === 'PAUSED') return;

        if (this.state === 'WAVE_TRANSITION') {
            this.waveTransitionTimer -= dt;
            if (this.waveTransitionTimer <= 0) {
                this.state = 'PLAYING';
                document.getElementById('wave-banner-screen').classList.add('hidden');
            }
            return;
        }

        if (this.state === 'SHOP') {
            if (input.isJustPressed('e')) {
                this.state = 'PLAYING';
                document.getElementById('shop-screen').classList.add('hidden');
            }
            return;
        }
        
        if (this.state !== 'PLAYING') return;
        // Open Shop logic
        if (input.isJustPressed('e') && this.player.y < 150) {
            this.state = 'SHOP';
            document.getElementById('shop-screen').classList.remove('hidden');
            return;
        }

        // Player actions (pass obstacles for collision)
        this.player.update(dt, this.canvas, this.obstacles);
        
        // Shoot
        if (input.mouse.down) {
            // Weapon nozzle is roughly 28px forward and 10px to the right of the center
            const cosAngle = Math.cos(this.player.angle);
            const sinAngle = Math.sin(this.player.angle);
            const spawnX = this.player.x + 28 * cosAngle - 10 * sinAngle;
            const spawnY = this.player.y + 28 * sinAngle + 10 * cosAngle;
            
            this.player.currentWeapon.fire(spawnX, spawnY, this.player.angle, this.projectiles);
        }

        // Throw Grenade
        if (input.isJustPressed('g') && this.player.grenadeCount > 0) {
            this.player.grenadeCount--;
            this.player.updateUI();
            const mouseWorldX = input.mouse.x;
            const mouseWorldY = input.mouse.y;
            this.grenades.push(new Grenade(this.player.x, this.player.y, mouseWorldX, mouseWorldY));
        }

        // Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt);
            
            // Check wall collision
            if (p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
                p.active = false;
            }
            
            // Check obstacle collision
            for (const obs of this.obstacles) {
                if (p.x > obs.x && p.x < obs.x + obs.w && p.y > obs.y && p.y < obs.y + obs.h) {
                    p.active = false;
                    break;
                }
            }
            
            if (!p.active) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update Grenades
        for (let i = this.grenades.length - 1; i >= 0; i--) {
            const g = this.grenades[i];
            g.update(dt, this.zombies, this);
            if (g.exploded && g.fuseTimer < -0.5) { // remove shortly after explosion
                this.grenades.splice(i, 1);
            }
        }

        // Update Zombies
        let activeZombies = 0;
        let spawnedZombiesRemaining = 0;
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const z = this.zombies[i];
            z.update(dt, this.player);
            
            // Zombie vs Obstacle collision (simple slide)
            for (const obs of this.obstacles) {
                // simple circle vs AABB
                const testX = Math.max(obs.x, Math.min(z.x, obs.x + obs.w));
                const testY = Math.max(obs.y, Math.min(z.y, obs.y + obs.h));
                const distX = z.x - testX;
                const distY = z.y - testY;
                const distance = Math.sqrt((distX*distX) + (distY*distY));
                
                if (distance < z.radius) {
                    // push out
                    const overlap = z.radius - distance;
                    const len = distance || 1;
                    z.x += (distX / len) * overlap;
                    z.y += (distY / len) * overlap;
                }
            }
            
            if (z.active) {
                activeZombies++;
                spawnedZombiesRemaining++;
                // Collision with projectiles
                for (const p of this.projectiles) {
                    if (!p.active) continue;
                    const dx = p.x - z.x;
                    const dy = p.y - z.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < z.radius + p.radius) {
                        p.active = false;
                        if (z.takeDamage(p.damage)) {
                            this.rewardKill();
                        }
                    }
                }
            } else {
                this.zombies.splice(i, 1);
            }
        }

        // Wave Management
        const now = performance.now();
        const unspawned = this.zombiesToSpawn - this.zombiesSpawned;
        this.totalZombiesRemaining = spawnedZombiesRemaining + unspawned;
        
        // Only update UI if count changed (optimization)
        if (this.lastTotalZombiesRemaining !== this.totalZombiesRemaining) {
            this.lastTotalZombiesRemaining = this.totalZombiesRemaining;
            document.getElementById('zombies-remaining').innerText = this.totalZombiesRemaining;
        }

        if (this.zombiesSpawned < this.zombiesToSpawn) {
            if (now - this.lastSpawnTime > this.spawnDelay) {
                this.spawnZombie();
                this.lastSpawnTime = now;
                this.spawnDelay = Math.max(200, 1500 - (this.wave * 150)); // spawn faster
            }
        } else if (activeZombies === 0 && this.state !== 'WAVE_TRANSITION') {
            // Next Wave
            this.wave++;
            this.zombiesToSpawn = 15 + (this.wave * 10);
            this.zombiesSpawned = 0;
            this.spawnDelay = 1000;
            
            // refill some health and grenades
            this.player.health = Math.min(this.player.maxHealth, this.player.health + 20);
            this.player.grenadeCount = Math.min(3, this.player.grenadeCount + 1);
            this.player.updateUI();
            
            this.updateUI();
            
            this.startWaveTransition();
        }

        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    rewardKill() {
        this.score += 10 * this.wave;
        this.player.gold += Math.floor(Math.random() * 10) + 5;
        this.player.updateUI();
        this.updateUI();
    }

    spawnZombie() {
        // Spawn from doors (left middle or right middle)
        let x, y;
        if (Math.random() > 0.5) {
            x = 30; // Left door
            y = this.canvas.height / 2;
        } else {
            x = this.canvas.width - 30; // Right door
            y = this.canvas.height / 2;
        }
        
        let type = 'NORMAL';
        const rand = Math.random();
        if (this.wave >= 4 && rand < 0.15) {
            type = 'TANK';
        } else if (this.wave >= 2 && rand < 0.3) {
            type = 'FAST';
        }
        
        this.zombies.push(new Zombie(x, y, this.wave, type));
        this.zombiesSpawned++;
    }

    updateUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('wave').innerText = this.wave;
        document.getElementById('zombies-remaining').innerText = this.totalZombiesRemaining || this.zombiesToSpawn;
    }

    drawArena(ctx) {
        // Draw Tiled snowy floor
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        for(let i=0; i<this.canvas.width; i+=40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.canvas.height);
            ctx.stroke();
        }
        for(let i=0; i<this.canvas.height; i+=40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.canvas.width, i);
            ctx.stroke();
        }

        // Draw Walls (Top, Bottom, Left, Right)
        ctx.fillStyle = '#475569';
        // Top Wall
        ctx.fillRect(0, 0, this.canvas.width, 60);
        // Bottom Wall
        ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        // Left Wall
        ctx.fillRect(0, 0, 40, this.canvas.height);
        // Right Wall
        ctx.fillRect(this.canvas.width - 40, 0, 40, this.canvas.height);
        
        // Draw Doors
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, this.canvas.height/2 - 60, 40, 120); // Left door
        ctx.fillRect(this.canvas.width - 40, this.canvas.height/2 - 60, 40, 120); // Right door
        
        ctx.fillStyle = '#fff';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText("SPAWN 1", 50, this.canvas.height/2 - 70);
        ctx.fillText("SPAWN 2", this.canvas.width - 120, this.canvas.height/2 - 70);

        // Draw Shop Stall (moved down to 50 so it doesn't overlap top bar)
        const shopX = this.canvas.width / 2 - 100;
        ctx.fillStyle = '#8b5a2b'; // Wood color
        ctx.fillRect(shopX, 50, 200, 80);
        ctx.fillStyle = '#d2b48c';
        ctx.fillRect(shopX + 10, 60, 180, 20); // Awning
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText("WEAPON SHOP", shopX + 30, 120);
        
        // Draw Obstacles (Crates)
        ctx.fillStyle = '#9a6324';
        ctx.strokeStyle = '#4e3415';
        ctx.lineWidth = 2;
        for (const obs of this.obstacles) {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
            // X mark on crate
            ctx.beginPath();
            ctx.moveTo(obs.x, obs.y);
            ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
            ctx.moveTo(obs.x + obs.w, obs.y);
            ctx.lineTo(obs.x, obs.y + obs.h);
            ctx.stroke();
        }
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        
        this.drawArena(this.ctx);

        // Draw Game Entities (Correct Z-Order)
        // 1. Grenade Explosions
        for (const g of this.grenades) g.draw(this.ctx);
        // 2. Zombies
        for (const z of this.zombies) z.draw(this.ctx);
        
        if (this.state === 'PLAYING' || this.state === 'WAVE_TRANSITION') {
            // 3. Player
            this.player.draw(this.ctx);
            
            // 4. Projectiles (Bullets on Top)
            for (const p of this.projectiles) p.draw(this.ctx);
            
            // 5. Crosshair
            this.ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            const cx = input.mouse.x;
            const cy = input.mouse.y;
            this.ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            this.ctx.moveTo(cx - 15, cy);
            this.ctx.lineTo(cx + 15, cy);
            this.ctx.moveTo(cx, cy - 15);
            this.ctx.lineTo(cx, cy + 15);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}
