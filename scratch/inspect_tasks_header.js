const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('id="screen-individual-tasks"');
console.log(html.substring(sIdx, sIdx + 700));

