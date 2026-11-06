const fs = require('fs');
const pbl = fs.readFileSync('js/pbl-academic.js', 'utf8');

const s = pbl.indexOf('renderTaskLevel(lvl) {');
console.log(pbl.substring(s + 1200, s + 4200));

