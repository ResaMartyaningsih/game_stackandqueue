const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update Navbar duration
const navTarget = '<span class="item-desc">4 Level Analisis Berjenjang (90 Menit)</span>';
const navRepl = '<span class="item-desc">4 Level Analisis Berjenjang (15 Menit)</span>';
if (!html.includes(navTarget)) {
  console.error('Error: navTarget not found');
  process.exit(1);
}
html = html.replace(navTarget, navRepl);
console.log('1. Updated Navbar duration to 15 Menit');

// 2. Add Stack Overflow & Underflow to screen-learn-stack
const stackOpsEnd = `<div class="method-card">
                                <code>🔍 Cek Status: isEmpty()</code>
                                <p>Memeriksa apakah tumpukan kosong sebelum operasi pengambilan data.</p>
                            </div>
                        </div>`;

const stackOverflowCard = `<div class="method-card">
                                <code>🔍 Cek Status: isEmpty()</code>
                                <p>Memeriksa apakah tumpukan kosong sebelum operasi pengambilan data.</p>
                            </div>
                        </div>

                        <!-- Pembahasan Khusus: Stack Overflow & Stack Underflow (Kondisi Batas) -->
                        <div class="academic-callout-card" style="background: #FFFFFF; border: 2px solid #891A10; border-radius: 14px; padding: 1.35rem 1.5rem; margin: 1.75rem 0; box-shadow: 0 4px 16px rgba(137, 26, 16, 0.08);">
                            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.75rem;">
                                <span style="font-size: 1.5rem;">⚠️</span>
                                <h4 style="color: #891A10; margin: 0; font-size: 1.2rem; font-weight: 800; font-family: 'Syne', sans-serif;">
                                    Kondisi Batas Kritis: Stack Overflow vs. Stack Underflow
                                </h4>
                            </div>
                            <p style="color: #2B1D19; line-height: 1.6; margin-bottom: 1.15rem; font-size: 0.95rem;">
                                Dalam perancangan algoritma dan pemodelan kantin, kapasitas memori penampung memiliki batasan fisik. Dua kondisi batas kritis berikut wajib diantisipasi agar sistem tidak mengalami kegagalan (<em>crash/error</em>):
                            </p>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                                <div style="background: #FAF6ED; border-left: 5px solid #891A10; padding: 1.1rem; border-radius: 10px; border: 1.5px solid #D8D4BC; border-left-width: 5px;">
                                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                                        <span style="font-size: 1.25rem;">💥</span>
                                        <h5 style="color: #891A10; margin: 0; font-size: 1.05rem; font-weight: 800;">1. Stack Overflow (Tumpukan Meluap)</h5>
                                    </div>
                                    <p style="margin: 0; font-size: 0.92rem; color: #2B1D19; line-height: 1.55;">
                                        <strong>Kapan terjadi?</strong> Terjadi saat operasi <code>push()</code> dipanggil untuk menambah data baru, padahal tumpukan <strong>sudah terisi penuh</strong> mencapai batas kapasitas memori maksimum.<br>
                                        <strong>Analogi Kantin:</strong> Dispenser piring saji kafetaria berkapasitas maksimal 5 piring. Jika petugas memaksakan menaruh piring ke-6, tumpukan akan meluap dan piring pecah berhamburan.<br>
                                        <strong>Pencegahan CT:</strong> Selalu cek apakah tumpukan sudah penuh dengan fungsi <code>isFull()</code> sebelum menjalankan <code>push()</code>.
                                    </p>
                                </div>
                                <div style="background: #FAF6ED; border-left: 5px solid #DC8236; padding: 1.1rem; border-radius: 10px; border: 1.5px solid #D8D4BC; border-left-width: 5px;">
                                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                                        <span style="font-size: 1.25rem;">📭</span>
                                        <h5 style="color: #714236; margin: 0; font-size: 1.05rem; font-weight: 800;">2. Stack Underflow (Tumpukan Kosong)</h5>
                                    </div>
                                    <p style="margin: 0; font-size: 0.92rem; color: #2B1D19; line-height: 1.55;">
                                        <strong>Kapan terjadi?</strong> Terjadi saat operasi <code>pop()</code> (mengambil) atau <code>peek()</code> (mengintip) dipanggil pada tumpukan yang <strong>sedang kosong</strong> (tidak ada elemen sama sekali).<br>
                                        <strong>Analogi Kantin:</strong> Siswa mencoba mengambil piring dari rak dispenser kafetaria padahal dispenser piring sedang kosong melompong.<br>
                                        <strong>Pencegahan CT:</strong> Selalu periksa apakah tumpukan kosong menggunakan fungsi logika <code>isEmpty()</code> sebelum melakukan operasi <code>pop()</code>.
                                    </p>
                                </div>
                            </div>
                        </div>`;

