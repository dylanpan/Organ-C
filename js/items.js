class ItemManager {
    constructor() {
        this.items = [];
    }

    initialize() {
        // 初始化道具系统
        this.container = document.getElementById('items-container');
        
        Object.keys(this.items).forEach(itemName => {
            const itemElement = document.createElement('button');
            itemElement.textContent = itemName;
            itemElement.addEventListener('click', () => this.useItem(itemName));
            container.appendChild(itemElement);
        });
    }

    useItem(itemName) {
        const item = this.items[itemName];
        if (!item) return;

        game.player.speedUp(item.speedBoost);
        
        const button = document.querySelector(`button:contains(${itemName})`);
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, item.duration);
    }
}