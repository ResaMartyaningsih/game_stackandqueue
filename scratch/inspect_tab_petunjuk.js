const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('data-pane="tab-petunjuk"');
console.log(html.substring(sIdx, sIdx + 2500));

