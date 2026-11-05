const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('saveGroupIdentity() {');
console.log(appJs.substring(idx, idx + 1500));

