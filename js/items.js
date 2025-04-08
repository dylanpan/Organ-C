class ItemManager {
    constructor() {
        this.items = {
            'phone': { speedBoost: 0.5, duration: 3000 },
            'medicine': { speedBoost: 0.3, duration: 5000 },
            'bell': { speedBoost: 0.4, duration: 4000 }
        };
        this.activeBoosts = new Map(); // Track active speed boosts
        this.buffBar = document.getElementById('buff-bar');
    }

    initialize(availableItems = []) {  // Provide default empty array
        this.container = document.getElementById('items-container');
        this.container.innerHTML = ''; // Clear existing items
        
        // Only show items available for current level
        Object.keys(this.items)
            .filter(itemName => !availableItems.length || availableItems.includes(itemName))
            .forEach(itemName => {
                const itemElement = document.createElement('button');
                itemElement.textContent = itemName;
                itemElement.dataset.item = itemName;
                itemElement.addEventListener('click', () => this.useItem(itemName));
                this.container.appendChild(itemElement);
            });
    }

    addBuffIcon(itemName, duration) {
        const buffIcon = document.createElement('div');
        buffIcon.className = 'buff-icon';
        buffIcon.id = `buff-${itemName}`;
        
        const timerSpan = document.createElement('span');
        timerSpan.className = 'buff-timer';
        timerSpan.textContent = (duration/1000).toFixed(1) + 's';
        
        buffIcon.textContent = itemName + ' ';
        buffIcon.appendChild(timerSpan);
        this.buffBar.appendChild(buffIcon);

        // Update timer every 100ms
        let timeLeft = duration/1000;
        const timerInterval = setInterval(() => {
            timeLeft -= 0.1;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                buffIcon.remove();
                return;
            }
            timerSpan.textContent = timeLeft.toFixed(1) + 's';
        }, 100);

        // Cleanup when buff expires
        setTimeout(() => {
            buffIcon.remove();
            clearInterval(timerInterval);
        }, duration);
    }

    useItem(itemName) {
        const item = this.items[itemName];
        if (!item) return;

        // Apply speed boost
        const boostId = game.player.speedUp(item.speedBoost);
        
        // Add buff icon
        this.addBuffIcon(itemName, item.duration);
        
        // Disable button during cooldown
        const button = document.querySelector(`button[data-item="${itemName}"]`);
        if (button) button.disabled = true;

        // Store the timeout ID
        this.activeBoosts.set(itemName, setTimeout(() => {
            game.player.resetSpeed(item.speedBoost); // Remove this specific boost
            if (button) button.disabled = false;
        }, item.duration));
    }
}