if (!html.includes(stackOpsEnd)) {
  console.error('Error: stackOpsEnd not found');
  process.exit(1);
}
html = html.replace(stackOpsEnd, stackOverflowCard);
console.log('2. Added Stack Overflow & Underflow card');

// 3. Add Queue Overflow & Underflow to screen-learn-queue
const queueOpsEnd = `<div class="method-card">
                                <code>🔍 Cek Status: isEmpty()</code>
                                <p>Memeriksa apakah antrean sedang kosong sebelum melakukan proses dequeue.</p>
                            </div>
                        </div>`;

const queueOverflowCard = `<div class="method-card">
                                <code>🔍 Cek Status: isEmpty()</code>
                                <p>Memeriksa apakah antrean sedang kosong sebelum melakukan proses dequeue.</p>
                            </div>
                        </div>

                        <!-- Pembahasan Khusus: Queue Overflow & Queue Underflow (Kondisi Batas) -->
                        <div class="academic-callout-card" style="background: #FFFFFF; border: 2px solid #891A10; border-radius: 14px; padding: 1.35rem 1.5rem; margin: 1.75rem 0; box-shadow: 0 4px 16px rgba(137, 26, 16, 0.08);">
                            <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.75rem;">
                                <span style="font-size: 1.5rem;">⚠️</span>
                                <h4 style="color: #891A10; margin: 0; font-size: 1.2rem; font-weight: 800; font-family: 'Syne', sans-serif;">
                                    Kondisi Batas Kritis: Queue Overflow vs. Queue Underflow
                                </h4>
                            </div>
                            <p style="color: #2B1D19; line-height: 1.6; margin-bottom: 1.15rem; font-size: 0.95rem;">
                                Struktur data Queue juga memiliki ruang antrean (buffer memori) dengan batasan kuota tertentu. Antisipasi dua kondisi batas berikut sangat penting dalam rekayasa sistem antrean:
                            </p>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                                <div style="background: #FAF6ED; border-left: 5px solid #891A10; padding: 1.1rem; border-radius: 10px; border: 1.5px solid #D8D4BC; border-left-width: 5px;">
                                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                                        <span style="font-size: 1.25rem;">💥</span>
                                        <h5 style="color: #891A10; margin: 0; font-size: 1.05rem; font-weight: 800;">1. Queue Overflow (Antrean Penuh)</h5>
                                    </div>
                                    <p style="margin: 0; font-size: 0.92rem; color: #2B1D19; line-height: 1.55;">
                                        <strong>Kapan terjadi?</strong> Terjadi saat operasi <code>enqueue()</code> dipanggil untuk memasukkan elemen baru ke posisi REAR, namun ruang antrean <strong>sudah terisi maksimal</strong>.<br>
                                        <strong>Analogi Kantin:</strong> Jalur tali pembatas antrean kasir kantin hanya muat untuk 5 orang. Jika siswa ke-6 mencoba masuk, pintu antrean ditutup sementara (antrean penuh).<br>
                                        <strong>Pencegahan CT:</strong> Verifikasi kapasitas antrean menggunakan fungsi <code>isFull()</code> sebelum mengizinkan proses <code>enqueue()</code>.
                                    </p>
                                </div>
                                <div style="background: #FAF6ED; border-left: 5px solid #DC8236; padding: 1.1rem; border-radius: 10px; border: 1.5px solid #D8D4BC; border-left-width: 5px;">
                                    <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                                        <span style="font-size: 1.25rem;">📭</span>
                                        <h5 style="color: #714236; margin: 0; font-size: 1.05rem; font-weight: 800;">2. Queue Underflow (Antrean Kosong)</h5>
                                    </div>
                                    <p style="margin: 0; font-size: 0.92rem; color: #2B1D19; line-height: 1.55;">
                                        <strong>Kapan terjadi?</strong> Terjadi saat operasi <code>dequeue()</code> (melayani/mengeluarkan) atau <code>front()</code> dipanggil pada antrean yang <strong>sedang kosong</strong> tanpa pelanggan.<br>
                                        <strong>Analogi Kantin:</strong> Petugas kasir memanggil nomor antrean berikutnya padahal lorong antrean sedang kosong melompong (tidak ada siswa yang dilayani).<br>
                                        <strong>Pencegahan CT:</strong> Lakukan pengecekan status antrean menggunakan fungsi <code>isEmpty()</code> sebelum mengeksekusi operasi <code>dequeue()</code>.
                                    </p>
                                </div>
                            </div>
                        </div>`;

