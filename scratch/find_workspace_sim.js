const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupCaseWorkspace()');
console.log(appJs.substring(idx + 1200, idx + 3200));

