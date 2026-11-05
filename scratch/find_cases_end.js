const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('groupProjectState: {');
const casesIdx = appJs.indexOf('cases: {', sIdx);
// Find hotsAnswers or worksheet or simState
const simIdx = appJs.indexOf('simState:', casesIdx);
console.log('cases length:', simIdx - casesIdx);
console.log(appJs.substring(simIdx - 100, simIdx + 300));