if (!html.includes(queueOpsEnd)) {
  console.error('Error: queueOpsEnd not found');
  process.exit(1);
}
html = html.replace(queueOpsEnd, queueOverflowCard);
console.log('3. Added Queue Overflow & Underflow card');

// 4. Update Queue Bottom Banner (The one in user screenshot)
const qBannerIdx = html.indexOf('Nilai Materi Belajar Queue');
const qBannerStart = html.lastIndexOf('<div class="learn-score-banner-academic"', qBannerIdx);
const qBannerEnd = html.indexOf('</div>', html.indexOf('Level 2 (Simulator Stack)', qBannerIdx)) + 6;
// let's grab the full banner container
const qBannerOld = html.substring(qBannerStart, html.indexOf('</div>\n                    </div>\n\n                    </div>\n                    <!-- End of Tab Pane 4', qBannerStart) + 13);

const qBannerNew = `<div class="learn-score-banner-academic" style="margin-top: 2rem; background: #2B1D19; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border: 1.5px solid #714236;">
                        <div class="score-banner-left" style="display: flex; align-items: center; gap: 1rem;">
                            <span class="score-trophy-icon" style="font-size: 2rem;">📝</span>
                            <div>
                                <h4 style="margin: 0; color: #FAF6ED; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800;">Kuis Formatif Materi Queue</h4>
                                <p style="margin: 0.25rem 0 0 0; color: #D8D4BC; font-size: 0.9rem;">Skor Terkini: <strong id="queue-live-page-score" style="color: #E76814;">0 pts</strong>. Asesmen formatif sebagai umpan balik pemahaman konsep Queue!</p>
                            </div>
                        </div>
                        <div class="score-actions-right" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <button class="btn-save-score" onclick="App.saveLearnScore('queue')" style="background: #E76814; color: #FFFFFF; font-weight: 700; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; cursor: pointer;">
                                💾 Simpan Kuis Formatif Queue
                            </button>
                            <button class="btn-next-level-nav" onclick="UI.switchScreen('individual-tasks')" style="background: #10b981; color: #FFFFFF; font-weight: 700; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; cursor: pointer;">
                                🎯 Lanjut ke Tugas Individu (4 Level) ➔
                            </button>
                        </div>
                    </div>`;

const qTargetAnchor = html.substring(qBannerStart, html.indexOf('▶ Lanjut: Level 2 (Simulator Stack) ➔', qBannerStart) + 120);
console.log('qTargetAnchor length:', qTargetAnchor.length);
html = html.replace(qTargetAnchor, qBannerNew + '\n                    </div>');
console.log('4. Updated Queue bottom banner navigation');

// 5. Update Stack bottom banner
const sBannerIdx = html.indexOf('Nilai Materi Belajar Stack');
if (sBannerIdx !== -1) {
  const sBannerStart = html.lastIndexOf('<div class="learn-score-banner-academic"', sBannerIdx);
  const sTargetAnchor = html.substring(sBannerStart, html.indexOf('▶ Lanjut: Belajar Queue ➔', sBannerStart) + 100);
  const sBannerNew = `<div class="learn-score-banner-academic" style="margin-top: 2rem; background: #2B1D19; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border: 1.5px solid #714236;">
                        <div class="score-banner-left" style="display: flex; align-items: center; gap: 1rem;">
                            <span class="score-trophy-icon" style="font-size: 2rem;">📝</span>
                            <div>
                                <h4 style="margin: 0; color: #FAF6ED; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800;">Kuis Formatif Materi Stack</h4>
                                <p style="margin: 0.25rem 0 0 0; color: #D8D4BC; font-size: 0.9rem;">Skor Terkini: <strong id="stack-live-page-score" style="color: #E76814;">0 pts</strong>. Asesmen formatif sebagai umpan balik pemahaman konsep Stack!</p>
                            </div>
                        </div>
                        <div class="score-actions-right" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <button class="btn-save-score" onclick="App.saveLearnScore('stack')" style="background: #E76814; color: #FFFFFF; font-weight: 700; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; cursor: pointer;">
                                💾 Simpan Kuis Formatif Stack
                            </button>
                            <button class="btn-next-level-nav" onclick="UI.switchScreen('learn-queue')" style="background: #10b981; color: #FFFFFF; font-weight: 700; border: none; border-radius: 10px; padding: 0.65rem 1.25rem; cursor: pointer;">
                                ▶ Lanjut ke Materi Queue ➔
                            </button>
                        </div>
                    </div>`;
  html = html.replace(sTargetAnchor, sBannerNew + '\n                    </div>');
  console.log('5. Updated Stack bottom banner');
}

