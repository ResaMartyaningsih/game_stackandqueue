const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('buildGroupLKPDHTML');
console.log(appJs.substring(idx, idx + 2500));

