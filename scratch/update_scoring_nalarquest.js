const fs = require('fs');

let scoringCode = `/**
 * scoring.js
 * Scoring System, Predicate Evaluator, and Learning Analytics Engine
 * Sesuai Spesifikasi Pembaharuan NalarQuest (Model PBL 2 JP / 90 Menit)
 * 
 * Sistem Pembobotan Nilai Digital (ND):
 * 1. Tugas Individu (4 Level) : 30% (Nilai terbaik dari maks 3 percobaan)
 * 2. LKPD Kelompok            : 35% (Nilai terbaik dari maks 3 percobaan)
 * 3. Evaluasi Akhir (Sumatif) : 35% (Penguasaan mandiri 5 butir soal HOTS)
 * 4. Bonus Mini-Lab           : Maksimal +5 Poin (Tambahan di luar bobot utama)
 * ---------------------------------------------------------------------------------
 * Rumus Nilai Digital: ND = min(100, round((I * 0.30) + (L * 0.35) + (E * 0.35) + B))
 * * Penilaian presentasi (10%) dilakukan secara manual oleh guru melalui rubrik penilaian guru
 *   di luar sistem website, dan TIDAK digabungkan ke dalam nilai digital otomatis ini.
 */

const ScoringSystem = {
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
        if (elapsedSec < this.currentLevelState.targetTimeSeconds && this.currentLevelState.wrongCount === 0) {
            calculatedScore = 100;
        }

        const finalScore = Math.min(100, Math.max(20, calculatedScore));
        if (window.StorageManager) {
            StorageManager.setLevelScore(this.currentLevelState.levelId, finalScore);
        }
        return finalScore;
    },

    // ----------------------------------------------------
    // COMPONENT SCORES & WEIGHTED AVERAGE (NALARQUEST FORMULA)
    // ----------------------------------------------------

    getIndividualScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        const att = StorageManager.getIndividualAttempts ? StorageManager.getIndividualAttempts() : StorageManager.data.individualAttempts;
        if (att) {
            // If bestScore is recorded, use it
            if (typeof att.bestScore === 'number' && att.bestScore > 0) {
                return att.bestScore;
            }
            // Check history
            if (att.history && att.history.length > 0) {
                const maxH = Math.max(...att.history.map(h => h.score || 0));
                if (maxH > 0) return maxH;
            }
            // Check currently completed locked tasks
            if (att.lockedTasks) {
                let c = 0;
                for (let i = 1; i <= 4; i++) {
                    if (att.lockedTasks[i] && att.lockedTasks[i].isCorrect) c++;
                }
                if (c > 0) return c * 25;
            }
        }

        // Check fallback in individualTasks
        const tasks = StorageManager.data.individualTasks || {};
        let correctCount = 0;
        for (let lvl = 1; lvl <= 4; lvl++) {
            if (tasks[lvl] && tasks[lvl].isSubmitted && tasks[lvl].isCorrect) {
                correctCount++;
            }
        }
        if (correctCount > 0) return correctCount * 25;

        // Check pageScores fallback
        const pageScores = StorageManager.data.pageScores || {};
        if (pageScores['individual-tasks'] && typeof pageScores['individual-tasks'].score === 'number') {
            return pageScores['individual-tasks'].score;
        }
        return 0;
    },

    getGroupProjectScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        const att = StorageManager.getGroupAttempts ? StorageManager.getGroupAttempts() : StorageManager.data.groupAttempts;
        if (att) {
            if (typeof att.bestScore === 'number' && att.bestScore > 0) {
                return att.bestScore;
            }
            if (att.history && att.history.length > 0) {
                const maxH = Math.max(...att.history.map(h => h.score || 0));
                if (maxH > 0) return maxH;
            }
        }

        const gp = StorageManager.data.groupProject;
        if (gp && typeof gp.score === 'number' && gp.score > 0) {
            return gp.score;
        }
        const pageScores = StorageManager.data.pageScores || {};
        if (pageScores['group-project'] && typeof pageScores['group-project'].score === 'number') {
            return pageScores['group-project'].score;
        }
        return 0;
    },

    getEvaluationScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        const pageScores = StorageManager.data.pageScores || {};
        if (pageScores['evaluation'] && typeof pageScores['evaluation'].score === 'number') {
            return pageScores['evaluation'].score;
        }
        return 0;
    },

    getMiniLabBonus() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        if (typeof StorageManager.getMiniLabBonus === 'function') {
            return StorageManager.getMiniLabBonus();
        }
        const ops = StorageManager.data.miniLabOps || {};
        let count = 0;
        if (ops.stackPush) count++;
        if (ops.stackPop) count++;
        if (ops.queueEnqueue) count++;
        if (ops.queueDequeue) count++;
        return Math.min(5, parseFloat(((count / 4) * 5).toFixed(1)));
    },

    getFormativeQuizScores() {
        if (!window.StorageManager || !StorageManager.data) return { stack: 0, queue: 0, avg: 0 };
        const pageScores = StorageManager.data.pageScores || {};
        const stackScore = (pageScores['learn-stack'] && typeof pageScores['learn-stack'].score === 'number')
            ? pageScores['learn-stack'].score
            : 0;
        const queueScore = (pageScores['learn-queue'] && typeof pageScores['learn-queue'].score === 'number')
            ? pageScores['learn-queue'].score
            : 0;
        const avg = Math.round((stackScore + queueScore) / 2);
        return { stack: stackScore, queue: queueScore, avg };
    },

    getComponentScores() {
        const individual = this.getIndividualScore();
        const groupProject = this.getGroupProjectScore();
        const evaluation = this.getEvaluationScore();
        const miniLabBonus = this.getMiniLabBonus();
        const formative = this.getFormativeQuizScores();

        // Formula: ND = (I * 0.30) + (L * 0.35) + (E * 0.35) + B, max 100
        const rawScore = (individual * 0.30) +
                         (groupProject * 0.35) +
                         (evaluation * 0.35) +
                         miniLabBonus;

        const finalScore = Math.min(100, Math.round(rawScore));

        const indAtt = (window.StorageManager && StorageManager.getIndividualAttempts) 
            ? StorageManager.getIndividualAttempts() 
            : { currentAttempt: 1, history: [], bestScore: individual };

        const grpAtt = (window.StorageManager && StorageManager.getGroupAttempts) 
            ? StorageManager.getGroupAttempts() 
            : { currentAttempt: 1, history: [], bestScore: groupProject };

        return {
            individual: {
                name: 'Tugas Individu (4 Level)',
                score: individual,
                bestScore: individual,
                weightPct: 30,
                weightedContribution: parseFloat((individual * 0.30).toFixed(1)),
                currentAttempt: indAtt.currentAttempt,
                history: indAtt.history || [],
                desc: 'Nilai terbaik dari maksimal 3 percobaan (bobot 30%)'
            },
            groupProject: {
                name: 'LKPD Kelompok',
                score: groupProject,
                bestScore: groupProject,
                weightPct: 35,
                weightedContribution: parseFloat((groupProject * 0.35).toFixed(1)),
                currentAttempt: grpAtt.currentAttempt,
                history: grpAtt.history || [],
                desc: 'Nilai terbaik kelompok dari maksimal 3 percobaan (bobot 35%)'
            },
            evaluation: {
                name: 'Evaluasi Akhir (Sumatif)',
                score: evaluation,
                weightPct: 35,
                weightedContribution: parseFloat((evaluation * 0.35).toFixed(1)),
                desc: 'Penguasaan konsep secara mandiri melalui 5 butir soal HOTS (bobot 35%)'
            },
            miniLabBonus: {
                name: 'Bonus Mini-Lab',
                score: miniLabBonus,
                maxBonus: 5,
                contribution: miniLabBonus,
                desc: 'Poin bonus penyelesaian eksplorasi operasional Stack & Queue (maks +5 poin)'
            },
            formative: {
                name: 'Kuis Formatif Materi Stack & Queue',
                score: formative.avg,
                stackScore: formative.stack,
                queueScore: formative.queue,
                weightPct: 0,
                desc: 'Asesmen formatif sebagai umpan balik mandiri (tidak dihitung dalam nilai sumatif)'
            },
            finalScore: finalScore
        };
    },

    getFinalAverage() {
        return this.getComponentScores().finalScore;
    },

    getPredicate(score) {
        if (score >= 90) {
            return {
                text: 'Sangat Baik (A)',
                class: 'predicate-excellent',
                badgeColor: '#10b981',
                desc: 'Luar biasa! Pemahaman konsep dan penerapan operasional Stack & Queue sangat komprehensif.'
            };
        } else if (score >= 80) {
            return {
                text: 'Baik (B)',
                class: 'predicate-good',
                badgeColor: '#0284c7',
                desc: 'Sangat baik. Mampu menganalisis dan menerapkan konsep serta operasi Stack & Queue dengan tepat.'
            };
        } else if (score >= 75) {
            return {
                text: 'Cukup / Tuntas KKTP (C)',
                class: 'predicate-satisfactory',
                badgeColor: '#E76814',
                desc: 'Tuntas KKTP minimal (75). Menguasai prinsip dasar, disarankan memperdalam latihan tracing & studi kasus.'
            };
        } else if (score >= 60) {
            return {
                text: 'Perlu Bimbingan (D)',
                class: 'predicate-needspractice',
                badgeColor: '#DC8236',
                desc: 'Belum mencapai KKTP 75. Perlu memperkuat pemahaman perbedaan prinsip LIFO dan FIFO.'
            };
        } else {
            return {
                text: 'Perlu Belajar Lagi (E)',
                class: 'predicate-needslearning',
                badgeColor: '#891A10',
                desc: 'Belum tuntas. Silakan pelajari kembali materi pada menu Pengayaan & Remedial.'
            };
        }
    },

    getDetailedAnalytics() {
        const logs = window.StorageManager ? StorageManager.getAnswersLog() : [];
        const totalAnswers = logs.length;
        const correctAnswers = logs.filter(l => l.isCorrect).length;
        const wrongAnswers = totalAnswers - correctAnswers;
        const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

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
            if (data.total > 0) {
                if ((data.correct / data.total) >= 0.7) {
                    mastered.push(c);
                } else {
                    needsPractice.push(c);
                }
            }
        });

        if (mastered.length === 0 && correctAnswers > 0) {
            mastered.push('Prinsip LIFO', 'Prinsip FIFO');
        }

        const totalSec = window.StorageManager ? StorageManager.getTotalPlayTime() : 0;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        const formattedTime = totalSec > 0 
            ? \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`
            : '00:00';

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
`;

fs.writeFileSync('js/scoring.js', scoringCode, 'utf8');
console.log('Successfully updated js/scoring.js with NalarQuest weighted formula!');

