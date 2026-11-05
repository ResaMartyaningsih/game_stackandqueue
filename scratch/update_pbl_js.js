const fs = require('fs');

let pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Replace 6 Level toast
const oldToast = 'UI.showToast("🎉 SELAMAT! Seluruh 6 Level Tugas Individu Tuntas dengan Nilai Sempurna!");';
const newToast = 'UI.showToast("🎉 SELAMAT! Seluruh 4 Level Tugas Individu Tuntas dengan Nilai Sempurna!");';
if (pblJs.includes(oldToast)) {
  pblJs = pblJs.replace(oldToast, newToast);
  console.log('1. Updated 6 Level toast to 4 Level in js/pbl-academic.js');
}

// 2. Enrich Level 4 scenario and explanation with Underflow/Overflow concepts
const oldLvl4Exp = `explanation: "Sangat tepat! Sistem X menghasilkan urutan terbalik dari urutan masukan ([101, 102, 103] menjadi [103, 102, 101]), ini merupakan ciri khas Stack (LIFO - pembalikan urutan). Sistem Y mempertahankan urutan kedatangan asli ([101, 102, 103] tetap [101, 102, 103]), yang merupakan ciri mutlak Queue (FIFO)."`;

const newLvl4Exp = `explanation: "Sangat tepat! Sistem X menghasilkan urutan terbalik dari urutan masukan ([101, 102, 103] menjadi [103, 102, 101]), ini merupakan ciri khas Stack (LIFO - pembalikan urutan). Sistem Y mempertahankan urutan kedatangan asli ([101, 102, 103] tetap [101, 102, 103]), yang merupakan ciri mutlak Queue (FIFO). Catatan Kondisi Batas: Jika Sistem X kosong lalu dipanggil pop(), terjadi Stack Underflow; jika Sistem Y penuh kuota lalu dipanggil enqueue(), terjadi Queue Overflow!"`;

if (pblJs.includes(oldLvl4Exp)) {
  pblJs = pblJs.replace(oldLvl4Exp, newLvl4Exp);
  console.log('2. Enriched Level 4 explanation with boundary conditions');
}

// 3. In saveTaskResult, update pageScores['individual-tasks']
const saveTaskResultOld = `    saveTaskResult(lvl, chosenIndex, isCorrect) {
        if (!window.StorageManager) return;
        if (!StorageManager.data.individualTasks) {
            StorageManager.data.individualTasks = {};
        }
        StorageManager.data.individualTasks[lvl] = {
            level: lvl,
            chosenIndex,
            isCorrect,
            isSubmitted: true,
            savedAt: new Date().toISOString()
        };
        StorageManager.save();
    },`;

const saveTaskResultNew = `    saveTaskResult(lvl, chosenIndex, isCorrect) {
        if (!window.StorageManager) return;
        if (!StorageManager.data.individualTasks) {
            StorageManager.data.individualTasks = {};
        }
        StorageManager.data.individualTasks[lvl] = {
            level: lvl,
            chosenIndex,
            isCorrect,
            isSubmitted: true,
            savedAt: new Date().toISOString()
        };

        // Recalculate 4 Level task score (each correct = 25 pts, max 100)
        let correctCount = 0;
        let submittedCount = 0;
        for (let i = 1; i <= 4; i++) {
            const t = StorageManager.data.individualTasks[i];
            if (t && t.isSubmitted) {
                submittedCount++;
                if (t.isCorrect) correctCount++;
            }
        }
        const taskScore = correctCount * 25;
        if (!StorageManager.data.pageScores) StorageManager.data.pageScores = {};
        StorageManager.data.pageScores['individual-tasks'] = {
            score: taskScore,
            completed: submittedCount === 4,
            completedCount: submittedCount,
            correctCount: correctCount,
            savedAt: new Date().toISOString()
        };

        StorageManager.save();
    },`;

if (!pblJs.includes(saveTaskResultOld)) {
  console.error('saveTaskResultOld not found!');
  process.exit(1);
}
pblJs = pblJs.replace(saveTaskResultOld, saveTaskResultNew);
console.log('3. Updated saveTaskResult with weighted individual task score calculation');

fs.writeFileSync('js/pbl-academic.js', pblJs, 'utf8');
console.log('Successfully written updated js/pbl-academic.js!');

