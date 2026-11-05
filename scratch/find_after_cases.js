const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const eIdx = 56795;
console.log(appJs.substring(eIdx - 50, eIdx + 400));

