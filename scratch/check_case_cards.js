const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="screen-group-project"');
const endIdx = html.indexOf('</section>', idx);
const content = html.substring(idx, endIdx);

const cardMatches = content.match(/<div[^>]*class=["'][^"']*case[^"']*["'][^>]*>/gi) || [];
console.log('Case cards in LKPD:', cardMatches);

