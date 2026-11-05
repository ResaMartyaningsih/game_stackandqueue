const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('renderGroupMembersList() {');
console.log(appJs.substring(idx + 1000, idx + 2500));

