const fs = require('fs');

let code = fs.readFileSync('js/storage.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Update defaultData
const oldDefaultData = `const defaultData = {
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
};`;

const newDefaultData = `const defaultData = {
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
    miniLabBonus: 0,
    totalPlayTimeSeconds: 0,
    answersLog: [],
    tempAnswers: {}, // Format: { [levelId]: { [qIndex]: { selectedIndex, isSubmitted, isCorrect, chosenText, savedAt, questionId } } }
    unlockedAchievements: [],
    lastPlayedDate: null
};`;

if (!code.includes(oldDefaultData)) {
  console.error('oldDefaultData not found!');
  process.exit(1);
}
code = code.replace(oldDefaultData, newDefaultData);
console.log('1. Updated defaultData in js/storage.js');

// 2. Update init() to ensure individualAttempts and groupAttempts are migrated safely
const oldInitEnd = `                if (!this.data.groupProject) {
                    this.data.groupProject = null;
                }
            } else {
                this.save();
            }`;

const newInitEnd = `                if (!this.data.groupProject) {
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
            }`;

if (!code.includes(oldInitEnd)) {
  console.error('oldInitEnd not found!');
  process.exit(1);
}
code = code.replace(oldInitEnd, newInitEnd);
console.log('2. Updated init() in js/storage.js with safe migration');

// 3. Add helper methods before resetAll
const helperMethods = `
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

            // Sync with pageScores
            if (!this.data.pageScores) this.data.pageScores = {};
            this.data.pageScores['individual-tasks'] = {
                score: att.bestScore,
                lastAttemptScore: currentScore,
                attempt: curIdx,
                completed: true,
                savedAt: new Date().toISOString()
            };
        }

        this.save();
        return { lockedCount, correctCount, currentScore, isAllLocked: lockedCount === 4 };
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

    getMiniLabBonus() {
        if (!this.data.miniLabOps) return 0;
        let count = 0;
        if (this.data.miniLabOps.stackPush) count++;
        if (this.data.miniLabOps.stackPop) count++;
        if (this.data.miniLabOps.queueEnqueue) count++;
        if (this.data.miniLabOps.queueDequeue) count++;

        // 4 operations => exactly +5.0 bonus points
        const bonus = Math.min(5, parseFloat(((count / 4) * 5).toFixed(1)));
        this.data.miniLabBonus = bonus;
        return bonus;
    },
`;

const resetAllTarget = '    resetAll() {';
if (!code.includes(resetAllTarget)) {
  console.error('resetAllTarget not found!');
  process.exit(1);
}
code = code.replace(resetAllTarget, helperMethods + '\n    resetAll() {');
console.log('3. Added attempt and locking helper methods to js/storage.js');

fs.writeFileSync('js/storage.js', code, 'utf8');
console.log('Successfully written updated js/storage.js!');

