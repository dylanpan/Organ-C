class AchievementSystem {
    constructor() {
        this.achievements = {
            clickMaster: {
                id: 'clickMaster',
                title: 'Click Master',
                description: 'Click 500 times in one level',
                icon: '🎯',
                condition: {
                    type: 'clicks',
                    target: 5
                },
                earned: false
            },
            // 可以轻松添加更多成就
        };
        
        this.stats = {
            clicks: 0
        };
        
        this.container = document.getElementById('achievement-container');
    }

    reset() {
        // 重置关卡相关的统计数据
        this.stats = {
            clicks: 0
        };
    }

    // 更新统计数据并检查成就
    updateStat(statName, value) {
        this.stats[statName] = value;
        this.checkAchievements();
    }

    incrementStat(statName) {
        this.stats[statName] = (this.stats[statName] || 0) + 1;
        this.checkAchievements();
    }

    checkAchievements() {
        for (const [id, achievement] of Object.entries(this.achievements)) {
            if (achievement.earned) continue;

            const condition = achievement.condition;
            if (this.stats[condition.type] >= condition.target) {
                this.unlockAchievement(id);
            }
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.earned) return;

        achievement.earned = true;
        this.showNotification(achievement);
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        this.container.appendChild(notification);

        // 动画结束后移除通知
        notification.addEventListener('animationend', (e) => {
            if (e.animationName === 'achievementSlideOut') {
                notification.remove();
            }
        });
    }
}