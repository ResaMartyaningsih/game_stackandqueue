const fs = require('fs');

['index.html', 'js/pbl-academic.js', 'js/ui.js', 'js/app.js'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/.{0,40}(?:6\s*level|6\s*Level|enam\s*level).{0,40}/gi);
  if (matches) {
    console.log(`=== Matches in ${file} ===`);
    matches.forEach(m => console.log('  ...', m.trim().replace(/\n/g, ' '), '...'));
  }
});

