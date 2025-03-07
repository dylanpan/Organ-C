class Player {
    constructor() {
        this.progress = 0;
        this.speed = 1;
        this.element = document.getElementById('player');
        this.centerPosition = 375; // Center position (800px/2 - 25px)
    }

    reset() {
        this.progress = 0;
        this.speed = 1;
        // Reset to starting position (left side)
        this.element.style.transition = 'none'; // Disable transition temporarily
        this.element.style.left = '-50px';
        document.getElementById('current-progress').textContent = '0';
        // Force a reflow to ensure the transition disable takes effect
        this.element.offsetHeight;
        // Re-enable transition
        this.element.style.transition = 'left 1s ease-out';
        this.updateVisual();
    }

    enterScene() {
        requestAnimationFrame(() => {
            this.element.style.left = `${this.centerPosition}px`;
        });
    }

    exitScene() {
        return new Promise(resolve => {
            this.element.addEventListener('transitionend', resolve, { once: true });
            this.element.style.left = '850px'; // Move outside right
        });
    }

    speedUp(amount) {
        this.speed += amount;
    }

    updateProgress(baseSpeed) {
        this.progress += baseSpeed * this.speed;
        this.updateVisual();
        document.getElementById('current-progress').textContent = 
            Math.min(Math.round(this.progress), 100);
    }

    updateVisual() {
        // 不再更新玩家位置，而是更新进度条
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${Math.min(this.progress, 100)}%`;
    }
}