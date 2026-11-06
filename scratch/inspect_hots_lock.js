const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const sIdx = app.indexOf('renderGroupHOTSQuestions() {');
console.log(app.substring(sIdx, sIdx + 1500));

