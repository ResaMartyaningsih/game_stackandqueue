const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<div style="background: #F0FDF4; border-left: 4px solid #10b981;');
const eIdx = html.indexOf('</table>', sIdx) + 8;
console.log('Snippet to replace:');
console.log(html.substring(sIdx, eIdx));

