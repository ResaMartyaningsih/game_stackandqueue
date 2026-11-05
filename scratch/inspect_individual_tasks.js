const fs = require('fs');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

console.log('=== SEARCHING INDIVIDUAL TASKS in pbl-academic.js ===');
let idx = 0;
while ((idx = pblJs.indexOf('individualTasks', idx)) !== -1) {
  console.log('Match at', idx, pblJs.substring(idx, idx + 250).replace(/\n/g, ' '));
  idx += 15;
}

['saveTask', 'submitTask', 'taskScore', 'PBLManager'].forEach(term => {
  let p = 0;
  while ((p = pblJs.indexOf(term, p)) !== -1) {
    console.log(`pblJs match "${term}" at ${p}:`, pblJs.substring(Math.max(0, p - 30), Math.min(pblJs.length, p + 150)).replace(/\n/g, ' '));
    p += term.length;
    if (p > pblJs.length) break;
  }
});

