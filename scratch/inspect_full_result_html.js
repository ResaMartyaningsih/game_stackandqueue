const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const resIdx = html.indexOf('id="screen-result"');
const endResIdx = html.indexOf('</section>', resIdx);
console.log(html.substring(resIdx, endResIdx + 10));

