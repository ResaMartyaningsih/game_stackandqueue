const fs = require('fs');
const storageJs = fs.readFileSync('js/storage.js', 'utf8');
const appJs = fs.readFileSync('js/app.js', 'utf8');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

console.log('=== STORAGE KEYS & METHODS in storage.js ===');
console.log(storageJs.substring(0, 3000));

console.log('\n=== PBL INDIVIDUAL TASKS SCORING in pbl-academic.js ===');
let match;
const regex = /(taskScores|score|saveTask|completeTask|evaluate|saveGroupProject|evalScore)[^\n]*/gi;
while ((match = regex.exec(pblJs)) !== null) {
  if (match.index > 50000 && match.index < 85000) {
    console.log(`Line around ${match.index}:`, match[0]);
  }
}

console.log('\n=== RENDER FINAL RESULT in ui.js ===');
const rfIdx = uiJs.indexOf('renderFinalResult');
console.log(uiJs.substring(rfIdx, rfIdx + 2000));

