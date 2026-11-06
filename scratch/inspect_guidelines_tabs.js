const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-guidelines"');
const eIdx = html.indexOf('id="screen-group-project"');
console.log(html.substring(sIdx, sIdx + 2000));

