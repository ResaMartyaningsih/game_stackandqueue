const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

function replaceOrThrow(target, replacement, label) {
  if (!html.includes(target)) {
    console.error(`FAILED: ${label} not found!`);
    process.exit(1);
  }
  html = html.replace(target, replacement);
  console.log(`SUCCESS: ${label}`);
}

// 1. Insert Attempt Tracker in screen-individual-tasks (after task-level-selector)
const tlsEnd = `                        <div class="task-level-chip" data-level="4" onclick="PBLAcademic.renderTaskLevel(4)">
                            <span class="chip-lvl">Level 4</span>
                            <span class="chip-name">Tracing &amp; Rekayasa</span>
                        </div>
                    </div>`;

const indAttemptTrackerHTML = `                        <div class="task-level-chip" data-level="4" onclick="PBLAcademic.renderTaskLevel(4)">
                            <span class="chip-lvl">Level 4</span>
                            <span class="chip-name">Tracing &amp; Rekayasa</span>
                        </div>
                    </div>

                    <!-- Indikator Percobaan & Penguncian Tugas Individu -->
                    <div class="attempt-tracker-banner" id="individual-attempt-tracker" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.85rem 1.25rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; box-shadow: 0 2px 8px rgba(113, 66, 54, 0.05);">
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            <span style="font-weight: 700; color: #891A10; font-size: 0.92rem; display: flex; align-items: center; gap: 0.35rem;">
                                <span>🔄</span> <span id="individual-attempt-text">Kesempatan pengerjaan: 1 dari 3</span>
                            </span>
                            <div class="attempt-indicators-pills" id="individual-attempt-pills" style="display: flex; gap: 0.4rem; align-items: center;">
                                <span class="attempt-pill active" style="background: #891A10; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">● P1 (Aktif)</span>
                                <span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P2</span>
                                <span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P3</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            <span id="individual-best-score-badge" style="font-size: 0.85rem; font-weight: 700; color: #10b981; background: #FAF6ED; border: 1.5px solid #D8D4BC; padding: 0.35rem 0.75rem; border-radius: 8px;">
                                🏆 Nilai Terbaik: 0 pts
                            </span>
                            <button type="button" class="btn btn-outline" id="individual-retry-btn" onclick="PBLAcademic.promptRetryIndividual()" style="padding: 0.4rem 0.85rem; font-size: 0.85rem; border-color: #DC8236; color: #891A10; font-weight: 700; background: #FFFFFF; cursor: pointer; border-radius: 8px;">
                                🔄 Ulangi Seluruh Tugas
                            </button>
                        </div>
                    </div>`;

replaceOrThrow(tlsEnd, indAttemptTrackerHTML, '1. Insert Attempt Tracker in screen-individual-tasks');

// 2. Insert Attempt Tracker in screen-group-project (after gp-hero-card)
const gpHeroEnd = `                        <div class="gp-step-item" id="gp-step-5">
                            <span class="step-num">5</span>
                            <span class="step-txt">Lembar Kesimpulan</span>
                        </div>
                    </div>
                </div>`;

const grpAttemptTrackerHTML = `                        <div class="gp-step-item" id="gp-step-5">
                            <span class="step-num">5</span>
                            <span class="step-txt">Lembar Kesimpulan</span>
                        </div>
                    </div>
                </div>

                <!-- Indikator Percobaan & Penguncian LKPD Kelompok -->
                <div class="attempt-tracker-banner" id="group-attempt-tracker" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.85rem 1.25rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; box-shadow: 0 2px 8px rgba(113, 66, 54, 0.05);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        <span style="font-weight: 700; color: #891A10; font-size: 0.92rem; display: flex; align-items: center; gap: 0.35rem;">
                            <span>🔄</span> <span id="group-attempt-text">Kesempatan pengerjaan: 1 dari 3</span>
                        </span>
                        <div class="attempt-indicators-pills" id="group-attempt-pills" style="display: flex; gap: 0.4rem; align-items: center;">
                            <span class="attempt-pill active" style="background: #891A10; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">● P1 (Aktif)</span>
                            <span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P2</span>
                            <span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P3</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                        <span id="group-best-score-badge" style="font-size: 0.85rem; font-weight: 700; color: #10b981; background: #FAF6ED; border: 1.5px solid #D8D4BC; padding: 0.35rem 0.75rem; border-radius: 8px;">
                            🏆 Nilai Terbaik: 0 pts
                        </span>
                        <button type="button" class="btn btn-outline" id="group-retry-btn" onclick="App.promptRetryGroup()" style="padding: 0.4rem 0.85rem; font-size: 0.85rem; border-color: #DC8236; color: #891A10; font-weight: 700; background: #FFFFFF; cursor: pointer; border-radius: 8px;">
                            🔄 Ulangi Seluruh Tugas
                        </button>
                    </div>
                </div>`;

