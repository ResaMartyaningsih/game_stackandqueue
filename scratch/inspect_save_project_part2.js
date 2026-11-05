const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('saveGroupProject(showFeedback = true) {');
console.log(appJs.substring(sIdx + 1200, sIdx + 2600));

