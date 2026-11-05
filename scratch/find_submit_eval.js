const fs = require('fs');
const code = fs.readFileSync('js/pbl-academic.js', 'utf8');

const idx = code.indexOf('submitEvaluation() {');
console.log(code.substring(idx, idx + 1800));

