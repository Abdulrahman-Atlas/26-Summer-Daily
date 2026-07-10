import { audio } from './Audio.js';

export class Zombie {
    constructor(x, y, waveMultiplier, type = 'NORMAL') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Base stats based on type
        if (type === 'FAST') {
            this.radius = 12;
            this.speed = 110 + (Math.random() * 30) + (waveMultiplier * 6);
            this.maxHealth = 20 + (waveMultiplier * 5);
            this.damage = 5 + (waveMultiplier * 2);
            this.color = '#ef4444'; // Red
            this.skin = '#991b1b';
        } else if (type === 'TANK') {
            this.radius = 22;
            this.speed = 40 + (Math.random() * 10) + (waveMultiplier * 3);
            this.maxHealth = 150 + (waveMultiplier * 30);
            this.damage = 25 + (waveMultiplier * 5);
            this.color = '#9ca3af'; // Grey
            this.skin = '#4b5563';
        } else {
            this.radius = 14;
            this.speed = 80 + (Math.random() * 20) + (waveMultiplier * 5);
            this.maxHealth = 40 + (waveMultiplier * 10);
            this.damage = 10 + (waveMultiplier * 2);
            this.color = '#22c55e'; // Green
            this.skin = '#14532d';
        }
        
        this.health = this.maxHealth;
        
        this.angle = 0;
        this.active = true;
        
        // Attack timer to prevent instant death on touch
        this.lastAttackTime = 0;
        this.attackCooldown = 1000; // 1 second
    }

    update(dt, player) {
        if (!this.active) return;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        this.angle = Math.atan2(dy, dx);
        
        // Random groan (much less frequent)
        if (Math.random() < 0.0002) {
            audio.playZombieGroan();
        }
        
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Move towards player
        if (dist > this.radius + player.radius) {
            this.x += Math.cos(this.angle) * this.speed * dt;
            this.y += Math.sin(this.angle) * this.speed * dt;
        } else {
            // Attack player
            const now = performance.now();
            if (now - this.lastAttackTime > this.attackCooldown) {
                player.takeDamage(this.damage);
                this.lastAttackTime = now;
            }
        }
    }

    takeDamage(amount) {
        if (!this.active) return false;
        
        this.health -= amount;
        
        // Knockback (less for tanks)
        const kb = this.type === 'TANK' ? 1 : 5;
        this.x -= Math.cos(this.angle) * kb;
        this.y -= Math.sin(this.angle) * kb;

        if (this.health <= 0) {
            this.active = false;
            audio.playZombieGroan();
            return true; // killed by this hit
        }
        return false;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Shoulders / clothes
        ctx.fillStyle = '#374151'; // dark grey clothes
        ctx.fillRect(-8, -12, 16, 24);

        // Draw Arms reaching forward
        ctx.fillStyle = this.color;
        const armOffset = this.radius * 0.8;
        const armWidth = this.radius * 0.8;
        ctx.fillRect(armOffset, -armWidth, armWidth, armWidth/2); // left arm
        ctx.fillRect(armOffset, armWidth/2, armWidth, armWidth/2); // right arm

        // Draw Zombie Head
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.skin;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
        
        // Health bar
        if (this.health < this.maxHealth) {
            const hpWidth = 20;
            const hpHeight = 4;
            const hpRatio = Math.max(0, this.health / this.maxHealth);
            
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x - hpWidth/2, this.y - this.radius - 12, hpWidth, hpHeight);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(this.x - hpWidth/2, this.y - this.radius - 12, hpWidth * hpRatio, hpHeight);
        }
    }
}
