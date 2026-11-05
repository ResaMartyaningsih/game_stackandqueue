const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('<form id="evaluation-form"');
const eIdx = html.indexOf('</form>', sIdx) + 7;
console.log('Start:', sIdx, 'End:', eIdx, 'Length:', eIdx - sIdx);
console.log(html.substring(sIdx, sIdx + 400));
console.log('--- End snippet ---');
console.log(html.substring(eIdx - 200, eIdx));

