const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tIdx = html.indexOf('toast-container');
console.log('toast-container around index:', tIdx);
console.log(html.substring(tIdx - 100, tIdx + 200));

