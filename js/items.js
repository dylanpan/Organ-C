class ItemManager {
    constructor() {
        this.items = {
            'phone': { speedBoost: 0.5, duration: 3000 },
            'medicine': { speedBoost: 0.3, duration: 5000 },
            'bell': { speedBoost: 0.4, duration: 4000 }
        };
        this.activeBoosts = new Map();
        this.buffBar = document.getElementById('buff-bar');
        this.itemCounts = new Map(); // Track remaining uses for each item
    }

    initialize(availableItems = []) {
        this.container = document.getElementById('items-container');
        this.container.innerHTML = '';
        this.itemCounts.clear();
        
        availableItems.forEach(item => {
            const itemElement = document.createElement('button');
            itemElement.className = 'item-button';
            itemElement.dataset.item = item.name;
            itemElement.innerHTML = `${item.name} (${item.count})`;
            itemElement.addEventListener('click', () => this.useItem(item.name));
            this.container.appendChild(itemElement);
            
            // Store initial count
            this.itemCounts.set(item.name, item.count);
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
        const remainingCount = this.itemCounts.get(itemName);
        
        if (!item || remainingCount <= 0) return;

        // Decrease remaining count
        this.itemCounts.set(itemName, remainingCount - 1);
        
        // Update button text and appearance
        const button = document.querySelector(`button[data-item="${itemName}"]`);
        if (button) {
            const newCount = remainingCount - 1;
            if (newCount <= 0) {
                button.disabled = true;
                button.dataset.empty = "true";
                button.innerHTML = `${itemName} (Empty)`;
            } else {
                button.disabled = true; // Disable during cooldown
                button.dataset.empty = "false";
                button.innerHTML = `${itemName} (${newCount})`;
                // Re-enable after cooldown
                setTimeout(() => {
                    if (this.itemCounts.get(itemName) > 0) {
                        button.disabled = false;
                        delete button.dataset.empty;
                    }
                }, item.duration);
            }
        }

        // Apply speed boost
        game.player.speedUp(item.speedBoost);
        
        // Add buff icon
        this.addBuffIcon(itemName, item.duration);
        
        // Reset speed after duration
        setTimeout(() => {
            game.player.resetSpeed(item.speedBoost);
        }, item.duration);
    }
}