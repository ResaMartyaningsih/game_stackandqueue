const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update Desktop Nav and Header User Badge
const oldNav = `                <button class="nav-link" data-screen-target="guidelines">Panduan</button>
            </nav>

            <!-- Student Profile Badge -->
            <div class="header-actions">
                <button type="button" class="header-user-badge" onclick="App.showNamePromptModal(false)" title="Ubah Nama, Kelas, atau No. Absen Siswa">
                    👤 <span class="player-display-name">Siswa</span> (<span class="player-display-class">Fase E</span>)
                </button>
            </div>`;

const newNav = `                <button class="nav-link" data-screen-target="guidelines">Panduan</button>
                <button class="nav-link" data-screen-target="profile">Profil & Nilai</button>
            </nav>

            <!-- Student Profile Badge -->
            <div class="header-actions">
                <button type="button" class="header-user-badge" onclick="UI.switchScreen('profile')" title="Buka Profil, Cek Progres & Nilai Siswa">
                    👤 <span class="player-display-name">Siswa</span> (<span class="player-display-class">Fase E</span>)
                </button>
            </div>`;

if (html.includes(oldNav)) {
    html = html.replace(oldNav, newNav);
    console.log('✓ Desktop nav & header badge updated');
} else {
    console.warn('! oldNav not matched');
}

// 2. Update Mobile Bottom Nav to include Profil
const oldMobNav = `        <button class="bottom-nav-item" data-screen-target="evaluation">
            <span class="nav-icon">📝</span>
            <span>Evaluasi</span>
        </button>
    </nav>`;

const newMobNav = `        <button class="bottom-nav-item" data-screen-target="evaluation">
            <span class="nav-icon">📝</span>
            <span>Evaluasi</span>
        </button>
        <button class="bottom-nav-item" data-screen-target="profile">
            <span class="nav-icon">👤</span>
            <span>Profil</span>
        </button>
    </nav>`;

if (html.includes(oldMobNav)) {
    html = html.replace(oldMobNav, newMobNav);
    console.log('✓ Mobile bottom nav updated with Profil');
} else {
    console.warn('! oldMobNav not matched');
}

// 3. Add Screen Profile before </main>
const oldScreenEnd = `                        <button class="btn btn-amber" onclick="UI.switchScreen('home')" data-i18n="btnBack">
                            🏠 Kembali ke Home
                        </button>
                    </div>
                </div>
            </div>
        </section>

    </main>`;

