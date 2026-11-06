const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const s = app.indexOf('groupProjectState: {');
console.log('--- groupProjectState ---');
console.log(app.substring(s, s + 1500));

const hots = app.indexOf('renderGroupHOTSQuestions()');
console.log('\n--- renderGroupHOTSQuestions ---');
console.log(app.substring(hots, hots + 2500));