// 6. Remove obsolete simulation screens: screen-stack-sim, screen-queue-sim, screen-games, screen-puzzle, screen-challenge
const simCutStart = html.indexOf('<!-- ===================================================================\n             SCREEN 4: INTERACTIVE STACK SIMULATOR');
const simCutEnd = html.indexOf('<!-- ===================================================================\n             SCREEN 9: ACHIEVEMENTS');

if (simCutStart === -1 || simCutEnd === -1) {
  console.error('Error: simulation screen cut points not found');
  process.exit(1);
}

console.log(`Cutting obsolete simulation screens from ${simCutStart} to ${simCutEnd} (Length: ${simCutEnd - simCutStart})`);
html = html.substring(0, simCutStart) + html.substring(simCutEnd);
console.log('6. Removed obsolete simulation screens 4 through 8');

// 7. Update LKPD Hero text
const lkpdHeroOld = 'diskusikan salah satu dari 4 studi kasus nyata';
const lkpdHeroNew = 'diskusikan satu studi kasus yang tersedia pada media';
if (html.includes(lkpdHeroOld)) {
  html = html.replace(lkpdHeroOld, lkpdHeroNew);
  console.log('7. Updated LKPD hero text');
}

// 8. Update LKPD Add Member button
const lkpdAddBtnOld = '➕ Tambah Anggota (Maks. 8)';
const lkpdAddBtnNew = '➕ Tambah Anggota (Maks. 6 Siswa)';
if (html.includes(lkpdAddBtnOld)) {
  html = html.replace(lkpdAddBtnOld, lkpdAddBtnNew);
  console.log('8. Updated LKPD add member button label');
}

// 9. Update Result Screen
const oldReportCardHeader = `<div class="student-meta-banner">
                        <div>
                            <span data-i18n="playerNameLabel">Nama Siswa</span>: <strong id="result-player-name">Petualang</strong>
                        </div>
                        <div>
                            <span data-i18n="studentClassLabel">Kelas</span>: <strong id="result-player-class">Fase E (Kelas X)</strong>
                        </div>
                        <div>
                            <span data-i18n="studentAbsenLabel">No. Absen</span>: <strong id="result-player-absen">-</strong>
                        </div>
                        <div>
                            <span data-i18n="printDateLabel">Tanggal</span>: <strong id="result-date">2026-10-01</strong>
                        </div>
                    </div>

                    <!-- Final Score Showcase -->
                    <div class="final-score-showcase">
                        <span class="final-score-label" data-i18n="finalAverageScore">Nilai Rata-Rata Akhir</span>
                        <div class="final-score-number" id="result-final-score">88</div>
                        <div class="predicate-badge predicate-good" id="result-predicate-badge">BAIK</div>
                    </div>

                    <!-- Metrics Summary Grid -->
                    <div class="metrics-summary-grid">
                        <div class="metric-box">
                            <span class="metric-val" id="result-accuracy">88%</span>
                            <span class="metric-label" data-i18n="metricAccuracy">Akurasi</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-val" id="result-correct-count">44</span>
                            <span class="metric-label" data-i18n="metricCorrect">Jawaban Benar</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-val" id="result-wrong-count">6</span>
                            <span class="metric-label" data-i18n="metricWrong">Jawaban Salah</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-val" id="result-play-time">18:42</span>
                            <span class="metric-label" data-i18n="metricTime">Waktu Bermain</span>
                        </div>
                    </div>

                    <!-- Level Breakdown -->
                    <div class="level-breakdown-section">
                        <h4 data-i18n="levelScoresSummary">Rincian Skor Tiap Level:</h4>
                        <div id="result-level-breakdown"></div>
                    </div>`;

