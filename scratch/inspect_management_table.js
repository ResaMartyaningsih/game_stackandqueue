const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const startIdx = html.indexOf('Alur &amp; Manajemen Waktu Pembelajaran PBL 2 JP');
console.log(html.substring(startIdx, startIdx + 4000));

