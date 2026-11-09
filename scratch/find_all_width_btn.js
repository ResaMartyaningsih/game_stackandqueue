const fs = require('fs');

const files = ['css/academic-theme.css', 'css/learning.css', 'css/style.css'];
files.forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  const lines = css.split('\n');
  lines.forEach((l, i) => {
    if ((l.includes('width: 100%') || l.includes('width:100%')) && (l.includes('btn') || l.includes('button'))) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
