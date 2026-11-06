const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('screen-guidelines');
const gSnippet = html.substring(sIdx, sIdx + 15000);

let pos = 0;
while ((pos = gSnippet.indexOf('Bobot', pos)) !== -1) {
  console.log('Bobot in guidelines at', pos, ':', gSnippet.substring(Math.max(0, pos - 50), Math.min(gSnippet.length, pos + 150)).replace(/\n/g, ' '));
  pos += 5;
}

while ((pos = html.indexOf('Bobot:', pos)) !== -1) {
  console.log('Bobot: in html at', pos, ':', html.substring(Math.max(0, pos - 50), Math.min(html.length, pos + 150)).replace(/\n/g, ' '));
  pos += 6;
}

