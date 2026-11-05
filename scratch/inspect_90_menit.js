const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let p = 0;
while ((p = html.indexOf('90 Menit', p)) !== -1) {
  console.log('90 Menit at', p, ':', html.substring(Math.max(0, p - 60), Math.min(html.length, p + 100)).replace(/\n/g, ' '));
  p += 8;
}

let p2 = 0;
while ((p2 = html.indexOf('studi kasus', p2)) !== -1) {
  console.log('studi kasus at', p2, ':', html.substring(Math.max(0, p2 - 60), Math.min(html.length, p2 + 100)).replace(/\n/g, ' '));
  p2 += 11;
}

