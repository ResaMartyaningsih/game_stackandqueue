/**
 * achievements.js
 * Achievement System & Badge Unlocker for Daily Rush
 */

const ACHIEVEMENTS_LIST = [
    {
        id: 'FIRST_STEP',
        icon: '👟',
        titleKey: 'achFirstStepTitle',
        descKey: 'achFirstStepDesc'
    },
    {
        id: 'STACK_MASTER',
        icon: '📚',
        titleKey: 'achStackMasterTitle',
        descKey: 'achStackMasterDesc'
    },
    {
        id: 'QUEUE_MASTER',
        icon: '👥',
        titleKey: 'achQueueMasterTitle',
        descKey: 'achQueueMasterDesc'
    },
    {
        id: 'PUZZLE_SOLVER',
        icon: '🧩',
        titleKey: 'achPuzzleSolverTitle',
        descKey: 'achPuzzleSolverDesc'
    },
    {
        id: 'FAST_LEARNER',
        icon: '⚡',
        titleKey: 'achFastLearnerTitle',
        descKey: 'achFastLearnerDesc'
    },
    {
        id: 'PERFECT_SCORE',
        icon: '🎯',
        titleKey: 'achPerfectScoreTitle',
        descKey: 'achPerfectScoreDesc'
    },
    {
        id: 'GRAND_MASTER',
        icon: '👑',
        titleKey: 'achGrandMasterTitle',
        descKey: 'achGrandMasterDesc'
    }
];

const AchievementsManager = {
    init() {
        this.renderAchievementsGrid();
    },

    check(achId) {
        if (!window.StorageManager) return;
        const newlyUnlocked = StorageManager.unlockAchievement(achId);
        if (newlyUnlocked) {
            this.showUnlockToast(achId);
            if (window.SoundManager) {
                SoundManager.play('achievement');
            }
            this.renderAchievementsGrid();
        }
    },

    showUnlockToast(achId) {
        const ach = ACHIEVEMENTS_LIST.find(a => a.id === achId);
        if (!ach) return;

        const container = document.getElementById('achievement-toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'achievement-toast animate-slide-up';
        toast.innerHTML = `
            <div class="toast-icon">${ach.icon}</div>
            <div class="toast-body">
                <span class="toast-label">${t('achievementUnlockedToast')}</span>
                <h4 class="toast-title">${t(ach.titleKey)}</h4>
                <p class="toast-desc">${t(ach.descKey)}</p>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    renderAchievementsGrid() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        const unlocked = window.StorageManager ? StorageManager.getUnlockedAchievements() : [];

        grid.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="ach-icon-wrapper">
                        <span class="ach-icon">${ach.icon}</span>
                        ${isUnlocked ? '<span class="ach-badge-check">✓</span>' : '<span class="ach-badge-lock">🔒</span>'}
                    </div>
                    <div class="ach-info">
                        <h4 class="ach-title">${t(ach.titleKey)}</h4>
                        <p class="ach-desc">${t(ach.descKey)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
};

window.AchievementsManager = AchievementsManager;
window.ACHIEVEMENTS_LIST = ACHIEVEMENTS_LIST;
