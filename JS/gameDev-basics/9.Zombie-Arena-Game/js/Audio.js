// Synthesized audio using Web Audio API for a 8-bit retro feel
export class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = false; // Enabled on first user interaction
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.5; // Default volume
        
        // Load Audio Assets
        this.zombieSounds = [new Audio('sounds/Zombie1.mp3'), new Audio('sounds/Zombie2.mp3')];
        this.zombieBiteSound = new Audio('sounds/Zombie-bite.mp3');
        
        this.lastGroanTime = 0;
        
        // Setup volume slider on load (module is deferred so DOM is ready)
        const volSlider = document.getElementById('volume-slider');
        if (volSlider) {
            this.setVolume(volSlider.value);
            volSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
            });
        }
    }

    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
        // Also update HTML5 Audio volume (Zombie1 is naturally louder, so lower it slightly)
        this.zombieSounds[0].volume = Math.min(1, value * 0.4);
        this.zombieSounds[1].volume = value;
        this.zombieBiteSound.volume = value;
    }

    enable() {
        if (!this.enabled) {
            this.enabled = true;
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }
    }

    playPew() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playBoom() {
        if (!this.enabled) return;
        // Simple noise burst for explosion
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        const gain = this.ctx.createGain();
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        noise.start(this.ctx.currentTime);
    }

    playClick() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playReload() {
        if (!this.enabled) return;
        setTimeout(() => this.playClick(), 0);
        setTimeout(() => this.playClick(), 200);
        setTimeout(() => this.playClick(), 600);
    }

    playZombieGroan() {
        if (!this.enabled) return;
        const now = performance.now();
        // Prevent groans from overlapping too heavily (max 1 groan per 1.5 seconds)
        if (now - this.lastGroanTime < 1500) return;
        this.lastGroanTime = now;
        
        // Zombie 2 more likely if Zombie 1 dominates
        const index = Math.random() < 0.4 ? 0 : 1;
        const sound = this.zombieSounds[index].cloneNode(); // clone so multiple can play
        sound.volume = this.zombieSounds[index].volume;
        sound.play().catch(e => console.warn('Audio play failed', e));
    }

    playHurt() {
        if (!this.enabled) return;
        this.zombieBiteSound.currentTime = 0;
        this.zombieBiteSound.play().catch(e => console.warn('Audio play failed', e));
    }

    playWaveStart() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(1320, this.ctx.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 1.0);
        
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 1.0);
    }
}

export const audio = new AudioSystem();
