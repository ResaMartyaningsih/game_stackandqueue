const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('groupProjectState: {');
const eIdx = appJs.indexOf('hotsAnswers: {},', sIdx);
console.log('Snippet around eIdx:');
console.log(appJs.substring(eIdx - 200, eIdx + 200));

