const fs = require('fs');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');

const sIdx = uiJs.indexOf('switchScreen(');
console.log(uiJs.substring(sIdx, sIdx + 1500));

