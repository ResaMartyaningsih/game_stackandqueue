/**
 * storage.js
 * LocalStorage Manager for Daily Rush
 * Persists player profile, level progression, scores, answer logs, and achievements.
 */

const STORAGE_KEY = 'daily_rush_adventure_v1';

const defaultData = {
    playerName: '',
    playerClass: 'Fase E (Kelas X)',
    playerAbsen: '',
    language: 'id',
    soundEnabled: true,
    currentLevel: 1,
    unlockedLevels: [1],
    levelScores: {},
    pageScores: {}, // Format: { [pageKey]: { score, savedAt, completed, details } }
    groupProject: null, // Format: { groupName, className, members, selectedCase, answers, score, savedAt }
    totalPlayTimeSeconds: 0,
    answersLog: [],
    tempAnswers: {}, // Format: { [levelId]: { [qIndex]: { selectedIndex, isSubmitted, isCorrect, chosenText, savedAt, questionId } } }
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
                if (!this.data.tempAnswers) {
                    this.data.tempAnswers = {};
                }
                if (!this.data.pageScores) {
                    this.data.pageScores = {};
                }
                if (!this.data.groupProject) {
                    this.data.groupProject = null;
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

    getPlayerClass() {
        return this.data.playerClass || 'Fase E (Kelas X)';
    },

    setPlayerClass(className) {
        this.data.playerClass = (className || '').trim();
        this.save();
    },

    getPlayerAbsen() {
        return this.data.playerAbsen || '';
    },

    setPlayerAbsen(absen) {
        this.data.playerAbsen = (absen !== undefined && absen !== null) ? String(absen).trim() : '';
        this.save();
    },

    setProfile(name, className, absen) {
        this.data.playerName = (name || '').trim();
        this.data.playerClass = (className || 'Fase E (Kelas X)').trim();
        this.data.playerAbsen = (absen !== undefined && absen !== null) ? String(absen).trim() : '';
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
        // logEntry: { levelId, questionId, question, userAnswer, correctAnswer, isCorrect, explanation, concept }
        if (!this.data.answersLog) {
            this.data.answersLog = [];
        }
        const existingIdx = this.data.answersLog.findIndex(item => 
            (logEntry.questionId && item.questionId === logEntry.questionId) ||
            (item.levelId === logEntry.levelId && item.question === logEntry.question)
        );

        const entryWithTimestamp = {
            ...logEntry,
            timestamp: new Date().toISOString()
        };

        if (existingIdx !== -1) {
            this.data.answersLog[existingIdx] = entryWithTimestamp;
        } else {
            this.data.answersLog.push(entryWithTimestamp);
        }
        this.save();
    },

    removeAnswerLog(questionId, levelId, questionText) {
        if (!this.data.answersLog) return;
        this.data.answersLog = this.data.answersLog.filter(item => {
            if (questionId && item.questionId === questionId) return false;
            if (levelId !== undefined && questionText && item.levelId === levelId && item.question === questionText) return false;
            return true;
        });
        this.save();
    },

    getAnswersLog() {
        return this.data.answersLog || [];
    },

    // ----------------------------------------------------
    // TEMPORARY ANSWER / DRAFT MANAGEMENT
    // ----------------------------------------------------
    saveTempAnswer(levelId, qIndex, answerData) {
        const lvl = Number(levelId);
        const idx = Number(qIndex);
        if (!this.data.tempAnswers) {
            this.data.tempAnswers = {};
        }
        if (!this.data.tempAnswers[lvl]) {
            this.data.tempAnswers[lvl] = {};
        }
        this.data.tempAnswers[lvl][idx] = {
            ...answerData,
            savedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        this.save();
        return this.data.tempAnswers[lvl][idx];
    },

    getTempAnswer(levelId, qIndex) {
        const lvl = Number(levelId);
        const idx = Number(qIndex);
        if (!this.data.tempAnswers || !this.data.tempAnswers[lvl]) {
            return null;
        }
        return this.data.tempAnswers[lvl][idx] || null;
    },

    getAllTempAnswers(levelId) {
        const lvl = Number(levelId);
        if (!this.data.tempAnswers || !this.data.tempAnswers[lvl]) {
            return {};
        }
        return { ...this.data.tempAnswers[lvl] };
    },

    resetQuestionAnswer(levelId, qIndex, questionId, questionText) {
        const lvl = Number(levelId);
        const idx = Number(qIndex);
        
        // Delete only this specific question draft
        if (this.data.tempAnswers && this.data.tempAnswers[lvl]) {
            delete this.data.tempAnswers[lvl][idx];
        }

        // Also remove this single question's answer log, leaving previous questions intact!
        this.removeAnswerLog(questionId, lvl, questionText);
        this.save();
    },

    clearTempAnswersForLevel(levelId) {
        const lvl = Number(levelId);
        if (this.data.tempAnswers && this.data.tempAnswers[lvl]) {
            delete this.data.tempAnswers[lvl];
            this.save();
        }
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

    // ----------------------------------------------------
    // PAGE SCORES & GROUP PROJECT MANAGEMENT
    // ----------------------------------------------------
    savePageScore(pageKey, score, details = {}) {
        if (!this.data.pageScores) {
            this.data.pageScores = {};
        }
        const numScore = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
        const timestamp = new Date().toLocaleString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        this.data.pageScores[pageKey] = {
            score: numScore,
            completed: true,
            savedAt: timestamp,
            details: details || {}
        };

        // Otomatis sinkronisasi ke Level Map & Progression jika ada relasi
        const levelMapping = {
            'learn-stack': 1,
            'learn-queue': 1,
            'stack-sim': 2,
            'queue-sim': 3,
            'games-stack': 4,
            'games-queue': 5,
            'puzzles': 6,
            'challenge-7': 7,
            'challenge-8': 8
        };

        const targetLevel = levelMapping[pageKey];
        if (targetLevel) {
            // Update level score (keep highest)
            this.setLevelScore(targetLevel, numScore);

            // Buka level berikutnya jika nilai cukup (>= 60)
            if (numScore >= 60 && targetLevel < 8) {
                this.unlockLevel(targetLevel + 1);
            }
        }

        this.save();
        return this.data.pageScores[pageKey];
    },

    getPageScore(pageKey) {
        if (!this.data.pageScores) return null;
        return this.data.pageScores[pageKey] || null;
    },

    getAllPageScores() {
        return { ...(this.data.pageScores || {}) };
    },

    saveGroupProject(projectData) {
        const timestamp = new Date().toLocaleString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        this.data.groupProject = {
            ...projectData,
            savedAt: timestamp
        };
        // Beri achievement jika ada
        try {
            if (this.unlockAchievement) {
                this.unlockAchievement('TEAM_COLLAB');
            }
            if (window.AchievementsManager && typeof AchievementsManager.check === 'function') {
                AchievementsManager.check('TEAM_COLLAB');
            }
        } catch (e) {
            console.warn('Achievement trigger skipped:', e);
        }
        this.save();
        return this.data.groupProject;
    },

    getGroupProject() {
        return this.data.groupProject || null;
    },

    resetAll() {
        this.data = {
            ...defaultData,
            playerName: this.data.playerName,
            playerClass: this.data.playerClass,
            playerAbsen: this.data.playerAbsen,
            language: this.data.language,
            soundEnabled: this.data.soundEnabled
        };
        this.save();
    }
};

window.StorageManager = StorageManager;
