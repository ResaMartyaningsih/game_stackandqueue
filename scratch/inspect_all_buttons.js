const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const btnMatches = [];
lines.forEach((l, i) => {
  if (/<button/i.test(l)) {
    btnMatches.push({ line: i + 1, text: l.trim() });
  }
});

console.log('Total buttons found in index.html:', btnMatches.length);
// Find buttons with style containing width
btnMatches.forEach(b => {
  if (/style="[^"]*width/i.test(b.text)) {
    console.log(`L${b.line}: ${b.text}`);
  }
});
