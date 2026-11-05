const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('Level 2 (Simulator Stack)');
console.log('Snippet around Level 2 (Simulator Stack):');
console.log(JSON.stringify(html.substring(idx - 250, idx + 100)));

