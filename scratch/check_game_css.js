const fs = require('fs');
const css = fs.readFileSync('css/game.css', 'utf8');
console.log('game.css lines:', css.split('\n').length);
console.log(css.split('\n').slice(0, 50).join('\n'));

