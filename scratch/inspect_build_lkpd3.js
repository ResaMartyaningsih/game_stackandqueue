const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = appJs.indexOf('buildGroupLKPDHTML');
console.log(appJs.substring(idx + 2400, idx + 4800));

