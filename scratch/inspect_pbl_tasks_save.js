const fs = require('fs');
const pblJs = fs.readFileSync('js/pbl-academic.js', 'utf8');

console.log(pblJs.substring(13500, 16500));

