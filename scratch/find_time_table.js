const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

let pos = 0;
while ((pos = html.indexOf('Tugas Individu', pos)) !== -1) {
  console.log('Match at', pos, ':', html.substring(Math.max(0, pos - 100), Math.min(html.length, pos + 250)).replace(/\n/g, ' '));
  pos += 14;
}

console.log('\n--- SEARCHING FOR "6 level" OR "Tabel Manajemen" ---');
['6 Level', '6 level', '6 Tantangan', 'Manajemen Waktu', 'Alokasi Waktu', 'Jadwal Aktivitas'].forEach(t => {
  let p = 0;
  while ((p = html.indexOf(t, p)) !== -1) {
    console.log(`Found "${t}" at ${p}:`, html.substring(Math.max(0, p - 60), Math.min(html.length, p + 200)).replace(/\n/g, ' '));
    p += t.length;
    if (p > html.length) break;
  }
});

