const fs = require('fs');

const appJs = fs.readFileSync('js/app.js', 'utf8');
const scoringJs = fs.readFileSync('js/scoring.js', 'utf8');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== APP.JS SIMULATION / MINILAB / LEARN SCORE FUNCTIONS ===');
const regexApp = /(function\s+[a-zA-Z0-9_]+|[a-zA-Z0-9_]+\s*:\s*function|\b(saveLearnScore|runInteractiveStack|runInteractiveQueue|miniLab|simulasi)\b[^\n]*)/gi;
let m;
['saveLearnScore', 'miniLab', 'simulasi', 'stackSim', 'queueSim'].forEach(term => {
  let idx = 0;
  while ((idx = appJs.indexOf(term, idx)) !== -1) {
    console.log(`appJs match "${term}" around ${idx}:`, appJs.substring(Math.max(0, idx - 50), Math.min(appJs.length, idx + 100)).replace(/\n/g, ' '));
    idx += term.length;
    if (idx > appJs.length) break;
  }
});

console.log('\n=== SCORING.JS CONTENT ===');
console.log(scoringJs);

console.log('\n=== PBL-ACADEMIC.JS SCORE / MINILAB REFERENCES ===');
['miniLab', 'simulasi', 'Praktik Simulasi', 'Mini-Lab', 'Tantangan Individu'].forEach(term => {
  let idx = 0;
  while ((idx = pblJs.indexOf(term, idx)) !== -1) {
    console.log(`pblJs match "${term}" around ${idx}:`, pblJs.substring(Math.max(0, idx - 50), Math.min(pblJs.length, idx + 100)).replace(/\n/g, ' '));
    idx += term.length;
    if (idx > pblJs.length) break;
  }
});

