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
    individualAttempts: {
        currentAttempt: 1,
        maxAttempts: 3,
        history: [], // Array of { attempt: number, score: number, correctCount: number, completedAt: string }
        bestScore: 0,
        lockedTasks: {} // lvl -> { isLocked: true, chosenIndex: number, isCorrect: boolean, lockedAt: string }
    },
    groupAttempts: {
        currentAttempt: 1,
        maxAttempts: 3,
        history: [], // Array of { attempt: number, score: number, completedAt: string, caseKey: string }
        bestScore: 0,
        isLocked: false
    },
    miniLabOps: {
        stackPush: false,
        stackPop: false,
        queueEnqueue: false,
        queueDequeue: false
    },
    materialQuizzes: {
        stackDone: false,
        stackScore: 0,
        queueDone: false,
        queueScore: 0
    },
    miniLabBonus: 0,
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
                if (!this.data.individualAttempts) {
                    this.data.individualAttempts = {
                        currentAttempt: 1,
                        maxAttempts: 3,
                        history: [],
                        bestScore: 0,
                        lockedTasks: {}
                    };
                    // Migrate legacy individual tasks if present
                    if (this.data.individualTasks) {
                        let cCount = 0;
                        let sCount = 0;
                        for (let lvl = 1; lvl <= 4; lvl++) {
                            const t = this.data.individualTasks[lvl];
                            if (t && t.isSubmitted) {
                                sCount++;
                                if (t.isCorrect) cCount++;
                                this.data.individualAttempts.lockedTasks[lvl] = {
                                    isLocked: true,
                                    chosenIndex: t.chosenIndex,
                                    isCorrect: t.isCorrect,
                                    lockedAt: t.savedAt || new Date().toISOString()
                                };
                            }
                        }
                        if (sCount > 0) {
                            const initialScore = cCount * 25;
                            this.data.individualAttempts.bestScore = initialScore;
                            this.data.individualAttempts.history.push({
                                attempt: 1,
                                score: initialScore,
                                correctCount: cCount,
                                completedAt: new Date().toISOString()
                            });
                        }
                    }
                }
                if (!this.data.groupAttempts) {
                    this.data.groupAttempts = {
                        currentAttempt: 1,
                        maxAttempts: 3,
                        history: [],
                        bestScore: 0,
                        isLocked: false
                    };
                    if (this.data.groupProject && typeof this.data.groupProject.score === 'number' && this.data.groupProject.score > 0) {
                        this.data.groupAttempts.bestScore = this.data.groupProject.score;
                        this.data.groupAttempts.history.push({
                            attempt: 1,
                            score: this.data.groupProject.score,
                            completedAt: this.data.groupProject.savedAt || new Date().toISOString(),
                            caseKey: this.data.groupProject.selectedCase || 'case1'
                        });
                        this.data.groupAttempts.isLocked = true;
                    }
                }
                if (!this.data.miniLabOps) {
                    this.data.miniLabOps = {
                        stackPush: false,
                        stackPop: false,
                        queueEnqueue: false,
                        queueDequeue: false
                    };
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

            // Trigger Real-Time Cloud Sync ke Dashboard Guru
            if (this._syncTimer) clearTimeout(this._syncTimer);
            this._syncTimer = setTimeout(() => {
                if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
                    window.CloudSync.syncStudentState();
                }
            }, 300);
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


    // ----------------------------------------------------
    // ATTEMPT MANAGEMENT & ANSWER LOCK SYSTEM (NALARQUEST)
    // ----------------------------------------------------
    getIndividualAttempts() {
        if (!this.data.individualAttempts) {
            this.data.individualAttempts = {
                currentAttempt: 1,
                maxAttempts: 3,
                history: [],
                bestScore: 0,
                lockedTasks: {}
            };
        }
        return this.data.individualAttempts;
    },

    saveIndividualTaskLock(lvl, chosenIndex, isCorrect) {
        const att = this.getIndividualAttempts();
        if (!att.lockedTasks) att.lockedTasks = {};
        
        att.lockedTasks[lvl] = {
            isLocked: true,
            chosenIndex: chosenIndex,
            isCorrect: isCorrect,
            lockedAt: new Date().toISOString()
        };

        if (!this.data.individualTasks) this.data.individualTasks = {};
        this.data.individualTasks[lvl] = {
            level: lvl,
            chosenIndex: chosenIndex,
            isCorrect: isCorrect,
            isSubmitted: true,
            savedAt: new Date().toISOString()
        };

        // Check if all 4 levels are completed
        let lockedCount = 0;
        let correctCount = 0;
        for (let i = 1; i <= 4; i++) {
            if (att.lockedTasks[i] && att.lockedTasks[i].isLocked) {
                lockedCount++;
                if (att.lockedTasks[i].isCorrect) correctCount++;
            }
        }

        const currentScore = correctCount * 25;

        // In-progress tracking: pastikan skor langsung tercatat dan terbaca di dashboard guru
        if (typeof att.bestScore !== 'number' || currentScore > att.bestScore) {
            att.bestScore = currentScore;
        }

        if (!this.data.pageScores) this.data.pageScores = {};
        this.data.pageScores['individual-tasks'] = {
            score: att.bestScore,
            lastAttemptScore: currentScore,
            attempt: att.currentAttempt,
            completed: (lockedCount === 4),
            savedAt: new Date().toISOString()
        };

        // If all 4 tasks are locked in this attempt, record attempt to history
        if (lockedCount === 4) {
            const curIdx = att.currentAttempt;
            const existingHist = att.history.find(h => h.attempt === curIdx);
            if (!existingHist) {
                att.history.push({
                    attempt: curIdx,
                    score: currentScore,
                    correctCount: correctCount,
                    completedAt: new Date().toISOString()
                });
            } else {
                existingHist.score = currentScore;
                existingHist.correctCount = correctCount;
                existingHist.completedAt = new Date().toISOString();
            }

            // Update bestScore
            const allScores = att.history.map(h => h.score);
            att.bestScore = Math.max(...allScores, currentScore);
            this.data.pageScores['individual-tasks'].score = att.bestScore;
        }

        this.save();
        return { lockedCount, correctCount, currentScore, isAllLocked: lockedCount === 4 };
    },

    // ----------------------------------------------------
    // EVALUASI SIMULASI EKSPLORASI SISWA (AKUMULASI SKOR 0 - 100 & SKALA 1 - 4)
    // ----------------------------------------------------
    initSimulationEvaluationState() {
        if (!this.data.simulationEvaluation) {
            this.data.simulationEvaluation = {
                score: 1,
                totalScore: 0,
                predicate: 'Perlu Bimbingan',
                operations: {},
                queueChallenges: {},
                stackChallenges: {},
                stats: {
                    opsCount: 0,
                    queueCorrect: 0,
                    stackCorrect: 0,
                    totalCompleted: 0
                },
                count: 0,
                lastUpdated: new Date().toISOString()
            };
        }
        const sim = this.data.simulationEvaluation;
        if (!sim.operations) sim.operations = {};
        if (!sim.queueChallenges) sim.queueChallenges = {};
        if (!sim.stackChallenges) sim.stackChallenges = {};
        if (!sim.stats) {
            sim.stats = { opsCount: 0, queueCorrect: 0, stackCorrect: 0, totalCompleted: 0 };
        }
        return sim;
    },

    recalculateSimulationAccumulation() {
        const sim = this.initSimulationEvaluationState();

        // 1. Komponen 1: Operasi Simulasi Instan (4 Operasi: Enqueue, Dequeue, Push, Pop) - Masing-masing 10 Pts (Maks 40 Pts)
        const ops = ['queueEnqueue', 'queueDequeue', 'stackPush', 'stackPop'];
        let opsCount = 0;
        ops.forEach(op => {
            if (sim.operations[op]) opsCount++;
        });
        const opsScore = opsCount * 10; // Maks 40 Pts

        // 2. Komponen 2: Tantangan Logika Antrean 3 Siswa (Queue - FIFO) - 3 Soal @ 10 Pts (Maks 30 Pts)
        let queueCorrect = 0;
        Object.keys(sim.queueChallenges).forEach(qId => {
            if (sim.queueChallenges[qId] && sim.queueChallenges[qId].isCorrect) queueCorrect++;
        });
        const queueScore = queueCorrect * 10; // Maks 30 Pts

        // 3. Komponen 3: Tantangan Logika Tumpukan 3 Piring (Stack - LIFO) - 3 Soal @ 10 Pts (Maks 30 Pts)
        let stackCorrect = 0;
        Object.keys(sim.stackChallenges).forEach(qId => {
            if (sim.stackChallenges[qId] && sim.stackChallenges[qId].isCorrect) stackCorrect++;
        });
        const stackScore = stackCorrect * 10; // Maks 30 Pts

        // Akumulasi Total Nilai Eksplorasi (0 - 100 Pts)
        const totalScore = opsScore + queueScore + stackScore;
        const totalCompleted = opsCount + Object.keys(sim.queueChallenges).length + Object.keys(sim.stackChallenges).length;

        sim.stats = {
            opsCount: opsCount,
            queueCorrect: queueCorrect,
            stackCorrect: stackCorrect,
            totalCompleted: totalCompleted
        };
        sim.count = opsCount;
        sim.totalScore = totalScore;

        // Skala Pemahaman 1 - 4 Berbasis Akumulasi Nilai
        // >= 80 pts: Skor 4 (Sangat Paham / Mahir)
        // 60 - 79 pts: Skor 3 (Paham / Cakap)
        // 40 - 59 pts: Skor 2 (Cukup Paham / Berkembang)
        // < 40 pts: Skor 1 (Perlu Bimbingan / Awal)
        if (totalScore >= 80) {
            sim.score = 4;
            sim.predicate = 'Sangat Paham';
        } else if (totalScore >= 60) {
            sim.score = 3;
            sim.predicate = 'Paham';
        } else if (totalScore >= 40) {
            sim.score = 2;
            sim.predicate = 'Cukup Paham';
        } else {
            sim.score = 1;
            sim.predicate = 'Perlu Bimbingan';
        }

        sim.lastUpdated = new Date().toISOString();
        return sim;
    },

    recordSimulationOp(opName) {
        const sim = this.initSimulationEvaluationState();
        sim.operations[opName] = true;
        this.recalculateSimulationAccumulation();
        this.save();
        return sim;
    },

    recordHeroChallengeAnswer(topic, questionId, optionIdx, isCorrect) {
        const sim = this.initSimulationEvaluationState();
        if (topic === 'queue') {
            sim.queueChallenges[questionId] = { chosen: optionIdx, isCorrect: !!isCorrect };
        } else if (topic === 'stack') {
            sim.stackChallenges[questionId] = { chosen: optionIdx, isCorrect: !!isCorrect };
        }
        this.recalculateSimulationAccumulation();
        this.save();
        return sim;
    },

    getSimulationEvaluation() {
        if (!this.data.simulationEvaluation) {
            return this.initSimulationEvaluationState();
        }
        return this.recalculateSimulationAccumulation();
    },

    resetIndividualAttempt() {
        const att = this.getIndividualAttempts();
        if (att.currentAttempt < att.maxAttempts) {
            att.currentAttempt++;
            att.lockedTasks = {};
            this.data.individualTasks = {};
            this.save();
            return true;
        }
        return false;
    },

    getGroupAttempts() {
        if (!this.data.groupAttempts) {
            this.data.groupAttempts = {
                currentAttempt: 1,
                maxAttempts: 3,
                history: [],
                bestScore: 0,
                isLocked: false
            };
        }
        return this.data.groupAttempts;
    },

    saveGroupAttemptRecord(score, caseKey) {
        const att = this.getGroupAttempts();
        const curIdx = att.currentAttempt;

        const existingHist = att.history.find(h => h.attempt === curIdx);
        if (!existingHist) {
            att.history.push({
                attempt: curIdx,
                score: score,
                caseKey: caseKey || 'case1',
                completedAt: new Date().toISOString()
            });
        } else {
            existingHist.score = score;
            existingHist.caseKey = caseKey || 'case1';
            existingHist.completedAt = new Date().toISOString();
        }

        const allScores = att.history.map(h => h.score);
        att.bestScore = Math.max(...allScores, score);
        att.isLocked = true;

        if (!this.data.pageScores) this.data.pageScores = {};
        this.data.pageScores['group-project'] = {
            score: att.bestScore,
            lastAttemptScore: score,
            attempt: curIdx,
            completed: true,
            savedAt: new Date().toISOString()
        };

        this.save();
        return att;
    },

    resetGroupAttempt() {
        const att = this.getGroupAttempts();
        if (att.currentAttempt < att.maxAttempts) {
            att.currentAttempt++;
            att.isLocked = false;
            // Clear current worksheet draft answers
            if (this.data.groupProject) {
                this.data.groupProject.worksheet = {
                    selectedStructure: '',
                    reasoning: '',
                    steps: '',
                    conclusion: ''
                };
                this.data.groupProject.hotsAnswers = {};
                this.data.groupProject.score = 0;
            }
            this.save();
            return true;
        }
        return false;
    },

    recordMiniLabOp(opKey) {
        if (!this.data.miniLabOps) {
            this.data.miniLabOps = {
                stackPush: false,
                stackPop: false,
                queueEnqueue: false,
                queueDequeue: false
            };
        }
        if (opKey in this.data.miniLabOps) {
            this.data.miniLabOps[opKey] = true;
        }
        this.getMiniLabBonus();
        this.save();
    },

    getMiniLabBonus() {
        if (!this.data) return 0;
        let bonus = 0;

        // 1. Bonus dari kuis pemahaman materi Stack & Queue (Masing-masing +2.5 poin, total +5 poin)
        const mq = this.data.materialQuizzes || {};
        if (mq.stackDone) bonus += 2.5;
        if (mq.queueDone) bonus += 2.5;

        // 2. Bonus dari uji coba interaktif mini-lab hands-on (jika kuis belum tuntas)
        if (bonus < 5 && this.data.miniLabOps) {
            let opsCount = 0;
            if (this.data.miniLabOps.stackPush) opsCount++;
            if (this.data.miniLabOps.stackPop) opsCount++;
            if (this.data.miniLabOps.queueEnqueue) opsCount++;
            if (this.data.miniLabOps.queueDequeue) opsCount++;
            const opsBonus = parseFloat(((opsCount / 4) * 5).toFixed(1));
            bonus = Math.max(bonus, opsBonus);
        }

        // Pastikan batas maksimal bonus adalah 5 poin
        bonus = Math.min(5, Math.round(bonus * 10) / 10);
        this.data.miniLabBonus = bonus;
        return bonus;
    },

    recordMaterialQuizBonus(topic, isDone = true, score = 100) {
        if (!this.data.materialQuizzes) {
            this.data.materialQuizzes = { stackDone: false, stackScore: 0, queueDone: false, queueScore: 0 };
        }
        if (topic === 'stack') {
            this.data.materialQuizzes.stackDone = isDone;
            this.data.materialQuizzes.stackScore = score;
        } else if (topic === 'queue') {
            this.data.materialQuizzes.queueDone = isDone;
            this.data.materialQuizzes.queueScore = score;
        }
        const bonus = this.getMiniLabBonus();
        this.save();
        return bonus;
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
