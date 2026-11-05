const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const gIdx = html.indexOf('Glosarium');
console.log('Glosarium idx:', gIdx);
if (gIdx !== -1) {
  console.log(html.substring(gIdx - 50, gIdx + 2000));
}

