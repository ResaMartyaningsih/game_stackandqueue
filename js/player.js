/**
 * player.js
 * Player Profile & Adventure Session Management
 */

const Player = {
    name: '',
    className: 'Kelas X.1',
    absen: '',
    currentSessionStartTime: Date.now(),

    init() {
        if (window.StorageManager) {
            this.name = StorageManager.getPlayerName();
            this.className = StorageManager.getPlayerClass() || 'Kelas X.1';
            this.absen = StorageManager.getPlayerAbsen();
        }
        this.updatePlayerUI();
    },

    getName() {
        return this.name || '';
    },

    setName(newName) {
        this.name = (newName || '').trim();
        if (window.StorageManager) {
            StorageManager.setPlayerName(this.name);
        }
        this.updatePlayerUI();
    },

    getClass() {
        return this.className || 'Kelas X.1';
    },

    setClass(newClass) {
        this.className = (newClass || 'Kelas X.1').trim();
        if (window.StorageManager) {
            StorageManager.setPlayerClass(this.className);
        }
        this.updatePlayerUI();
    },

    getAbsen() {
        return this.absen || '';
    },

    setAbsen(newAbsen) {
        this.absen = (newAbsen !== undefined && newAbsen !== null) ? String(newAbsen).trim() : '';
        if (window.StorageManager) {
            StorageManager.setPlayerAbsen(this.absen);
        }
        this.updatePlayerUI();
    },

    setProfile(newName, newClass, newAbsen) {
        this.name = (newName || '').trim();
        this.className = (newClass || 'Kelas X.1').trim();
        this.absen = (newAbsen !== undefined && newAbsen !== null) ? String(newAbsen).trim() : '';
        if (window.StorageManager) {
            StorageManager.setProfile(this.name, this.className, this.absen);
        }
        this.updatePlayerUI();
    },

    hasValidProfile() {
        const cleanName = (this.name || '').trim();
        const cleanClass = (this.className || '').trim();
        const cleanAbsen = (this.absen || '').trim();
        return cleanName.length >= 2 && cleanName.toLowerCase() !== 'petualang' && cleanClass.length > 0 && cleanAbsen.length > 0;
    },

    hasName() {
        return this.hasValidProfile();
    },

    updatePlayerUI() {
        const displayName = this.getName() || 'Siswa';
        const displayClass = this.getClass();
        const displayAbsen = this.getAbsen();

        document.querySelectorAll('.player-display-name').forEach(el => {
            el.textContent = displayName;
        });

        document.querySelectorAll('.player-display-class').forEach(el => {
            el.textContent = displayClass;
        });

        document.querySelectorAll('.player-display-absen').forEach(el => {
            el.textContent = displayAbsen ? `No. ${displayAbsen}` : '-';
        });

        document.querySelectorAll('.player-display-full').forEach(el => {
            if (this.hasValidProfile()) {
                el.textContent = `${displayName} (${displayClass} - Absen ${displayAbsen})`;
            } else {
                el.textContent = displayName;
            }
        });

        // Update dynamic greetings with interpolation
        document.querySelectorAll('[data-i18n-greeting]').forEach(el => {
            el.textContent = t('greeting', { name: displayName });
        });

        // Update overall progress bar
        this.updateProgressSummary();

        // Refresh profile page if active
        if (window.UI && typeof UI.renderProfilePage === 'function' && UI.currentScreen === 'profile') {
            UI.renderProfilePage();
        }
    },

    updateProgressSummary() {
        if (!window.StorageManager) return;
        const totalLevels = 4;
        const tasks = StorageManager.data.individualTasks || {};
        let completedCount = 0;
        for (let i = 1; i <= 4; i++) {
            if (tasks[i] && tasks[i].isSubmitted) {
                completedCount++;
            }
        }
        const progressPct = Math.round((completedCount / totalLevels) * 100);

        document.querySelectorAll('.overall-progress-bar-fill').forEach(el => {
            el.style.width = `${progressPct}%`;
        });

        document.querySelectorAll('.overall-progress-text').forEach(el => {
            el.textContent = `${completedCount} / ${totalLevels} Level Selesai (${progressPct}%)`;
        });
    }
};

window.Player = Player;
