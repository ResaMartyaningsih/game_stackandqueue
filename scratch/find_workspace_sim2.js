const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const idx = 79721;
console.log(appJs.substring(idx + 500, idx + 3500));

