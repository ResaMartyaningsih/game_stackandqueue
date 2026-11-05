const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('Pengingat Manajemen Waktu Pembelajaran');
console.log(html.substring(idx - 50, idx + 1500));

