const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="screen-achievements"');
console.log(html.substring(idx, idx + 500));

