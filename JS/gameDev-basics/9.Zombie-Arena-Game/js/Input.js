export class InputManager {
    constructor() {
        this.keys = {
            'w': false,
            'a': false,
            's': false,
            'd': false,
            'r': false,
            'e': false,
            'p': false,
            'g': false,
            '1': false,
            '2': false,
            '3': false
        };
        
        this.mouse = {
            x: 0,
            y: 0,
            down: false
        };

        this.justPressed = {};
        
        window.addEventListener('keydown', (e) => {
            const k = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(k)) {
                if (!this.keys[k]) this.justPressed[k] = true;
                this.keys[k] = true;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            if (this.keys.hasOwnProperty(k)) {
                this.keys[k] = false;
            }
        });

        window.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
                this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
            } else {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });

        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.down = true;
        });

        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.down = false;
        });
    }

    update() {
        // clear just pressed state at the end of the frame
        this.justPressed = {};
    }

    isDown(key) {
        return this.keys[key.toLowerCase()];
    }

    isJustPressed(key) {
        return !!this.justPressed[key.toLowerCase()];
    }
}

export const input = new InputManager();
