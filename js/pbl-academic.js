/**
 * js/pbl-academic.js
 * Modul Interaktif Problem Based Learning (PBL) Informatika Fase E
 * Meliputi: Tugas Individu (4 Level Inti 15 Menit), Evaluasi Sumatif (5 Menit),
 * Pengayaan & Remedial, Refleksi Individu, serta Panduan & Glosarium.
 */

const PBLAcademic = {
    // ----------------------------------------------------
    // DATA TUGAS INDIVIDU (4 LEVEL INTI BERJENJANG - 15 MENIT)
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
            explanation: "Sangat tepat! Sistem X menghasilkan urutan terbalik dari urutan masukan ([101, 102, 103] menjadi [103, 102, 101]), ini merupakan ciri khas Stack (LIFO - pembalikan urutan). Sistem Y mempertahankan urutan kedatangan asli ([101, 102, 103] tetap [101, 102, 103]), yang merupakan ciri mutlak Queue (FIFO). Catatan Kondisi Batas: Jika Sistem X kosong lalu dipanggil pop(), terjadi Stack Underflow; jika Sistem Y penuh kuota lalu dipanggil enqueue(), terjadi Queue Overflow!"
        }
    ],

    currentTaskLevel: 1,
    selectedTaskOption: null,

    init() {
        this.renderTaskLevel(this.currentTaskLevel);
        this.restoreTaskProgress();
        this.bindEvents();
        this.initHeroSim();
        this.renderRemedialQuiz();
        this.updateEnrichmentUI();

        // Tangani navigasi khusus ke halaman Pengayaan & Remedial agar langsung adaptif
        document.querySelectorAll('[data-screen-target="enrichment"]').forEach(el => {
            el.addEventListener('click', () => {
                setTimeout(() => this.openAdaptiveEnrichmentScreen(), 50);
            });
        });
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
                    const isTarget = p.getAttribute('data-pane') === targetTab;
                    p.classList.toggle('active', isTarget);
                    if (isTarget && targetTab === 'tab-remedial') {
                        PBLAcademic.renderRemedialQuiz();
                    }
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
    renderIndividualAttemptTracker() {
        if (!window.StorageManager || !StorageManager.getIndividualAttempts) return;
        const att = StorageManager.getIndividualAttempts();
        const textEl = document.getElementById('individual-attempt-text');
        const pillsEl = document.getElementById('individual-attempt-pills');
        const bestEl = document.getElementById('individual-best-score-badge');
        const retryBtn = document.getElementById('individual-retry-btn');

        if (textEl) {
            textEl.textContent = `Kesempatan pengerjaan: ${att.currentAttempt} dari 3`;
        }

        if (pillsEl) {
            let pillsHtml = '';
            for (let i = 1; i <= 3; i++) {
                const hist = (att.history || []).find(h => h.attempt === i);
                const isCurrent = (att.currentAttempt === i);
                if (hist) {
                    pillsHtml += `<span class="attempt-pill completed" style="background: #10b981; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">✓ P${i}: ${hist.score} pts</span>`;
                } else if (isCurrent) {
                    pillsHtml += `<span class="attempt-pill active" style="background: #891A10; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">● P${i} (Aktif)</span>`;
                } else {
                    pillsHtml += `<span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P${i}</span>`;
                }
            }
            pillsEl.innerHTML = pillsHtml;
        }

        if (bestEl) {
            bestEl.textContent = `🏆 Nilai Terbaik: ${att.bestScore || 0} pts`;
        }

        if (retryBtn) {
            const isCompletedAll = att.lockedTasks && Object.keys(att.lockedTasks).filter(k => att.lockedTasks[k]?.isLocked).length === 4;
            if (att.currentAttempt >= 3 && isCompletedAll) {
                retryBtn.disabled = true;
                retryBtn.style.opacity = '0.6';
                retryBtn.style.cursor = 'not-allowed';
                retryBtn.textContent = 'Kesempatan Habis (3 dari 3)';
            } else {
                retryBtn.disabled = false;
                retryBtn.style.opacity = '1';
                retryBtn.style.cursor = 'pointer';
                retryBtn.textContent = '🔄 Ulangi Seluruh Tugas';
            }
        }
    },

    promptRetryIndividual() {
        if (!window.StorageManager || !StorageManager.getIndividualAttempts) return;
        const att = StorageManager.getIndividualAttempts();
        if (att.currentAttempt >= 3) {
            if (window.UI) UI.showToast("Kesempatan pengerjaan tugas individu telah habis (3 dari 3)!");
            return;
        }
        if (window.UI) {
            UI.openRetryModal('individual');
        }
    },

    executeRetryIndividual() {
        if (!window.StorageManager || !StorageManager.resetIndividualAttempt) return;
        const success = StorageManager.resetIndividualAttempt();
        if (success) {
            this.renderIndividualAttemptTracker();
            this.renderTaskLevel(1);
            this.updateTaskChipsState();
            if (window.UI) {
                UI.showToast("🔄 Percobaan baru dimulai. Silakan kerjakan kembali dari Level 1!");
            }
        } else {
            if (window.UI) UI.showToast("Kesempatan pengerjaan telah habis (3 dari 3)!");
        }
    },

    renderTaskLevel(lvl) {
        this.currentTaskLevel = lvl;
        this.selectedTaskOption = null;

        const taskData = this.individualTasks.find(t => t.level === lvl) || this.individualTasks[0];
        const att = (window.StorageManager && StorageManager.getIndividualAttempts) 
            ? StorageManager.getIndividualAttempts() 
            : { currentAttempt: 1, lockedTasks: {} };
        const lockedInfo = att.lockedTasks && att.lockedTasks[lvl];

        // Update selector chips
        document.querySelectorAll('.task-level-chip').forEach(chip => {
            const chipLvl = parseInt(chip.getAttribute('data-level'), 10);
            chip.classList.toggle('active', chipLvl === lvl);
        });

        // Update Attempt Tracker Banner
        this.renderIndividualAttemptTracker();

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
        if (checkBtn) checkBtn.style.display = 'none';

        // Check if level is locked
        if (lockedInfo && lockedInfo.isLocked) {
            // Render options as locked & disabled
            if (optionsContainer) {
                optionsContainer.innerHTML = taskData.options.map((opt, idx) => {
                    const isChosen = idx === lockedInfo.chosenIndex;
                    const isCorrect = idx === taskData.correct;
                    let extraClass = '';
                    let lockTag = '';

                    if (isChosen) {
                        extraClass = isCorrect ? 'selected correct' : 'selected wrong';
                        lockTag = '<span style="font-size: 0.75rem; background: rgba(0,0,0,0.12); padding: 0.15rem 0.5rem; border-radius: 999px; margin-left: auto; font-weight: 700;">🔒 Terkunci</span>';
                    } else if (isCorrect) {
                        extraClass = 'correct';
                    }

                    return `
                        <button type="button" class="academic-option-btn ${extraClass}" disabled style="cursor: not-allowed; opacity: ${isChosen || isCorrect ? '1' : '0.65'};">
                            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                            <span style="flex: 1; text-align: left;">${opt.substring(3)}</span>
                            ${lockTag}
                        </button>
                    `;
                }).join('');
            }

            // Show feedback with explanation & locked notice
            if (feedbackEl) {
                feedbackEl.className = `academic-feedback-box show ${lockedInfo.isCorrect ? 'correct' : 'wrong'}`;
                feedbackEl.innerHTML = `
                    <div style="font-size: 0.82rem; background: rgba(0,0,0,0.06); padding: 0.35rem 0.65rem; border-radius: 6px; margin-bottom: 0.5rem; font-weight: 700;">
                        🔒 Jawaban Level ${lvl} Terkunci pada Percobaan ke-${att.currentAttempt} (Tidak dapat diubah terpisah)
                    </div>
                    <strong>${lockedInfo.isCorrect ? '✓ Jawaban Tepat!' : '⚠️ Perlu Koreksi:'}</strong> ${taskData.explanation}
                `;
            }

            // Hide Check Button & Show Next Button
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
        } else {
            // Render options as interactive single-choice
            if (optionsContainer) {
                optionsContainer.innerHTML = taskData.options.map((opt, idx) => `
                    <button type="button" class="academic-option-btn" id="task-opt-${idx}" onclick="PBLAcademic.selectTaskOption(${idx})">
                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                        <span>${opt.substring(3)}</span>
                    </button>
                `).join('');
            }

            // Show Check Button (awaiting selection)
            if (checkBtn) {
                checkBtn.style.display = 'inline-flex';
                checkBtn.disabled = true;
                checkBtn.style.opacity = '0.65';
                checkBtn.style.cursor = 'not-allowed';
                checkBtn.innerHTML = '✓ Periksa Jawaban';
                checkBtn.className = 'academic-btn academic-btn-primary';
            }
            if (nextBtn) nextBtn.style.display = 'none';
        }

        // Render Interactive Game / Simulation for this Level
        this.renderInteractiveTaskGame(lvl);
    },

    selectTaskOption(idx) {
        idx = parseInt(idx, 10);
        const curLvl = parseInt(this.currentTaskLevel, 10) || 1;
        const att = (window.StorageManager && StorageManager.getIndividualAttempts) 
            ? StorageManager.getIndividualAttempts() 
            : { currentAttempt: 1, lockedTasks: {} };
        if (att.lockedTasks && att.lockedTasks[curLvl]?.isLocked) {
            return; // Already locked!
        }

        // Jika mengklik opsi yang sama untuk kedua kalinya, langsung kunci & periksa!
        if (this.selectedTaskOption === idx) {
            this.checkTaskAnswer();
            return;
        }

        this.selectedTaskOption = idx;

        // Visual update: highlight selected option
        const container = document.getElementById('task-options-container');
        if (container) {
            container.querySelectorAll('.academic-option-btn').forEach((btn, i) => {
                btn.classList.toggle('selected', i === idx);
            });
        }

        // Enable and highlight "🔒 Kunci & Periksa Jawaban"
        const checkBtn = document.getElementById('task-check-btn');
        if (checkBtn) {
            checkBtn.style.display = 'inline-flex';
            checkBtn.disabled = false;
            checkBtn.style.opacity = '1';
            checkBtn.style.cursor = 'pointer';
            checkBtn.innerHTML = `🔒 Kunci &amp; Periksa Jawaban (Pilihan ${String.fromCharCode(65 + idx)})`;
            checkBtn.className = 'academic-btn academic-btn-primary animate-pulse';
        }
    },

    checkTaskAnswer() {
        if (this.selectedTaskOption === null || this.selectedTaskOption === undefined) {
            if (window.UI) UI.showToast("⚠️ Silakan pilih salah satu opsi jawaban (A, B, C, atau D) terlebih dahulu!");
            return;
        }

        const curLvl = parseInt(this.currentTaskLevel, 10) || 1;
        const att = (window.StorageManager && StorageManager.getIndividualAttempts) 
            ? StorageManager.getIndividualAttempts() 
            : { currentAttempt: 1, lockedTasks: {} };
        if (att.lockedTasks && att.lockedTasks[curLvl]?.isLocked) {
            return; // Already locked
        }

        const taskData = this.individualTasks.find(t => t.level === curLvl);
        if (!taskData) return;

        const isCorrect = (this.selectedTaskOption === taskData.correct);

        // Immediate answer lock and storage persistence
        let lockResult = null;
        if (window.StorageManager && typeof StorageManager.saveIndividualTaskLock === 'function') {
            lockResult = StorageManager.saveIndividualTaskLock(curLvl, this.selectedTaskOption, isCorrect);
        }

        if (window.SoundManager) {
            SoundManager.play(isCorrect ? 'levelComplete' : 'wrong');
        }

        // Re-render UI with locked state
        this.renderTaskLevel(curLvl);
        this.updateTaskChipsState();

        // Realtime Sync to Teacher Dashboard
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Tugas Individu Level ${curLvl} Diperiksa (${isCorrect ? 'Tepat' : 'Salah'})`);
        }

        if (window.UI) {
            if (isCorrect) {
                UI.showToast(`🔒 Jawaban Level ${curLvl} Terkunci: Tepat Sekali! (+25 Poin)`);
            } else {
                UI.showToast(`🔒 Jawaban Level ${curLvl} Terkunci: Kurang Tepat. Pelajari pembahasannya!`);
            }

            if (lockResult && lockResult.isAllLocked) {
                UI.showToast(`🎉 SELAMAT! Seluruh 4 Level selesai pada Percobaan ke-${att.currentAttempt}! Nilai: ${lockResult.currentScore}/100 Poin.`);
            }
        }
    },

    showTaskResultUI(chosenIndex, isCorrect, taskData) {
        // Fallback for rendering result UI
        this.renderTaskLevel(this.currentTaskLevel);
    },

    goToNextTaskLevel() {
        const curLvl = parseInt(this.currentTaskLevel, 10) || 1;
        if (curLvl < 4) {
            this.renderTaskLevel(curLvl + 1);
            const cardEl = document.getElementById('task-title-text');
            if (cardEl) {
                cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            if (window.UI) {
                UI.showToast("🎉 Seluruh 4 Level Individu Tuntas! Lanjut ke LKPD Kelompok.");
                UI.switchScreen('group-project');
            }
        }
    },

    getSavedTaskResult(lvl) {
        if (!window.StorageManager || !StorageManager.data.individualTasks) return null;
        return StorageManager.data.individualTasks[lvl] || null;
    },

    updateTaskChipsState() {
        if (!window.StorageManager) return;
        const att = StorageManager.getIndividualAttempts ? StorageManager.getIndividualAttempts() : null;
        const lockedTasks = att ? (att.lockedTasks || {}) : {};
        let completedCount = 0;

        document.querySelectorAll('.task-level-chip').forEach(chip => {
            const lvl = parseInt(chip.getAttribute('data-level'), 10);
            const isLocked = lockedTasks[lvl] && lockedTasks[lvl].isLocked;
            if (isLocked) {
                chip.classList.add('completed');
                completedCount++;
            } else {
                chip.classList.remove('completed');
            }
        });

        const progressLabel = document.getElementById('tasks-overall-progress');
        if (progressLabel) {
            progressLabel.textContent = `${completedCount} dari 4 Level Selesai (${Math.round((completedCount/4)*100)}%)`;
        }
    },

    restoreTaskProgress() {
        this.updateTaskChipsState();
        this.renderIndividualAttemptTracker();
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
            if (window.UI) UI.showToast("🎉 SELAMAT! Seluruh 4 Level Tugas Individu Tuntas dengan Nilai Sempurna!");
        } else {
            if (statusEl) {
                statusEl.innerHTML = '<span style="color: #B8210F; font-weight: 800;">⚠️ Integrasi gagal. Periksa kembali: Undo butuh LIFO (Stack) dan Dapur butuh FIFO (Queue)!</span>';
            }
            if (window.UI) UI.showToast("⚠️ Ada pilihan modul yang belum tepat. Cek kembali!");
        }
    },

    // ----------------------------------------------------
    // ----------------------------------------------------
    // EVALUASI AKHIR (ASESMEN SUMATIF HOTS 5 MENIT)
    // Sesuai Capaian Pembelajaran & RPM UKIN:
    // Soal 1: Analisis Ketidaktepatan Antrean Kasir (C4)
    // Soal 2: Analisis Tracing Operasi Beruntun Stack (C4)
    // Soal 3: Penerapan Operasi Push, Pop, Peek (C3)
    // Soal 4: Penerapan Operasi Enqueue & Dequeue (C3)
    // Soal 5: Evaluasi Kesalahan Pemilihan Struktur Data (C4)
    // ----------------------------------------------------
    evalQuestions: [
        {
            id: 1,
            cognitive: "C4 - Analisis",
            title: "Analisis Ketidaktepatan Sistem Antrean Kantin",
            stimulus: "Pada jam istirahat sekolah, kantin dipadati 30 siswa tanpa jalur antrean fisik. Siswa yang baru saja datang dari pintu samping langsung menyerobot ke dekat meja kasir dan dilayani lebih dahulu oleh penjual, sedangkan siswa yang telah mengantre tertib selama 10 menit di barisan depan belum dilayani.",
            q: "Berdasarkan prinsip berpikir komputasional dan struktur data, analisislah pelanggaran mendasar yang terjadi pada skenario pelayanan kantin tersebut serta tentukan pemodelan solusi algoritmik yang paling tepat!",
            options: [
                "Pelayanan melanggar prinsip FIFO (First In, First Out) dari struktur data Queue; solusinya adalah menerapkan jalur antrean teratur di mana siswa yang tiba lebih awal (Front) wajib dilayani dan keluar lebih dahulu (dequeue) sebelum melayani siswa di belakangnya (Rear).",
                "Pelayanan melanggar prinsip LIFO (Last In, First Out) dari struktur data Stack; solusinya adalah mewajibkan siswa yang baru datang dilayani terlebih dahulu agar tidak menumpuk di pintu masuk kantin.",
                "Pelayanan melanggar prinsip Priority Queue; solusinya adalah memberikan prioritas pelayanan kepada siswa yang membeli makanan dengan harga tertinggi tanpa melihat waktu kedatangan.",
                "Pelayanan melanggar prinsip Array dua dimensi; solusinya adalah membagi siswa ke dalam baris dan kolom acak di seluruh ruangan kantin."
            ],
            correct: 0,
            note: "Analisis C4: Pelayanan kantin wajib menganut keadilan antrean linear FIFO (Queue). Siswa yang pertama masuk (Front) berhak dilayani pertama kali (dequeue). Pelayanan kepada orang yang baru datang melanggar keadilan waktu tunggu antrean."
        },
        {
            id: 2,
            cognitive: "C4 - Analisis",
            title: "Analisis Tracing Operasi Beruntun Stack",
            stimulus: "Petugas kantin menata baki saji menggunakan wadah tumpukan vertikal (Stack) dengan kapasitas maksimal 5 baki. Sistem mencatat riwayat operasi berturut-turut: push(Baki Merah) → push(Baki Kuning) → push(Baki Hijau) → pop() → push(Baki Biru) → pop() → push(Baki Ungu).",
            q: "Lakukan penelusuran (tracing) terhadap riwayat operasi tersebut. Analisislah baki mana saja yang telah berhasil dikeluarkan dari tumpukan serta tentukan baki mana yang saat ini menempati posisi puncak (Top of Stack)!",
            options: [
                "Baki yang telah dikeluarkan adalah Baki Hijau lalu Baki Biru; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Ungu.",
                "Baki yang telah dikeluarkan adalah Baki Merah lalu Baki Kuning; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Hijau.",
                "Baki yang telah dikeluarkan adalah Baki Biru lalu Baki Hijau; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Merah.",
                "Baki yang telah dikeluarkan adalah Baki Ungu lalu Baki Biru; dan baki yang saat ini menempati posisi Top of Stack adalah Baki Kuning."
            ],
            correct: 0,
            note: "Analisis C4: Penelusuran operasi: push(M), push(K), push(H) -> Stack=[M, K, H(Top)]. Operasi pop() pertama mengeluarkan H. Lalu push(B) -> Stack=[M, K, B(Top)]. Operasi pop() kedua mengeluarkan B. Lalu push(U) -> Stack=[M, K, U(Top)]. Maka baki yang dikeluarkan: Hijau lalu Biru; puncak (Top): Ungu."
        },
        {
            id: 3,
            cognitive: "C3 - Penerapan",
            title: "Penerapan Operasi Push, Pop, dan Peek",
            stimulus: "Di meja prasmanan, sebuah dispenser piring bersih menampung piring keramik menggunakan prinsip Stack. Saat ini tumpukan berisi dua piring dari bawah ke atas: [Piring A, Piring B] di mana Piring B berada di posisi Top. Asisten kantin kemudian menjalankan urutan instruksi: 1) Melakukan peek(); 2) Melakukan push(Piring C); 3) Melakukan pop(); 4) Melakukan peek() kembali.",
            q: "Tentukan secara berurutan hasil identifikasi piring dari operasi peek() pertama, piring yang terambil saat pop(), dan hasil dari operasi peek() kedua!",
            options: [
                "peek() pertama menghasilkan Piring B; pop() mengeluarkan Piring C; dan peek() kedua menghasilkan Piring B.",
                "peek() pertama menghasilkan Piring A; pop() mengeluarkan Piring B; dan peek() kedua menghasilkan Piring C.",
                "peek() pertama menghasilkan Piring B; pop() mengeluarkan Piring A; dan peek() kedua menghasilkan Piring C.",
                "peek() pertama menghasilkan Piring C; pop() mengeluarkan Piring C; dan peek() kedua menghasilkan Piring A."
            ],
            correct: 0,
            note: "Penerapan C3: Operasi peek() membaca elemen TOP tanpa menghapusnya (maka peek ke-1 membaca Piring B). Operasi push(C) menjadikan C sebagai TOP baru. Operasi pop() mengambil elemen TOP yaitu Piring C sehingga tumpukan kembali [A, B(Top)]. Operasi peek() ke-2 kembali membaca Piring B."
        },
        {
            id: 4,
            cognitive: "C3 - Penerapan",
            title: "Penerapan Operasi Enqueue dan Dequeue",
            stimulus: "Sebuah sistem antrean digital pemesanan kasir kantin menerapkan struktur data Queue dengan representasi antrean saat ini dari depan ke belakang (Front ke Rear): [Rizky, Siti] di mana Rizky berada di posisi Front. Selanjutnya terjadi urutan aktivitas: 1) Ahmad mengambil nomor antrean (enqueue); 2) Kasir selesai melayani dan memanggil nomor terdepan (dequeue); 3) Budi mengambil nomor antrean (enqueue); 4) Citra mengambil nomor antrean (enqueue).",
            q: "Tentukan siswa yang dipanggil keluar dari antrean pada langkah ke-2, serta susunan urutan antrean siswa yang tersisa di depan kasir saat ini mulai dari Front hingga Rear!",
            options: [
                "Siswa yang keluar adalah Rizky; dan susunan antrean saat ini dari Front ke Rear adalah [Siti, Ahmad, Budi, Citra].",
                "Siswa yang keluar adalah Siti; dan susunan antrean saat ini dari Front ke Rear adalah [Rizky, Ahmad, Budi, Citra].",
                "Siswa yang keluar adalah Ahmad; dan susunan antrean saat ini dari Front ke Rear adalah [Citra, Budi, Siti, Rizky].",
                "Siswa yang keluar adalah Rizky; dan susunan antrean saat ini dari Front ke Rear adalah [Citra, Budi, Ahmad, Siti]."
            ],
            correct: 0,
            note: "Penerapan C3: Antrean awal: [Rizky(Front), Siti(Rear)]. 1) Enqueue Ahmad -> [Rizky, Siti, Ahmad]. 2) Dequeue -> Rizky keluar karena berada di posisi FRONT. Antrean tersisa [Siti(Front), Ahmad(Rear)]. 3) Enqueue Budi -> [Siti, Ahmad, Budi]. 4) Enqueue Citra -> [Siti(Front), Ahmad, Budi, Citra(Rear)]."
        },
        {
            id: 5,
            cognitive: "C4 - Analisis & Evaluasi",
            title: "Evaluasi Kesalahan Pemilihan Struktur Data",
            stimulus: "Kantin sekolah membuat aplikasi web pemesanan makanan agar siswa dapat memesan menu sebelum jam istirahat. Namun, programmer pemula yang membuat aplikasi tersebut keliru mengimplementasikan struktur data Stack (LIFO) untuk daftar tunggu pemesanan makanan, bukan Queue (FIFO). Siswa pertama (Andi) memesan pukul 09.00, disusul Bella pukul 09.15, dan Candra pukul 09.25.",
            q: "Evaluasilah dampak yang dialami oleh para pemesan akibat kesalahan pemilihan struktur data tersebut, dan tentukan alasan komputasional mengapa sistem tersebut gagal memenuhi keadilan layanan!",
            options: [
                "Candra akan dilayani paling awal sedangkan Andi (pemesan paling awal) justru dilayani paling akhir; hal ini terjadi karena Stack memprioritaskan elemen yang paling akhir masuk (Last In First Out), sehingga melanggar asas keadilan waktu pemesanan.",
                "Andi akan dilayani paling awal tetapi pesanan Candra otomatis terhapus karena kapasitas memori Stack langsung penuh (Overflow).",
                "Seluruh pesanan Andi, Bella, dan Candra akan diproses secara serentak (paralel) sehingga dapur kantin mengalami kelebihan beban komputasi.",
                "Tidak ada dampak yang terjadi karena struktur data Stack dan Queue memiliki mekanisme urutan pemrosesan data yang sama persis dalam antrean."
            ],
            correct: 0,
            note: "Evaluasi C4: Struktur data Stack bekerja dengan prinsip LIFO (Last In First Out). Akibatnya, pemesan terakhir (Candra) berada di Top dan diproses duluan, sedangkan Andi yang memesan paling awal tertahan di dasar tumpukan. Ini membuktikan bahwa antrean layanan manusia/kasir mutlak memerlukan Queue FIFO, bukan Stack LIFO."
        }
    ],

    submitEvaluation() {
        const form = document.getElementById('evaluation-form');
        if (!form) return;

        let score = 0;
        let answeredCount = 0;
        const total = this.evalQuestions.length;
        const answerDetails = [];

        this.evalQuestions.forEach((item, idx) => {
            const selected = form.querySelector(`input[name="eval-q${idx + 1}"]:checked`);
            if (selected) {
                answeredCount++;
                const chosenIdx = parseInt(selected.value, 10);
                const isCorrect = (chosenIdx === item.correct);
                if (isCorrect) {
                    score += 20; // 5 soal x 20 = 100
                }
                answerDetails.push({
                    id: item.id,
                    cognitive: item.cognitive,
                    title: item.title,
                    isCorrect,
                    chosenIdx,
                    correctIdx: item.correct,
                    note: item.note
                });
            }
        });

        if (answeredCount < total) {
            alert(`Mohon lengkapi seluruh 5 butir soal evaluasi HOTS! Kamu baru menjawab ${answeredCount} dari ${total} soal.`);
            return;
        }

        // Display Result Card
        const resultCard = document.getElementById('eval-result-card');
        const scoreVal = document.getElementById('eval-score-number');
        const statusBadge = document.getElementById('eval-status-badge');
        const noteEl = document.getElementById('eval-recommendation-text');

        if (scoreVal) scoreVal.textContent = score;
        const isPassed = score >= 75; // KKTP 75 (minimal 4 dari 5 benar = 80)

        if (statusBadge) {
            statusBadge.className = `academic-badge ${isPassed ? 'academic-badge-emerald' : 'academic-badge-amber'}`;
            statusBadge.textContent = isPassed ? `✓ Tuntas (Memenuhi KKTP ≥ 75)` : `⚠️ Perlu Penguatan (Belum Tuntas)`;
        }

        if (noteEl) {
            if (isPassed) {
                noteEl.innerHTML = `Selamat! Skor evaluasimu <strong>${score}/100</strong> telah melampaui Kriteria Ketercapaian Tujuan Pembelajaran (KKTP ≥ 75). Kamu telah menguasai analisis perbedaan prinsip kerja Stack (LIFO) dan Queue (FIFO) serta operasi dasar push, pop, enqueue, dan dequeue. Sangat disarankan untuk melanjutkan ke menu <strong>💡 Pengayaan</strong> dan mengisi <strong>🪞 Refleksi Individu</strong>.`;
            } else {
                noteEl.innerHTML = `Skor evaluasimu <strong>${score}/100</strong> belum mencapai KKTP minimal 75. Silakan amati pembahasan pada rincian butir soal di bawah, pelajari kembali ringkasan materi di menu <strong>💡 Pengayaan &amp; Remedial</strong>, lalu lakukan evaluasi ulang!`;
            }
        }

        // Render per-question review list
        let reviewContainer = document.getElementById('eval-review-list');
        if (!reviewContainer && resultCard) {
            reviewContainer = document.createElement('div');
            reviewContainer.id = 'eval-review-list';
            reviewContainer.style.marginTop = '1.5rem';
            reviewContainer.style.borderTop = '1.5px solid #D8D4BC';
            reviewContainer.style.paddingTop = '1.25rem';
            resultCard.appendChild(reviewContainer);
        }

        if (reviewContainer) {
            reviewContainer.innerHTML = `
                <h4 style="font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: #714236; margin-bottom: 1rem;">
                    🔍 Rincian Pembahasan Analisis 5 Soal HOTS:
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${answerDetails.map((ans, i) => `
                        <div style="background: ${ans.isCorrect ? '#f0fdf4' : '#fef2f2'}; border: 1.5px solid ${ans.isCorrect ? '#86efac' : '#fca5a5'}; border-radius: 10px; padding: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                                <strong style="color: ${ans.isCorrect ? '#166534' : '#991b1b'}; font-size: 0.92rem;">
                                    ${ans.isCorrect ? '✓' : '✗'} Butir Soal #${i + 1}: ${ans.title} (${ans.cognitive})
                                </strong>
                                <span class="academic-badge ${ans.isCorrect ? 'academic-badge-emerald' : 'academic-badge-blue'}" style="font-size: 0.72rem;">
                                    ${ans.isCorrect ? '+20 Poin' : '0 Poin'}
                                </span>
                            </div>
                            <p style="font-size: 0.88rem; color: #374151; margin: 0 0 0.4rem 0;">
                                <strong>Kunci Jawaban:</strong> Pilihan A (Opsi Tepat)
                            </p>
                            <p style="font-size: 0.85rem; color: #4b5563; line-height: 1.5; margin: 0;">
                                💡 <em>Pembahasan:</em> ${ans.note}
                            </p>
                        </div>
                    `).join('')}
                </div>
            `;
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
                completed: true,
                savedAt: new Date().toISOString()
            };
            StorageManager.save();
        }

        // Update tombol navigasi hasil adaptif
        const btnGotoEnrich = document.getElementById('btn-eval-goto-enrichment');
        if (btnGotoEnrich) {
            if (isPassed) {
                btnGotoEnrich.innerHTML = `🚀 Lanjut Mengerjakan Pengayaan (Tuntas KKTP: ${score}) ➔`;
                btnGotoEnrich.className = 'academic-btn academic-btn-primary';
                btnGotoEnrich.style.background = '#10B981';
                btnGotoEnrich.style.borderColor = '#059669';
                btnGotoEnrich.style.color = '#FFFFFF';
            } else {
                btnGotoEnrich.innerHTML = `🔄 Lanjut Mengerjakan Remedial (KKTP &lt; 75: ${score}) ➔`;
                btnGotoEnrich.className = 'academic-btn academic-btn-primary';
                btnGotoEnrich.style.background = '#E76814';
                btnGotoEnrich.style.borderColor = '#C2540C';
                btnGotoEnrich.style.color = '#FFFFFF';
            }
        }

        // Sinkronkan ke cloud portal guru seketika
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Evaluasi Akhir Selesai: Nilai ${score} (${isPassed ? 'TUNTAS KKTP' : 'REMEDIAL'})`);
        }

        if (window.UI) {
            UI.showToast(`📝 Evaluasi selesai! Nilai: ${score}/100 — ${isPassed ? 'TUNTAS KKTP (Lanjut Pengayaan)' : 'PERLU PENGUATAN (Lanjut Remedial)'}.`);
        }
    },

    openAdaptiveEnrichmentScreen(forcedMode = null) {
        // 1. Tampilkan layar screen-enrichment
        if (window.UI && typeof window.UI.showScreen === 'function') {
            window.UI.showScreen('screen-enrichment');
        } else if (window.App && typeof window.App.showScreen === 'function') {
            window.App.showScreen('screen-enrichment');
        }

        // 2. Ambil nilai evaluasi terkini
        let evalScore = 0;
        let hasDoneEval = false;
        if (window.StorageManager && window.StorageManager.data) {
            const ev = window.StorageManager.data.pageScores && window.StorageManager.data.pageScores['evaluation'];
            if (ev) {
                evalScore = typeof ev.score === 'number' ? ev.score : 0;
                hasDoneEval = (ev.completed === true || ev.score !== undefined);
            }
        }

        // 3. Kriteria adaptif: >= 75 Pengayaan, < 75 Remedial
        const isEnrichment = forcedMode ? (forcedMode === 'enrichment') : (evalScore >= 75);
        const targetTab = isEnrichment ? 'tab-pengayaan' : 'tab-remedial';

        // 4. Update banner hasil adaptif
        this.updateEnrichmentUI(evalScore, hasDoneEval, isEnrichment);

        // 5. Aktifkan tab yang sesuai
        const screen = document.getElementById('screen-enrichment');
        if (screen) {
            screen.querySelectorAll('.academic-tab-btn').forEach(btn => {
                const isActive = (btn.getAttribute('data-tab') === targetTab);
                btn.classList.toggle('active', isActive);
            });
            screen.querySelectorAll('.academic-tab-pane').forEach(pane => {
                const isActive = (pane.getAttribute('data-pane') === targetTab);
                pane.classList.toggle('active', isActive);
            });
            if (targetTab === 'tab-remedial') {
                this.renderRemedialQuiz();
            }
            screen.scrollIntoView({ behavior: 'smooth' });
        }

        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(isEnrichment ? 'Membuka Modul Pengayaan' : 'Membuka Modul Remedial');
        }
    },

    updateEnrichmentUI(evalScore = 0, hasDoneEval = false, isEnrichment = true) {
        const banner = document.getElementById('enrichment-adaptive-banner');
        if (!banner) return;

        if (!hasDoneEval) {
            banner.innerHTML = `
                <div style="background: #FFFBEB; border: 1.5px solid #FCD34D; border-radius: 14px; padding: 1.15rem 1.35rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <div style="font-size: 2.2rem; line-height: 1;">ℹ️</div>
                    <div style="flex: 1; min-width: 250px;">
                        <h4 style="margin: 0 0 0.25rem 0; color: #92400E; font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800;">
                            Alur Diferensiasi Pembelajaran Terbimbing
                        </h4>
                        <p style="margin: 0; font-size: 0.88rem; color: #78350F; line-height: 1.5;">
                            Kriteria penentuan: Siswa dengan Nilai Evaluasi Akhir <strong>≥ 75</strong> diarahkan ke modul <strong>Pengayaan</strong>, sedangkan siswa dengan nilai <strong>&lt; 75</strong> diarahkan mengikuti latihan <strong>Remedial</strong>. Kamu dapat mengeksplorasi kedua modul ini secara mandiri kapan pun.
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        if (evalScore >= 75) {
            banner.innerHTML = `
                <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.12);">
                    <div style="font-size: 2.5rem; line-height: 1;">🎉</div>
                    <div style="flex: 1; min-width: 260px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                            <span class="academic-badge academic-badge-emerald" style="font-size: 0.8rem; font-weight: 800; background: #10B981; color: #FFFFFF;">
                                ✓ TUNTAS KKTP (NILAI EVALUASI: ${evalScore}/100)
                            </span>
                            <span style="font-size: 0.8rem; color: #065F46; font-weight: 700;">
                                Kriteria: Nilai ≥ 75
                            </span>
                        </div>
                        <h4 style="margin: 0 0 0.3rem 0; color: #065F46; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800;">
                            Selamat! Kamu Berhak Mempelajari Modul Pengayaan (Enrichment)
                        </h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #047857; line-height: 1.55;">
                            Pemahaman analisismu terhadap konsep <strong>Stack (LIFO)</strong> dan <strong>Queue (FIFO)</strong> telah melampaui kriteria ketuntasan minimal. Silakan perdalam pengetahuanmu mengenai arsitektur tingkat lanjut: <em>Priority Queue</em>, <em>Circular Queue</em>, dan <em>Call Stack</em> pada sistem operasi di bawah ini.
                        </p>
                    </div>
                </div>
            `;
        } else {
            banner.innerHTML = `
                <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.12);">
                    <div style="font-size: 2.5rem; line-height: 1;">🔄</div>
                    <div style="flex: 1; min-width: 260px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                            <span class="academic-badge academic-badge-amber" style="font-size: 0.8rem; font-weight: 800; background: #D97706; color: #FFFFFF;">
                                ⚠️ PERLU PEMANTAPAN (NILAI EVALUASI: ${evalScore}/100)
                            </span>
                            <span style="font-size: 0.8rem; color: #92400E; font-weight: 700;">
                                Kriteria: Nilai &lt; 75
                            </span>
                        </div>
                        <h4 style="margin: 0 0 0.3rem 0; color: #92400E; font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800;">
                            Program Remedial Terbimbing: Pemantapan Konsep Kunci
                        </h4>
                        <p style="margin: 0; font-size: 0.9rem; color: #78350F; line-height: 1.55;">
                            Nilai evaluasimu belum mencapai Kriteria Ketercapaian Tujuan Pembelajaran (KKTP ≥ 75). Jangan berkecil hati! Pelajari kembali rangkuman prinsip dasar <strong>FIFO (Queue)</strong> dan <strong>LIFO (Stack)</strong> di bawah ini, lalu selesaikan 4 latihan soal terarah untuk menguji kembali pemahamanmu.
                        </p>
                    </div>
                </div>
            `;
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

        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState('Refleksi 3-2-1 Disimpan');
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
    heroQueueData: ['Ani'],
    heroStackData: ['🔴 Piring Merah'],
    heroMaxCapacity: 3,
    heroQueueSequence: ['Ani', 'Adi', 'Ida'],
    heroStackSequence: ['🔴 Piring Merah', '🟡 Piring Kuning', '🟢 Piring Hijau'],
    heroChallengeAnswers: {
        queue: null,
        stack: null
    },
    problemDilemmaMode: 'chaos',

    initHeroSim() {
        // Muat jawaban tersimpan tantangan logika 2 nomor dari StorageManager jika ada
        if (window.StorageManager && typeof StorageManager.getSimulationEvaluation === 'function') {
            const sim = StorageManager.getSimulationEvaluation();
            if (sim.queueChallenge && sim.queueChallenge.chosen !== undefined) {
                this.heroChallengeAnswers.queue = sim.queueChallenge.chosen;
            }
            if (sim.stackChallenge && sim.stackChallenge.chosen !== undefined) {
                this.heroChallengeAnswers.stack = sim.stackChallenge.chosen;
            }
        }
        this.renderHeroSim();
        this.renderHeroChallenge();
        this.updateHeroSimulationBadge();
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

        const stage = document.getElementById('hero-vis-stage');
        if (stage) {
            stage.classList.toggle('stack-mode', mode === 'stack');
        }

        this.renderHeroSim();
        this.renderHeroChallenge();
    },

    renderHeroSim() {
        const stage = document.getElementById('hero-vis-stage');
        if (!stage) return;

        if (this.heroMode === 'queue') {
            stage.classList.remove('stack-mode');
            if (this.heroQueueData.length === 0) {
                stage.innerHTML = '<span style="font-size: 0.88rem; color: #8F726A; font-style: italic;">Antrean kasir sedang kosong (0 / 3 siswa)</span>';
                return;
            }

            let html = '<div style="display: flex; align-items: center; justify-content: center; background: #FAF6ED; border: 1.5px solid #E76814; border-radius: 8px; padding: 0.4rem 0.65rem; font-weight: 800; font-size: 0.76rem; color: #891A10; flex-shrink: 0;"><span>🏪</span> LOKET KASIR<br><small style="color: #E76814;">(FRONT)</small></div><span style="color: #DC8236; font-weight: bold; font-size: 1.1rem;">◀</span>';

            html += this.heroQueueData.map((name, idx) => {
                const isFront = idx === 0;
                const isRear = idx === this.heroQueueData.length - 1;
                return `
                    <div class="hero-node-chip hero-node-queue" style="${isFront ? 'border: 2px solid #E76814; background: #FAF3EA; font-weight: 800;' : 'font-weight: 600;'}">
                        <span>👤 ${name}</span>
                        ${isFront ? '<span style="font-size: 0.65rem; background: #E76814; color: #FAF8F5; padding: 1px 5px; border-radius: 4px; font-weight: 800;">FRONT (1)</span>' : ''}
                        ${isRear && !isFront ? '<span style="font-size: 0.65rem; background: #DC8236; color: #FAF8F5; padding: 1px 5px; border-radius: 4px; font-weight: 800;">REAR (' + (idx + 1) + ')</span>' : ''}
                    </div>
                `;
            }).join('<span style="color: #D8D4BC; font-weight: bold;">◀</span>');

            html += '<span style="color: #DC8236; font-weight: bold; font-size: 1.1rem;">◀</span><div style="font-size: 0.74rem; color: #714236; font-weight: 700; text-align: center; flex-shrink: 0;">🚪 PINTU MASUK<br><small style="color: #DC8236;">(REAR)</small></div>';
            stage.innerHTML = html;
        } else {
            // MODE STACK: MENUMPUK KE ATAS (Bukan ke samping!)
            stage.classList.add('stack-mode');
            if (this.heroStackData.length === 0) {
                stage.innerHTML = '<span style="font-size: 0.88rem; color: #8F726A; font-style: italic; margin-bottom: 2rem;">Rak tumpukan piring kosong (0 / 3 piring)</span>';
                return;
            }

            // Tampilkan bertingkat dari bawah ke atas (column-reverse meletakkan index terakhir di posisi paling atas)
            stage.innerHTML = this.heroStackData.map((plate, idx) => {
                const isTop = (idx === this.heroStackData.length - 1);
                const isBottom = (idx === 0);

                let colorStyles = 'border: 2px solid #891A10; background: #FFF5F3; color: #891A10;';
                if (plate.includes('Kuning')) {
                    colorStyles = 'border: 2px solid #F59E0B; background: #FFFBEB; color: #92400E;';
                } else if (plate.includes('Hijau')) {
                    colorStyles = 'border: 2px solid #10B981; background: #ECFDF5; color: #065F46;';
                } else if (plate.includes('Merah')) {
                    colorStyles = 'border: 2px solid #DC2626; background: #FEF2F2; color: #991B1B;';
                }

                return `
                    <div class="hero-node-stack-vertical" style="${colorStyles} ${isTop ? 'box-shadow: 0 4px 12px rgba(137, 26, 16, 0.2);' : ''}">
                        <span style="font-weight: 800;">🍽️ ${plate}</span>
                        <div style="display: flex; gap: 0.35rem; align-items: center;">
                            ${isTop ? '<span style="font-size: 0.72rem; background: #891A10; color: #FFFFFF; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-family: \'Space Mono\', monospace;">TOP (PUNCAK)</span>' : ''}
                            ${isBottom && !isTop ? '<span style="font-size: 0.72rem; background: #FAF3EA; color: #714236; border: 1px solid #D8D4BC; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-family: \'Space Mono\', monospace;">BOTTOM (DASAR)</span>' : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    },

    // ----------------------------------------------------
    // PERTANYAAN TANTANGAN LOGIKA BERANDA (2 NOMOR JADI 1 KARTU TERPADU)
    // NOMOR 1: SOAL QUEUE (FIFO) | NOMOR 2: SOAL STACK (LIFO)
    // ----------------------------------------------------
    heroUnifiedChallenges: [
        {
            num: 1,
            topic: 'queue',
            badge: 'Queue (FIFO) - Antrean Kasir',
            title: '👥 Nomor 1: Tantangan Logika Antrean Kasir (Queue - FIFO)',
            context: 'Loket kasir kantin melayani antrean kuota maksimal 3 siswa. Datang 3 siswa berurutan memesan makanan: 👤 <strong>Ani</strong> (datang ke-1), 👤 <strong>Adi</strong> (datang ke-2), dan 👤 <strong>Ida</strong> (datang ke-3).',
            q: '1. Berdasarkan aturan FIFO (First In First Out), saat kasir menekan tombol <strong>− Ambil Antrean (Layani / Dequeue)</strong>, siapakah siswa yang pertama kali dilayani?',
            options: [
                { text: 'A. 👤 Ida (Posisi Paling Belakang - REAR)', isCorrect: false, note: 'Ida datang terakhir di posisi REAR, harus menunggu giliran antrean.' },
                { text: 'B. 👤 Adi (Posisi Tengah)', isCorrect: false, note: 'Adi berada di tengah antrean di belakang Ani.' },
                { text: 'C. 👤 Ani (Posisi Paling Depan - FRONT)', isCorrect: true, note: 'Tepat sekali! Asas keadilan antrean Queue menerapkan FIFO (First In First Out): Ani yang datang pertama berada di FRONT dan dilayani pertama kali!' }
            ]
        },
        {
            num: 2,
            topic: 'stack',
            badge: 'Stack (LIFO) - Tumpukan Piring',
            title: '🍽️ Nomor 2: Tantangan Logika Tumpukan Piring (Stack - LIFO)',
            context: 'Petugas kantin menumpuk 3 piring ke dalam rak saji dari bawah ke atas: 🔴 <strong>Piring Merah</strong> (dasar), 🟡 <strong>Piring Kuning</strong> (tengah), dan 🟢 <strong>Piring Hijau</strong> (puncak TOP). Kapasitas rak maksimal 3 piring.',
            q: '2. Berdasarkan aturan LIFO (Last In First Out), jika seorang siswa datang mengambil piring menggunakan tombol <strong>− Ambil Piring (Pop)</strong>, piring warna apakah yang terambil pertama kali?',
            options: [
                { text: 'A. 🔴 Piring Merah (Dasar Rak)', isCorrect: false, note: 'Piring Merah berada di dasar rak (paling bawah), terhimpit piring lain.' },
                { text: 'B. 🟡 Piring Kuning (Tengah Rak)', isCorrect: false, note: 'Piring Kuning berada di tengah rak, tidak bisa diambil langsung.' },
                { text: 'C. 🟢 Piring Hijau (Puncak - TOP)', isCorrect: true, note: 'Tepat sekali! Sesuai prinsip LIFO (Last In First Out), piring yang terakhir ditaruh di puncak (TOP) adalah yang pertama diambil!' }
            ]
        }
    ],

    renderHeroChallenge() {
        const container = document.getElementById('hero-interactive-challenge-container');
        if (!container) return;

        let html = `
            <div style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 14px rgba(113, 66, 54, 0.05); text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                    <div>
                        <h4 style="margin: 0; font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: #891A10;">
                            🎯 Tantangan Logika Komputasional: Queue (FIFO) &amp; Stack (LIFO)
                        </h4>
                        <p style="margin: 0.2rem 0 0 0; font-size: 0.8rem; color: #714236;">
                            Uji penalaran Anda pada 2 nomor studi kasus pelayanan kantin sekolah berikut:
                        </p>
                    </div>
                    <span style="font-size: 0.74rem; background: #FAF3EA; border: 1px solid #E76814; color: #891A10; font-weight: 800; padding: 2px 8px; border-radius: 999px;">
                        2 Nomor Kasus Nyata
                    </span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${this.heroUnifiedChallenges.map(chal => {
                        const chosen = this.heroChallengeAnswers[chal.topic];
                        const hasAnswered = (chosen !== undefined && chosen !== null);
                        const isCorrectChosen = hasAnswered && chal.options[chosen] && chal.options[chosen].isCorrect;
                        const noteText = hasAnswered ? (chal.options[chosen]?.note || '') : '';

                        return `
                            <div style="background: #FAF6ED; border: 1.5px solid #EAE7D7; border-radius: 10px; padding: 0.85rem 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.4rem;">
                                    <h5 style="margin: 0; font-size: 0.88rem; font-weight: 800; color: #891A10;">
                                        ${chal.title}
                                    </h5>
                                    <span style="font-size: 0.72rem; background: #FFFFFF; border: 1px solid #D8D4BC; color: #714236; font-weight: 700; padding: 1px 6px; border-radius: 6px;">
                                        ${chal.badge}
                                    </span>
                                </div>

                                <p style="font-size: 0.82rem; color: #4A3832; line-height: 1.45; margin: 0 0 0.6rem 0; background: #FAF8F5; border-left: 3px solid #E76814; padding: 0.45rem 0.65rem; border-radius: 0 6px 6px 0;">
                                    ${chal.context}
                                </p>

                                <div style="font-size: 0.85rem; font-weight: 700; color: #2E1E1A; margin-bottom: 0.5rem; line-height: 1.4;">
                                    ${chal.q}
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                                    ${chal.options.map((opt, optIdx) => {
                                        const isThisSelected = (chosen === optIdx);
                                        let btnStyle = 'background: #FFFFFF; border: 1.5px solid #D8D4BC; color: #714236;';
                                        if (isThisSelected) {
                                            btnStyle = opt.isCorrect
                                                ? 'background: #ECFDF5; border: 2px solid #10B981; color: #065F46; font-weight: 800;'
                                                : 'background: #FEF2F2; border: 2px solid #EF4444; color: #991B1B; font-weight: 700;';
                                        }

                                        return `
                                            <button type="button" 
                                                onclick="PBLAcademic.checkHeroChallenge('${chal.topic}', ${chal.num}, ${optIdx})"
                                                style="text-align: left; padding: 0.45rem 0.75rem; border-radius: 8px; font-size: 0.82rem; cursor: pointer; transition: all 0.2s ease; ${btnStyle}">
                                                ${opt.text}
                                            </button>
                                        `;
                                    }).join('')}
                                </div>

                                ${hasAnswered ? `
                                    <div style="margin-top: 0.5rem; font-size: 0.8rem; line-height: 1.45; padding: 0.4rem 0.65rem; border-radius: 6px; background: ${isCorrectChosen ? '#ECFDF5' : '#FEF2F2'}; color: ${isCorrectChosen ? '#065F46' : '#991B1B'}; border: 1px solid ${isCorrectChosen ? '#A7F3D0' : '#FECACA'};">
                                        ${isCorrectChosen ? '✓ <strong>Tepat Sekali (+30 Pts)!</strong> ' : '✕ <strong>Kurang Tepat:</strong> '} ${noteText}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    checkHeroChallenge(topic, num, optionIdx) {
        this.heroChallengeAnswers[topic] = optionIdx;

        const chal = this.heroUnifiedChallenges.find(c => c.topic === topic);
        const opt = chal && chal.options[optionIdx];
        const isCorrect = !!(opt && opt.isCorrect);

        // Rekam jawaban ke storage & hitung akumulasi skor simulasi
        let sim = null;
        if (window.StorageManager && typeof StorageManager.recordHeroChallengeAnswer === 'function') {
            sim = StorageManager.recordHeroChallengeAnswer(topic, num, optionIdx, isCorrect);
            this.updateHeroSimulationBadge(sim);
        }

        // Sinkronkan ke Dashboard Guru
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Tantangan No.${num} ${topic.toUpperCase()}: ${isCorrect ? 'Benar (+30 Pts)' : 'Mencoba'} [Akumulasi: ${sim?.totalScore || 0} pts]`);
        }

        if (window.UI) {
            if (isCorrect) {
                UI.showToast(`✓ Jawaban No.${num} tepat (+30 Pts)! ${opt.note}`);
            } else {
                UI.showToast(`✕ Jawaban No.${num} belum tepat. ${opt.note}`);
            }
        }

        this.renderHeroChallenge();
    },

    updateHeroSimulationBadge(evalResult) {
        if (!evalResult && window.StorageManager && StorageManager.getSimulationEvaluation) {
            evalResult = StorageManager.getSimulationEvaluation();
        }
        const badgeEl = document.getElementById('hero-sim-eval-badge');
        if (badgeEl && evalResult) {
            const stars = '⭐'.repeat(evalResult.score || 1);
            const totalScore = evalResult.totalScore || 0;
            const stats = evalResult.stats || { opsCount: 0, queueCorrect: 0, stackCorrect: 0 };

            badgeEl.innerHTML = `
                <div style="background: #FAF3EA; border: 1.5px solid #E76814; border-radius: 10px; padding: 0.75rem 0.95rem; margin-top: 0.85rem; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
                        <span style="font-weight: 800; color: #891A10; font-size: 0.9rem;">
                            📊 Akumulasi Eksplorasi: ${stars} ${totalScore}/100 Pts (${evalResult.predicate || 'Perlu Bimbingan'})
                        </span>
                        <span style="font-size: 0.76rem; background: #E76814; color: #FFFFFF; padding: 3px 10px; border-radius: 999px; font-weight: 700; font-family: 'Space Mono', monospace;">
                            ⭐ Skor ${evalResult.score || 1}/4
                        </span>
                    </div>
                    <div style="font-size: 0.78rem; color: #714236; margin-top: 0.45rem; line-height: 1.45; display: flex; flex-wrap: wrap; gap: 0.75rem;">
                        <span>🧪 <strong>Simulasi Instan:</strong> ${stats.opsCount}/4 operasi</span>
                        <span>👥 <strong>No. 1 (Queue):</strong> ${stats.queueCorrect ? '✅ Benar (+30 Pts)' : '❌ Belum (+0 Pts)'}</span>
                        <span>🍽️ <strong>No. 2 (Stack):</strong> ${stats.stackCorrect ? '✅ Benar (+30 Pts)' : '❌ Belum (+0 Pts)'}</span>
                    </div>
                </div>
            `;
        }
    },

    heroEnqueue() {
        if (this.heroQueueData.length >= this.heroMaxCapacity) {
            if (window.UI) UI.showToast("⚠️ Antrean kasir penuh! Maksimal 3 orang (Kondisi Queue Overflow / Antrean Penuh).");
            return;
        }
        let nextName = this.heroQueueSequence[this.heroQueueData.length];
        if (!nextName) nextName = `Siswa ke-${this.heroQueueData.length + 1}`;

        this.heroQueueData.push(nextName);
        this.renderHeroSim();

        if (window.StorageManager && typeof StorageManager.recordSimulationOp === 'function') {
            const sim = StorageManager.recordSimulationOp('queueEnqueue');
            this.updateHeroSimulationBadge(sim);
        }
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Simulasi Antrean: Tambah antrean ${nextName}`);
        }
        if (window.UI) UI.showToast(`+ ${nextName} datang & masuk antrean di belakang (REAR)! [${this.heroQueueData.length}/3 Siswa]`);
    },

    heroDequeue() {
        if (this.heroQueueData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Antrean kasir kosong! Tidak ada pembeli mengantre (Kondisi Queue Underflow).");
            return;
        }
        const served = this.heroQueueData.shift();
        this.renderHeroSim();

        if (window.StorageManager && typeof StorageManager.recordSimulationOp === 'function') {
            const sim = StorageManager.recordSimulationOp('queueDequeue');
            this.updateHeroSimulationBadge(sim);
        }
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Simulasi Antrean: Layani ${served}`);
        }
        if (window.UI) UI.showToast(`− Kasir melayani ${served} yang terdepan (FRONT - FIFO)! [Sisa antrean: ${this.heroQueueData.length}/3 Siswa]`);
    },

    heroPush() {
        if (this.heroStackData.length >= this.heroMaxCapacity) {
            if (window.UI) UI.showToast("⚠️ Rak piring penuh! Maksimal 3 piring (Kondisi Stack Overflow / Tumpukan Meluap).");
            return;
        }
        let nextPlate = this.heroStackSequence[this.heroStackData.length];
        if (!nextPlate) nextPlate = `Piring ke-${this.heroStackData.length + 1}`;

        this.heroStackData.push(nextPlate);
        this.renderHeroSim();

        if (window.StorageManager && typeof StorageManager.recordSimulationOp === 'function') {
            const sim = StorageManager.recordSimulationOp('stackPush');
            this.updateHeroSimulationBadge(sim);
        }
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Simulasi Piring: Tambah ${nextPlate}`);
        }
        if (window.UI) UI.showToast(`+ Petugas menaruh ${nextPlate} di puncak tumpukan (TOP)! [${this.heroStackData.length}/3 Piring]`);
    },

    heroPop() {
        if (this.heroStackData.length === 0) {
            if (window.UI) UI.showToast("⚠️ Rak piring kosong! Tidak ada piring untuk diambil (Kondisi Stack Underflow).");
            return;
        }
        const popped = this.heroStackData.pop();
        this.renderHeroSim();

        if (window.StorageManager && typeof StorageManager.recordSimulationOp === 'function') {
            const sim = StorageManager.recordSimulationOp('stackPop');
            this.updateHeroSimulationBadge(sim);
        }
        if (window.CloudSync && typeof window.CloudSync.syncStudentState === 'function') {
            window.CloudSync.syncStudentState(`Simulasi Piring: Ambil ${popped}`);
        }
        if (window.UI) UI.showToast(`− Siswa mengambil ${popped} dari puncak (TOP - LIFO)! [Sisa di rak: ${this.heroStackData.length}/3 Piring]`);
    },

    resetHeroSim() {
        if (this.heroMode === 'queue') {
            this.heroQueueData = ['Ani'];
            if (window.UI) UI.showToast("🔄 Antrean kasir di-reset: kembali ke 1 siswa (Ani).");
        } else {
            this.heroStackData = ['🔴 Piring Merah'];
            if (window.UI) UI.showToast("🔄 Rak tumpukan piring di-reset: kembali ke 1 piring (🔴 Piring Merah).");
        }
        this.renderHeroSim();
        this.renderHeroChallenge();
    },

    toggleClue(clueId) {
        const clueEl = document.getElementById(clueId);
        if (!clueEl) return;
        const isOpen = clueEl.classList.contains('open');
        clueEl.classList.toggle('open', !isOpen);
    },

    // ----------------------------------------------------
    // MODUL REMEDIAL: LATIHAN SOAL BERVARIASI (UKIN PPG)
    // ----------------------------------------------------
    remedialAnswers: {},
    remedialQuestions: [
        {
            id: 1,
            badge: "Soal 1 • Konseptual & Prinsip Kerja (LIFO vs FIFO)",
            question: "Kasir kantin sekolah melayani siswa yang memesan makanan sesuai urutan kedatangan siswa, sedangkan piring saji yang bersih ditumpuk vertikal dan siswa mengambil piring yang paling baru diletakkan oleh petugas. Pasangan struktur data yang tepat untuk memodelkan kedua sistem tersebut adalah...",
            options: [
                { key: "A", text: "Antrean Kasir: Stack (LIFO) | Piring Saji: Queue (FIFO)", isCorrect: false, explanation: "Salah. Melayani siswa yang baru datang terlebih dahulu akan melanggar prinsip keadilan antrean." },
                { key: "B", text: "Antrean Kasir: Queue (FIFO) | Piring Saji: Stack (LIFO)", isCorrect: true, explanation: "Tepat sekali! Antrean kasir menjamin yang datang pertama dilayani pertama (FIFO), sedangkan piring saji diambil dari yang paling atas/terakhir ditumpuk (LIFO)." },
                { key: "C", text: "Antrean Kasir: Stack (LIFO) | Piring Saji: Stack (LIFO)", isCorrect: false, explanation: "Salah. Antrean kasir tidak boleh memakai Stack karena siswa pertama akan terjebak di posisi bawah." },
                { key: "D", text: "Antrean Kasir: Queue (FIFO) | Piring Saji: Queue (FIFO)", isCorrect: false, explanation: "Salah. Piring saji bertumpuk vertikal tidak dapat diambil dari bagian bawah tanpa merusak tumpukan." }
            ]
        },
        {
            id: 2,
            badge: "Soal 2 • Tracing Operasi Stack (LIFO)",
            question: "Sebuah wadah tumpukan Stack mula-mula kosong. Dilakukan serangkaian operasi secara berurutan:\n1) push('Piring Biru')\n2) push('Piring Hijau')\n3) push('Piring Merah')\n4) pop()\n5) push('Piring Kuning')\n\nJika sekarang program mengeksekusi operasi peek(), piring manakah yang berada di posisi puncak (TOP)?",
            options: [
                { key: "A", text: "Piring Merah", isCorrect: false, explanation: "Salah. Piring Merah sudah dikeluarkan dari tumpukan saat operasi pop() dieksekusi." },
                { key: "B", text: "Piring Hijau", isCorrect: false, explanation: "Salah. Piring Hijau berada di bawah Piring Kuning." },
                { key: "C", text: "Piring Kuning", isCorrect: true, explanation: "Tepat sekali! Operasi pop() menghapus 'Piring Merah', lalu operasi push('Piring Kuning') menaruh Kuning di posisi paling atas (TOP)." },
                { key: "D", text: "Piring Biru", isCorrect: false, explanation: "Salah. Piring Biru adalah elemen pertama yang berada di dasar tumpukan." }
            ]
        },
        {
            id: 3,
            badge: "Soal 3 • Tracing Operasi Queue (FIFO)",
            question: "Barisan antrean kantin (Queue) saat ini berisi 3 siswa secara berurutan: [FRONT] Doni -> Eka -> Fajar [REAR]. Kasir melayani satu siswa terdepan (dequeue), kemudian siswa bernama Gilang baru saja datang dan bergabung ke antrean (enqueue). Siapakah siswa yang saat ini berada di posisi FRONT (depan) dan REAR (belakang)?",
            options: [
                { key: "A", text: "FRONT: Doni | REAR: Fajar", isCorrect: false, explanation: "Salah. Doni sudah selesai dilayani dan keluar dari antrean (dequeue)." },
                { key: "B", text: "FRONT: Eka | REAR: Gilang", isCorrect: true, explanation: "Tepat sekali! Dequeue mengeluarkan Doni sehingga Eka maju menjadi FRONT, sedangkan Enqueue menambah Gilang di posisi paling belakang (REAR)." },
                { key: "C", text: "FRONT: Gilang | REAR: Eka", isCorrect: false, explanation: "Salah. Gilang baru datang sehingga harus berada di posisi REAR (belakang)." },
                { key: "D", text: "FRONT: Fajar | REAR: Doni", isCorrect: false, explanation: "Salah. Urutan tidak terbalik seperti itu dalam struktur data Queue." }
            ]
        },
        {
            id: 4,
            badge: "Soal 4 • Analisis Galat Komputasional (Underflow & Overflow)",
            question: "Sebuah dispenser tumpukan baki saji memiliki kapasitas maksimum 5 baki dan saat ini kondisinya kosong sama sekali (isEmpty() == true). Jika seorang siswa tetap mencoba menekan tombol pop() untuk mengambil baki, kondisi galat apakah yang akan terjadi pada sistem komputasi?",
            options: [
                { key: "A", text: "Stack Overflow, karena sistem kelebihan kapasitas memori", isCorrect: false, explanation: "Salah. Stack Overflow terjadi jika menambah data saat wadah sudah PENUH." },
                { key: "B", text: "Stack Underflow, karena mencoba mengambil elemen dari wadah yang KOSONG", isCorrect: true, explanation: "Tepat sekali! Mengambil data (pop) dari struktur data yang kosong memicu galat Underflow." },
                { key: "C", text: "Queue Dequeue Error, karena tumpukan otomatis berubah menjadi antrean", isCorrect: false, explanation: "Salah. Struktur data tumpukan piring adalah Stack, bukan Queue." },
                { key: "D", text: "Sistem tetap berjalan normal dan memberikan piring cadangan secara acak", isCorrect: false, explanation: "Salah. Secara komputasi, operasi pop pada wadah kosong adalah galat logika/runtime." }
            ]
        }
    ],

    renderRemedialQuiz() {
        const container = document.getElementById('remedial-questions-container');
        if (!container) return;

        let correctCount = 0;

        container.innerHTML = this.remedialQuestions.map((q) => {
            const userChoice = this.remedialAnswers[q.id];
            const hasAnswered = userChoice !== undefined;
            const selectedOpt = hasAnswered ? q.options[userChoice] : null;
            if (selectedOpt && selectedOpt.isCorrect) correctCount++;

            const optionsHTML = q.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                let btnClass = "remedial-opt-btn";
                if (hasAnswered) {
                    if (opt.isCorrect) {
                        btnClass += " is-correct";
                    } else if (isSelected && !opt.isCorrect) {
                        btnClass += " is-wrong";
                    }
                }

                return `
                    <button type="button" class="${btnClass}" onclick="PBLAcademic.answerRemedial(${q.id}, ${optIdx})">
                        <span class="opt-key">${opt.key}</span>
                        <span class="opt-text">${opt.text}</span>
                    </button>
                `;
            }).join('');

            let feedbackHTML = '';
            if (hasAnswered && selectedOpt) {
                feedbackHTML = `
                    <div class="gp-feedback-alert ${selectedOpt.isCorrect ? 'correct' : 'info'}" style="margin-top: 0.75rem;">
                        <strong>${selectedOpt.isCorrect ? '✅ Jawaban Benar!' : '💡 Pembahasan Konsep:'}</strong>
                        ${selectedOpt.explanation}
                    </div>
                `;
            }

            return `
                <div class="academic-task-card" style="margin-bottom: 1.25rem; background: #FFFFFF; border: 2px solid #D8D4BC; border-radius: 14px; padding: 1.25rem; box-shadow: 0 4px 14px rgba(113, 66, 54, 0.06);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
                        <span class="academic-badge academic-badge-amber" style="font-size: 0.8rem;">${q.badge}</span>
                        <span style="font-family: 'Space Mono', monospace; font-size: 0.82rem; font-weight: 700; color: #891A10;">Bobot: 25 Poin</span>
                    </div>
                    <p style="font-size: 0.95rem; font-weight: 600; color: #2B1D19; line-height: 1.55; white-space: pre-wrap; margin-bottom: 1rem;">${q.question}</p>
                    <div class="remedial-options-grid" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${optionsHTML}
                    </div>
                    ${feedbackHTML}
                </div>
            `;
        }).join('');

        const score = correctCount * 25;
        const scoreBadge = document.getElementById('remedial-score-badge');
        if (scoreBadge) {
            scoreBadge.textContent = `Skor Remedial: ${score} / 100 Poin`;
            scoreBadge.style.color = score >= 75 ? '#10b981' : '#E76814';
        }
    },

    answerRemedial(qId, optIdx) {
        this.remedialAnswers[qId] = optIdx;
        this.renderRemedialQuiz();
        const q = this.remedialQuestions.find(item => item.id === qId);
        const isCorrect = q && q.options[optIdx] && q.options[optIdx].isCorrect;
        if (window.SoundManager) SoundManager.play(isCorrect ? 'correct' : 'wrong');
        if (window.UI) {
            UI.showToast(isCorrect ? "✅ Tepat! Jawaban remedial kamu benar." : "💡 Cermati kembali prinsip dasar LIFO/FIFO pada pembahasan.");
        }
    },

    resetRemedialQuiz() {
        this.remedialAnswers = {};
        this.renderRemedialQuiz();
        if (window.SoundManager) SoundManager.play('click');
        if (window.UI) UI.showToast("🔄 Latihan soal remedial telah di-reset. Silakan coba kembali!");
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PBLAcademic.init();
});

window.PBLAcademic = PBLAcademic;

