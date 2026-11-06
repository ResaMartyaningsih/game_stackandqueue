const fs = require('fs');

global.window = {};
global.StorageManager = {
  data: {
    individualAttempts: {
      currentAttempt: 2,
      maxAttempts: 3,
      history: [
        { attempt: 1, score: 75, completedAt: '2026-11-06T10:00:00Z' },
        { attempt: 2, score: 100, completedAt: '2026-11-06T10:15:00Z' }
      ],
      bestScore: 100
    },
    groupAttempts: {
      currentAttempt: 1,
      maxAttempts: 3,
      history: [
        { attempt: 1, score: 90, completedAt: '2026-11-06T10:30:00Z' }
      ],
      bestScore: 90
    },
    pageScores: {
      'evaluation': { score: 80 }
    },
    miniLabOps: {
      stackPush: true,
      stackPop: true,
      queueEnqueue: true,
      queueDequeue: true
    },
    miniLabBonus: 5
  },
  getIndividualAttempts() { return this.data.individualAttempts; },
  getGroupAttempts() { return this.data.groupAttempts; },
  getMiniLabBonus() { return 5; }
};
global.window.StorageManager = global.StorageManager;

eval(fs.readFileSync('js/scoring.js', 'utf8'));
const ScoringSystem = window.ScoringSystem;

const scores = ScoringSystem.getComponentScores();
console.log('=== NALARQUEST SCORES TEST ===');
console.log('Tugas Individu (30%):', scores.individual.score, 'Contrib:', scores.individual.weightedContribution);
console.log('LKPD Kelompok (35%):', scores.groupProject.score, 'Contrib:', scores.groupProject.weightedContribution);
console.log('Evaluasi Akhir (35%):', scores.evaluation.score, 'Contrib:', scores.evaluation.weightedContribution);
console.log('Bonus Mini-Lab (+5):', scores.miniLabBonus.score);
console.log('Nilai Akhir Digital (ND):', scores.finalScore);

// Formula check: (100 * 0.30) + (90 * 0.35) + (80 * 0.35) + 5
// = 30 + 31.5 + 28 + 5 = 94.5 -> round = 95
console.log('Expected: 95. Actual:', scores.finalScore, 'Match?', scores.finalScore === 95);
