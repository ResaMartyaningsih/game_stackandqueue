const fs = require('fs');
const css = fs.readFileSync('css/responsive.css', 'utf8');
const lines = css.split('\n');
lines.forEach((l, i) => {
  if (l.includes('@media')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
