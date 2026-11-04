const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="screen-learn-stack"');
console.log(html.substring(idx, idx + 1500));

