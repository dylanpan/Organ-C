class Game {
    constructor() {
        this.currentLevel = 1;
        this.isPlaying = false;
        this.player = new Player();
        this.levelManager = new LevelManager();
        this.levelConfig = {
            1: { timeLimit: 30, targetProgress: 100, baseSpeed: 0.3 },
            2: { timeLimit: 25, targetProgress: 100, baseSpeed: 0.25 },
            3: { timeLimit: 20, targetProgress: 100, baseSpeed: 0.2 }
        };
        this.items = new ItemManager();
        this.tapFeedbackCounter = 0;
        this.initialize();
    }

    showSpeedFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'speed-feedback';
        
        // Get player position and dimensions
        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const gameContainer = document.getElementById('game-container').getBoundingClientRect();
        
        // Random position around the player's center
        const offset = 50; // Maximum distance from player
        const randomX = Math.random() * offset * 2 - offset;
        const randomY = Math.random() * offset * 2 - offset;
        
        // Calculate center position of the player relative to game container
        const centerX = playerRect.left - gameContainer.left + playerRect.width / 2;
        const centerY = playerRect.top - gameContainer.top + playerRect.height / 2;
        
        // Position feedback relative to player center
        feedback.style.left = `${centerX + randomX - 20}px`; // -20px to center the feedback text
        feedback.style.top = `${centerY + randomY - 10}px`; // -10px to center vertically
        
        // Calculate total boost including active items
        const itemBoosts = Array.from(this.player.speedBoosts).reduce((sum, boost) => sum + boost, 0);
        const totalBoost = this.player.tapBoostAmount + itemBoosts;
        
        feedback.textContent = `+${totalBoost.toFixed(1)}`;
        feedback.id = `feedback-${this.tapFeedbackCounter++}`;
        
        document.getElementById('game-container').appendChild(feedback);

        // Remove the element after animation
        feedback.addEventListener('animationend', () => {
            feedback.remove();
        });
    }

    initialize() {
        // Initialize start screen
        document.getElementById('start-button').addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            this.startGame();
        });

        // Initialize tap area with mousedown and mouseup events
        const tapArea = document.getElementById('tap-area');
        
        // Mouse events
        tapArea.addEventListener('mousedown', () => {
            if (this.isPlaying) {
                this.player.startSpeedUp();
                this.showSpeedFeedback();
            }
        });

        tapArea.addEventListener('mouseup', () => {
            if (this.isPlaying) {
                this.player.stopSpeedUp();
            }
        });

        // Touch events for mobile
        tapArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.player.startSpeedUp();
                this.showSpeedFeedback();
            }
        });

        tapArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.player.stopSpeedUp();
            }
        });

        // Handle mouse leaving the tap area
        tapArea.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.player.stopSpeedUp();
            }
        });

        // Initialize items system with level 1 items
        const level1Items = this.levelManager.levels[1].items;
        this.items.initialize(level1Items);
    }

    showStartScreen() {
        document.getElementById('start-screen').classList.remove('hidden');
    }

    startGame() {
        const currentLevel = this.levelManager.startCurrentLevel();
        if (currentLevel) {
            this.startLevel(currentLevel);
        }
    }
    
    startLevel(levelNum) {
        this.currentLevel = levelNum;
        this.isPlaying = true;
        this.player.reset();
        
        const levelConfig = this.levelManager.levels[levelNum];
        // Initialize items for this level
        this.items.initialize(levelConfig.items);
        
        // Add entrance animation
        setTimeout(() => {
            this.player.enterScene();
        }, 100);
        
        const config = this.levelConfig[levelNum];
        this.remainingTime = config.timeLimit;
        this.targetProgress = config.targetProgress;
        
        this.gameLoop = setInterval(() => this.update(), 100);
        this.timer = setInterval(() => this.updateTimer(), 1000);
    }

    update() {
        if (!this.isPlaying) return;

        // 更新进度
        this.player.updateProgress(this.levelConfig[this.currentLevel].baseSpeed);
        
        // 检查是否完成
        if (this.player.progress >= this.targetProgress) {
            this.levelComplete();
        }
    }

    updateTimer() {
        this.remainingTime--;
        document.getElementById('time-left').textContent = this.remainingTime;
        
        if (this.remainingTime <= 0) {
            this.gameOver();
        }
    }

    async levelComplete() {
        this.isPlaying = false;
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        
        // Wait for exit animation to complete
        await this.player.exitScene();
        
        if (this.currentLevel < Object.keys(this.levelConfig).length) {
            this.startLevel(this.currentLevel + 1);
        } else {
            alert('Congratulations! You completed all levels!');
            this.showStartScreen();
        }
    }

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.gameLoop);
        clearInterval(this.timer);
        if (confirm('Game Over! Try again?')) {
            // Reset game state
            this.currentLevel = 1;
            this.player.reset();
            // Show start screen
            this.showStartScreen();
        }
    }
}