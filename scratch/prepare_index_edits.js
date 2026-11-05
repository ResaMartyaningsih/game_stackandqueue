const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function checkAnchor(name, str) {
  const idx = html.indexOf(str);
  console.log(`Anchor [${name}]: ${idx !== -1 ? 'FOUND at ' + idx : 'NOT FOUND'}`);
  return idx;
}

checkAnchor('Navbar 90 Menit', '4 Level Analisis Berjenjang (90 Menit)');
checkAnchor('Stack Operations List End', 'Cek apakah tumpukan kosong sebelum mengambil data untuk mencegah error underflow.');
checkAnchor('Queue Operations List End', 'Cek apakah antrean kosong sebelum melayani untuk mencegah error underflow.');
checkAnchor('Queue Bottom Banner', '▶ Lanjut: Level 2 (Simulator Stack) ➔');
checkAnchor('Screen Stack Sim Start', '<!-- ===================================================================\n             SCREEN 4: INTERACTIVE STACK SIMULATOR');
checkAnchor('Screen Challenge End', '</section>\n\n        <!-- ===================================================================\n             SCREEN 9: ACHIEVEMENTS');
checkAnchor('LKPD Hero 4 Studi Kasus', 'diskusikan salah satu dari 4 studi kasus nyata');
checkAnchor('LKPD Add Member Button', '➕ Tambah Anggota (Maks. 8)');
checkAnchor('Result Breakdown Section', 'Rincian Skor Tiap Level:');

