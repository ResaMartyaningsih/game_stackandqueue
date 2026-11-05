const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<form id="evaluation-form"');
const eIdx = html.indexOf('</form>', sIdx);
console.log(html.substring(sIdx, eIdx + 7));

