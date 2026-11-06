const fs = require('fs');
const ui = fs.readFileSync('js/ui.js', 'utf8');

const sIdx = ui.indexOf('renderFinalResult() {');
const eIdx = ui.indexOf('// ----------------------------------------------------', sIdx + 100);
console.log(ui.substring(sIdx, eIdx));

