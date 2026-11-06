const fs = require('fs');
const pbl = fs.readFileSync('js/pbl-academic.js', 'utf8');

const start = pbl.indexOf('individualTasks: [');
const end = pbl.indexOf('// ----------------------------------------------------', start + 100);
console.log(pbl.substring(start, end));

const renderTaskStart = pbl.indexOf('renderTaskLevel(');
console.log('\n--- renderTaskLevel to saveTaskResult ---');
console.log(pbl.substring(renderTaskStart, renderTaskStart + 4000));