replaceOrThrow(gpHeroEnd, grpAttemptTrackerHTML, '2. Insert Attempt Tracker in screen-group-project');

// 3. Insert Universal Retry Confirmation Modal before toast notification area
const toastTarget = '<div id="toast-notification-area" aria-live="assertive"></div>';
const retryModalHTML = `<!-- Universal Retry Confirmation Modal (Sistem Maksimal 3 Kali Percobaan) -->
    <div id="retry-confirm-modal" class="modal-overlay" role="dialog" aria-modal="true" style="display: none; position: fixed; inset: 0; background: rgba(43, 29, 25, 0.7); backdrop-filter: blur(4px); z-index: 99999; align-items: center; justify-content: center; padding: 1rem;">
        <div class="modal-card animate-pop" style="max-width: 480px; width: 100%; text-align: left; background: #FFFFFF; border: 2.5px solid #891A10; border-radius: 16px; padding: 1.75rem; box-shadow: 0 12px 35px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.85rem;">
                <span style="font-size: 2rem;">⚠️</span>
                <h3 id="retry-modal-title" style="margin: 0; color: #891A10; font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800;">
                    Ulangi Seluruh Tugas?
                </h3>
            </div>
            <p id="retry-modal-message" style="color: #2B1D19; line-height: 1.6; margin-bottom: 1rem; font-size: 0.95rem;">
                Seluruh jawaban pada tugas ini akan dihapus dan kamu akan memulai kembali dari soal pertama. Kesempatan pengerjaan akan berkurang satu.
            </p>
            <div style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 1.5rem; font-size: 0.88rem; color: #714236; line-height: 1.5;">
                💡 <strong>Nilai Terbaik Tetap Aman:</strong> Nilai tertinggi yang pernah kamu raih dari ketiga percobaan akan otomatis disimpan dan digunakan dalam perhitungan Nilai Digital (ND).
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button type="button" class="btn btn-outline" onclick="UI.closeRetryModal()" style="font-weight: 700; padding: 0.6rem 1.25rem; border-color: #D8D4BC; color: #714236; background: #FFFFFF; cursor: pointer; border-radius: 8px;">
                    Batal
                </button>
                <button type="button" class="btn btn-primary" id="retry-modal-confirm-btn" onclick="UI.confirmRetryAction()" style="background: #891A10; border: 1.5px solid #891A10; color: #FFFFFF; font-weight: 700; padding: 0.6rem 1.25rem; cursor: pointer; border-radius: 8px;">
                    Ya, Ulangi Seluruh Tugas
                </button>
            </div>
        </div>
    </div>

    ` + toastTarget;

replaceOrThrow(toastTarget, retryModalHTML, '3. Insert Universal Retry Confirmation Modal');

// 4. Update guidelines tab-petunjuk with Assessment Policy & Formula
const tabPetunjukOld = `<div class="academic-tab-pane active" data-pane="tab-petunjuk">
                            <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.95rem; line-height: 1.6; color: #334155;">
                                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                                    <span class="academic-badge academic-badge-blue" style="flex-shrink: 0;">Langkah 1</span>
                                    <div><strong>Beranda &amp; Orientasi Masalah:</strong> Pahami stimulus antrean kantin sekolah dan telaah 3 pertanyaan pemantiknya.</div>
                                </div>`;

