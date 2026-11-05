const fs = require('fs');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

const lvl4Idx = pblJs.indexOf('level: 4');
console.log(pblJs.substring(lvl4Idx, lvl4Idx + 1500));

