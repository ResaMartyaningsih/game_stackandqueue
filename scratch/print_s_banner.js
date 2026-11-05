const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('Nilai Materi Belajar Stack');
console.log('Stack banner:');
console.log(JSON.stringify(html.substring(sIdx - 100, sIdx + 750)));

