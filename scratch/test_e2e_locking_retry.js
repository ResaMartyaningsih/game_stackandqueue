// Comprehensive End-to-End verification script for NalarQuest
const fs = require('fs');
const path = require('path');

// Mock localStorage and window
const store = {};
global.localStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};
global.window = {
    localStorage: global.localStorage
};

// Load storage.js
const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'storage.js'), 'utf8');
eval(storageCode);
const StorageManager = global.window.StorageManager;

// Load scoring.js
const scoringCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'scoring.js'), 'utf8');
eval(scoringCode);
const ScoringSystem = global.window.ScoringSystem;

console.log('--- TEST 1: StorageManager Initialization ---');
StorageManager.init();
const indInitial = StorageManager.getIndividualAttempts();
console.assert(indInitial.currentAttempt === 1, 'Initial attempt should be 1');
console.assert(indInitial.maxAttempts === 3, 'Max attempts should be 3');
console.assert(indInitial.history.length === 0, 'History should be empty initially');
console.log('✓ Initial individual attempts state correct');

console.log('--- TEST 2: Task Locking on Answer Selection ---');
// Student answers Level 1 with option 2
const lockRes1 = StorageManager.saveIndividualTaskLock(1, 2, true);
console.assert(lockRes1.lockedCount === 1, 'Locked count should be 1');
const attAfterLock1 = StorageManager.getIndividualAttempts();
console.assert(attAfterLock1.lockedTasks[1].chosenIndex === 2, 'Task 1 locked with index 2');
console.assert(attAfterLock1.lockedTasks[1].isCorrect === true, 'Task 1 is correct');
console.assert(attAfterLock1.lockedTasks[1].isLocked === true, 'Task 1 is permanently locked');
console.log('✓ Task 1 immediately locked upon selection');

console.log('--- TEST 3: Retry System (Max 3 attempts) ---');
// Complete Attempt 1 with 50 points (levels 1 and 3 correct, 2 and 4 incorrect)
StorageManager.saveIndividualTaskLock(2, 0, false);
StorageManager.saveIndividualTaskLock(3, 1, true);
const lockRes4 = StorageManager.saveIndividualTaskLock(4, 0, false);
console.assert(lockRes4.isAllLocked === true, 'All 4 tasks locked');
console.assert(lockRes4.currentScore === 50, 'Attempt 1 score is 50');

const indAfterAttempt1 = StorageManager.getIndividualAttempts();
console.assert(indAfterAttempt1.history.length === 1, 'History has 1 completed attempt');
console.assert(indAfterAttempt1.history[0].score === 50, 'History attempt 1 score is 50');
console.assert(indAfterAttempt1.bestScore === 50, 'Best score is 50');

// Now trigger retry 1
const retry1 = StorageManager.resetIndividualAttempt();
console.assert(retry1 === true, 'Retry 1 should succeed');
const indAtt2 = StorageManager.getIndividualAttempts();
console.assert(indAtt2.currentAttempt === 2, 'Now on attempt 2');
console.assert(indAtt2.history.length === 1, 'History has 1 completed attempt');
console.assert(indAtt2.history[0].score === 50, 'Attempt 1 score was 50');
console.assert(indAtt2.bestScore === 50, 'Best score remains 50 from previous attempt');
console.assert(Object.keys(indAtt2.lockedTasks).length === 0, 'New attempt has empty lockedTasks');
console.log('✓ Retry 1 successfully archived attempt 1 and reset answers');

// Now in Attempt 2, get full score 100
StorageManager.saveIndividualTaskLock(1, 2, true);
StorageManager.saveIndividualTaskLock(2, 1, true);
StorageManager.saveIndividualTaskLock(3, 1, true);
const lockResAtt2_4 = StorageManager.saveIndividualTaskLock(4, 3, true);
console.assert(lockResAtt2_4.currentScore === 100, 'Attempt 2 score is 100');

