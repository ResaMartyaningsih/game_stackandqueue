const fs = require('fs');
const css = fs.readFileSync('css/responsive.css', 'utf8');
const lines = css.split('\n');
console.log('Total lines:', lines.length);
// print first 50 lines
console.log('--- Lines 1-50 ---');
console.log(lines.slice(0, 50).join('\n'));
