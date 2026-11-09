const fs = require('fs');

['js/app.js', 'js/ui.js'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('saveLearnScore') || l.includes('Simulator Stack') || l.includes('membuka level')) {
      console.log(`${f}:${i+1}: ${l.trim()}`);
    }
  });
});