const profileScreenHTML = `                        <button class="btn btn-amber" onclick="UI.switchScreen('home')" data-i18n="btnBack">
                            🏠 Kembali ke Home
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================================================================
             SCREEN 11: PROFIL SISWA, CEK PROGRES & REKAP NILAI (UNDUH RAPOR)
             =================================================================== -->
        <section id="screen-profile" class="app-screen">
            <div class="academic-page-container">

                <!-- 1. HERO BANNER: IDENTITAS & AKSI UNDUH -->
                <div class="academic-card highlight-sky animate-fade-in-up" style="border: 2px solid #891A10; background: linear-gradient(135deg, #FAF6ED 0%, #FFFFFF 100%); margin-bottom: 1.5rem;">
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 1.25rem;">
                            <div style="width: 76px; height: 76px; border-radius: 50%; background: #891A10; color: #FAF6ED; display: flex; align-items: center; justify-content: center; font-size: 2.6rem; border: 3px solid #E76814; box-shadow: 0 4px 12px rgba(137, 26, 16, 0.2); flex-shrink: 0;">
                                👤
                            </div>
                            <div>
                                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                                    <h2 id="prof-hero-name" style="font-family: var(--font-heading); color: #891A10; margin: 0; font-size: 1.75rem; font-weight: 800;">
                                        Nama Peserta Didik
                                    </h2>
                                    <span id="prof-hero-class" style="background: #E76814; color: #FFFFFF; padding: 0.2rem 0.8rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700; font-family: 'Space Mono', monospace;">
                                        Kelas X.1
                                    </span>
                                    <span id="prof-hero-absen" style="background: #714236; color: #FFFFFF; padding: 0.2rem 0.8rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700; font-family: 'Space Mono', monospace;">
                                        Absen: 01
                                    </span>
                                </div>
                                <p style="color: #714236; margin: 0.4rem 0 0 0; font-size: 0.95rem; font-weight: 500;">
                                    Rapor Digital &amp; Cek Progres Pembelajaran • <strong>Informatika Fase E (Problem-Based Learning)</strong>
                                </p>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                            <button type="button" class="btn" onclick="UI.downloadProfileWordReport()" style="background: #2563eb; color: #FFFFFF; font-size: 0.88rem; font-weight: 700; padding: 0.65rem 1.15rem; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 3px 8px rgba(37,99,235,0.25); transition: transform 0.15s ease;">
                                📄 Unduh Rapor (.doc)
                            </button>
                            <button type="button" class="btn" onclick="UI.printProfileReport()" style="background: #891A10; color: #FFFFFF; font-size: 0.88rem; font-weight: 700; padding: 0.65rem 1.15rem; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 3px 8px rgba(137,26,16,0.25); transition: transform 0.15s ease;">
                                🖨️ Cetak / Unduh PDF
                            </button>
                            <button type="button" class="btn btn-outline" onclick="App.showNamePromptModal(false)" style="font-size: 0.88rem; font-weight: 600; padding: 0.65rem 1rem; border-radius: 10px; border: 1.5px solid #D8D4BC; background: #FFFFFF; color: #714236; cursor: pointer;">
                                ✏️ Edit Identitas
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 2. CARD NILAI AKHIR DIGITAL & PREDIKAT -->
                <div class="academic-card highlight-indigo animate-fade-in-up" style="margin-top: 1.5rem;">
                    <div class="academic-card-header">
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #E76814; font-family: 'Space Mono', monospace;">
                                Rekapitulasi Asesmen Digital
                            </div>
                            <h2 class="academic-card-title" style="color: #891A10; font-size: 1.5rem;">
                                🏆 Nilai Akhir Digital (ND) &amp; Ketercapaian KKTP
                            </h2>
                        </div>
                        <span id="prof-kktp-status-pill" style="padding: 0.4rem 1rem; border-radius: 999px; font-weight: 800; font-size: 0.85rem; font-family: 'Space Mono', monospace; background: #10b981; color: #FFFFFF;">
                            TUNTAS KKTP (≥ 75)
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-top: 1.25rem; align-items: center;">
                        <!-- Score Hero Box -->
                        <div style="background: #FAF6ED; border: 2px solid #891A10; border-radius: 14px; padding: 1.5rem; text-align: center;">
                            <div style="font-size: 0.85rem; font-weight: 700; color: #714236; text-transform: uppercase; letter-spacing: 0.05em;">
                                Skor Nilai Digital (ND)
                            </div>
                            <div id="prof-digital-score-num" style="font-size: 3.6rem; font-family: 'Space Mono', monospace; font-weight: 800; color: #891A10; line-height: 1.1; margin: 0.35rem 0;">
                                0
                            </div>
                            <div id="prof-predicate-badge" style="display: inline-block; padding: 0.25rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 800; background: #891A10; color: #FFFFFF;">
                                Sangat Baik (A)
                            </div>
                        </div>

                        <!-- Progress & Metric Details -->
                        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                            <div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.35rem; color: #714236;">
                                    <span>Kemajuan Capaian Pembelajaran</span>
                                    <span id="prof-progress-pct-text">0% Tuntas</span>
                                </div>
                                <div style="width: 100%; height: 12px; background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 999px; overflow: hidden;">
                                    <div id="prof-progress-bar-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #E76814 0%, #891A10 100%); transition: width 0.5s ease;"></div>
                                </div>
                            </div>

                            <div style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem; font-size: 0.84rem; color: #2B1D19;">
                                <div style="font-weight: 700; color: #891A10; margin-bottom: 0.2rem;">
                                    📐 Formula Nilai Digital Resmi:
                                </div>
                                <div style="font-family: 'Space Mono', monospace; font-size: 0.8rem; color: #714236; word-break: break-all;">
                                    ND = min(100, round((I × 30%) + (L × 35%) + (E × 35%) + B))
                                </div>
                            </div>

                            <div style="background: #FFF7ED; border-left: 4px solid #E76814; border-radius: 0 8px 8px 0; padding: 0.65rem 0.85rem; font-size: 0.8rem; color: #714236;">
                                <strong>📢 Catatan Guru:</strong> Penilaian Presentasi Kelompok (10%) dilakukan secara manual oleh guru melalui lembar observasi rubrik presentasi kelas di luar sistem website.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 3. CARD RINCIAN 4 KOMPONEN NILAI & PERCOBAAN -->
                <div class="academic-card highlight-blue" style="margin-top: 1.5rem;">
                    <div class="academic-card-header">
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #E76814; font-family: 'Space Mono', monospace;">
                                Rincian Komponen Nilai
                            </div>
                            <h2 class="academic-card-title" style="color: #891A10; font-size: 1.4rem;">
                                📊 Bobot Asesmen, Riwayat Percobaan &amp; Nilai Terbaik
                            </h2>
                        </div>
                    </div>

                    <div id="prof-components-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 1rem;">
                        <!-- Injected dynamically by UI.renderProfilePage() -->
                    </div>
                </div>

                <!-- 4. CARD CEK PROGRES ALUR PEMBELAJARAN (8 TAHAPAN PBL) -->
                <div class="academic-card highlight-emerald" style="margin-top: 1.5rem;">
                    <div class="academic-card-header">
                        <div>
                            <div style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #E76814; font-family: 'Space Mono', monospace;">
                                Alur Pembelajaran PBL
                            </div>
                            <h2 class="academic-card-title" style="color: #891A10; font-size: 1.4rem;">
                                🗺️ Cek Status &amp; Progres 8 Tahapan Belajar
                            </h2>
                        </div>
                        <span id="prof-stages-completed-badge" style="background: #FAF6ED; color: #891A10; border: 1.5px solid #891A10; padding: 0.35rem 0.85rem; border-radius: 999px; font-weight: 700; font-size: 0.82rem; font-family: 'Space Mono', monospace;">
                            0 dari 8 Selesai
                        </span>
                    </div>

                    <div id="prof-stages-table-container" style="margin-top: 1rem; overflow-x: auto;">
                        <!-- Injected dynamically by UI.renderProfilePage() -->
                    </div>
                </div>

                <!-- 5. CARD RESET PROGRES BELAJAR -->
                <div class="academic-card highlight-amber" style="margin-top: 1.5rem; text-align: center; border: 1.5px dashed #D8D4BC; background: #FAF8F5;">
                    <h3 style="font-family: var(--font-heading); color: #891A10; margin-bottom: 0.35rem; font-size: 1.15rem;">
                        🔄 Manajemen Progres Belajar Siswa
                    </h3>
                    <p style="color: #714236; font-size: 0.88rem; max-width: 600px; margin: 0 auto 1rem auto;">
                        Jika kamu ingin mengulang seluruh aktivitas pembelajaran, menghapus riwayat jawaban lokal, dan memulai petualangan berpikir komputasional dari awal, gunakan tombol di bawah:
                    </p>
                    <button type="button" class="btn btn-outline" onclick="UI.promptResetProgress()" style="color: #891A10; border: 1.5px solid #891A10; font-weight: 700; font-size: 0.88rem; padding: 0.6rem 1.4rem; border-radius: 10px; background: #FFFFFF; cursor: pointer;">
                        ⚠️ Reset Semua Progres Belajar
                    </button>
                </div>

            </div>
        </section>

    </main>`;

if (html.includes(oldScreenEnd)) {
    html = html.replace(oldScreenEnd, profileScreenHTML);
    console.log('✓ Profile screen successfully added before </main>');
} else {
    console.warn('! oldScreenEnd not matched');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully written updated index.html');

