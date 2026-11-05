const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const sIdx = html.indexOf('4 Operasi Dasar pada Struktur Data Stack:');
console.log('--- Stack 4 Operations snippet ---');
console.log(html.substring(sIdx, sIdx + 2000));

const qIdx = html.indexOf('4 Operasi Dasar pada Struktur Data Queue:');
console.log('--- Queue 4 Operations snippet ---');
console.log(html.substring(qIdx, qIdx + 2000));