const tabPetunjukNew = `<div class="academic-tab-pane active" data-pane="tab-petunjuk">
                            <!-- Informasi Sistem Penilaian NalarQuest -->
                            <div style="background: #FFFFFF; border: 2px solid #891A10; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem; box-shadow: 0 4px 15px rgba(137, 26, 16, 0.08);">
                                <h4 style="margin: 0 0 0.6rem 0; color: #891A10; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
                                    <span>📊</span> Sistem Pembobotan Nilai &amp; Aturan Pengerjaan Media
                                </h4>
                                <p style="margin: 0 0 0.85rem 0; color: #2B1D19; font-size: 0.92rem; line-height: 1.55;">
                                    Penilaian digital pada website <strong>NalarQuest</strong> mengukur kompetensi pemecahan masalah komputasional dengan formula:
                                </p>
                                <div style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 0.85rem; font-family: 'Space Mono', monospace; font-size: 0.95rem; font-weight: 700; color: #891A10; text-align: center;">
                                    ND = (I × 0,30) + (L × 0,35) + (E × 0,35) + B
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 0.85rem; font-size: 0.88rem;">
                                    <div style="background: #FAF8F5; border: 1px solid #D8D4BC; padding: 0.7rem; border-radius: 8px;">
                                        <strong>1. Tugas Individu (4 Level): 30%</strong><br>
                                        <span style="color: #714236;">Nilai terbaik dari maksimal 3 kali percobaan.</span>
                                    </div>
                                    <div style="background: #FAF8F5; border: 1px solid #D8D4BC; padding: 0.7rem; border-radius: 8px;">
                                        <strong>2. LKPD Kelompok: 35%</strong><br>
                                        <span style="color: #714236;">Nilai terbaik kelompok dari maksimal 3 kali percobaan.</span>
                                    </div>
                                    <div style="background: #FAF8F5; border: 1px solid #D8D4BC; padding: 0.7rem; border-radius: 8px;">
                                        <strong>3. Evaluasi Akhir: 35%</strong><br>
                                        <span style="color: #714236;">Asesmen sumatif 5 butir soal HOTS mandiri.</span>
                                    </div>
                                    <div style="background: #FAF8F5; border: 1px solid #D8D4BC; padding: 0.7rem; border-radius: 8px;">
                                        <strong>4. Bonus Mini-Lab: Maksimal +5</strong><br>
                                        <span style="color: #714236;">Poin tambahan eksplorasi praktikum (nilai akhir maks 100).</span>
                                    </div>
                                </div>
                                <div style="border-top: 1px dashed #D8D4BC; padding-top: 0.75rem; font-size: 0.85rem; color: #714236; line-height: 1.5;">
                                    🔒 <strong>Aturan Kunci Jawaban &amp; Percobaan:</strong> Jawaban yang telah dipilih atau dikonfirmasi langsung terkunci dan tidak dapat diubah terpisah. Jika ingin memperbaiki, gunakan tombol "Ulangi Seluruh Tugas" (maksimal 3 kali kesempatan, pengulangan dimulai dari soal pertama). Nilai tertinggi dari riwayat percobaan akan otomatis digunakan.<br>
                                    📢 <strong>Catatan Presentasi:</strong> Penilaian presentasi kelompok (bobot 10%) dilakukan secara manual oleh guru melalui rubrik penilaian guru di luar sistem digital ini.
                                </div>
                            </div>

                            <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.95rem; line-height: 1.6; color: #334155;">
                                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                                    <span class="academic-badge academic-badge-blue" style="flex-shrink: 0;">Langkah 1</span>
                                    <div><strong>Beranda &amp; Orientasi Masalah:</strong> Pahami stimulus antrean kantin sekolah dan telaah 3 pertanyaan pemantiknya.</div>
                                </div>`;

replaceOrThrow(tabPetunjukOld, tabPetunjukNew, '4. Update guidelines tab-petunjuk with Assessment Policy');

// 5. Update screen-result showcase card
const oldResultShowcase = `<span class="final-score-label" style="font-size: 0.95rem; font-weight: 700; color: #714236; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                            Nilai Akhir Terbobot (Sesuai RPM UKIN)
                        </span>
                        <div class="final-score-number" id="result-final-score" style="font-family: 'Space Mono', monospace; font-size: 3.5rem; font-weight: 800; color: #891A10; line-height: 1;">0</div>
                        <div class="predicate-badge" id="result-predicate-badge" style="display: inline-block; margin-top: 0.75rem; padding: 0.4rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.95rem; background: #D8D4BC; color: #2B1D19;">
                            MEMPROSES...
                        </div>
                        <p style="font-size: 0.85rem; color: #714236; margin: 0.75rem 0 0 0;">
                            Bobot: Individu (25%) + Mini-Lab (20%) + LKPD Kelompok (30%) + Evaluasi Sumatif (25%)
                        </p>`;

const newResultShowcase = `<span class="final-score-label" style="font-size: 0.95rem; font-weight: 700; color: #714236; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                            Nilai Akhir Digital (ND)
                        </span>
                        <div class="final-score-number" id="result-final-score" style="font-family: 'Space Mono', monospace; font-size: 3.5rem; font-weight: 800; color: #891A10; line-height: 1;">0</div>
                        <div class="predicate-badge" id="result-predicate-badge" style="display: inline-block; margin-top: 0.75rem; padding: 0.4rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.95rem; background: #D8D4BC; color: #2B1D19;">
                            MEMPROSES...
                        </div>
                        <p style="font-size: 0.88rem; color: #714236; margin: 0.75rem 0 0 0; font-weight: 700; font-family: 'Space Mono', monospace;">
                            ND = (I × 0,30) + (L × 0,35) + (E × 0,35) + B
                        </p>
                        <p style="font-size: 0.82rem; color: #714236; margin: 0.35rem 0 0 0; font-style: italic;">
                            * Penilaian presentasi kelompok (bobot 10%) dilakukan secara manual oleh guru melalui rubrik penilaian guru di luar media digital ini.
                        </p>`;

replaceOrThrow(oldResultShowcase, newResultShowcase, '5. Update screen-result showcase card');

fs.writeFileSync('index.html', html, 'utf8');
console.log('ALL UPDATES APPLIED TO index.html SUCCESSFULLY!');
