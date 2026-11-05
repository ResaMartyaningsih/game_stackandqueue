const fs = require('fs');

let playerJs = fs.readFileSync('js/player.js', 'utf8').replace(/\r\n/g, '\n');

const oldProg = `    updateProgressSummary() {
        if (!window.StorageManager) return;
        const unlocked = StorageManager.data.unlockedLevels ? StorageManager.data.unlockedLevels.length : 1;
        const totalLevels = 8;
        const scores = StorageManager.getAllLevelScores();
        const completedLevels = Object.keys(scores).length;
        const progressPct = Math.round((completedLevels / totalLevels) * 100);

        document.querySelectorAll('.overall-progress-bar-fill').forEach(el => {
            el.style.width = \`\${progressPct}%\`;
        });

        document.querySelectorAll('.overall-progress-text').forEach(el => {
            el.textContent = \`\${completedLevels} / \${totalLevels} (\${progressPct}%)\`;
        });
    }`;

const newProg = `    updateProgressSummary() {
        if (!window.StorageManager) return;
        const totalLevels = 4;
        const tasks = StorageManager.data.individualTasks || {};
        let completedCount = 0;
        for (let i = 1; i <= 4; i++) {
            if (tasks[i] && tasks[i].isSubmitted) {
                completedCount++;
            }
        }
        const progressPct = Math.round((completedCount / totalLevels) * 100);

        document.querySelectorAll('.overall-progress-bar-fill').forEach(el => {
            el.style.width = \`\${progressPct}%\`;
        });

        document.querySelectorAll('.overall-progress-text').forEach(el => {
            el.textContent = \`\${completedCount} / \${totalLevels} Level Selesai (\${progressPct}%)\`;
        });
    }`;

if (!playerJs.includes(oldProg)) {
  console.error('oldProg not found!');
  process.exit(1);
}
playerJs = playerJs.replace(oldProg, newProg);

fs.writeFileSync('js/player.js', playerJs, 'utf8');
console.log('Successfully updated js/player.js!');

