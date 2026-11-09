const fs = require('fs');
const css = fs.readFileSync('css/responsive.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.startsWith('/*') && (l.includes('---') || l.includes('==='))) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
