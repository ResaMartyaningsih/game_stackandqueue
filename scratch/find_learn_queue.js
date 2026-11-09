const fs = require('fs');

function search(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'backup-awal' && f !== 'scratch') search(full);
    } else {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('learn-queue') || txt.includes('Berpikir Komputasional pada Stack/Queue')) {
        console.log('Found in', full);
      }
    }
  }
}
search('.');
