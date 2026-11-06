const fs = require('fs');
const pbl = fs.readFileSync('js/pbl-academic.js', 'utf8');

const sIdx = pbl.indexOf('renderTaskLevel(lvl) {');
const eIdx = pbl.indexOf('// ----------------------------------------------------', sIdx + 100);
console.log(pbl.substring(sIdx, eIdx));

