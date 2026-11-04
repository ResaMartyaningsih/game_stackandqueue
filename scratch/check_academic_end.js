const fs = require('fs');
const css = fs.readFileSync('css/academic-theme.css', 'utf8');
console.log('Lines:', css.split('\n').length);
console.log('Last 10 lines:');
console.log(css.split('\n').slice(-10).join('\n'));

