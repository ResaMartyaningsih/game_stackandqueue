const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="screen-group-project"');
const endIdx = html.indexOf('</section>', idx);
const content = html.substring(idx, endIdx);

const btnMatches = content.match(/<button[^>]*>[^<]*<\/button>/gi) || [];
console.log('Buttons in LKPD:');
btnMatches.forEach(b => console.log(b));

