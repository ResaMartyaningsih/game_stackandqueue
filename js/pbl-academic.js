/**
 * js/pbl-academic.js
 * Modul Interaktif Problem Based Learning (PBL) Informatika Fase E
 * Meliputi: Tugas Individu (6 Level Progresif 90 Menit), Evaluasi Sumatif,
 * Pengayaan & Remedial, Refleksi Individu, serta Panduan & Glosarium.
 */

const PBLAcademic = {
    // ----------------------------------------------------
    // DATA TUGAS INDIVIDU (6 LEVEL PROGRESIF - 2 JP / 90 MENIT)
    // ----------------------------------------------------
    individualTasks: [
        {
            level: 1,
            title: "Level 1: Konsep Dasar di Kantin Sekolah",
            cognitive: "C2 - Memahami Karakteristik",
            scenario: "Saat jam istirahat di kantin SMAN 1, Andi mengamati dua aktivitas: (1) Siswa yang antre berurutan di loket kasir bakso, dan (2) Tumpukan piring makan bersih yang baru dicuci oleh petugas di meja saji.",
            question: "Tentukan pasangan struktur data dan prinsip kerja yang paling tepat untuk masing-masing aktivitas tersebut!",
            options: [
                "A. (1) Antrean kasir = Queue (FIFO), (2) Tumpukan piring = Stack (LIFO)",
                "B. (1) Antrean kasir = Stack (LIFO), (2) Tumpukan piring = Queue (FIFO)",
                "C. (1) Antrean kasir = Queue (LIFO), (2) Tumpukan piring = Stack (FIFO)",
                "D. (1) Antrean kasir = Array acak, (2) Tumpukan piring = Binary Tree"
            ],
            correct: 0,
            explanation: "Tepat sekali! Antrean kasir menerapkan Queue dengan prinsip FIFO (First In, First Out) agar siswa yang datang lebih awal dilayani lebih dulu. Sedangkan tumpukan piring menerapkan Stack dengan prinsip LIFO (Last In, First Out) karena piring yang ditaruh terakhir di puncak tumpukan akan diambil pertama kali."
        },
        {
            level: 2,
            title: "Level 2: Simulasi Antrean Kasir (enqueue & dequeue)",
            cognitive: "C3 - Menerapkan Operasi Queue",
            scenario: "Loket kasir kantin mula-mula kosong. Datang 4 siswa berturut-turut memesan makanan: Budi, Citra, Dodi, Eka (operasi enqueue). Kasir kemudian melayani dan menyelesaikan transaksi 2 orang pertama (operasi dequeue). Setelah itu, datang lagi 1 siswa baru bernama Fani (operasi enqueue).",
            question: "Siapakah siswa yang saat ini berada di posisi terdepan (FRONT) yang siap dilayani berikutnya, dan berapa total siswa yang masih mengantre?",
            options: [
                "A. Siswa terdepan: Dodi, Total sisa antrean: 3 siswa (Dodi, Eka, Fani)",
                "B. Siswa terdepan: Citra, Total sisa antrean: 2 siswa (Citra, Dodi)",
                "C. Siswa terdepan: Budi, Total sisa antrean: 4 siswa (Budi, Dodi, Eka, Fani)",
                "D. Siswa terdepan: Fani, Total sisa antrean: 3 siswa (Fani, Eka, Dodi)"
            ],
            correct: 0,
            explanation: "Benar! Tracing antrean: Masuk [Budi, Citra, Dodi, Eka]. Dua orang dilayani/keluar (dequeue): Budi keluar, lalu Citra keluar. Sisa antrean menjadi [Dodi, Eka]. Fani masuk (enqueue) di belakang (REAR). Antrean terkini: [Dodi (FRONT), Eka, Fani (REAR)]. Siswa terdepan adalah Dodi dan sisa antrean adalah 3 orang."
        },
        {
            level: 3,
            title: "Level 3: Simulasi Tumpukan Piring (push & pop)",
            cognitive: "C3 - Menerapkan Operasi Stack",
            scenario: "Petugas kantin menumpuk piring bersih ke wadah piring: Piring Merah (P1), Piring Biru (P2), Piring Hijau (P3) dengan memanggil fungsi push(). Seorang siswa lalu mengambil 1 piring dengan memanggil fungsi pop(). Petugas kemudian menaruh Piring Kuning (P4) di atas tumpukan dengan push().",
            question: "Jika seorang siswa berikutnya datang mengambil piring menggunakan operasi pop(), piring warna apakah yang akan ia peroleh?",
            options: [
                "A. Piring Kuning (P4)",
                "B. Piring Hijau (P3)",
                "C. Piring Biru (P2)",
                "D. Piring Merah (P1)"
            ],
            correct: 0,
            explanation: "Tepat sekali! Tracing Stack: push(P1), push(P2), push(P3). Tumpukan saat ini [P1, P2, P3(TOP)]. Pop() mengambil P3, sehingga tumpukan tersisa [P1, P2(TOP)]. Petugas lalu push(P4), sehingga tumpukan menjadi [P1, P2, P4(TOP)]. Saat operasi pop() berikutnya dipanggil, piring di posisi TOP yaitu Piring Kuning (P4) yang keluar!"
        },
        {
            level: 4,
            title: "Level 4: Tracing & Rekayasa Urutan (LIFO vs FIFO)",
            cognitive: "C4 - Menganalisis Pembalikan Urutan",
            scenario: "Tiga nomor pesanan makanan [101, 102, 103] dimasukkan ke dalam sistem pemrosesan secara berurutan. Sistem X memproses pesanan dengan hasil urutan pengeluaran [103, 102, 101]. Sedangkan Sistem Y memproses dengan urutan pengeluaran [101, 102, 103].",
            question: "Berdasarkan pola urutan keluaran data tersebut, struktur data apakah yang digunakan oleh Sistem X dan Sistem Y?",
            options: [
                "A. Sistem X menggunakan Stack (LIFO), Sistem Y menggunakan Queue (FIFO)",
                "B. Sistem X menggunakan Queue (FIFO), Sistem Y menggunakan Stack (LIFO)",
                "C. Kedua sistem menggunakan Stack (LIFO)",
                "D. Kedua sistem menggunakan Queue (FIFO)"
            ],
            correct: 0,
            explanation: "Sangat tepat! Sistem X menghasilkan urutan terbalik dari urutan masukan ([101, 102, 103] menjadi [103, 102, 101]), ini merupakan ciri khas Stack (LIFO - pembalikan urutan). Sistem Y mempertahankan urutan kedatangan asli ([101, 102, 103] tetap [101, 102, 103]), yang merupakan ciri mutlak Queue (FIFO)."
        }
    ],

    currentTaskLevel: 1,
    selectedTaskOption: null,

    init() {
        this.renderTaskLevel(this.currentTaskLevel);
        this.restoreTaskProgress();
        this.bindEvents();
        this.initHeroSim();
    },

    bindEvents() {
        // Handle global tab switches in guidelines & enrichment
        document.querySelectorAll('.academic-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = btn.getAttribute('data-tab');
                const parent = btn.closest('.academic-tabs-wrapper') || btn.parentElement.parentElement;
                if (!parent || !targetTab) return;

                parent.querySelectorAll('.academic-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                parent.querySelectorAll('.academic-tab-pane').forEach(p => {
                    p.classList.toggle('active', p.getAttribute('data-pane') === targetTab);
                });
            });
        });

        // Handle dropdown toggle on click / touch
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parent = btn.closest('.nav-dropdown');
                if (!parent) return;
                const wasOpen = parent.classList.contains('open');
                document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
                if (!wasOpen) {
                    parent.classList.add('open');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
            }
        });

        // Close dropdown when an item is selected
        document.querySelectorAll('.nav-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
            });
        });
    },

    // ----------------------------------------------------
    // INDIVIDUAL TASKS MANAGER
    // ----------------------------------------------------
    renderTaskLevel(lvl) {
        this.currentTaskLevel = lvl;
        this.selectedTaskOption = null;

        const taskData = this.individualTasks.find(t => t.level === lvl) || this.individualTasks[0];

        // Update selector chips
        document.querySelectorAll('.task-level-chip').forEach(chip => {
            const chipLvl = parseInt(chip.getAttribute('data-level'), 10);
            chip.classList.toggle('active', chipLvl === lvl);
        });

        // Populate card UI
        const badgeEl = document.getElementById('task-cognitive-badge');
        const titleEl = document.getElementById('task-title-text');
        const scenarioEl = document.getElementById('task-scenario-text');
        const questionEl = document.getElementById('task-question-text');
        const optionsContainer = document.getElementById('task-options-container');
        const feedbackEl = document.getElementById('task-feedback-box');
        const checkBtn = document.getElementById('task-check-btn');
        const nextBtn = document.getElementById('task-next-btn');

        if (badgeEl) badgeEl.textContent = taskData.cognitive;
        if (titleEl) titleEl.textContent = taskData.title;
        if (scenarioEl) scenarioEl.textContent = `"${taskData.scenario}"`;
        if (questionEl) questionEl.textContent = taskData.question;

        if (feedbackEl) {
            feedbackEl.className = 'academic-feedback-box';
            feedbackEl.textContent = '';
        }

        if (nextBtn) nextBtn.style.display = 'none';
        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.style.display = 'inline-flex';
        }

        // Render options
        if (optionsContainer) {
            optionsContainer.innerHTML = taskData.options.map((opt, idx) => `
                <button type="button" class="academic-option-btn" onclick="PBLAcademic.selectTaskOption(${idx})">
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <span>${opt.substring(3)}</span>
                </button>
            `).join('');
        }

        // Render Interactive Game / Simulation for this Level
        this.renderInteractiveTaskGame(lvl);

        // Restore saved status if completed
        const saved = this.getSavedTaskResult(lvl);
        if (saved && saved.isSubmitted) {
            this.showTaskResultUI(saved.chosenIndex, saved.isCorrect, taskData);
        }
    },

    selectTaskOption(idx) {
        this.selectedTaskOption = idx;
        const options = document.querySelectorAll('#task-options-container .academic-option-btn');
        options.forEach((btn, i) => {
            btn.classList.toggle('selected', i === idx);
        });

        const checkBtn = document.getElementById('task-check-btn');
        if (checkBtn) checkBtn.disabled = false;
    },

    checkTaskAnswer() {
        if (this.selectedTaskOption === null) return;
        const taskData = this.individualTasks.find(t => t.level === this.currentTaskLevel);
        if (!taskData) return;

        const isCorrect = this.selectedTaskOption === taskData.correct;
        this.saveTaskResult(this.currentTaskLevel, this.selectedTaskOption, isCorrect);
        this.showTaskResultUI(this.selectedTaskOption, isCorrect, taskData);
        this.updateTaskChipsState();
    },

    showTaskResultUI(chosenIndex, isCorrect, taskData) {
        const options = document.querySelectorAll('#task-options-container .academic-option-btn');
        options.forEach((btn, i) => {
            btn.disabled = true;
            if (i === taskData.correct) {
                btn.classList.add('correct');
            } else if (i === chosenIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        const feedbackEl = document.getElementById('task-feedback-box');
        if (feedbackEl) {
            feedbackEl.className = `academic-feedback-box show ${isCorrect ? 'correct' : 'wrong'}`;
            feedbackEl.innerHTML = `
                <strong>${isCorrect ? '✓ Jawaban Tepat!' : '⚠️ Perlu Koreksi:'}</strong> ${taskData.explanation}
            `;
        }

        const checkBtn = document.getElementById('task-check-btn');
        const nextBtn = document.getElementById('task-next-btn');
        if (checkBtn) checkBtn.style.display = 'none';

        if (nextBtn) {
            nextBtn.style.display = 'inline-flex';
            if (this.currentTaskLevel < 4) {
                nextBtn.textContent = `Lanjut ke Level ${this.currentTaskLevel + 1} ➔`;
                nextBtn.onclick = () => PBLAcademic.goToNextTaskLevel();
            } else {
                nextBtn.textContent = '🎉 Semua 4 Level Tuntas! Buka Tugas Kelompok ➔';
                nextBtn.onclick = () => UI.switchScreen('group-project');
            }
        }

        if (window.UI) {
            if (isCorrect) {
                UI.showToast(`✓ Level ${this.currentTaskLevel} Selesai dengan Benar! (+25 Poin)`);
            } else {
                UI.showToast(`⚠️ Jawaban Level ${this.currentTaskLevel} dicatat. Pelajari pembahasannya!`);
            }
        }
    },

    goToNextTaskLevel() {
        if (this.currentTaskLevel < 4) {
            this.renderTaskLevel(this.currentTaskLevel + 1);
        }
    },

    saveTaskResult(lvl, chosenIndex, isCorrect) {
        if (!window.StorageManager) return;
        if (!StorageManager.data.individualTasks) {
            StorageManager.data.individualTasks = {};
        }
        StorageManager.data.individualTasks[lvl] = {
            level: lvl,
            chosenIndex,
            isCorrect,
            isSubmitted: true,
            savedAt: new Date().toISOString()
        };
        StorageManager.save();
    },

    getSavedTaskResult(lvl) {
        if (!window.StorageManager || !StorageManager.data.individualTasks) return null;
        return StorageManager.data.individualTasks[lvl] || null;
    },

    updateTaskChipsState() {
        if (!window.StorageManager || !StorageManager.data.individualTasks) return;
        let completedCount = 0;
        document.querySelectorAll('.task-level-chip').forEach(chip => {
            const lvl = parseInt(chip.getAttribute('data-level'), 10);
            const saved = StorageManager.data.individualTasks[lvl];
            if (saved && saved.isSubmitted) {
                chip.classList.add('completed');
                completedCount++;
            }
        });

        const progressLabel = document.getElementById('tasks-overall-progress');
        if (progressLabel) {
            progressLabel.textContent = `${completedCount} dari 4 Level Selesai (${Math.round((completedCount/4)*100)}%)`;
        }
    },

    restoreTaskProgress() {
        this.updateTaskChipsState();
    },

    // ----------------------------------------------------
    // DIAGNOSTIC READINESS CHECK (SCREEN LEARN INTRO)
    // ----------------------------------------------------
    checkDiagnostic(btn, isCorrect) {
        const parent = btn.closest('.academic-page-container') || document;
        const buttons = parent.querySelectorAll('.academic-option-btn');
        buttons.forEach(b => b.classList.remove('selected', 'correct', 'wrong'));

        const feedback = document.getElementById('diagnostic-feedback');
        if (isCorrect) {
            btn.classList.add('correct');
            if (feedback) {
                feedback.className = 'academic-feedback-box show correct';
                feedback.innerHTML = '<strong>✓ Tepat Sekali!</strong> Prinsip FIFO (First In, First Out) pada struktur data Queue memastikan bahwa pelanggan yang datang terlebih dahulu akan dilayani terlebih dahulu, menjamin rasa keadilan bagi siswa di kantin.';
            }
            if (window.UI) UI.showToast('✓ Kesiapan belajar terkonfirmasi! Silakan lanjutkan ke Materi Stack.');
        } else {
            btn.classList.add('wrong');
            if (feedback) {
                feedback.className = 'academic-feedback-box show wrong';
                feedback.innerHTML = '<strong>⚠️ Kurang Tepat.</strong> Ingat kembali: jika kita ingin melayani yang datang lebih awal (adil), kita menggunakan prinsip First In First Out (Queue), bukan LIFO (Stack). Coba pilih opsi A!';
            }
        }
    },

    // ----------------------------------------------------
    // INTERACTIVE GAMES & SIMULATION FOR 6 TASK LEVELS
    // ----------------------------------------------------
    renderInteractiveTaskGame(lvl) {
        const container = document.getElementById('task-interactive-container');
        if (!container) return;

        switch (lvl) {
            case 1:
                this.renderLevel1Matching(container);
                break;
            case 2:
                this.renderLevel2Queue(container);
                break;
            case 3:
                this.renderLevel3Stack(container);
                break;
            case 4:
                this.renderLevel4Conveyor(container);
                break;
            case 5:
                this.renderLevel5Guard(container);
                break;
            case 6:
                this.renderLevel6Builder(container);
                break;
            default:
                container.innerHTML = '';
        }
    },

    // --- LEVEL 1: MATCHING GAME (PILAH KARTU STACK VS QUEUE) ---
    lvl1CardsData: [
        { id: 'c1', text: '🚶 Antrean siswa beli tiket makan di kasir kantin', type: 'queue' },
        { id: 'c2', text: '🍽️ Tumpukan piring bersih baru dicuci di meja saji', type: 'stack' },
        { id: 'c3', text: '↩️ Tombol Undo membatalkan ketikan teks terakhir', type: 'stack' },
        { id: 'c4', text: '🖨️ Antrean dokumen dikirim ke mesin printer sekolah', type: 'queue' },
        { id: 'c5', text: '🌐 Tombol Back pada browser ke halaman sebelumnya', type: 'stack' },
        { id: 'c6', text: '🚗 Antrean mobil di pintu gerbang parkir sekolah', type: 'queue' }
    ],
    lvl1SelectedCard: null,
    lvl1BucketStack: [],
    lvl1BucketQueue: [],

    renderLevel1Matching(container) {
        const unassigned = this.lvl1CardsData.filter(
            c => !this.lvl1BucketStack.includes(c.id) && !this.lvl1BucketQueue.includes(c.id)
        );

        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🎮 Game Misi: Pilah Kartu Kasus (Matching Game)</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Klik salah satu kartu di bawah, lalu masukkan ke dalam wadah STACK atau QUEUE!</div>
                    </div>
                    <span class="academic-badge academic-badge-blue">Sisa Kartu: ${unassigned.length} / 6</span>
                </div>

                <!-- Deck Kartu Tersedia -->
                <div style="margin-bottom: 0.5rem; font-size: 0.82rem; font-weight: 700; color: #714236;">
                    Pilih Kartu Kasus:
                </div>
                <div class="matching-card-deck">
                    ${unassigned.length === 0 ? 
                        '<div style="font-size: 0.85rem; color: #E76814; font-weight: 800; padding: 0.5rem;">🎉 Semua kartu telah dimasukkan ke dalam wadah! Klik "Periksa Hasil Klasifikasi" di bawah.</div>' : 
                        unassigned.map(card => `
                            <button type="button" class="matching-card-chip ${this.lvl1SelectedCard === card.id ? 'selected' : ''}" onclick="PBLAcademic.selectLvl1Card('${card.id}')">
                                <span>📄</span> <span>${card.text}</span>
                            </button>
                        `).join('')
                    }
                </div>

                <!-- 2 Wadah Drop Buckets -->
                <div class="matching-buckets-grid">
                    <!-- Bucket 1: Stack -->
                    <div class="matching-bucket bucket-stack">
                        <div class="bucket-header">
                            <div>
                                <h4 style="color: #891A10;">📦 Wadah STACK</h4>
                                <small style="color: #B8210F; font-weight: 700;">Prinsip: LIFO (Tumpukan)</small>
                            </div>
                            <button type="button" class="hero-btn-mini" style="background: #891A10; color: #FAF8F5;" onclick="PBLAcademic.assignLvl1Card('stack')" ${!this.lvl1SelectedCard ? 'disabled' : ''}>
                                + Masukkan ke Stack
                            </button>
                        </div>
                        <div class="bucket-drop-zone">
                            ${this.lvl1BucketStack.length === 0 ? 
                                '<div style="font-size: 0.8rem; color: #8F726A; font-style: italic; text-align: center; margin-top: 1.5rem;">Belum ada kartu di wadah Stack</div>' :
                                this.lvl1BucketStack.map(id => {
                                    const card = this.lvl1CardsData.find(c => c.id === id);
                                    return `
                                        <div class="bucket-assigned-item" style="border-left: 3px solid #891A10;">
                                            <span>${card.text}</span>
                                            <button type="button" class="bucket-remove-btn" onclick="PBLAcademic.removeLvl1Card('${id}')" title="Keluarkan kartu">✕</button>
                                        </div>
                                    `;
                                }).join('')
                            }
                        </div>
                    </div>

                    <!-- Bucket 2: Queue -->
                    <div class="matching-bucket bucket-queue">
                        <div class="bucket-header">
                            <div>
                                <h4 style="color: #E76814;">👥 Wadah QUEUE</h4>
                                <small style="color: #DC8236; font-weight: 700;">Prinsip: FIFO (Antrean)</small>
                            </div>
                            <button type="button" class="hero-btn-mini" style="background: #E76814; color: #FAF8F5;" onclick="PBLAcademic.assignLvl1Card('queue')" ${!this.lvl1SelectedCard ? 'disabled' : ''}>
                                + Masukkan ke Queue
                            </button>
                        </div>
                        <div class="bucket-drop-zone">
                            ${this.lvl1BucketQueue.length === 0 ? 
                                '<div style="font-size: 0.8rem; color: #8F726A; font-style: italic; text-align: center; margin-top: 1.5rem;">Belum ada kartu di wadah Queue</div>' :
                                this.lvl1BucketQueue.map(id => {
                                    const card = this.lvl1CardsData.find(c => c.id === id);
                                    return `
                                        <div class="bucket-assigned-item" style="border-left: 3px solid #E76814;">
                                            <span>${card.text}</span>
                                            <button type="button" class="bucket-remove-btn" onclick="PBLAcademic.removeLvl1Card('${id}')" title="Keluarkan kartu">✕</button>
                                        </div>
                                    `;
                                }).join('')
                            }
                        </div>
                    </div>
                </div>

                <!-- Tombol Periksa Game -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1.5px solid #D8D4BC; padding-top: 0.75rem;">
                    <div id="lvl1-game-status" style="font-size: 0.85rem; font-weight: 700; color: #714236;">
                        Pilah seluruh kartu ke dalam wadah yang sesuai!
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="academic-btn academic-btn-outline" style="padding: 0.4rem 0.85rem; font-size: 0.84rem;" onclick="PBLAcademic.resetLvl1Game()">
                            🔄 Reset Kartu
                        </button>
                        <button type="button" class="academic-btn academic-btn-primary" style="padding: 0.4rem 1.15rem; font-size: 0.85rem;" onclick="PBLAcademic.checkLvl1Matching()">
                            ✓ Periksa Hasil Klasifikasi
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    selectLvl1Card(cardId) {
        this.lvl1SelectedCard = cardId;
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel1Matching(container);
    },

    assignLvl1Card(bucketType) {
        if (!this.lvl1SelectedCard) return;
        if (bucketType === 'stack') {
            this.lvl1BucketStack.push(this.lvl1SelectedCard);
        } else {
            this.lvl1BucketQueue.push(this.lvl1SelectedCard);
        }
        this.lvl1SelectedCard = null;
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel1Matching(container);
    },

    removeLvl1Card(cardId) {
        this.lvl1BucketStack = this.lvl1BucketStack.filter(id => id !== cardId);
        this.lvl1BucketQueue = this.lvl1BucketQueue.filter(id => id !== cardId);
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel1Matching(container);
    },

    resetLvl1Game() {
        this.lvl1SelectedCard = null;
        this.lvl1BucketStack = [];
        this.lvl1BucketQueue = [];
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel1Matching(container);
    },

    checkLvl1Matching() {
        const totalAssigned = this.lvl1BucketStack.length + this.lvl1BucketQueue.length;
        if (totalAssigned < 6) {
            alert(`Masih ada ${6 - totalAssigned} kartu yang belum kamu masukkan ke dalam wadah!`);
            return;
        }

        let correctCount = 0;
        this.lvl1BucketStack.forEach(id => {
            const card = this.lvl1CardsData.find(c => c.id === id);
            if (card && card.type === 'stack') correctCount++;
        });
        this.lvl1BucketQueue.forEach(id => {
            const card = this.lvl1CardsData.find(c => c.id === id);
            if (card && card.type === 'queue') correctCount++;
        });

        const statusEl = document.getElementById('lvl1-game-status');
        if (correctCount === 6) {
            if (statusEl) {
                statusEl.innerHTML = '<span style="color: #E76814; font-weight: 800;">✓ Luar Biasa! Semua kartu terklasifikasi 100% tepat!</span>';
            }
            this.selectTaskOption(0); // Option A is correct
            this.checkTaskAnswer();
            if (window.UI) UI.showToast("🎉 Klasifikasi Sempurna (6/6)! Level 1 Tuntas.");
        } else {
            if (statusEl) {
                statusEl.innerHTML = `<span style="color: #B8210F; font-weight: 800;">⚠️ Hasil: ${correctCount}/6 tepat. Ada kartu yang tertukar wadah. Coba cek prinsip LIFO vs FIFO lagi!</span>`;
            }
            if (window.UI) UI.showToast(`⚠️ ${correctCount}/6 kartu tepat. Cek kembali posisi kartumu!`);
        }
    },

    // --- LEVEL 2: SIMULASI ANTREAN KASIR KANTIN (QUEUE) ---
    lvl2QueueData: ['Budi', 'Citra', 'Dodi', 'Eka'],

    renderLevel2Queue(container) {
        const frontPerson = this.lvl2QueueData.length > 0 ? this.lvl2QueueData[0] : '-';
        const rearPerson = this.lvl2QueueData.length > 0 ? this.lvl2QueueData[this.lvl2QueueData.length - 1] : '-';

        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🧪 Simulator Praktik: Jalur Antrean Kasir Kantin</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Misi: Layani 2 orang pertama dengan <code>dequeue()</code>, lalu masukkan siswa Fani dengan <code>enqueue()</code>!</div>
                    </div>
                    <span class="academic-badge academic-badge-emerald">Total Antre: ${this.lvl2QueueData.length} Orang</span>
                </div>

                <!-- Info Bar: FRONT & REAR -->
                <div style="display: flex; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
                    <div style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 8px; padding: 0.4rem 0.85rem; font-size: 0.84rem;">
                        <strong>Posisi FRONT (Depan):</strong> <span style="color: #891A10; font-weight: 800;">${frontPerson}</span>
                    </div>
                    <div style="background: #FAF8F5; border: 1.5px solid #D8D4BC; border-radius: 8px; padding: 0.4rem 0.85rem; font-size: 0.84rem;">
                        <strong>Posisi REAR (Belakang):</strong> <span style="color: #E76814; font-weight: 800;">${rearPerson}</span>
                    </div>
                </div>

                <!-- Visual Queue Lane -->
                <div class="game-sim-stage">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: #FAF6ED; border: 1.5px solid #E76814; border-radius: 8px; padding: 0.5rem 0.75rem; font-weight: 800; font-size: 0.8rem; color: #891A10;">
                        <span>🏪</span> LOKET KASIR<br><small style="color: #E76814;">(FRONT)</small>
                    </div>
                    <span style="color: #DC8236; font-weight: bold; font-size: 1.2rem;">◀</span>
                    ${this.lvl2QueueData.length === 0 ? 
                        '<span style="font-size: 0.85rem; color: #8F726A; font-style: italic;">Antrean kasir sedang kosong</span>' :
                        this.lvl2QueueData.map((name, idx) => `
                            <div class="student-queue-chip" style="${idx === 0 ? 'border: 2px solid #E76814; background: #FAF3EA;' : ''}">
                                <span>👤 ${name}</span>
                                ${idx === 0 ? '<span style="font-size: 0.65rem; background: #E76814; color: #FAF8F5; padding: 1px 4px; border-radius: 4px;">FRONT</span>' : ''}
                                ${idx === this.lvl2QueueData.length - 1 && idx !== 0 ? '<span style="font-size: 0.65rem; background: #DC8236; color: #FAF8F5; padding: 1px 4px; border-radius: 4px;">REAR</span>' : ''}
                            </div>
                        `).join('<span style="color: #D8D4BC; font-weight: bold;">◀</span>')
                    }
                    <span style="color: #DC8236; font-weight: bold; font-size: 1.2rem;">◀</span>
                    <div style="font-size: 0.75rem; color: #714236; font-weight: 700; text-align: center;">
                        🚪 PINTU MASUK<br><small>(REAR)</small>
                    </div>
                </div>

                <!-- Interactive Queue Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.85rem;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button type="button" class="hero-btn-mini hero-btn-mini-primary" onclick="PBLAcademic.lvl2Enqueue('Fani')">
                            ➕ Enqueue Fani (Masuk di REAR)
                        </button>
                        <button type="button" class="hero-btn-mini hero-btn-mini-amber" onclick="PBLAcademic.lvl2Dequeue()">
                            ➖ Dequeue (Kasir Layani FRONT)
                        </button>
                        <button type="button" class="hero-btn-mini" style="background: #FAF8F5; color: #714236; border: 1.5px solid #D8D4BC;" onclick="PBLAcademic.lvl2Reset()">
                            🔄 Reset Skenario Kasir
                        </button>
                    </div>
                    <div style="font-size: 0.8rem; color: #714236;">
                        <em>Amati perubahan siswa di posisi FRONT dan REAR!</em>
                    </div>
                </div>
            </div>
        `;
    },

    lvl2Enqueue(name) {
        this.lvl2QueueData.push(name);
        if (window.UI) UI.showToast(`+ Enqueue: Siswa ${name} antre di belakang (REAR).`);
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel2Queue(container);
    },

    lvl2Dequeue() {
        if (this.lvl2QueueData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Antrean kasir kosong (Queue Underflow)!");
            return;
        }
        const served = this.lvl2QueueData.shift();
        if (window.UI) UI.showToast(`- Dequeue: Kasir melayani ${served} di posisi FRONT (FIFO).`);
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel2Queue(container);
    },

    lvl2Reset() {
        this.lvl2QueueData = ['Budi', 'Citra', 'Dodi', 'Eka'];
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel2Queue(container);
    },

    // --- LEVEL 3: SIMULASI TUMPUKAN PIRING (STACK) ---
    lvl3StackData: ['Piring Merah (P1)', 'Piring Biru (P2)', 'Piring Hijau (P3)'],

    renderLevel3Stack(container) {
        const topPlate = this.lvl3StackData.length > 0 ? this.lvl3StackData[this.lvl3StackData.length - 1] : '-';
        const bottomPlate = this.lvl3StackData.length > 0 ? this.lvl3StackData[0] : '-';

        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🧪 Simulator Praktik: Rak Tumpukan Piring Bersih</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Misi: Ambil 1 piring teratas dengan <code>pop()</code>, lalu taruh Piring Kuning (P4) dengan <code>push()</code>!</div>
                    </div>
                    <span class="academic-badge academic-badge-indigo">Tinggi Tumpukan: ${this.lvl3StackData.length} Piring</span>
                </div>

                <!-- Info Bar: TOP & BOTTOM -->
                <div style="display: flex; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;">
                    <div style="background: #FAF3F0; border: 1.5px solid #D8D4BC; border-radius: 8px; padding: 0.4rem 0.85rem; font-size: 0.84rem;">
                        <strong>Posisi Puncak (TOP):</strong> <span style="color: #891A10; font-weight: 800;">${topPlate}</span>
                    </div>
                    <div style="background: #FAF8F5; border: 1.5px solid #D8D4BC; border-radius: 8px; padding: 0.4rem 0.85rem; font-size: 0.84rem;">
                        <strong>Posisi Dasar (BOTTOM):</strong> <span style="color: #714236; font-weight: 800;">${bottomPlate}</span>
                    </div>
                </div>

                <!-- Vertical Stack Chamber -->
                <div class="game-sim-stage vertical-stack">
                    ${this.lvl3StackData.length === 0 ? 
                        '<div style="font-size: 0.85rem; color: #8F726A; font-style: italic; margin: auto;">Rak piring kosong (Stack Underflow)</div>' :
                        this.lvl3StackData.map((plate, idx) => {
                            const isTop = idx === this.lvl3StackData.length - 1;
                            let bgColor = '#FAF3F0';
                            let borderColor = '#891A10';
                            let textColor = '#891A10';
                            if (plate.includes('Biru')) { bgColor = '#FAF6ED'; borderColor = '#E76814'; textColor = '#714236'; }
                            if (plate.includes('Hijau')) { bgColor = '#F5EBE1'; borderColor = '#DC8236'; textColor = '#714236'; }
                            if (plate.includes('Kuning') || plate.includes('P4')) { bgColor = '#FFF7EB'; borderColor = '#DC8236'; textColor = '#891A10'; }
                            return `
                                <div class="plate-item-box" style="background: ${bgColor}; border-color: ${borderColor}; color: ${textColor};">
                                    🍽️ ${plate} ${isTop ? '<span style="font-size: 0.7rem; background: #891A10; color: #FAF8F5; padding: 2px 6px; border-radius: 4px; margin-left: 0.4rem;">TOP</span>' : ''}
                                </div>
                            `;
                        }).join('')
                    }
                </div>

                <!-- Controls -->
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.85rem;">
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button type="button" class="hero-btn-mini hero-btn-mini-primary" onclick="PBLAcademic.lvl3Push('Piring Kuning (P4)')">
                            ⬇️ Push Piring Kuning (Taruh di TOP)
                        </button>
                        <button type="button" class="hero-btn-mini hero-btn-mini-amber" onclick="PBLAcademic.lvl3Pop()">
                            ⬆️ Pop (Ambil Piring Teratas / TOP)
                        </button>
                        <button type="button" class="hero-btn-mini" style="background: #FAF8F5; color: #714236; border: 1.5px solid #D8D4BC;" onclick="PBLAcademic.lvl3Reset()">
                            🔄 Reset Skenario Rak
                        </button>
                    </div>
                    <div style="font-size: 0.8rem; color: #714236;">
                        <em>Perhatikan bahwa hanya elemen paling atas (TOP) yang dapat diakses!</em>
                    </div>
                </div>
            </div>
        `;
    },

    lvl3Push(plate) {
        this.lvl3StackData.push(plate);
        if (window.UI) UI.showToast(`+ Push: ${plate} ditaruh di puncak tumpukan (TOP).`);
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel3Stack(container);
    },

    lvl3Pop() {
        if (this.lvl3StackData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Rak piring kosong (Stack Underflow)!");
            return;
        }
        const popped = this.lvl3StackData.pop();
        if (window.UI) UI.showToast(`- Pop: ${popped} diambil dari posisi paling atas (LIFO).`);
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel3Stack(container);
    },

    lvl3Reset() {
        this.lvl3StackData = ['Piring Merah (P1)', 'Piring Biru (P2)', 'Piring Hijau (P3)'];
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel3Stack(container);
    },

    // --- LEVEL 4: GAME SABUK KONVEYOR & TRACING URUTAN ---
    renderLevel4Conveyor(container) {
        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🧪 Simulator Tracing: Pembalikan Urutan Masuk vs Keluar</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Data Masukan: <code>[101, 102, 103]</code>. Uji coba kedua mesin untuk melihat struktur data mana yang membalikkan urutan!</div>
                    </div>
                    <span class="academic-badge academic-badge-slate">Analisis LIFO vs FIFO</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <!-- Mesin X: Tabung Silinder Stack -->
                    <div style="background: #FAF3F0; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <strong style="color: #891A10; font-size: 0.92rem;">Mesin X: Tabung Silinder (1 Pintu)</strong>
                            <button type="button" class="hero-btn-mini" style="background: #891A10; color: #FAF8F5;" onclick="PBLAcademic.runLevel4Sim('X')">
                                ▶ Uji Mesin X
                            </button>
                        </div>
                        <div style="font-size: 0.82rem; color: #714236; margin-bottom: 0.5rem;">Data masuk: <code>[101] ➔ [102] ➔ [103]</code></div>
                        <div id="lvl4-output-x" style="background: #FFFFFF; border: 1.5px dashed #D8D4BC; border-radius: 6px; padding: 0.6rem; font-size: 0.85rem; font-weight: 700; color: #891A10; min-height: 38px; display: flex; align-items: center;">
                            Klik "Uji Mesin X" untuk melihat urutan keluaran...
                        </div>
                    </div>

                    <!-- Mesin Y: Sabuk Konveyor Queue -->
                    <div style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <strong style="color: #E76814; font-size: 0.92rem;">Mesin Y: Sabuk Konveyor (2 Ujung)</strong>
                            <button type="button" class="hero-btn-mini" style="background: #E76814; color: #FAF8F5;" onclick="PBLAcademic.runLevel4Sim('Y')">
                                ▶ Uji Mesin Y
                            </button>
                        </div>
                        <div style="font-size: 0.82rem; color: #714236; margin-bottom: 0.5rem;">Data masuk: <code>[101] ➔ [102] ➔ [103]</code></div>
                        <div id="lvl4-output-y" style="background: #FFFFFF; border: 1.5px dashed #D8D4BC; border-radius: 6px; padding: 0.6rem; font-size: 0.85rem; font-weight: 700; color: #E76814; min-height: 38px; display: flex; align-items: center;">
                            Klik "Uji Mesin Y" untuk melihat urutan keluaran...
                        </div>
                    </div>
                </div>

                <div style="font-size: 0.84rem; color: #714236; background: #FAF8F5; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1.5px solid #D8D4BC;">
                    💡 <strong>Temuan Komputasional:</strong> Mesin mana yang menghasilkan urutan terbalik <code>[103, 102, 101]</code>? Pilih jawaban analisismu pada opsi di bawah!
                </div>
            </div>
        `;
    },

    runLevel4Sim(machine) {
        const outX = document.getElementById('lvl4-output-x');
        const outY = document.getElementById('lvl4-output-y');
        if (machine === 'X' && outX) {
            outX.innerHTML = '<span style="color: #891A10; font-weight: 800;">Hasil Keluaran: [103] ➔ [102] ➔ [101] (URUTAN DIBALIK / LIFO ➔ Stack!)</span>';
            if (window.UI) UI.showToast("Mesin X: Urutan terbalik [103, 102, 101] (Prinsip Stack LIFO)");
        }
        if (machine === 'Y' && outY) {
            outY.innerHTML = '<span style="color: #E76814; font-weight: 800;">Hasil Keluaran: [101] ➔ [102] ➔ [103] (URUTAN ASLI TETAP / FIFO ➔ Queue!)</span>';
            if (window.UI) UI.showToast("Mesin Y: Urutan tetap [101, 102, 103] (Prinsip Queue FIFO)");
        }
    },

    // --- LEVEL 5: GAME PENJAGA BATAS MEMORI (OVERFLOW & UNDERFLOW) ---
    lvl5Count: 0,
    lvl5Max: 4,
    lvl5UnderflowGuard: false,
    lvl5OverflowGuard: false,

    renderLevel5Guard(container) {
        const fillPercent = (this.lvl5Count / this.lvl5Max) * 100;
        let meterStatusClass = '';
        if (this.lvl5Count === 0) meterStatusClass = '';
        else if (this.lvl5Count >= this.lvl5Max) meterStatusClass = 'danger';
        else if (this.lvl5Count >= 3) meterStatusClass = 'warning';

        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🧪 Simulator Penanganan Eror: Batas Memori Antrean</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Kapasitas Maksimal: 4 Pesanan. Aktifkan blok pengaman (Guard Clauses) untuk mencegah crash program!</div>
                    </div>
                    <span class="academic-badge academic-badge-amber">Status Buffer: ${this.lvl5Count} / ${this.lvl5Max} Slot</span>
                </div>

                <!-- Memory Meter Bar -->
                <div class="memory-meter-container">
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700; color: #714236;">
                        <span>KOSONG (isEmpty == ${this.lvl5Count === 0})</span>
                        <span>TERISI: ${this.lvl5Count} DARI ${this.lvl5Max}</span>
                        <span>PENUH (isFull == ${this.lvl5Count === this.lvl5Max})</span>
                    </div>
                    <div class="memory-meter-bar-track">
                        <div class="memory-meter-bar-fill ${meterStatusClass}" style="width: ${fillPercent}%;"></div>
                    </div>
                    <div id="lvl5-alert-box" style="min-height: 28px; font-size: 0.84rem; font-weight: 700; color: #714236;">
                        Tekan tombol uji coba di bawah untuk menguji kondisi batas.
                    </div>
                </div>

                <!-- Toggle Guards -->
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <button type="button" class="academic-btn ${this.lvl5UnderflowGuard ? 'academic-btn-success' : 'academic-btn-outline'}" onclick="PBLAcademic.toggleLvl5Guard('underflow')" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                        ${this.lvl5UnderflowGuard ? '🛡️ Guard Underflow: AKTIF' : '⚠️ Pasang Guard: if (isEmpty()) return error'}
                    </button>
                    <button type="button" class="academic-btn ${this.lvl5OverflowGuard ? 'academic-btn-success' : 'academic-btn-outline'}" onclick="PBLAcademic.toggleLvl5Guard('overflow')" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                        ${this.lvl5OverflowGuard ? '🛡️ Guard Overflow: AKTIF' : '⚠️ Pasang Guard: if (isFull()) return error'}
                    </button>
                </div>

                <!-- Action Simulation Controls -->
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button type="button" class="hero-btn-mini hero-btn-mini-primary" onclick="PBLAcademic.testLvl5Enqueue()">
                        ➕ Tambah Pesanan (Enqueue)
                    </button>
                    <button type="button" class="hero-btn-mini hero-btn-mini-amber" onclick="PBLAcademic.testLvl5Dequeue()">
                        ➖ Ambil Pesanan (Dequeue)
                    </button>
                    <button type="button" class="hero-btn-mini" style="background: #FAF8F5; color: #714236; border: 1.5px solid #D8D4BC;" onclick="PBLAcademic.resetLvl5()">
                        🔄 Kosongkan Buffer (0/4)
                    </button>
                </div>
            </div>
        `;
    },

    toggleLvl5Guard(type) {
        if (type === 'underflow') {
            this.lvl5UnderflowGuard = !this.lvl5UnderflowGuard;
        } else {
            this.lvl5OverflowGuard = !this.lvl5OverflowGuard;
        }
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel5Guard(container);
    },

    testLvl5Enqueue() {
        const alertEl = document.getElementById('lvl5-alert-box');
        if (this.lvl5Count >= this.lvl5Max) {
            if (this.lvl5OverflowGuard) {
                if (alertEl) alertEl.innerHTML = '<span style="color: #E76814; font-weight: 800;">🛡️ TERLINDUNGI: Guard isFull() menolak pesanan baru secara aman tanpa crash program!</span>';
                if (window.UI) UI.showToast("🛡️ Overflow dicegah oleh guard condition!");
            } else {
                if (alertEl) alertEl.innerHTML = '<span style="color: #B8210F; font-weight: 800;">🚨 OVERFLOW ERROR CRASH! Memori penuh (4/4), pesanan ke-5 tumpah dan sistem terhenti!</span>';
                if (window.UI) UI.showToast("🚨 Terjadi Overflow Error! Pasang guard clause.");
            }
            return;
        }
        this.lvl5Count++;
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel5Guard(container);
    },

    testLvl5Dequeue() {
        const alertEl = document.getElementById('lvl5-alert-box');
        if (this.lvl5Count === 0) {
            if (this.lvl5UnderflowGuard) {
                if (alertEl) alertEl.innerHTML = '<span style="color: #E76814; font-weight: 800;">🛡️ TERLINDUNGI: Guard isEmpty() mencegah dequeue pada wadah kosong!</span>';
                if (window.UI) UI.showToast("🛡️ Underflow dicegah oleh guard condition!");
            } else {
                if (alertEl) alertEl.innerHTML = '<span style="color: #B8210F; font-weight: 800;">🚨 UNDERFLOW ERROR CRASH! Mengambil data saat buffer kosong (0/4)!</span>';
                if (window.UI) UI.showToast("🚨 Terjadi Underflow Error! Pasang guard clause.");
            }
            return;
        }
        this.lvl5Count--;
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel5Guard(container);
    },

    resetLvl5() {
        this.lvl5Count = 0;
        const container = document.getElementById('task-interactive-container');
        if (container) this.renderLevel5Guard(container);
    },

    // --- LEVEL 6: GAME REKAYASA ARSITEKTUR KANTIN PINTAR ---
    lvl6Choices: { kitchen: '', undo: '', cashier: '' },

    renderLevel6Builder(container) {
        container.innerHTML = `
            <div class="task-game-wrapper">
                <div class="task-game-header">
                    <div>
                        <strong style="color: #891A10; font-size: 0.95rem;">🏗️ Game Arsitektur: Rancang Sistem Kios Mandiri Kantin</strong>
                        <div style="font-size: 0.8rem; color: #714236;">Tentukan struktur data yang tepat untuk masing-masing dari 3 modul kios mandiri sekolah:</div>
                    </div>
                    <span class="academic-badge academic-badge-blue">Tantangan Level 6</span>
                </div>

                <div class="builder-module-grid">
                    <!-- Modul 1 -->
                    <div class="builder-module-card" style="border-top: 4px solid #E76814;">
                        <h4>🍳 1. Antrean Masak Koki Dapur</h4>
                        <p style="font-size: 0.82rem; color: #714236; line-height: 1.4; margin: 0 0 0.5rem 0;">
                            Pesanan dimasak berurutan sesuai pesanan yang masuk terlebih dahulu agar adil.
                        </p>
                        <select class="builder-select" onchange="PBLAcademic.setLvl6Choice('kitchen', this.value)">
                            <option value="">-- Pilih Struktur Data --</option>
                            <option value="queue" ${this.lvl6Choices.kitchen === 'queue' ? 'selected' : ''}>Queue (FIFO - First In First Out)</option>
                            <option value="stack" ${this.lvl6Choices.kitchen === 'stack' ? 'selected' : ''}>Stack (LIFO - Last In First Out)</option>
                        </select>
                    </div>

                    <!-- Modul 2 -->
                    <div class="builder-module-card" style="border-top: 4px solid #891A10;">
                        <h4>↩️ 2. Fitur Batalkan Menu (Undo)</h4>
                        <p style="font-size: 0.82rem; color: #714236; line-height: 1.4; margin: 0 0 0.5rem 0;">
                            Siswa membatalkan item makanan yang paling baru saja dimasukkan ke keranjang belanja.
                        </p>
                        <select class="builder-select" onchange="PBLAcademic.setLvl6Choice('undo', this.value)">
                            <option value="">-- Pilih Struktur Data --</option>
                            <option value="stack" ${this.lvl6Choices.undo === 'stack' ? 'selected' : ''}>Stack (LIFO - Last In First Out)</option>
                            <option value="queue" ${this.lvl6Choices.undo === 'queue' ? 'selected' : ''}>Queue (FIFO - First In First Out)</option>
                        </select>
                    </div>

                    <!-- Modul 3 -->
                    <div class="builder-module-card" style="border-top: 4px solid #DC8236;">
                        <h4>📢 3. Pemanggilan Nomor Pesanan</h4>
                        <p style="font-size: 0.82rem; color: #714236; line-height: 1.4; margin: 0 0 0.5rem 0;">
                            Nomor struk dipanggil sesuai urutan pembayaran yang selesai lebih dulu.
                        </p>
                        <select class="builder-select" onchange="PBLAcademic.setLvl6Choice('cashier', this.value)">
                            <option value="">-- Pilih Struktur Data --</option>
                            <option value="queue" ${this.lvl6Choices.cashier === 'queue' ? 'selected' : ''}>Queue (FIFO - First In First Out)</option>
                            <option value="stack" ${this.lvl6Choices.cashier === 'stack' ? 'selected' : ''}>Stack (LIFO - Last In First Out)</option>
                        </select>
                    </div>
                </div>

                <!-- Simulation Output & Test Button -->
                <div style="background: #FAF8F5; border: 1.5px solid #D8D4BC; border-radius: 10px; padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <div id="lvl6-test-status" style="font-size: 0.85rem; font-weight: 700; color: #714236;">
                        Pilih struktur data untuk ketiga modul di atas lalu jalankan uji integrasi!
                    </div>
                    <button type="button" class="academic-btn academic-btn-primary" onclick="PBLAcademic.testLvl6System()" style="font-size: 0.85rem; padding: 0.45rem 1.15rem;">
                        🚀 Uji Integrasi Sistem Arsitektur
                    </button>
                </div>
            </div>
        `;
    },

    setLvl6Choice(mod, val) {
        this.lvl6Choices[mod] = val;
    },

    testLvl6System() {
        const { kitchen, undo, cashier } = this.lvl6Choices;
        if (!kitchen || !undo || !cashier) {
            alert("Harap tentukan struktur data untuk ketiga modul terlebih dahulu!");
            return;
        }

        const isCorrect = (kitchen === 'queue' && undo === 'stack' && cashier === 'queue');
        const statusEl = document.getElementById('lvl6-test-status');

        if (isCorrect) {
            if (statusEl) {
                statusEl.innerHTML = '<span style="color: #E76814; font-weight: 800;">🎉 UJI SISTEM 100% SUKSES! Dapur (Queue), Undo (Stack), dan Kasir (Queue) terintegrasi sempurna!</span>';
            }
            this.selectTaskOption(0); // Option A is correct
            this.checkTaskAnswer();
            if (window.UI) UI.showToast("🎉 SELAMAT! Seluruh 6 Level Tugas Individu Tuntas dengan Nilai Sempurna!");
        } else {
            if (statusEl) {
                statusEl.innerHTML = '<span style="color: #B8210F; font-weight: 800;">⚠️ Integrasi gagal. Periksa kembali: Undo butuh LIFO (Stack) dan Dapur butuh FIFO (Queue)!</span>';
            }
            if (window.UI) UI.showToast("⚠️ Ada pilihan modul yang belum tepat. Cek kembali!");
        }
    },

    // ----------------------------------------------------
    // EVALUASI AKHIR (ASESMEN SUMATIF 90 MENIT)
    // ----------------------------------------------------
    evalQuestions: [
        {
            q: "1. Mengapa antrean pemesanan kasir kantin sekolah paling tepat dimodelkan dengan struktur data Queue (FIFO)?",
            options: [
                "Karena pelanggan yang datang pertama harus dilayani dan menerima makanan pertama kali demi keadilan pelayanan",
                "Karena pesanan terakhir harus didahulukan agar koki tidak menunggu",
                "Karena data antrean dapat dimasukkan dan dikeluarkan dari ujung yang sama",
                "Karena kapasitas kantin tidak terbatas"
            ],
            correct: 0,
            note: "Prinsip dasar Queue adalah FIFO (First In First Out), memastikan keadilan pelayanan bagi pelanggan yang datang lebih dulu."
        },
        {
            q: "2. Operasi pengambilan dan penghapusan elemen dari puncak tumpukan (Stack) disebut dengan operasi...",
            options: [
                "pop()",
                "push()",
                "dequeue()",
                "enqueue()"
            ],
            correct: 0,
            note: "pop() adalah operasi standar Stack untuk mengambil dan menghapus elemen di posisi TOP."
        },
        {
            q: "3. Tumpukan piring saji kantin berisi 3 piring: Piring A di bawah, Piring B di tengah, dan Piring C di atas. Urutan piring yang akan diambil oleh siswa secara berurutan adalah...",
            options: [
                "C, B, lalu A",
                "A, B, lalu C",
                "B, A, lalu C",
                "A, C, lalu B"
            ],
            correct: 0,
            note: "Stack menganut prinsip LIFO (Last In First Out), maka piring C di posisi paling atas (TOP) diambil pertama, lalu B, dan terakhir A."
        },
        {
            q: "4. Manakah di bawah ini yang merupakan contoh penerapan struktur data Stack dalam aplikasi perangkat lunak sehari-hari?",
            options: [
                "Fitur Undo (Ctrl + Z) pada aplikasi pengolah kata dan tombol Back pada browser web",
                "Antrean pencetakan dokumen pada printer sekolah (print spooler)",
                "Antrean panggilan telepon masuk di pusat layanan bantuan",
                "Sistem pemesanan tiket kereta api online"
            ],
            correct: 0,
            note: "Fitur Undo dan tombol Back browser mengingat riwayat tindakan terakhir untuk dibalikkan terlebih dahulu (LIFO)."
        },
        {
            q: "5. Apa yang terjadi jika kasir mencoba melayani pesanan baru dengan memanggil dequeue() pada saat antrean pembeli sedang kosong?",
            options: [
                "Terjadi kondisi Queue Underflow sehingga program memerlukan validasi pengecekan isEmpty()",
                "Terjadi kondisi Queue Overflow",
                "Program otomatis membuat pesanan fiktif baru",
                "Sistem komputer otomatis menambah memori antrean"
            ],
            correct: 0,
            note: "Mengambil data dari wadah antrean yang kosong disebut Underflow."
        }
    ],

    submitEvaluation() {
        const form = document.getElementById('evaluation-form');
        if (!form) return;

        let score = 0;
        let answeredCount = 0;
        const total = this.evalQuestions.length;

        this.evalQuestions.forEach((item, idx) => {
            const selected = form.querySelector(`input[name="eval-q${idx + 1}"]:checked`);
            if (selected) {
                answeredCount++;
                if (parseInt(selected.value, 10) === item.correct) {
                    score += 20; // 5 soal x 20 = 100
                }
            }
        });

        if (answeredCount < total) {
            alert(`Mohon lengkapi semua soal evaluasi! Kamu baru menjawab ${answeredCount} dari ${total} soal.`);
            return;
        }

        // Display Result Card
        const resultCard = document.getElementById('eval-result-card');
        const scoreVal = document.getElementById('eval-score-number');
        const statusBadge = document.getElementById('eval-status-badge');
        const noteEl = document.getElementById('eval-recommendation-text');

        if (scoreVal) scoreVal.textContent = score;
        const isPassed = score >= 75; // KKTP 75

        if (statusBadge) {
            statusBadge.className = `academic-badge ${isPassed ? 'academic-badge-emerald' : 'academic-badge-amber'}`;
            statusBadge.textContent = isPassed ? '✓ Tuntas (Memenuhi KKTP)' : '⚠️ Perlu Remedial (Belum Tuntas)';
        }

        if (noteEl) {
            if (isPassed) {
                noteEl.innerHTML = `Selamat! Kamu telah mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP). Sangat direkomendasikan untuk melanjutkan ke menu <strong>💡 Pengayaan</strong> guna memperdalam wawasan seputar <em>Priority Queue</em> dan <em>Circular Queue</em>.`;
            } else {
                noteEl.innerHTML = `Nilaimu belum mencapai KKTP minimal 75. Silakan buka menu <strong>💡 Pengayaan &amp; Remedial</strong> (Tab Remedial) untuk mereview ringkasan konsep, lalu coba evaluasi kembali!`;
            }
        }

        if (resultCard) {
            resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }

        // Save evaluation score to storage
        if (window.StorageManager) {
            StorageManager.data.pageScores = StorageManager.data.pageScores || {};
            StorageManager.data.pageScores['evaluation'] = {
                score,
                isPassed,
                savedAt: new Date().toISOString()
            };
            StorageManager.save();
        }

        if (window.UI) {
            UI.showToast(`📝 Evaluasi selesai! Nilai akhir: ${score}/100.`);
        }
    },

    // ----------------------------------------------------
    // REFLEKSI INDIVIDU MANAGER
    // ----------------------------------------------------
    saveReflection() {
        const q1 = document.getElementById('ref-q1')?.value.trim() || '';
        const q2 = document.getElementById('ref-q2')?.value.trim() || '';
        const q3 = document.getElementById('ref-q3')?.value.trim() || '';
        const rating = document.querySelector('input[name="ref-rating"]:checked')?.value || '5';

        if (!q1 || !q2) {
            alert("Harap lengkapi pertanyaan refleksi nomor 1 dan 2 sebelum menyimpan.");
            return;
        }

        const refData = {
            conceptLearned: q1,
            challengingPart: q2,
            actionableSolution: q3,
            rating,
            savedAt: new Date().toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })
        };

        if (window.StorageManager) {
            StorageManager.data.reflection = refData;
            StorageManager.save();
        }

        if (window.UI) {
            UI.showToast("✓ Refleksi individu berhasil disimpan!");
        }

        const msgBox = document.getElementById('reflection-saved-msg');
        if (msgBox) {
            msgBox.style.display = 'block';
            setTimeout(() => { msgBox.style.display = 'none'; }, 4000);
        }
    },

    printReflection() {
        this.saveReflection();
        window.print();
    },

    // ----------------------------------------------------
    // HERO INTERACTIVE MINI VISUALIZER & CLUE ACCORDION
    // ----------------------------------------------------
    heroMode: 'queue',
    heroQueueData: ['Andi', 'Budi', 'Citra'],
    heroStackData: ['Piring Hijau', 'Piring Biru', 'Piring Merah'],
    studentNamesPool: ['Dodi', 'Eka', 'Fani', 'Gita', 'Hadi', 'Intan'],
    plateColorsPool: ['Piring Kuning', 'Piring Oranye', 'Piring Ungu', 'Piring Emas'],
    problemDilemmaMode: 'chaos',

    initHeroSim() {
        this.renderHeroSim();
    },

    switchProblemDilemma(mode) {
        this.problemDilemmaMode = mode;
        const bChaos = document.getElementById('dilemma-btn-chaos');
        const bSmart = document.getElementById('dilemma-btn-smart');
        const vChaos = document.getElementById('dilemma-view-chaos');
        const vSmart = document.getElementById('dilemma-view-smart');
        if (bChaos) bChaos.classList.toggle('active', mode === 'chaos');
        if (bSmart) bSmart.classList.toggle('active', mode === 'smart');
        if (vChaos) vChaos.style.display = (mode === 'chaos') ? 'block' : 'none';
        if (vSmart) vSmart.style.display = (mode === 'smart') ? 'block' : 'none';
    },

    switchHeroSim(mode) {
        this.heroMode = mode;
        const qBtn = document.getElementById('hero-vis-tab-queue');
        const sBtn = document.getElementById('hero-vis-tab-stack');
        if (qBtn) qBtn.classList.toggle('active', mode === 'queue');
        if (sBtn) sBtn.classList.toggle('active', mode === 'stack');

        const controlsQueue = document.getElementById('hero-controls-queue');
        const controlsStack = document.getElementById('hero-controls-stack');
        if (controlsQueue) controlsQueue.style.display = (mode === 'queue') ? 'flex' : 'none';
        if (controlsStack) controlsStack.style.display = (mode === 'stack') ? 'flex' : 'none';

        this.renderHeroSim();
    },

    renderHeroSim() {
        const stage = document.getElementById('hero-vis-stage');
        if (!stage) return;

        if (this.heroMode === 'queue') {
            if (this.heroQueueData.length === 0) {
                stage.innerHTML = '<span style="font-size: 0.85rem; color: #8F726A; font-style: italic;">Antrean kasir kosong (isEmpty == true)</span>';
                return;
            }
            stage.innerHTML = this.heroQueueData.map((name, idx) => {
                const isFront = idx === 0;
                const isRear = idx === this.heroQueueData.length - 1;
                return `
                    <div class="hero-node-chip hero-node-queue">
                        <span>👤 ${name}</span>
                        ${isFront ? '<span style="font-size: 0.68rem; background: #E76814; color: #FAF8F5; padding: 1px 4px; border-radius: 4px;">FRONT</span>' : ''}
                        ${isRear && !isFront ? '<span style="font-size: 0.68rem; background: #DC8236; color: #FAF8F5; padding: 1px 4px; border-radius: 4px;">REAR</span>' : ''}
                    </div>
                `;
            }).join('<span style="color: #D8D4BC; font-weight: bold;">➔</span>');
        } else {
            if (this.heroStackData.length === 0) {
                stage.innerHTML = '<span style="font-size: 0.85rem; color: #8F726A; font-style: italic;">Tumpukan piring kosong (isEmpty == true)</span>';
                return;
            }
            stage.innerHTML = this.heroStackData.map((plate, idx) => {
                const isTop = idx === this.heroStackData.length - 1;
                return `
                    <div class="hero-node-chip hero-node-stack">
                        <span>🍽️ ${plate}</span>
                        ${isTop ? '<span style="font-size: 0.68rem; background: #891A10; color: #FAF8F5; padding: 1px 4px; border-radius: 4px;">TOP</span>' : ''}
                    </div>
                `;
            }).join('<span style="color: #D8D4BC; font-weight: bold;">▲</span>');
        }
    },

    heroEnqueue() {
        if (this.heroQueueData.length >= 5) {
            if (window.UI) UI.showToast("⚠️ Antrean kasir penuh (Kapasitas simulasi maks 5 orang)!");
            return;
        }
        const nextName = this.studentNamesPool[Math.floor(Math.random() * this.studentNamesPool.length)];
        this.heroQueueData.push(nextName);
        this.renderHeroSim();
        if (window.UI) UI.showToast(`+ Siswa ${nextName} masuk antrean di posisi paling belakang (REAR)!`);
    },

    heroDequeue() {
        if (this.heroQueueData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Antrean kasir sudah kosong (Queue Underflow)!");
            return;
        }
        const served = this.heroQueueData.shift();
        this.renderHeroSim();
        if (window.UI) UI.showToast(`- Siswa terdepan ${served} dilayani kasir & keluar (FIFO)!`);
    },

    heroPush() {
        if (this.heroStackData.length >= 5) {
            if (window.UI) UI.showToast("⚠️ Tumpukan piring sudah penuh (Maks 5 piring)!");
            return;
        }
        const nextPlate = this.plateColorsPool[Math.floor(Math.random() * this.plateColorsPool.length)];
        this.heroStackData.push(nextPlate);
        this.renderHeroSim();
        if (window.UI) UI.showToast(`+ Petugas menaruh ${nextPlate} di puncak tumpukan (TOP)!`);
    },

    heroPop() {
        if (this.heroStackData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Tumpukan piring kosong (Stack Underflow)!");
            return;
        }
        const popped = this.heroStackData.pop();
        this.renderHeroSim();
        if (window.UI) UI.showToast(`- Siswa mengambil ${popped} dari posisi puncak (TOP - LIFO)!`);
    },

    toggleClue(clueId) {
        const clueEl = document.getElementById(clueId);
        if (!clueEl) return;
        const isOpen = clueEl.classList.contains('open');
        clueEl.classList.toggle('open', !isOpen);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PBLAcademic.init();
});

window.PBLAcademic = PBLAcademic;

