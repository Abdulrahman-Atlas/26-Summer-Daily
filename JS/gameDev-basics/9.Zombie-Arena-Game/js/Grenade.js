import { audio } from './Audio.js';

export class Grenade {
    constructor(x, y, tx, ty) {
        this.x = x;
        this.y = y;
        this.targetX = tx;
        this.targetY = ty;
        
        // calculate velocity to reach target in ~1 second
        const dx = tx - x;
        const dy = ty - y;
        this.vx = dx * 1.5; 
        this.vy = dy * 1.5;
        
        this.fuseTimer = 1.0; // 1 second fuse
        this.exploded = false;
        this.damage = 150;
        this.radius = 150; // explosion radius
        
        this.rotation = 0;
    }

    update(dt, zombiesArray, game) {
        if (this.exploded) return;

        this.fuseTimer -= dt;
        
        // simple friction/slowing down
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.rotation += 10 * dt;

        if (this.fuseTimer <= 0) {
            this.explode(zombiesArray, game);
        }
    }

    explode(zombiesArray, game) {
        this.exploded = true;
        audio.playBoom();
        
        // Deal damage to zombies in radius
        for (const zombie of zombiesArray) {
            const dx = zombie.x - this.x;
            const dy = zombie.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < this.radius) {
                // falloff damage
                const damagePercent = 1 - (dist / this.radius);
                if (zombie.takeDamage(this.damage * damagePercent)) {
                    game.rewardKill();
                }
            }
        }
    }

    draw(ctx) {
        if (this.exploded) {
            // Draw explosion
            ctx.fillStyle = `rgba(255, 100, 0, ${Math.max(0, this.fuseTimer + 0.2)})`; // fading out rapidly
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        // Draw grenade
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        
        // blinking red light
        if (Math.floor(this.fuseTimer * 10) % 2 === 0) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}
