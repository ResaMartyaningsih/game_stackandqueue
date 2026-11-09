const fs = require('fs');

['js/app.js', 'js/ui.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('showLevelCompleteModal') || l.includes('stack-sim') || l.includes('queue-sim')) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
