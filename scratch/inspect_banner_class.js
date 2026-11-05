const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const qIdx = html.indexOf('Nilai Materi Belajar Queue');
console.log('qIdx:', qIdx);
console.log('500 chars before qIdx:');
console.log(html.substring(qIdx - 500, qIdx));
console.log('500 chars after qIdx:');
console.log(html.substring(qIdx, qIdx + 500));

