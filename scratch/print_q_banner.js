const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('Nilai Materi Belajar Queue');
console.log(JSON.stringify(html.substring(idx - 100, idx + 750)));

