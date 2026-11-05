const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = 59087;
console.log(appJs.substring(idx - 50, idx + 800));

