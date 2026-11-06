const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const rIdx = app.indexOf('renderGroupProjectUI() {');
console.log('--- renderGroupProjectUI definition ---');
console.log(app.substring(rIdx, rIdx + 1200));

const initIdx = app.indexOf('initGroupProject() {');
console.log('\n--- initGroupProject definition ---');
console.log(app.substring(initIdx, initIdx + 1200));

