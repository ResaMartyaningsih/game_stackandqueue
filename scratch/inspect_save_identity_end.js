const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('saveGroupIdentity() {');
console.log(appJs.substring(sIdx + 2200, sIdx + 4000));

