const fs = require('fs');

['index.html', 'js/app.js', 'js/ui.js', 'js/learning.js', 'js/levels.js', 'js/translations.js'].forEach(f => {
  if (fs.existsSync(f)) {
    const txt = fs.readFileSync(f, 'utf8');
    if (txt.includes('Berpikir Komputasional')) {
      console.log('Contains in', f);
      // find line numbers
      txt.split('\n').forEach((l, i) => {
        if (l.includes('Berpikir Komputasional') || l.includes('Dekomposisi') || l.includes('Pengenalan Pola')) {
          console.log(`  ${f}:${i+1}: ${l.trim().substring(0, 100)}`);
        }
      });
    }
  }
});
