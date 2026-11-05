const fs = require('fs');

let scoringCode = `/**
 * scoring.js
 * Scoring System, Predicate Evaluator, and Learning Analytics Engine
 * Sesuai Pedoman RPM UKIN Fase E (Problem-Based Learning 2 JP / 90 Menit)
 * 
 * Bobot Penilaian Pembelajaran:
 * 1. Tantangan Individu 4 Level : 25% (Ketepatan jawaban & pemecahan masalah)
 * 2. Praktik Simulasi Mini-Lab  : 20% (Keberhasilan operasi Stack & Queue)
 * 3. LKPD Kelompok (PBL)        : 30% (Analisis kasus, konsep, algoritma, argumentasi)
 * 4. Evaluasi Akhir (Sumatif)   : 25% (Penguasaan mandiri 5 butir soal HOTS)
 * ---------------------------------------------------------------------------------
 * Total Nilai Akhir            : 100%
 * * Kuis Materi Stack & Queue   : Asesmen formatif (0% - umpan balik pemahaman konsep)
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
    // COMPONENT SCORES & WEIGHTED AVERAGE (RPM UKIN)
    // ----------------------------------------------------

    getIndividualScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        const tasks = StorageManager.data.individualTasks || {};
        let correctCount = 0;
        for (let lvl = 1; lvl <= 4; lvl++) {
            if (tasks[lvl] && tasks[lvl].isSubmitted && tasks[lvl].isCorrect) {
                correctCount++;
            }
        }
        // If student submitted tasks, score = correctCount * 25
        if (Object.keys(tasks).length > 0) {
            return correctCount * 25;
        }
        // Check pageScores fallback
        const pageScores = StorageManager.data.pageScores || {};
        if (pageScores['individual-tasks'] && typeof pageScores['individual-tasks'].score === 'number') {
            return pageScores['individual-tasks'].score;
        }
        return 0;
    },

    getMiniLabScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
        const ops = StorageManager.data.miniLabOps || {};
        let opsDone = 0;
        if (ops.stackPush) opsDone++;
        if (ops.stackPop) opsDone++;
        if (ops.queueEnqueue) opsDone++;
        if (ops.queueDequeue) opsDone++;

        if (opsDone > 0) {
            return opsDone * 25; // 4 operations x 25 = 100
        }

        const pageScores = StorageManager.data.pageScores || {};
        if (pageScores['mini-lab'] && typeof pageScores['mini-lab'].score === 'number') {
            return pageScores['mini-lab'].score;
        }
        return 0;
    },

    getGroupProjectScore() {
        if (!window.StorageManager || !StorageManager.data) return 0;
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
        const miniLab = this.getMiniLabScore();
        const groupProject = this.getGroupProjectScore();
        const evaluation = this.getEvaluationScore();
        const formative = this.getFormativeQuizScores();

        // Formula: (Individu * 0.25) + (MiniLab * 0.20) + (LKPD * 0.30) + (Evaluasi * 0.25)
        const weightedScore = (individual * 0.25) +
                              (miniLab * 0.20) +
                              (groupProject * 0.30) +
                              (evaluation * 0.25);

        return {
            individual: {
                name: 'Tantangan Individu (4 Level)',
                score: individual,
                weightPct: 25,
                weightedContribution: parseFloat((individual * 0.25).toFixed(1)),
                desc: 'Ketepatan jawaban & penyelesaian 4 level tugas mandiri bertingkat'
            },
            miniLab: {
                name: 'Praktik Simulasi Mini-Lab',
                score: miniLab,
                weightPct: 20,
                weightedContribution: parseFloat((miniLab * 0.20).toFixed(1)),
                desc: 'Keberhasilan eksekusi operasi dasar Stack (push, pop) & Queue (enqueue, dequeue)'
            },
            groupProject: {
                name: 'LKPD Kelompok (PBL)',
                score: groupProject,
                weightPct: 30,
                weightedContribution: parseFloat((groupProject * 0.30).toFixed(1)),
                desc: 'Analisis masalah kantin, ketepatan konsep, algoritma, & argumentasi tim'
            },
            evaluation: {
                name: 'Evaluasi Akhir (Sumatif)',
                score: evaluation,
                weightPct: 25,
                weightedContribution: parseFloat((evaluation * 0.25).toFixed(1)),
                desc: 'Penguasaan konsep secara mandiri melalui 5 butir soal HOTS (C3-C4)'
            },
            formative: {
                name: 'Kuis Formatif Materi Stack & Queue',
                score: formative.avg,
                stackScore: formative.stack,
                queueScore: formative.queue,
                weightPct: 0,
                desc: 'Asesmen formatif sebagai umpan balik mandiri (tidak dihitung dalam nilai sumatif)'
            },
            finalScore: Math.round(weightedScore)
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

        // Add default mastered if students did well
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
console.log('Successfully updated js/scoring.js!');

