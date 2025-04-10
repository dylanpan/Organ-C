const ACHIEVEMENT_CONFIGS = {
    // 点击相关成就
    clickBeginner: {
        id: 'clickBeginner',
        title: 'Click Beginner',
        description: 'Click 5 times in one level',
        icon: '🎯',
        condition: {
            type: 'clicks',
            target: 5
        }
    },
    clickAdvanced: {
        id: 'clickAdvanced',
        title: 'Click Advanced',
        description: 'Click 50 times in one level',
        icon: '🎯🎯',
        condition: {
            type: 'clicks',
            target: 50
        }
    },
    clickMaster: {
        id: 'clickMaster',
        title: 'Click Master',
        description: 'Click 500 times in one level',
        icon: '🎯🎯🎯',
        condition: {
            type: 'clicks',
            target: 500
        }
    }
    
    // 可以在这里添加更多成就配置
    // 例如：
    // speedMaster: {
    //     id: 'speedMaster',
    //     title: 'Speed Master',
    //     description: 'Reach maximum speed',
    //     icon: '⚡',
    //     condition: {
    //         type: 'maxSpeed',
    //         target: 5
    //     }
    // }
};