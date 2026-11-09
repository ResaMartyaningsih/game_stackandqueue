const fs = require('fs');

const css = fs.readFileSync('css/responsive.css', 'utf8');

// Check braces balance
let openCount = 0;
for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openCount++;
  if (css[i] === '}') openCount--;
  if (openCount < 0) {
    console.error('Negative brace balance at char ' + i);
    break;
  }
}
console.log('Braces balance (should be 0):', openCount);

// Check occurrences of width: 100%
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('button') && l.includes('width: 100%')) {
    console.log('Warning line ' + (i+1) + ': ' + l.trim());
  }
});
