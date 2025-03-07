class Game {
    constructor() {
        this.currentLevel = 1;
        this.isPlaying = false;
        this.player = new Player();
        this.levelManager = new LevelManager();
        this.levelConfig = {
            1: { timeLimit: 30, targetProgress: 100, baseSpeed: 0.3 },  // 降低基础速度
            2: { timeLimit: 25, targetProgress: 100, baseSpeed: 0.25 },
            3: { timeLimit: 20, targetProgress: 100, baseSpeed: 0.2 }
        };
        this.items = new ItemManager();
        this.initialize();
    }

    initialize() {
        // 初始化点击加速
        document.getElementById('tap-area').addEventListener('click', () => {
            this.player.speedUp(0.2);
        });

        // 初始化道具系统
        this.items.initialize();
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
            // Restart the game
            this.startGame();
        }
    }
}