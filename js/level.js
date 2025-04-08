class Level {
    constructor(config) {
        this.levelId = config.levelId;
        this.timeLimit = config.timeLimit;
        this.targetProgress = config.targetProgress;
        this.baseSpeed = config.baseSpeed;
        this.availableItems = config.availableItems || [];
        this.backgroundImage = config.backgroundImage;
        this.npcs = config.npcs || [];
        this.events = config.events || [];
        this.isCompleted = false;
    }

    initialize() {
        // 设置关卡场景
        this.setupScene();
        // 初始化可用道具
        this.setupItems();
        // 设置NPC
        this.setupNPCs();
    }

    setupScene() {
        const scene = document.getElementById('game-scene');
        scene.style.backgroundImage = `url(${this.backgroundImage})`;
    }

    setupItems() {
        const itemsContainer = document.getElementById('items-container');
        itemsContainer.innerHTML = '';
        
        this.availableItems.forEach(item => {
            const itemButton = document.createElement('button');
            itemButton.className = 'item-btn';
            itemButton.dataset.itemType = item.type;
            itemButton.innerHTML = `
                <img src="${item.icon}" alt="${item.name}">
                <span>${item.name}</span>
            `;
            itemsContainer.appendChild(itemButton);
        });
    }

    setupNPCs() {
        const scene = document.getElementById('game-scene');
        this.npcs.forEach(npc => {
            const npcElement = document.createElement('div');
            npcElement.className = 'npc';
            npcElement.style.left = `${npc.position.x}px`;
            npcElement.style.bottom = `${npc.position.y}px`;
            scene.appendChild(npcElement);
        });
    }
}

class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.levels = {
            1: {
                backgroundImage: 'assets/images/level1-bg.jpg',
                items: [
                    { name: 'phone', count: 2 },
                    { name: 'medicine', count: 1 }
                ]
            },
            2: {
                backgroundImage: 'assets/images/level2-bg.jpg',
                items: [
                    { name: 'phone', count: 3 },
                    { name: 'medicine', count: 2 },
                    { name: 'diaper', count: 1 }
                ]
            },
            3: {
                backgroundImage: 'assets/images/level3-bg.jpg',
                items: [
                    { name: 'phone', count: 3 },
                    { name: 'medicine', count: 2 },
                    { name: 'diaper', count: 2 },
                    { name: 'bell', count: 1 }
                ]
            }
        };
    }

    startCurrentLevel() {
        if (this.levels[this.currentLevel]) {
            return this.currentLevel;
        }
        return null;
    }
}