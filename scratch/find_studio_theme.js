const fs = require('fs');

const css = fs.readFileSync('css/academic-theme.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.studio-section') || l.includes('.hero-editorial-title') || l.includes('.studio-corner-decor')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
