const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const achIdx = html.indexOf('screen-achievements');
console.log('achievements in index.html:');
let pos = 0;
while ((pos = html.indexOf('screen-achievements', pos)) !== -1) {
  console.log('  at', pos, ':', html.substring(Math.max(0, pos - 40), Math.min(html.length, pos + 100)).replace(/\n/g, ' '));
  pos += 19;
}

