/**
 * player.js
 * Player Profile & Adventure Session Management
 */

const Player = {
    name: '',
    currentSessionStartTime: Date.now(),

    init() {
        if (window.StorageManager) {
            this.name = StorageManager.getPlayerName();
        }
        this.updatePlayerUI();
    },

    getName() {
        return this.name || 'Petualang';
    },

    setName(newName) {
        this.name = (newName || '').trim();
        if (window.StorageManager) {
            StorageManager.setPlayerName(this.name);
        }
        this.updatePlayerUI();
    },

    hasName() {
        return !!(this.name && this.name.length > 0);
    },

    updatePlayerUI() {
        const displayName = this.getName();
        document.querySelectorAll('.player-display-name').forEach(el => {
            el.textContent = displayName;
        });

        // Update dynamic greetings with interpolation
        document.querySelectorAll('[data-i18n-greeting]').forEach(el => {
            el.textContent = t('greeting', { name: displayName });
        });

        // Update overall progress bar
        this.updateProgressSummary();
    },

    updateProgressSummary() {
        if (!window.StorageManager) return;
        const unlocked = StorageManager.data.unlockedLevels ? StorageManager.data.unlockedLevels.length : 1;
        const totalLevels = 8;
        const scores = StorageManager.getAllLevelScores();
        const completedLevels = Object.keys(scores).length;
        const progressPct = Math.round((completedLevels / totalLevels) * 100);

        document.querySelectorAll('.overall-progress-bar-fill').forEach(el => {
            el.style.width = `${progressPct}%`;
        });

        document.querySelectorAll('.overall-progress-text').forEach(el => {
            el.textContent = `${completedLevels} / ${totalLevels} (${progressPct}%)`;
        });
    }
};

window.Player = Player;
