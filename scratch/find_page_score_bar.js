const fs = require('fs');

['css/academic-theme.css', 'css/learning.css', 'css/responsive.css'].forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  const lines = css.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('page-score-action-bar') || l.includes('btn-save-score') || l.includes('btn-next-level-nav')) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
