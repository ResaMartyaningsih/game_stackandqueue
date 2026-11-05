const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('cases: {');
const eIdx = appJs.indexOf('hotsAnswers: {');
console.log('Start index:', sIdx, 'End index:', eIdx);
console.log('Cases block length:', eIdx - sIdx);

