const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('getSimulationButtonsHTML(caseId) {');
const eIdx = appJs.indexOf('renderCaseSimulationLog() {', sIdx);
console.log('Simulation block length:', eIdx - sIdx);
console.log(appJs.substring(sIdx, sIdx + 1200));

