const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-learn-stack"');
const paneIdx = html.indexOf('data-tab-pane="concept"', sIdx);
console.log(html.substring(paneIdx, paneIdx + 800));

