const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Dropdown
html = html.replace(
    '<span class="item-desc">4 Level Analisis Berjenjang (90 Menit)</span>',
    '<span class="item-desc">4 Level Analisis Inti (15 Menit)</span>'
);

// 2. Tasks header
html = html.replace(
    'Selesaikan 4 level tugas terfokus secara berurutan. Tingkat kesulitan meningkat bertahap dari pemahaman konsep, simulasi antrean kasir &amp; piring, hingga tracing dan rekayasa urutan untuk alokasi 90 menit (2 JP).',
    'Selesaikan 4 level tugas inti bertingkat secara mandiri (Alokasi: 15 Menit). Tingkat kesulitan bertahap dari pemahaman konsep, simulasi kasir &amp; piring, hingga tracing dan rekayasa urutan operasi.'
);

// 3. Evaluation header
html = html.replace(
    '<span>📝</span> Evaluasi Akhir: Asesmen Sumatif (90 Menit)',
    '<span>📝</span> Evaluasi Akhir: Asesmen Sumatif (5 Menit)'
);

html = html.replace(
    'Uji pemahaman komprehensifmu terhadap struktur data Stack dan Queue melalui 5 butir soal analisis HOTS berbasis kasus nyata kantin sekolah. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) minimal adalah 75.',
    'Uji pemahaman komprehensifmu terhadap struktur data Stack dan Queue melalui 5 butir soal analisis HOTS berbasis kasus nyata kantin sekolah (Alokasi: 5 Menit). Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) minimal adalah 75 / 100.'
);

// 4. LKPD Hero description
html = html.replace(
    '<div class="gp-hero-badge">👥 Lembar Kerja Kolaboratif Kelompok</div>',
    '<div class="gp-hero-badge">👥 Lembar Kerja Kolaboratif Kelompok &bull; ⏱ 20 Menit &bull; 6 Anggota per Kelompok</div>'
);

// 5. Update Guidelines time table
const oldRundown = `⏱ Pengingat Manajemen Waktu Pembelajaran 2 JP (90 Menit):</h4>`;
if (html.includes(oldRundown)) {
    console.log('Found old rundown in guidelines');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated durations in index.html');

