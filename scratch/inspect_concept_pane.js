const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-learn-stack"');
const paneIdx = html.indexOf('id="stack-tab-concept"', sIdx);
console.log(html.substring(paneIdx, paneIdx + 1200));

