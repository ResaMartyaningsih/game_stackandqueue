const fs = require('fs');
const appJs = fs.readFileSync('js/app.js', 'utf8');

const sIdx = appJs.indexOf('groupProjectState: {');
console.log(appJs.substring(sIdx, sIdx + 500));

