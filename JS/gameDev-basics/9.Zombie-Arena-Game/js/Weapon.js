import { audio } from './Audio.js';
import { input } from './Input.js';

export class Projectile {
    constructor(x, y, angle, speed, damage, color, lifeTime = 2000) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.damage = damage;
        this.color = color;
        this.lifeTime = lifeTime;
        this.age = 0;
        this.active = true;
        this.radius = 3;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.age += dt * 1000;
        if (this.age >= this.lifeTime) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Weapon {
    constructor(name, maxAmmo, reserveAmmo, fireRate, damage, reloadTime, spread, projSpeed, projColor) {
        this.name = name;
        this.maxAmmo = maxAmmo;
        this.ammo = maxAmmo;
        this.reserveAmmo = reserveAmmo;
        this.fireRate = fireRate; // ms between shots
        this.damage = damage;
        this.reloadTime = reloadTime;
        this.spread = spread; // radians
        this.projSpeed = projSpeed;
        this.projColor = projColor;

        this.lastFired = 0;
        this.isReloading = false;
        this.reloadTimer = 0;
    }

    update(dt) {
        if (this.isReloading) {
            this.reloadTimer += dt * 1000;
            if (this.reloadTimer >= this.reloadTime) {
                const needed = this.maxAmmo - this.ammo;
                let bulletsToLoad = needed;
                
                if (this.reserveAmmo !== Infinity) {
                    bulletsToLoad = Math.min(needed, this.reserveAmmo);
                    this.reserveAmmo -= bulletsToLoad;
                }
                
                this.ammo += bulletsToLoad;
                this.isReloading = false;
                this.updateUI();
            }
        }
    }

    fire(x, y, angle, projectilesArray) {
        if (this.isReloading) return false;
        if (this.ammo <= 0) {
            this.reload();
            return false;
        }

        const now = performance.now();
        if (now - this.lastFired >= this.fireRate) {
            this.lastFired = now;
            this.ammo--;
            this.updateUI();
            
            // Fire projectile(s)
            this.spawnProjectiles(x, y, angle, projectilesArray);
            audio.playPew();
            return true; // Fired successfully
        }
        return false;
    }

    spawnProjectiles(x, y, angle, projectilesArray) {
        const finalAngle = angle + (Math.random() - 0.5) * this.spread;
        projectilesArray.push(new Projectile(x, y, finalAngle, this.projSpeed, this.damage, this.projColor));
    }

    reload() {
        if (this.isReloading || this.ammo === this.maxAmmo || this.reserveAmmo === 0) return;
        this.isReloading = true;
        this.reloadTimer = 0;
        audio.playReload();
        
        document.getElementById('reload-indicator').classList.remove('hidden');
    }

    updateUI() {
        if (!this.isReloading) {
            document.getElementById('reload-indicator').classList.add('hidden');
        }
        document.getElementById('weapon-name').innerText = this.name;
        document.getElementById('ammo-current').innerText = this.ammo;
        
        const reserveStr = this.reserveAmmo === Infinity ? '∞' : this.reserveAmmo;
        document.getElementById('ammo-total').innerText = reserveStr;
    }
}

export class Pistol extends Weapon {
    constructor() {
        super('PISTOL', 12, Infinity, 300, 25, 1000, 0.05, 800, '#fbbf24');
    }
}

export class Shotgun extends Weapon {
    constructor() {
        super('SHOTGUN', 6, 24, 800, 20, 2000, 0.3, 600, '#ef4444');
        this.pellets = 5;
    }
    
    spawnProjectiles(x, y, angle, projectilesArray) {
        for (let i = 0; i < this.pellets; i++) {
            super.spawnProjectiles(x, y, angle, projectilesArray);
        }
    }
}

export class AssaultRifle extends Weapon {
    constructor() {
        super('ASSAULT RIFLE', 30, 90, 100, 15, 1500, 0.1, 900, '#60a5fa');
    }
}
