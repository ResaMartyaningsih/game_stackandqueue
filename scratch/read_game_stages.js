const fs = require('fs');
const css = fs.readFileSync('css/game.css', 'utf8');
console.log(css.split('\n').slice(50, 150).join('\n'));

