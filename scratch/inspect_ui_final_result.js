const fs = require('fs');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');

const start = uiJs.indexOf('renderFinalResult() {');
const end = uiJs.indexOf('// ----------------------------------------------------', start + 100);
console.log(uiJs.substring(start, end));

