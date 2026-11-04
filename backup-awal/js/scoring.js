/**
 * scoring.js
 * Scoring System, Predicate Evaluator, and Learning Analytics Engine
 */

const ScoringSystem = {
    // Current level temporary scoring state
    currentLevelState: {
        levelId: 1,
        baseScore: 100,
        hintsUsed: 0,
        correctCount: 0,
        wrongCount: 0,
        startTime: 0,
        targetTimeSeconds: 60
    },

    startLevel(levelId, targetTimeSeconds = 60) {
        this.currentLevelState = {
            levelId,
            baseScore: 100,
            hintsUsed: 0,
            correctCount: 0,
            wrongCount: 0,
            startTime: Date.now(),
            targetTimeSeconds
        };
    },

    recordAnswer(isCorrect, questionObj, userAnswer) {
        if (isCorrect) {
            this.currentLevelState.correctCount++;
        } else {
            this.currentLevelState.wrongCount++;
            this.currentLevelState.baseScore = Math.max(0, this.currentLevelState.baseScore - 10);
        }

        // Log to persistent answer history
        if (window.StorageManager && questionObj) {
            StorageManager.addAnswerLog({
                levelId: this.currentLevelState.levelId,
                question: questionObj.question,
                userAnswer: userAnswer,
                correctAnswer: questionObj.correctAnswer,
                isCorrect: isCorrect,
                explanation: questionObj.explanation,
                concept: questionObj.concept || 'General'
            });
        }
    },

    useHint() {
        this.currentLevelState.hintsUsed++;
        this.currentLevelState.baseScore = Math.max(0, this.currentLevelState.baseScore - 5);
    },

    finishLevel() {
        const elapsedSec = Math.round((Date.now() - this.currentLevelState.startTime) / 1000);
        if (window.StorageManager) {
            StorageManager.addPlayTime(elapsedSec);
        }

        let calculatedScore = this.currentLevelState.baseScore;
        // Speed bonus if finished within target time with good performance
        if (elapsedSec < this.currentLevelState.targetTimeSeconds && this.currentLevelState.wrongCount === 0) {
            calculatedScore = 100;
        }

        const finalScore = Math.min(100, Math.max(20, calculatedScore));
        if (window.StorageManager) {
            StorageManager.setLevelScore(this.currentLevelState.levelId, finalScore);
            // Check achievement for perfect score
            if (finalScore === 100 && window.AchievementsManager) {
                AchievementsManager.check('PERFECT_SCORE');
            }
        }
        return finalScore;
    },

    getFinalAverage() {
        if (!window.StorageManager) return 0;
        const scores = StorageManager.getAllLevelScores();
        let total = 0;
        for (let i = 1; i <= 8; i++) {
            total += (scores[i] || 0);
        }
        return Math.round(total / 8);
    },

    getPredicate(score) {
        const lang = getLanguage();
        if (score >= 90) {
            return {
                text: lang === 'id' ? 'Sangat Baik' : 'Excellent',
                class: 'predicate-excellent',
                badgeColor: '#10b981'
            };
        } else if (score >= 80) {
            return {
                text: lang === 'id' ? 'Baik' : 'Good',
                class: 'predicate-good',
                badgeColor: '#0284c7'
            };
        } else if (score >= 70) {
            return {
                text: lang === 'id' ? 'Cukup' : 'Satisfactory',
                class: 'predicate-satisfactory',
                badgeColor: '#f59e0b'
            };
        } else if (score >= 60) {
            return {
                text: lang === 'id' ? 'Perlu Berlatih' : 'Needs Practice',
                class: 'predicate-needspractice',
                badgeColor: '#f97316'
            };
        } else {
            return {
                text: lang === 'id' ? 'Perlu Belajar Lagi' : 'Needs More Learning',
                class: 'predicate-needslearning',
                badgeColor: '#ef4444'
            };
        }
    },

    getDetailedAnalytics() {
        const logs = window.StorageManager ? StorageManager.getAnswersLog() : [];
        const totalAnswers = logs.length;
        const correctAnswers = logs.filter(l => l.isCorrect).length;
        const wrongAnswers = totalAnswers - correctAnswers;
        const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

        // Group by concepts
        const conceptPerformance = {
            'FIFO': { total: 0, correct: 0 },
            'LIFO': { total: 0, correct: 0 },
            'enqueue()': { total: 0, correct: 0 },
            'dequeue()': { total: 0, correct: 0 },
            'push()': { total: 0, correct: 0 },
            'pop()': { total: 0, correct: 0 },
            'front()': { total: 0, correct: 0 },
            'peek()': { total: 0, correct: 0 },
            'isEmpty()': { total: 0, correct: 0 }
        };

        logs.forEach(l => {
            const concept = l.concept;
            if (concept && conceptPerformance[concept]) {
                conceptPerformance[concept].total++;
                if (l.isCorrect) conceptPerformance[concept].correct++;
            }
        });

        const mastered = [];
        const needsPractice = [];

        Object.keys(conceptPerformance).forEach(c => {
            const data = conceptPerformance[c];
            if (data.total === 0 || (data.correct / data.total) >= 0.7) {
                mastered.push(c);
            } else {
                needsPractice.push(c);
            }
        });

        const totalSec = window.StorageManager ? StorageManager.getTotalPlayTime() : 0;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        return {
            totalAnswers,
            correctAnswers,
            wrongAnswers,
            accuracy,
            mastered,
            needsPractice,
            formattedTime
        };
    }
};

window.ScoringSystem = ScoringSystem;
