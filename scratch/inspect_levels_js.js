const fs = require('fs');
const levelsJs = fs.readFileSync('js/levels.js', 'utf8');
console.log('levels.js lines:', levelsJs.split('\n').length);
console.log(levelsJs.split('\n').slice(0, 50).join('\n'));

