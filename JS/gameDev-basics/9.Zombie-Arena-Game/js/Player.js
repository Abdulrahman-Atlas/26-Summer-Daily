import { input } from './Input.js';
import { Pistol, Shotgun, AssaultRifle } from './Weapon.js';
import { audio } from './Audio.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 200;
        
        this.maxHealth = 100;
        this.health = 100;
        this.gold = 0;
        
        this.angle = 0;
        
        this.weapons = [
            new Pistol(),
            new Shotgun(),
            new AssaultRifle()
        ];
        this.currentWeaponIndex = 0;
        this.grenadeCount = 3;
        this.gold = 0;
        
        this.purchaseCounts = {
            ammo: 0,
            grenade: 0,
            shotgun: 0,
            ar: 0
        };
        
        this.shopPrices = {
            ammo: 50,
            grenade: 100,
            shotgun: 250,
            ar: 400
        };
        
        this.updateUI();
    }

    get currentWeapon() {
        return this.weapons[this.currentWeaponIndex];
    }

    update(dt, canvas, obstacles) {
        // Movement
        let dx = 0;
        let dy = 0;
        
        if (input.isDown('w')) dy -= 1;
        if (input.isDown('s')) dy += 1;
        if (input.isDown('a')) dx -= 1;
        if (input.isDown('d')) dx += 1;
        
        // Normalize vector
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx*dx + dy*dy);
            dx /= length;
            dy /= length;
        }
        
        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;
        
        // Boundaries
        this.x = Math.max(this.radius + 30, Math.min(canvas.width - this.radius - 30, this.x));
        this.y = Math.max(this.radius + 30, Math.min(canvas.height - this.radius - 30, this.y));

        // Obstacle Collision
        if (obstacles) {
            for (const obs of obstacles) {
                const testX = Math.max(obs.x, Math.min(this.x, obs.x + obs.w));
                const testY = Math.max(obs.y, Math.min(this.y, obs.y + obs.h));
                const distX = this.x - testX;
                const distY = this.y - testY;
                const distance = Math.sqrt((distX*distX) + (distY*distY));
                
                if (distance < this.radius) {
                    const overlap = this.radius - distance;
                    const len = distance || 1;
                    this.x += (distX / len) * overlap;
                    this.y += (distY / len) * overlap;
                }
            }
        }

        // Aiming (no camera offset since we removed it)
        const mouseWorldX = input.mouse.x;
        const mouseWorldY = input.mouse.y;
        this.angle = Math.atan2(mouseWorldY - this.y, mouseWorldX - this.x);

        // Weapon switching
        if (input.isJustPressed('1')) this.switchWeapon(0);
        if (input.isJustPressed('2')) this.switchWeapon(1);
        if (input.isJustPressed('3')) this.switchWeapon(2);

        // Reload
        if (input.isJustPressed('r')) {
            this.currentWeapon.reload();
        }

        this.currentWeapon.update(dt);
    }

    switchWeapon(index) {
        if (this.currentWeapon.isReloading) return;
        this.currentWeaponIndex = index;
        
        // Update UI Slots
        document.querySelectorAll('.inv-slot').forEach(el => el.classList.remove('active'));
        document.getElementById(`slot-${index + 1}`).classList.add('active');
        
        this.currentWeapon.updateUI();
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        audio.playHurt();
        this.updateUI();
    }

    updateUI() {
        const hpBar = document.getElementById('health-bar');
        const hpText = document.getElementById('health-text');
        
        hpBar.style.width = `${Math.max(0, (this.health / this.maxHealth) * 100)}%`;
        hpText.innerText = `${Math.ceil(this.health)}/${this.maxHealth}`;
        
        if (this.health < 30) hpBar.classList.add('low');
        else hpBar.classList.remove('low');
        
        document.getElementById('gold').innerText = this.gold;
        document.getElementById('grenade-count').innerText = this.grenadeCount;
        
        this.currentWeapon.updateUI();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // More detailed pixel-art style drawing using geometric shapes
        // Shoulders
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(-8, -12, 16, 24);
        
        // Hands
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(10, -10, 5, 0, Math.PI * 2); 
        ctx.arc(15, 10, 5, 0, Math.PI * 2); 
        ctx.fill();

        // Gun (depends on current weapon)
        ctx.fillStyle = '#333';
        if (this.currentWeaponIndex === 0) { // Pistol
            ctx.fillRect(12, 8, 12, 4);
        } else if (this.currentWeaponIndex === 1) { // Shotgun
            ctx.fillRect(8, 7, 20, 6);
            ctx.fillStyle = '#666';
            ctx.fillRect(10, 7, 8, 6); // pump handle
        } else { // AR
            ctx.fillRect(8, 8, 24, 4);
            ctx.fillStyle = '#444';
            ctx.fillRect(14, 6, 8, 8); // magazine
        }

        // Head
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Hair (Blue like in screenshot)
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(0, 0, 10, Math.PI * 0.7, Math.PI * 2.3);
        ctx.fill();

        ctx.restore();
    }
}
