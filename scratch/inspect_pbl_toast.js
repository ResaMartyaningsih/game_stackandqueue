const fs = require('fs');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

const tIdx = pblJs.indexOf('Seluruh 6 Level');
console.log(pblJs.substring(tIdx - 100, tIdx + 300));

