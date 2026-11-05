const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const gIdx = html.indexOf('data-pane="tab-glosarium"');
console.log('tab-glosarium snippet:');
console.log(html.substring(gIdx, gIdx + 3000));

