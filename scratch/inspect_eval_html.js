const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="screen-evaluation"');
const endIdx = html.indexOf('</section>', idx);
console.log(html.substring(idx, endIdx + 10));

