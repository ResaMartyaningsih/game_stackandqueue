const fs = require('fs');
const uiJs = fs.readFileSync('js/ui.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

console.log('=== renderFinalResult in js/ui.js ===');
console.log(uiJs.substring(21500, 25500));

console.log('\n=== screen-result in index.html ===');
const resIdx = html.indexOf('id="screen-result"');
console.log(html.substring(resIdx, resIdx + 3000));