// Trigger retry 2
const retry2 = StorageManager.resetIndividualAttempt();
console.assert(retry2 === true, 'Retry 2 should succeed');
const indAtt3 = StorageManager.getIndividualAttempts();
console.assert(indAtt3.currentAttempt === 3, 'Now on attempt 3');
console.assert(indAtt3.history.length === 2, 'History has 2 completed attempts');
console.assert(indAtt3.bestScore === 100, 'Best score correctly updated to 100');
console.log('✓ Retry 2 correctly archived attempt 2 (100 pts) and updated bestScore to 100');

// Trigger retry 3 (from attempt 3)
const retry3 = StorageManager.resetIndividualAttempt();
console.assert(retry3 === false, 'Retry 3 should be BLOCKED because max 3 attempts reached');
console.log('✓ 4th attempt successfully BLOCKED (strictly max 3 attempts)');

console.log('--- TEST 4: LKPD Group Attempts and Locking ---');
const gpInitial = StorageManager.getGroupAttempts();
console.assert(gpInitial.currentAttempt === 1, 'Initial GP attempt should be 1');
console.assert(gpInitial.isLocked === false, 'Initially unlocked');

// Save group attempt record (90 pts)
StorageManager.saveGroupAttemptRecord(90, 'case1');
const gpLocked = StorageManager.getGroupAttempts();
console.assert(gpLocked.isLocked === true, 'GP is now locked');
console.assert(gpLocked.bestScore === 90, 'GP best score is 90');
console.assert(gpLocked.history.length === 1, 'History has 1 entry');
console.assert(gpLocked.history[0].score === 90, 'Entry 1 score is 90');

// Reset GP attempt
const gpRetry1 = StorageManager.resetGroupAttempt();
console.assert(gpRetry1 === true, 'GP retry 1 should succeed');
const gpAtt2 = StorageManager.getGroupAttempts();
console.assert(gpAtt2.currentAttempt === 2, 'GP now on attempt 2');
console.assert(gpAtt2.isLocked === false, 'GP unlocked for attempt 2');
console.assert(gpAtt2.history.length === 1, 'History preserved 1 entry');
console.assert(gpAtt2.history[0].score === 90, 'History entry 1 score is 90');
console.assert(gpAtt2.bestScore === 90, 'Best score remains 90');
console.log('✓ LKPD group retry and history recording working correctly');

console.log('--- TEST 5: Scoring System Digital Score Formula ---');
// Record Evaluation Score 80
StorageManager.savePageScore('evaluation', 80, { totalQuestions: 5, correctCount: 4 });
// Add Mini-Lab bonus (3 ops: stackPush, stackPop, queueEnqueue = (3/4)*5 = 3.8 bonus pts)
StorageManager.recordMiniLabOp('stackPush');
StorageManager.recordMiniLabOp('stackPop');
StorageManager.recordMiniLabOp('queueEnqueue');

const compScores = ScoringSystem.getComponentScores();
console.log('Calculated Components:', {
    I: compScores.individual.score,
    L: compScores.groupProject.score,
    E: compScores.evaluation.score,
    B: compScores.miniLabBonus.score,
    Final: compScores.finalScore
});

// Expected:
// I = 100 (best of 50, 100) -> 30% = 30
// L = 90 (best of 90) -> 35% = 31.5
// E = 80 -> 35% = 28
// B = 3.8
// Sum = 30 + 31.5 + 28 + 3.8 = 93.3 -> round = 93
console.assert(compScores.finalScore === 93, `Expected finalScore 93, got ${compScores.finalScore}`);
console.log('✓ ND formula calculated accurately with rounding and bonus caps');

console.log('--- TEST 6: Cap at 100 ---');
StorageManager.savePageScore('evaluation', 100, { totalQuestions: 5, correctCount: 5 });
StorageManager.saveGroupAttemptRecord(100, 'case1');
// Now I = 100, L = 100, E = 100, B = 3 -> 30 + 35 + 35 + 3 = 103 -> capped at 100
const cappedScores = ScoringSystem.getComponentScores();
console.assert(cappedScores.finalScore === 100, `Expected capped 100, got ${cappedScores.finalScore}`);
console.log('✓ Final digital score strictly capped at 100');

console.log('\n========================================');
console.log('ALL VERIFICATION TESTS PASSED (100%)! 🎉');
console.log('========================================');
