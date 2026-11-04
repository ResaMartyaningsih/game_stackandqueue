const fs = require('fs');

const originalHtml = fs.readFileSync('index.html', 'utf8');
const lines = originalHtml.split('\n');

const newHomeContent = `        <!-- ===================================================================
             SCREEN 1: BERANDA PEMBELAJARAN (LARASLOGIKA - TWO26 STUDIO STYLE)
             Full-Bleed Color-Blocked Layouts, Interactive Labs, PBL Flow
             =================================================================== -->
        <section id="screen-home" class="app-screen active">

            <!-- 1. HERO EDITORIAL SHOWCASE (#FAF8F5 - WARM LINEN CANVAS) -->
            <section class="studio-section studio-hero-section" id="section-hero">
                <div class="studio-container">
                    <div class="studio-hero-grid">
                        <!-- Hero Left Column: Editorial Statement -->
                        <div>
                            <div class="hero-meta-pill">
                                <span>📘</span> Informatika Fase E &bull; ⏱ 2 JP (90 Menit) &bull; 🧩 Model PBL
                            </div>
                            <h1 class="hero-editorial-title">
                                Computational Thinking:<br>
                                <span class="highlight-terracotta">Struktur Data</span><br>
                                <span class="highlight-crimson">Stack &amp; Queue</span>
                            </h1>
                            <p class="hero-lead-text">
                                Pahami bagaimana sistem komputasi menyimpan, mengatur, dan mengolah data melalui fenomena nyata pelayanan kantin sekolah. Kembangkan kemampuan bernalar kritis melalui prinsip <strong>LIFO (Last In First Out)</strong> dan <strong>FIFO (First In First Out)</strong>.
                            </p>
                            <div class="hero-actions-group">
                                <button type="button" class="studio-btn-hero-primary" data-screen-target="learn-intro">
                                    <span>🚀</span> Mulai Pembelajaran
                                </button>
                                <button type="button" class="studio-btn-hero-outline" onclick="document.getElementById('section-problem').scrollIntoView({behavior: 'smooth'})">
                                    <span>🧭</span> Orientasi Masalah
                                </button>
                                <button type="button" class="studio-btn-hero-outline" onclick="document.getElementById('section-goals').scrollIntoView({behavior: 'smooth'})">
                                    <span>🎯</span> Tujuan Pembelajaran
                                </button>
                            </div>
                            <div class="hero-ct-tags-row">
                                <span class="hero-ct-tag">🧩 Dekomposisi</span>
                                <span class="hero-ct-tag">🔍 Pengenalan Pola</span>
                                <span class="hero-ct-tag">💡 Abstraksi</span>
                                <span class="hero-ct-tag">⚙️ Perancangan Algoritma</span>
                            </div>
                        </div>

                        <!-- Hero Right Column: Interactive Live Showcase Lab -->
                        <div>
                            <div class="hero-studio-card">
                                <div class="hero-studio-card-header">
                                    <div>
                                        <div class="hero-studio-label">🔬 LIVE INTERACTIVE LAB</div>
                                        <h3 class="hero-studio-card-title">Simulasi Operasi Instan</h3>
                                    </div>
                                    <div class="hero-vis-tabs">
                                        <button type="button" id="hero-vis-tab-queue" class="hero-vis-tab-btn active" onclick="PBLAcademic.switchHeroSim('queue')">Queue (FIFO)</button>
                                        <button type="button" id="hero-vis-tab-stack" class="hero-vis-tab-btn" onclick="PBLAcademic.switchHeroSim('stack')">Stack (LIFO)</button>
                                    </div>
                                </div>
                                
                                <!-- Visual Stage Viewport -->
                                <div class="hero-stage-viewport" id="hero-vis-stage" aria-label="Area Visualisasi Elemen">
                                    <!-- Rendered dynamically by PBLAcademic.renderHeroSim() -->
                                </div>

                                <!-- Queue Controls -->
                                <div class="hero-stage-controls" id="hero-controls-queue">
                                    <button type="button" class="hero-action-btn-primary" onclick="PBLAcademic.heroEnqueue()">
                                        + Enqueue (Masuk Belakang)
                                    </button>
                                    <button type="button" class="hero-action-btn-amber" onclick="PBLAcademic.heroDequeue()">
                                        &minus; Dequeue (Layani Depan)
                                    </button>
                                </div>

                                <!-- Stack Controls -->
                                <div class="hero-stage-controls" id="hero-controls-stack" style="display: none;">
                                    <button type="button" class="hero-action-btn-primary" onclick="PBLAcademic.heroPush()">
                                        + Push (Tumpuk di Puncak)
                                    </button>
                                    <button type="button" class="hero-action-btn-amber" onclick="PBLAcademic.heroPop()">
                                        &minus; Pop (Ambil dari Puncak)
                                    </button>
                                </div>

                                <div class="hero-interactive-hint" id="hero-card-tip">
                                    ℹ️ <strong>Eksplorasi Langsung:</strong> Uji perubahan elemen secara instan sebelum masuk ke materi lengkap.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- MARQUEE RIBBON BAND (#E76814 - VIBRANT TERRACOTTA) -->
            <div class="studio-marquee-band" aria-hidden="true">
                <div class="marquee-inner">
                    <span class="marquee-item">COMPUTATIONAL THINKING <span>★</span> STRUKTUR DATA LINEAR <span>★</span> STACK &amp; QUEUE <span>★</span> LAST IN FIRST OUT (LIFO) <span>★</span> FIRST IN FIRST OUT (FIFO) <span>★</span> PUSH &amp; POP <span>★</span> ENQUEUE &amp; DEQUEUE <span>★</span> PROBLEM BASED LEARNING <span>★</span> LARASLOGIKA <span>★</span> INFORMATIKA FASE E <span>★</span></span>
                    <span class="marquee-item">COMPUTATIONAL THINKING <span>★</span> STRUKTUR DATA LINEAR <span>★</span> STACK &amp; QUEUE <span>★</span> LAST IN FIRST OUT (LIFO) <span>★</span> FIRST IN FIRST OUT (FIFO) <span>★</span> PUSH &amp; POP <span>★</span> ENQUEUE &amp; DEQUEUE <span>★</span> PROBLEM BASED LEARNING <span>★</span> LARASLOGIKA <span>★</span> INFORMATIKA FASE E <span>★</span></span>
                </div>
            </div>

            <!-- 2. ORIENTASI MASALAH KANTIN (#891A10 - DEEP CRIMSON RUST) -->
            <section class="studio-section studio-problem-section" id="section-problem">
                <div class="studio-container">
                    <div class="problem-editorial-tag">01 / Orientasi Terhadap Masalah (PBL Tahap 1)</div>
                    <h2 class="problem-editorial-title">Kekacauan di Kantin Sekolah: Bagaimana Logika Mengatasinya?</h2>
                    <p class="problem-editorial-sub">
                        Saat bel istirahat 15 menit berbunyi, 200 siswa serentak memadati loket kantin. Tanpa tata kelola struktur data yang adil dan efisien, terjadi kericuhan antrean dan penumpukan piring makan.
                    </p>

                    <div class="problem-split-grid">
                        <!-- Left: Narrative Stimulus Card -->
                        <div class="problem-stimulus-card">
                            <div class="problem-stimulus-quote">
                                &ldquo;Saat jam istirahat, kantin sekolah dipenuhi siswa yang ingin membeli makanan. Antrean menjadi tidak teratur dan pesanan harus dikelola dengan baik. Bagaimana cara mengatur pelayanan kantin agar lebih tertib dan efisien?&rdquo;
                            </div>
                            <div style="font-size: 0.96rem; color: #D8D4BC; line-height: 1.65; margin-bottom: 1rem;">
                                <strong>Pertanyaan Pemantik Berpikir Komputasional:</strong><br>
                                1. Mengapa siswa yang datang lebih awal berhak dilayani lebih dulu oleh kasir?<br>
                                2. Mengapa petugas kantin menaruh piring bersih di atas tumpukan dan siswa mengambil piring paling atas terlebih dahulu?
                            </div>
                            <div class="problem-ct-pills-row">
                                <span class="problem-ct-pill">🧩 Dekomposisi: Pisahkan Kasir vs Piring</span>
                                <span class="problem-ct-pill">🔍 Pengenalan Pola: Waktu Datang vs Waktu Selesai</span>
                                <span class="problem-ct-pill">💡 Abstraksi: Fokus pada Urutan Akses</span>
                                <span class="problem-ct-pill">⚙️ Algoritma: Terapkan Queue &amp; Stack</span>
                            </div>
                        </div>

                        <!-- Right: Interactive Dilemma Comparison Card -->
                        <div class="problem-dilemma-card">
                            <div class="dilemma-header-label">Simulasi Perbandingan PBL</div>
                            <h3 class="dilemma-header-title">Analisis Efek Sistem di Kantin</h3>
                            
                            <div class="dilemma-switch-tabs">
                                <button type="button" id="dilemma-btn-chaos" class="dilemma-tab-btn active" onclick="PBLAcademic.switchProblemDilemma('chaos')">
                                    ⚠️ Sistem Acak (Tanpa Aturan)
                                </button>
                                <button type="button" id="dilemma-btn-smart" class="dilemma-tab-btn" onclick="PBLAcademic.switchProblemDilemma('smart')">
                                    ✨ Solusi Logika Komputasi
                                </button>
                            </div>

                            <div class="dilemma-body-box">
                                <div id="dilemma-view-chaos">
                                    <span class="dilemma-status-tag danger">Kondisi Awal: Chaos &amp; Antrean Tidak Teratur</span>
                                    <p class="dilemma-narrative">
                                        Siswa saling berebut di depan kasir. Siswa yang datang awal kerap diserobot, sementara tumpukan piring kotor dan piring bersih tercampur tidak teratur.
                                    </p>
                                    <div class="dilemma-metrics-grid">
                                        <div class="dilemma-metric-chip danger">❌ Waktu Tunggu: 18 Menit</div>
                                        <div class="dilemma-metric-chip danger">❌ Pelayanan: Tidak Adil</div>
                                        <div class="dilemma-metric-chip danger">❌ Pesanan Tertukar: Sering</div>
                                        <div class="dilemma-metric-chip danger">❌ Piring: Berantakan</div>
                                    </div>
                                </div>
                                <div id="dilemma-view-smart" style="display: none;">
                                    <span class="dilemma-status-tag success">Kondisi Terkelola: Integrasi Queue &amp; Stack</span>
                                    <p class="dilemma-narrative">
                                        Loket kasir menerapkan <strong>Queue (FIFO)</strong> sehingga siswa dilayani tertib berdasarkan urutan tiba. Rak piring menerapkan <strong>Stack (LIFO)</strong> yang ringkas dan higienis.
                                    </p>
                                    <div class="dilemma-metrics-grid">
                                        <div class="dilemma-metric-chip success">✓ Waktu Tunggu: 4 Menit</div>
                                        <div class="dilemma-metric-chip success">✓ Pelayanan: Tertib &amp; Adil</div>
                                        <div class="dilemma-metric-chip success">✓ Pesanan: 100% Akurat</div>
                                        <div class="dilemma-metric-chip success">✓ Piring: Rapi &amp; Teratur</div>
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top: 1.25rem;">
                                <button type="button" class="studio-btn-hero-primary" style="width: 100%; justify-content: center;" data-screen-target="group-project">
                                    <span>👥</span> Buka Lembar Kerja Kelompok (LKPD) ➔
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 3. DUEL KONSEP LIFO VS FIFO (#FAF6ED - WARM SAND) -->
            <section class="studio-section studio-duel-section" id="section-concepts">
                <div class="studio-container">
                    <div class="duel-editorial-tag">02 / Konsep Inti Struktur Data</div>
                    <h2 class="duel-editorial-title">Queue vs Stack: Dua Pilar Logika Linear</h2>
                    <p class="duel-lead-sub" style="font-size: 1.05rem; line-height: 1.65; color: #4A332D; max-width: 800px; margin: 0 0 1.5rem 0;">
                        Memahami perbedaan mendasar cara penyimpanan, penambahan, dan pengambilan elemen data untuk memilih struktur yang tepat bagi setiap persoalan komputasional.
                    </p>

                    <div class="studio-duel-cards-grid">
                        <!-- Card Queue -->
                        <div class="duel-concept-card card-queue">
                            <div>
                                <span class="duel-card-pill pill-queue">Prinsip FIFO (First In First Out)</span>
                                <h3 class="duel-card-heading">Queue (Antrean)</h3>
                                <p class="duel-card-desc">
                                    Elemen yang <strong>pertama kali masuk</strong> akan menjadi elemen yang <strong>pertama kali keluar</strong>. Memiliki dua ujung operasional: penambahan di ujung belakang (<em>Rear</em>) dan pengambilan di ujung depan (<em>Front</em>).
                                </p>
                                <div class="duel-card-methods">
                                    <strong>Operasi Dasar Queue:</strong>
                                    <div class="duel-methods-pills">
                                        <span class="duel-method-code">enqueue(x)</span>
                                        <span class="duel-method-code">dequeue()</span>
                                        <span class="duel-method-code">peek()</span>
                                        <span class="duel-method-code">isEmpty()</span>
                                    </div>
                                </div>
                                <p style="font-size: 0.9rem; color: #714236; margin-bottom: 1.5rem;">
                                    <strong>Contoh Nyata:</strong> Antrean loket kasir, antrean cetak printer (spooler), playlist lagu antre.
                                </p>
                            </div>
                            <button type="button" class="studio-btn-hero-primary" style="width: 100%; justify-content: center;" data-screen-target="learn-queue">
                                Pelajari Materi Queue &amp; Simulasi ➔
                            </button>
                        </div>

                        <!-- Card Stack -->
                        <div class="duel-concept-card card-stack">
                            <div>
                                <span class="duel-card-pill pill-stack">Prinsip LIFO (Last In First Out)</span>
                                <h3 class="duel-card-heading">Stack (Tumpukan)</h3>
                                <p class="duel-card-desc">
                                    Elemen yang <strong>terakhir kali masuk</strong> justru menjadi elemen yang <strong>pertama kali keluar</strong>. Seluruh proses penambahan dan pengambilan elemen hanya berlangsung pada satu pintu: puncak tumpukan (<em>Top</em>).
                                </p>
                                <div class="duel-card-methods">
                                    <strong>Operasi Dasar Stack:</strong>
                                    <div class="duel-methods-pills">
                                        <span class="duel-method-code">push(x)</span>
                                        <span class="duel-method-code">pop()</span>
                                        <span class="duel-method-code">peek()</span>
                                        <span class="duel-method-code">isEmpty()</span>
                                    </div>
                                </div>
                                <p style="font-size: 0.9rem; color: #714236; margin-bottom: 1.5rem;">
                                    <strong>Contoh Nyata:</strong> Tumpukan piring bersih kantin, fitur Undo/Redo di Microsoft Word, tombol Back browser.
                                </p>
                            </div>
                            <button type="button" class="studio-btn-hero-primary" style="width: 100%; justify-content: center; background: #891A10 !important; border-color: #891A10 !important;" data-screen-target="learn-stack">
                                Pelajari Materi Stack &amp; Simulasi ➔
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 4. ALUR BELAJAR PBL 90 MENIT (#714236 - DEEP ESPRESSO) -->
            <section class="studio-section studio-journey-section" id="section-journey">
                <div class="studio-container">
                    <div class="journey-editorial-tag">03 / Alur Pembelajaran 90 Menit</div>
                    <h2 class="journey-editorial-title">5 Sintaks Problem Based Learning (PBL)</h2>
                    <p class="journey-editorial-sub">
                        Alur terstruktur dirancang khusus untuk pembelajaran 2 Jam Pelajaran Fase E SMA, mengintegrasikan penyelidikan konsep mandiri dan kolaborasi kelompok.
                    </p>

                    <div class="journey-timeline-stack">
                        <!-- Step 1 -->
                        <div class="journey-card-row" onclick="document.getElementById('section-problem').scrollIntoView({behavior: 'smooth'})">
                            <div class="journey-card-num">01</div>
                            <div class="journey-card-content">
                                <h4>Orientasi terhadap Masalah <span class="journey-time-tag">⏱ 10 Menit</span></h4>
                                <p>Mengamati stimulus kasus kekacauan kantin sekolah, menjawab pertanyaan pemantik, dan mengidentifikasi kebutuhan komputasi.</p>
                            </div>
                            <div class="journey-card-action">
                                <button type="button" class="btn-journey-jump">Telaah Kasus</button>
                            </div>
                        </div>

                        <!-- Step 2 -->
                        <div class="journey-card-row" data-screen-target="learn-intro">
                            <div class="journey-card-num">02</div>
                            <div class="journey-card-content">
                                <h4>Mengorganisasikan Peserta Didik <span class="journey-time-tag">⏱ 20 Menit</span></h4>
                                <p>Mempelajari pemahaman awal, eksplorasi konsep Stack (LIFO) &amp; Queue (FIFO), serta membentuk kelompok belajar.</p>
                            </div>
                            <div class="journey-card-action">
                                <button type="button" class="btn-journey-jump">Buka Materi</button>
                            </div>
                        </div>

                        <!-- Step 3 -->
                        <div class="journey-card-row" data-screen-target="individual-tasks">
                            <div class="journey-card-num">03</div>
                            <div class="journey-card-content">
                                <h4>Membimbing Penyelidikan Mandiri <span class="journey-time-tag">⏱ 25 Menit</span></h4>
                                <p>Menyelesaikan 6 level tugas individu bertingkat (game simulasi &amp; pemecahan masalah) untuk mengasah logika operasional.</p>
                            </div>
                            <div class="journey-card-action">
                                <button type="button" class="btn-journey-jump">Mainkan 6 Level 🎮</button>
                            </div>
                        </div>

                        <!-- Step 4 -->
                        <div class="journey-card-row" data-screen-target="group-project">
                            <div class="journey-card-num">04</div>
                            <div class="journey-card-content">
                                <h4>Mengembangkan &amp; Menyajikan Karya <span class="journey-time-tag">⏱ 25 Menit</span></h4>
                                <p>Berkolaborasi dalam tim merancang solusi antrean kantin, mengisi LKPD terstruktur, dan mengunduh berkas Word (.doc) untuk presentasi.</p>
                            </div>
                            <div class="journey-card-action">
                                <button type="button" class="btn-journey-jump">Buka LKPD</button>
                            </div>
                        </div>

                        <!-- Step 5 -->
                        <div class="journey-card-row" data-screen-target="evaluation">
                            <div class="journey-card-num">05</div>
                            <div class="journey-card-content">
                                <h4>Menganalisis &amp; Evaluasi Proses <span class="journey-time-tag">⏱ 10 Menit</span></h4>
                                <p>Mengerjakan asesmen sumatif (5 soal HOTS), meninjau skor &amp; pembahasan, pengayaan materi, dan refleksi 3-2-1.</p>
                            </div>
                            <div class="journey-card-action">
                                <button type="button" class="btn-journey-jump">Ikuti Evaluasi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 5. TUJUAN PEMBELAJARAN (#FAF8F5 - CRISP LINEN) -->
            <section class="studio-section studio-goals-section" id="section-goals">
                <div class="studio-container">
                    <div class="goals-editorial-tag">04 / Standar Kompetensi</div>
                    <h2 class="goals-editorial-title">Tujuan Pembelajaran (Fase E SMA)</h2>
                    <p style="font-size: 1.05rem; line-height: 1.65; color: #4A332D; max-width: 800px; margin: 0 0 1.5rem 0;">
                        Dirumuskan berdasarkan Capaian Pembelajaran Informatika Fase E dengan formula ABCD (Audience, Behavior, Condition, Degree):
                    </p>

                    <div class="goals-stack-list">
                        <!-- Goal 1 -->
                        <div class="goal-card-item goal-1">
                            <div class="goal-num-badge">1</div>
                            <div class="goal-info">
                                <h4>Analisis Perbedaan Prinsip LIFO &amp; FIFO <span class="goal-cognitive-tag">Kognitif C4 - Analisis</span></h4>
                                <p>
                                    Melalui pengamatan dan analisis studi kasus pelayanan kantin sekolah, peserta didik dapat <strong>menganalisis perbedaan prinsip kerja</strong> struktur data Stack (LIFO) dan Queue (FIFO) dengan tepat, sekurang-kurangnya <strong>4 dari 5 pernyataan atau contoh kasus</strong>.
                                </p>
                            </div>
                        </div>

                        <!-- Goal 2 -->
                        <div class="goal-card-item goal-2">
                            <div class="goal-num-badge">2</div>
                            <div class="goal-info">
                                <h4>Praktik Operasi Simulasi Interaktif <span class="goal-cognitive-tag">Kognitif C3 - Aplikasi</span></h4>
                                <p>
                                    Melalui penggunaan simulasi interaktif struktur data Stack dan Queue, peserta didik dapat <strong>mempraktikkan operasi dasar</strong> push, pop, peek, enqueue, dan dequeue serta <strong>menjelaskan perubahan elemen</strong> pada masing-masing struktur data dengan ketepatan <strong>minimal 80%</strong>.
                                </p>
                            </div>
                        </div>

                        <!-- Goal 3 -->
                        <div class="goal-card-item goal-3">
                            <div class="goal-num-badge">3</div>
                            <div class="goal-info">
                                <h4>Perancangan Solusi Algoritmik &amp; LKPD <span class="goal-cognitive-tag">Kognitif C6 - Kreasi</span></h4>
                                <p>
                                    Melalui kegiatan diskusi dan penyelesaian LKPD secara berkelompok, peserta didik dapat <strong>merancang solusi algoritmik</strong> untuk mengatasi permasalahan pelayanan kantin sekolah dengan menerapkan konsep Stack dan Queue secara tepat berdasarkan <strong>minimal 3 kriteria penilaian</strong>: ketepatan konsep, urutan langkah penyelesaian, dan kejelasan solusi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 6. STUDIO CTA BANNER (#E76814 -> #B8210F GRADIENT) -->
            <section class="studio-section studio-cta-section">
                <div class="studio-container">
                    <h2 class="cta-editorial-title">Siap Memecahkan Masalah Kantin dengan Berpikir Komputasional?</h2>
                    <p class="cta-editorial-sub">
                        Mulai eksplorasi materi dari pemahaman awal, uji keterampilan logikamu di laboratorium game 6 level, dan susun karya terbaik bersama kelompok!
                    </p>
                    <div class="cta-buttons-row">
                        <button type="button" class="btn-cta-light" data-screen-target="learn-intro">
                            <span>🚀</span> Mulai Belajar (Pemahaman Awal)
                        </button>
                        <button type="button" class="btn-cta-trans" data-screen-target="individual-tasks">
                            <span>🎮</span> Mainkan 6 Level Game Simulasi
                        </button>
                        <button type="button" class="btn-cta-trans" data-screen-target="group-project">
                            <span>👥</span> Kolaborasi Kelompok (LKPD)
                        </button>
                    </div>
                </div>
            </section>

        </section>`;

// Line index 169 is `<main class="main-wrapper">`
// Lines 170 to 483 are being replaced.
// Line 484 is the blank line before `<!-- SCREEN KHUSUS: TUGAS INDIVIDU ...`
const newLines = [
    ...lines.slice(0, 169), // up to and including line 169
    newHomeContent,
    ...lines.slice(483)     // from line 484 onwards
];

const newHtml = newLines.join('\n');
fs.writeFileSync('scratch/test_index.html', newHtml, 'utf8');
console.log('scratch/test_index.html regenerated. Line count:', newLines.length);

