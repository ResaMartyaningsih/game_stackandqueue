const fs = require('fs');

['js/ui.js', 'js/app.js', 'js/pbl-academic.js', 'js/scoring.js'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf('renderFinalResult', idx)) !== -1) {
    console.log(`${file} at ${idx}:`, content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 200)).replace(/\n/g, ' '));
    idx += 17;
  }
});

