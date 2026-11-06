const fs = require('fs');
const app = fs.readFileSync('js/app.js', 'utf8');

let idx = 0;
while ((idx = app.indexOf('saveGroupProject', idx)) !== -1) {
  console.log('Match at', idx, ':', app.substring(idx - 30, idx + 100).replace(/\n/g, ' '));
  idx += 16;
}

