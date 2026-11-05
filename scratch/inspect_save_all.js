const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('saveGroupIdentity() {');
const eIdx = appJs.indexOf('downloadGroupWord()');
console.log('Snippet length:', eIdx - sIdx);
console.log(appJs.substring(sIdx, sIdx + 1200));
console.log('--- Middle snippet ---');
console.log(appJs.substring(sIdx + 1200, sIdx + 2400));

