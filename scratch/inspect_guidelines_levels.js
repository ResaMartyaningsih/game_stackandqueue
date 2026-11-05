const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const gStart = html.indexOf('id="screen-guidelines"');
const gEnd = html.indexOf('id="screen-group-project"');
const gText = html.substring(gStart, gEnd);

const matches = gText.match(/.{0,50}(?:level|Level).{0,50}/g);
console.log('Matches in screen-guidelines:');
if (matches) {
  matches.forEach(m => console.log('  ...', m.trim().replace(/\n/g, ' '), '...'));
}

