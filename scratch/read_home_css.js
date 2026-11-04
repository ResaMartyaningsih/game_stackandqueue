const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');
const lines = css.split('\n');
console.log(lines.slice(2250, 2350).join('\n'));

