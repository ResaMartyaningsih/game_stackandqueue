const fs = require('fs');
const levelsJs = fs.readFileSync('js/levels.js', 'utf8');
console.log(levelsJs.split('\n').slice(50, 150).join('\n'));