const newReportCardHeader = `<div class="student-meta-banner" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                        <div>
                            <span style="color: #714236; font-size: 0.88rem; font-weight: 600;">Nama Peserta Didik</span>: <strong id="result-player-name" style="color: #891A10; font-size: 1.05rem;">—</strong>
                        </div>
                        <div>
                            <span style="color: #714236; font-size: 0.88rem; font-weight: 600;">Kelas</span>: <strong id="result-player-class" style="color: #2B1D19;">—</strong>
                        </div>
                        <div>
                            <span style="color: #714236; font-size: 0.88rem; font-weight: 600;">No. Absen</span>: <strong id="result-player-absen" style="color: #2B1D19;">—</strong>
                        </div>
                        <div>
                            <span style="color: #714236; font-size: 0.88rem; font-weight: 600;">Tanggal Asesmen</span>: <strong id="result-date" style="color: #2B1D19;">—</strong>
                        </div>
                    </div>

                    <!-- Final Score Showcase (Weighted Scale 100) -->
                    <div class="final-score-showcase" style="background: #FFFFFF; border: 2.5px solid #891A10; border-radius: 16px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(137, 26, 16, 0.1);">
                        <span class="final-score-label" style="font-size: 0.95rem; font-weight: 700; color: #714236; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                            Nilai Akhir Terbobot (Sesuai RPM UKIN)
                        </span>
                        <div class="final-score-number" id="result-final-score" style="font-family: 'Space Mono', monospace; font-size: 3.5rem; font-weight: 800; color: #891A10; line-height: 1;">0</div>
                        <div class="predicate-badge" id="result-predicate-badge" style="display: inline-block; margin-top: 0.75rem; padding: 0.4rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.95rem; background: #D8D4BC; color: #2B1D19;">
                            MEMPROSES...
                        </div>
                        <p style="font-size: 0.85rem; color: #714236; margin: 0.75rem 0 0 0;">
                            Bobot: Individu (25%) + Mini-Lab (20%) + LKPD Kelompok (30%) + Evaluasi Sumatif (25%)
                        </p>
                    </div>

                    <!-- Metrics Summary Grid -->
                    <div class="metrics-summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
                        <div class="metric-box" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem; text-align: center;">
                            <span class="metric-val" id="result-accuracy" style="font-family: 'Space Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #891A10; display: block;">0%</span>
                            <span class="metric-label" style="font-size: 0.8rem; color: #714236;">Akurasi Analisis</span>
                        </div>
                        <div class="metric-box" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem; text-align: center;">
                            <span class="metric-val" id="result-correct-count" style="font-family: 'Space Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #10b981; display: block;">0</span>
                            <span class="metric-label" style="font-size: 0.8rem; color: #714236;">Jawaban Tepat</span>
                        </div>
                        <div class="metric-box" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem; text-align: center;">
                            <span class="metric-val" id="result-wrong-count" style="font-family: 'Space Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #ef4444; display: block;">0</span>
                            <span class="metric-label" style="font-size: 0.8rem; color: #714236;">Perlu Evaluasi</span>
                        </div>
                        <div class="metric-box" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem; text-align: center;">
                            <span class="metric-val" id="result-play-time" style="font-family: 'Space Mono', monospace; font-size: 1.4rem; font-weight: 700; color: #714236; display: block;">00:00</span>
                            <span class="metric-label" style="font-size: 0.8rem; color: #714236;">Durasi Belajar</span>
                        </div>
                    </div>

                    <!-- Level Breakdown (4 Weighted Components + Formative Feedback) -->
                    <div class="level-breakdown-section" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
                        <h4 style="color: #891A10; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; margin: 0 0 1rem 0;">
                            📊 Rincian Komponen Penilaian Pembelajaran (Sesuai RPM UKIN):
                        </h4>
                        <div id="result-level-breakdown"></div>
                    </div>`;

if (!html.includes(oldReportCardHeader)) {
  console.error('Error: oldReportCardHeader not found');
  process.exit(1);
}
html = html.replace(oldReportCardHeader, newReportCardHeader);
console.log('9. Updated Report Card and Breakdown Header');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully written updated index.html!');
