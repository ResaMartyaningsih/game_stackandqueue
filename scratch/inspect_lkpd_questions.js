const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

const hotsDef = app.indexOf('renderGroupHOTSQuestions() {');
console.log('--- renderGroupHOTSQuestions definition ---');
console.log(app.substring(hotsDef, hotsDef + 3000));

const saveProj = app.indexOf('saveGroupProject() {');
console.log('\n--- saveGroupProject definition ---');
console.log(app.substring(saveProj, saveProj + 2000));

