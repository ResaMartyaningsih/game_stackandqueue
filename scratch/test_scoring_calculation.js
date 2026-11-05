const fs = require('fs');

global.window = {};
global.StorageManager = {
  data: {
    individualTasks: {
      1: { isSubmitted: true, isCorrect: true },
      2: { isSubmitted: true, isCorrect: true },
      3: { isSubmitted: true, isCorrect: true },
      4: { isSubmitted: true, isCorrect: true }
    },
    miniLabOps: {
      stackPush: true,
      stackPop: true,
      queueEnqueue: true,
      queueDequeue: true
    },
    groupProject: {
      groupName: 'Tim Garuda',
      score: 95
    },
    pageScores: {
      'evaluation': { score: 100 },
      'learn-stack': { score: 100 },
      'learn-queue': { score: 100 }
    },
    answersLog: [],
    getTotalPlayTime: () => 720
  }
};
global.window.StorageManager = global.StorageManager;
global.getLanguage = () => 'id';

eval(fs.readFileSync('js/scoring.js', 'utf8'));
const ScoringSystem = window.ScoringSystem;

const scores = ScoringSystem.getComponentScores();
console.log('=== CALCULATED COMPONENT SCORES ===');
console.log('Individual (25%):', scores.individual);
console.log('Mini-Lab (20%):', scores.miniLab);
console.log('LKPD (30%):', scores.groupProject);
console.log('Evaluasi (25%):', scores.evaluation);
console.log('Formative Quiz (0%):', scores.formative);
console.log('FINAL WEIGHTED AVERAGE:', scores.finalScore);

const pred = ScoringSystem.getPredicate(scores.finalScore);
console.log('Predicate:', pred);

// Test partial scores
global.StorageManager.data.individualTasks[4].isCorrect = false; // 3/4 = 75
global.StorageManager.data.miniLabOps.queueDequeue = false; // 3/4 = 75
global.StorageManager.data.groupProject.score = 80;
global.StorageManager.data.pageScores.evaluation.score = 80;

const partial = ScoringSystem.getComponentScores();
console.log('\n=== PARTIAL TEST SCORES ===');
console.log('Individu:', partial.individual.score, 'Contrib:', partial.individual.weightedContribution);
console.log('Mini-Lab:', partial.miniLab.score, 'Contrib:', partial.miniLab.weightedContribution);
console.log('LKPD:', partial.groupProject.score, 'Contrib:', partial.groupProject.weightedContribution);
console.log('Evaluasi:', partial.evaluation.score, 'Contrib:', partial.evaluation.weightedContribution);
console.log('Partial Final Score:', partial.finalScore);
// Expected: (75 * 0.25) + (75 * 0.20) + (80 * 0.30) + (80 * 0.25) = 18.75 + 15 + 24 + 20 = 77.75 -> 78
console.log('Expected: ~78. Match?', partial.finalScore === 78);
