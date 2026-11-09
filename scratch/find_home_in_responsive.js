const fs = require('fs');
const css = fs.readFileSync('css/responsive.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('hero-') || l.includes('studio-') || l.includes('screen-home') || l.includes('problem-')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
