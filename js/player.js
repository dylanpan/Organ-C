class Player {
    constructor() {
        this.progress = 0;
        this.baseSpeed = 1;
        this.speed = this.baseSpeed; // Initialize speed
        this.speedBoosts = new Set();
        this.element = document.getElementById('player');
        this.centerPosition = 375; // 水平中心位置 (800px/2 - 25px)
        this.isSpeedingUp = false; // Add flag for tap speed boost
        this.tapBoostAmount = 0.5; // Increased boost amount for more noticeable effect
    }

    reset() {
        this.progress = 0;
        this.baseSpeed = 1;
        this.speed = this.baseSpeed;  // Reset speed to base value
        this.speedBoosts.clear();
        // Reset to starting position (left side)
        this.element.style.transition = 'none'; // Disable transition temporarily
        this.element.style.left = '-50px';
        // 不需要设置 top，因为由 CSS 控制
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
        this.speedBoosts.add(amount);
        this.updateSpeed();
    }

    resetSpeed(amount) {
        this.speedBoosts.delete(amount);
        this.updateSpeed();
    }

    updateSpeed() {
        // Calculate total speed including tap boost
        const boostSum = Array.from(this.speedBoosts).reduce((sum, boost) => sum + boost, 0);
        const tapBoost = this.isSpeedingUp ? this.tapBoostAmount : 0;
        this.speed = this.baseSpeed + boostSum + tapBoost;
    }

    updateProgress(baseSpeed) {
        // Use the current speed to update progress
        this.progress += baseSpeed * this.speed;
        document.getElementById('current-progress').textContent = 
            Math.min(Math.round(this.progress), 100);
        this.updateVisual();
    }

    updateVisual() {
        // 不再更新玩家位置，而是更新进度条
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${Math.min(this.progress, 100)}%`;
    }

    startSpeedUp() {
        this.isSpeedingUp = true;
        this.updateSpeed();
    }

    stopSpeedUp() {
        this.isSpeedingUp = false;
        this.updateSpeed();
    }
}