/**
 * storage.js
 * LocalStorage Manager for Daily Rush
 * Persists player profile, level progression, scores, answer logs, and achievements.
 */

const STORAGE_KEY = 'daily_rush_adventure_v1';

const defaultData = {
    playerName: '',
    language: 'id',
    soundEnabled: true,
    currentLevel: 1,
    unlockedLevels: [1],
    levelScores: {},
    totalPlayTimeSeconds: 0,
    answersLog: [],
    unlockedAchievements: [],
    lastPlayedDate: null
};

const StorageManager = {
    data: { ...defaultData },

    init() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.data = { ...defaultData, ...parsed };
                // ensure unlockedLevels has at least [1]
                if (!this.data.unlockedLevels || !this.data.unlockedLevels.includes(1)) {
                    this.data.unlockedLevels = [1];
                }
            } else {
                this.save();
            }
        } catch (e) {
            console.warn('LocalStorage error or blocked; using in-memory state:', e);
            this.data = { ...defaultData };
        }
    },

    save() {
        try {
            this.data.lastPlayedDate = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
        }
    },

    getPlayerName() {
        return this.data.playerName || '';
    },

    setPlayerName(name) {
        this.data.playerName = (name || '').trim();
        this.save();
    },

    getSetting(key) {
        return this.data[key];
    },

    setSetting(key, val) {
        this.data[key] = val;
        this.save();
    },

    isLevelUnlocked(levelNum) {
        return this.data.unlockedLevels.includes(Number(levelNum));
    },

    unlockLevel(levelNum) {
        const num = Number(levelNum);
        if (!this.data.unlockedLevels.includes(num)) {
            this.data.unlockedLevels.push(num);
            this.data.unlockedLevels.sort((a, b) => a - b);
            this.save();
        }
    },

    getLevelScore(levelNum) {
        return this.data.levelScores[levelNum] || null;
    },

    setLevelScore(levelNum, score) {
        const num = Number(levelNum);
        const existing = this.data.levelScores[num] || 0;
        // Keep highest score or update
        if (score >= existing) {
            this.data.levelScores[num] = Math.min(100, Math.max(0, Math.round(score)));
        }
        this.save();
    },

    getAllLevelScores() {
        return { ...this.data.levelScores };
    },

    addAnswerLog(logEntry) {
        // logEntry: { levelId, question, userAnswer, correctAnswer, isCorrect, explanation, concept }
        if (!this.data.answersLog) {
            this.data.answersLog = [];
        }
        this.data.answersLog.push({
            ...logEntry,
            timestamp: new Date().toISOString()
        });
        this.save();
    },

    getAnswersLog() {
        return this.data.answersLog || [];
    },

    unlockAchievement(achId) {
        if (!this.data.unlockedAchievements) {
            this.data.unlockedAchievements = [];
        }
        if (!this.data.unlockedAchievements.includes(achId)) {
            this.data.unlockedAchievements.push(achId);
            this.save();
            return true;
        }
        return false;
    },

    getUnlockedAchievements() {
        return this.data.unlockedAchievements || [];
    },

    addPlayTime(seconds) {
        this.data.totalPlayTimeSeconds = (this.data.totalPlayTimeSeconds || 0) + seconds;
        this.save();
    },

    getTotalPlayTime() {
        return this.data.totalPlayTimeSeconds || 0;
    },

    resetAll() {
        this.data = {
            ...defaultData,
            playerName: this.data.playerName, // preserve player name for convenience
            language: this.data.language,
            soundEnabled: this.data.soundEnabled
        };
        this.save();
    }
};

window.StorageManager = StorageManager;
