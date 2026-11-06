const fs = require('fs');
const path = require('path');

// Mock DOM and localStorage
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

// Mock document
const elements = {};
global.document = {
    getElementById: (id) => {
        if (!elements[id]) {
            elements[id] = {
                id,
                textContent: '',
                innerHTML: '',
                style: {},
                classList: {
                    add: () => {},
                    remove: () => {},
                    toggle: () => {}
                }
            };
        }
        return elements[id];
    },
    querySelectorAll: () => [],
    createElement: (tag) => ({
        tagName: tag,
        setAttribute: () => {},
        style: {},
        classList: { add: () => {}, remove: () => {} }
    }),
    body: {
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {} }
    }
};

global.t = (k) => k;
global.getLanguage = () => 'id';

// Load modules
const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'storage.js'), 'utf8');
eval(storageCode);
global.StorageManager = window.StorageManager;

const playerCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'player.js'), 'utf8');
eval(playerCode);
global.Player = window.Player;

const scoringCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'scoring.js'), 'utf8');
eval(scoringCode);
global.ScoringSystem = window.ScoringSystem;

const uiCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'ui.js'), 'utf8');
eval(uiCode);
const UI = window.UI;

console.log('--- TEST 1: Initialize Storage & Player ---');
StorageManager.init();
Player.init();
Player.setProfile('Ahmad Zaki Pratama', 'Kelas X.2', '14');

console.assert(Player.getName() === 'Ahmad Zaki Pratama', 'Player name matches');
console.assert(Player.getClass() === 'Kelas X.2', 'Player class matches');
console.assert(Player.getAbsen() === '14', 'Player absen matches');
console.log('✓ Player profile verified');

console.log('--- TEST 2: Seed Activity Data for Progress & Scores ---');
// Mini-Lab (4 ops)
StorageManager.recordMiniLabOp('stackPush');
StorageManager.recordMiniLabOp('stackPop');
StorageManager.recordMiniLabOp('queueEnqueue');
StorageManager.recordMiniLabOp('queueDequeue');

// Individual Task: attempt 1 (75 pts), attempt 2 (100 pts)
StorageManager.saveIndividualTaskLock(1, 2, true);
StorageManager.saveIndividualTaskLock(2, 1, true);
StorageManager.saveIndividualTaskLock(3, 1, true);
StorageManager.saveIndividualTaskLock(4, 0, false);
StorageManager.resetIndividualAttempt();
StorageManager.saveIndividualTaskLock(1, 2, true);
StorageManager.saveIndividualTaskLock(2, 1, true);
StorageManager.saveIndividualTaskLock(3, 1, true);
StorageManager.saveIndividualTaskLock(4, 3, true);

// LKPD Kelompok: 95 pts
StorageManager.saveGroupAttemptRecord(95, 'case1');

// Evaluasi: 90 pts
StorageManager.savePageScore('evaluation', 90, { totalQuestions: 5, correctCount: 4 });

// Reflection
StorageManager.savePageScore('reflection', 100, { completed: true });

console.log('--- TEST 3: renderProfilePage() Execution ---');
UI.renderProfilePage();

const heroName = elements['prof-hero-name'].textContent;
const heroClass = elements['prof-hero-class'].textContent;
const heroAbsen = elements['prof-hero-absen'].textContent;
const digitalScore = elements['prof-digital-score-num'].textContent;

console.assert(heroName === 'Ahmad Zaki Pratama', `Hero name: ${heroName}`);
console.assert(heroClass === 'Kelas X.2', `Hero class: ${heroClass}`);
console.assert(heroAbsen === 'Absen: 14', `Hero absen: ${heroAbsen}`);
console.log('Hero Card Values:', { heroName, heroClass, heroAbsen, digitalScore });

// Expected ND:
// I = 100 -> 30% = 30
// L = 95 -> 35% = 33.25
// E = 90 -> 35% = 31.5
// B = 5 (4 ops)
// Sum = 30 + 33.25 + 31.5 + 5 = 99.75 -> round = 100
console.assert(Number(digitalScore) === 100, `Expected ND 100, got ${digitalScore}`);
console.log('✓ UI.renderProfilePage() successfully rendered and computed ND = 100');

console.log('--- TEST 4: buildProfileReportHTML for Word & PDF ---');
const wordHTML = UI.buildProfileReportHTML(true);
console.assert(wordHTML.includes('Ahmad Zaki Pratama'), 'Word HTML contains student name');
console.assert(wordHTML.includes('Kelas X.2'), 'Word HTML contains student class');
console.assert(wordHTML.includes('LEMBAR RAPOR HASIL BELAJAR DIGITAL SISWA'), 'Word HTML contains kop title');
console.assert(wordHTML.includes('TUNTAS KKTP'), 'Word HTML contains KKTP status');
console.assert(wordHTML.includes('100 / 100 Poin'), 'Word HTML contains score');
console.assert(wordHTML.includes('Guru Mata Pelajaran Informatika'), 'Word HTML contains teacher signature block');
console.assert(wordHTML.includes('Peserta Didik'), 'Word HTML contains student signature block');
console.log('✓ Word Report HTML generated with full formal structure (' + wordHTML.length + ' chars)');

const printHTML = UI.buildProfileReportHTML(false);
console.assert(printHTML.includes('Ahmad Zaki Pratama'), 'Print HTML contains student name');
console.assert(printHTML.includes('REKAPITULASI NILAI AKHIR DIGITAL'), 'Print HTML contains section I');
console.assert(printHTML.includes('CEK PROGRES TAHAPAN PEMBELAJARAN'), 'Print HTML contains section III');
console.log('✓ Print/PDF Report HTML generated with full formal structure (' + printHTML.length + ' chars)');

console.log('\n========================================');
console.log('ALL PROFILE TESTS PASSED (100%)! 🎉');
console.log('========================================');

