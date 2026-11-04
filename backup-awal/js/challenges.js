/**
 * challenges.js
 * Contextual Scenario Challenges, Quizzes, and Final Assessment Engine
 */

const CHALLENGE_BANKS = {
    // Level 1: Introduction Concept Check
    1: [
        {
            id: 'l1_q1',
            concept: 'LIFO',
            question: 'Di sebuah tumpukan piring bersih di atas meja, jika piring A diletakkan pertama, lalu piring B, dan terakhir piring C, piring manakah yang akan diambil pertama kali saat seseorang ingin makan?',
            questionEn: 'In a stack of clean plates on a table, if plate A is placed first, then B, and finally C, which plate will be taken first when someone wants to eat?',
            options: ['Piring A (Paling Bawah)', 'Piring B (Tengah)', 'Piring C (Paling Atas)'],
            optionsEn: ['Plate A (Bottom)', 'Plate B (Middle)', 'Plate C (Top)'],
            correctIndex: 2,
            correctAnswer: 'Piring C (Paling Atas)',
            correctAnswerEn: 'Plate C (Top)',
            explanation: 'Stack mengikuti prinsip LIFO (Last In, First Out). Piring C adalah piring yang terakhir ditaruh di puncak (TOP), sehingga dialah yang diambil pertama kali.',
            explanationEn: 'Stack follows LIFO (Last In, First Out). Plate C was placed last on the TOP, so it is removed first.'
        },
        {
            id: 'l1_q2',
            concept: 'FIFO',
            question: 'Di loket bioskop, penonton yang datang lebih awal akan dilayani lebih dahulu daripada penonton yang baru saja datang. Struktur data apakah yang mencerminkan situasi ini?',
            questionEn: 'At a cinema ticket counter, moviegoers who arrive earlier are served before newcomers. Which data structure reflects this situation?',
            options: ['Stack (Tumpukan)', 'Queue (Antrean)', 'Tree (Pohon)', 'Graph (Graf)'],
            optionsEn: ['Stack', 'Queue', 'Tree', 'Graph'],
            correctIndex: 1,
            correctAnswer: 'Queue (Antrean)',
            correctAnswerEn: 'Queue',
            explanation: 'Situasi antrean loket menerapkan prinsip FIFO (First In, First Out), yang merupakan karakteristik utama struktur data Queue.',
            explanationEn: 'Ticket counter lines follow FIFO (First In, First Out), the core principle of Queue.'
        },
        {
            id: 'l1_q3',
            concept: 'LIFO',
            question: 'Dalam aplikasi pengolah kata, fitur "Undo" (Ctrl+Z) membatalkan tindakan yang paling baru dilakukan terlebih dahulu. Fitur ini menggunakan konsep...',
            questionEn: 'In word processors, "Undo" (Ctrl+Z) reverts the most recently performed action first. This feature utilizes...',
            options: ['Queue (FIFO)', 'Stack (LIFO)', 'Sorting Array', 'Binary Search'],
            optionsEn: ['Queue (FIFO)', 'Stack (LIFO)', 'Sorting Array', 'Binary Search'],
            correctIndex: 1,
            correctAnswer: 'Stack (LIFO)',
            correctAnswerEn: 'Stack (LIFO)',
            explanation: 'Aksi yang terakhir diketik adalah yang pertama kali dibatalkan saat menekan Undo. Ini merupakan penerapan LIFO (Stack).',
            explanationEn: 'The action performed last is the first undone. This is an exact application of LIFO (Stack).'
        }
    ],

    // Level 7: Real-Life Technology Scenarios
    7: [
        {
            id: 'l7_q1',
            concept: 'dequeue()',
            question: 'Tiga siswa mengirim tugas ke printer sekolah secara berurutan: Ani (08.00), Budi (08.01), dan Cici (08.02). Jika printer selesai mencetak dokumen Ani dan memanggil operasi dequeue(), tugas siapa yang dicetak berikutnya?',
            questionEn: 'Three students send assignments to the school printer in order: Ani (08:00), Budi (08:01), and Cici (08:02). After Ani\'s document prints and dequeue() is called, whose document prints next?',
            options: ['Tugas Budi', 'Tugas Cici', 'Tugas Ani lagi', 'Printer mencetak acak'],
            optionsEn: ['Budi\'s assignment', 'Cici\'s assignment', 'Ani\'s assignment again', 'Random printing'],
            correctIndex: 0,
            correctAnswer: 'Tugas Budi',
            correctAnswerEn: 'Budi\'s assignment',
            explanation: 'Dalam antrean printer (Queue FIFO), setelah elemen paling depan (Ani) selesai didequeue, elemen di belakangnya (Budi) maju menjadi FRONT.',
            explanationEn: 'In a printer queue (Queue FIFO), after the front document (Ani) is dequeued, the next in line (Budi) becomes the new FRONT.'
        },
        {
            id: 'l7_q2',
            concept: 'push()',
            question: 'Ketika kamu membuka halaman web A -> B -> C secara berurutan, alamat web disimpan ke dalam riwayat browser. Operasi apa yang dipanggil oleh browser untuk menyimpan alamat baru ke tumpukan riwayat?',
            questionEn: 'When you browse web pages A -> B -> C sequentially, web addresses are stored in browser history. Which operation is executed by the browser to store a new URL on the history stack?',
            options: ['enqueue(C)', 'push(C)', 'dequeue(C)', 'peek(C)'],
            optionsEn: ['enqueue(C)', 'push(C)', 'dequeue(C)', 'peek(C)'],
            correctIndex: 1,
            correctAnswer: 'push(C)',
            correctAnswerEn: 'push(C)',
            explanation: 'Riwayat browser bekerja sebagai Stack. Menambahkan halaman baru ke puncak riwayat menggunakan operasi push().',
            explanationEn: 'Browser back history is implemented as a Stack. Appending a new visited URL onto the top requires push().'
        },
        {
            id: 'l7_q3',
            concept: 'isEmpty()',
            question: 'Sebelum mengambil elemen dengan pop() pada Stack atau dequeue() pada Queue, mengapa programer disarankan memeriksa isEmpty() terlebih dahulu?',
            questionEn: 'Before extracting an element using pop() on a Stack or dequeue() on a Queue, why should programmers check isEmpty() first?',
            options: [
                'Untuk mencegah error Underflow saat wadah kosong',
                'Untuk mempercepat kecepatan internet',
                'Agar elemen otomatis terhapus semua',
                'Supaya data bertambah dua kali lipat'
            ],
            optionsEn: [
                'To prevent Underflow errors when the container is empty',
                'To accelerate internet connection',
                'To automatically clear all items',
                'To double the data count'
            ],
            correctIndex: 0,
            correctAnswer: 'Untuk mencegah error Underflow saat wadah kosong',
            correctAnswerEn: 'To prevent Underflow errors when the container is empty',
            explanation: 'Jika kita memanggil pop() atau dequeue() pada struktur data yang sudah kosong, akan terjadi kondisi Underflow (atau menghasilkan null/undefined).',
            explanationEn: 'Calling pop() or dequeue() on an empty data structure triggers an Underflow condition (or returns null/undefined).'
        }
    ],

    // Level 8: Grand Champion Comprehensive Evaluation (10 items)
    8: [
        {
            id: 'l8_q1',
            concept: 'LIFO',
            question: 'Apa kepanjangan dan arti dari istilah LIFO dalam struktur data Stack?',
            questionEn: 'What is the expansion and meaning of LIFO in Stack data structure?',
            options: [
                'Last In, First Out — Yang terakhir masuk keluar pertama',
                'Late In, Fast Out — Yang terlambat keluar cepat',
                'Last In, Final Order — Urutan akhir',
                'Left In, Front Out — Masuk kiri keluar depan'
            ],
            optionsEn: [
                'Last In, First Out — The last item entered is the first removed',
                'Late In, Fast Out — Late items leave quickly',
                'Last In, Final Order — Final ordering',
                'Left In, Front Out — Enter left exit front'
            ],
            correctIndex: 0,
            correctAnswer: 'Last In, First Out — Yang terakhir masuk keluar pertama',
            correctAnswerEn: 'Last In, First Out',
            explanation: 'LIFO (Last In, First Out) adalah ciri khas mutlak Stack, di mana elemen yang dimasukkan paling akhir akan berada di puncak dan diambil pertama kali.',
            explanationEn: 'LIFO means the most recently added item is the first one taken out.'
        },
        {
            id: 'l8_q2',
            concept: 'FIFO',
            question: 'Apa kepanjangan dan arti dari istilah FIFO dalam struktur data Queue?',
            questionEn: 'What is the expansion and meaning of FIFO in Queue data structure?',
            options: [
                'First In, First Out — Yang pertama masuk keluar pertama',
                'Fast In, Fast Out — Masuk cepat keluar cepat',
                'Forward In, Final Out — Maju ke depan',
                'Front Item, First Order — Elemen depan'
            ],
            optionsEn: [
                'First In, First Out — The first item entered is the first served',
                'Fast In, Fast Out — Quick in quick out',
                'Forward In, Final Out — Step forward',
                'Front Item, First Order — Front item'
            ],
            correctIndex: 0,
            correctAnswer: 'First In, First Out — Yang pertama masuk keluar pertama',
            correctAnswerEn: 'First In, First Out',
            explanation: 'FIFO (First In, First Out) memastikan keadilan dalam antrean: yang datang lebih dulu akan dilayani terlebih dahulu.',
            explanationEn: 'FIFO guarantees fairness in queues: whoever arrives first is served first.'
        },
        {
            id: 'l8_q3',
            concept: 'push()',
            question: 'Diberikan sebuah Stack kosong. Operasi berikut dijalankan: push(5), push(10), push(15), lalu pop(). Berapakah nilai elemen yang berada di puncak (TOP) sekarang?',
            questionEn: 'Given an empty Stack. Operations executed: push(5), push(10), push(15), then pop(). What is the element at TOP now?',
            options: ['5', '10', '15', 'Stack kosong'],
            optionsEn: ['5', '10', '15', 'Stack is empty'],
            correctIndex: 1,
            correctAnswer: '10',
            correctAnswerEn: '10',
            explanation: 'Setelah push 5, 10, 15 -> stack adalah [5, 10, 15]. Saat pop() dipanggil, 15 dikeluarkan. Maka elemen puncak yang tersisa adalah 10.',
            explanationEn: 'Stack sequence: [5, 10, 15]. Calling pop() removes 15. The new top element is 10.'
        },
        {
            id: 'l8_q4',
            concept: 'dequeue()',
            question: 'Diberikan sebuah Queue kosong. Operasi dijalankan: enqueue("A"), enqueue("B"), enqueue("C"), lalu dequeue(). Siapakah elemen yang berada di posisi FRONT saat ini?',
            questionEn: 'Given an empty Queue. Operations executed: enqueue("A"), enqueue("B"), enqueue("C"), then dequeue(). Who is currently at FRONT?',
            options: ['A', 'B', 'C', 'Queue kosong'],
            optionsEn: ['A', 'B', 'C', 'Queue is empty'],
            correctIndex: 1,
            correctAnswer: 'B',
            correctAnswerEn: 'B',
            explanation: 'Queue awal: FRONT -> [A, B, C] <- REAR. Operasi dequeue() mengeluarkan "A" (elemen pertama masuk). Sekarang "B" maju menjadi FRONT.',
            explanationEn: 'Queue was [A, B, C]. dequeue() removes the frontmost element "A". "B" advances to become the new FRONT.'
        },
        {
            id: 'l8_q5',
            concept: 'peek()',
            question: 'Apa perbedaan mendasar antara operasi pop() dan peek() pada sebuah Stack?',
            questionEn: 'What is the key difference between pop() and peek() in a Stack?',
            options: [
                'pop() menghapus dan mengambil elemen teratas, sedangkan peek() hanya melihat tanpa menghapus',
                'peek() menghapus elemen, sedangkan pop() hanya melihat',
                'pop() menambah elemen baru, peek() menghapus elemen',
                'Keduanya sama persis tanpa ada perbedaan'
            ],
            optionsEn: [
                'pop() removes and returns top item, while peek() inspects top item without removing it',
                'peek() deletes, pop() inspects',
                'pop() adds, peek() deletes',
                'They are identical'
            ],
            correctIndex: 0,
            correctAnswer: 'pop() menghapus dan mengambil elemen teratas, sedangkan peek() hanya melihat tanpa menghapus',
            correctAnswerEn: 'pop() removes top item, while peek() only inspects',
            explanation: 'peek() digunakan untuk memeriksa apa yang ada di TOP tanpa mengubah ukuran stack, sedangkan pop() mengurangi ukuran stack sebanyak 1.',
            explanationEn: 'peek() allows looking at the top element safely without mutating the stack.'
        },
        {
            id: 'l8_q6',
            concept: 'front()',
            question: 'Pada struktur data Queue, posisi di mana data baru DITAMBAHKAN dan posisi di mana data DIKELUARKAN secara berturut-turut disebut...',
            questionEn: 'In a Queue, the position where new items are ADDED and the position where items are REMOVED are called respectively...',
            options: [
                'REAR (Belakang) dan FRONT (Depan)',
                'FRONT (Depan) dan TOP (Atas)',
                'TOP (Atas) dan BOTTOM (Bawah)',
                'REAR (Belakang) dan BOTTOM (Bawah)'
            ],
            optionsEn: [
                'REAR (Back) and FRONT (Head)',
                'FRONT and TOP',
                'TOP and BOTTOM',
                'REAR and BOTTOM'
            ],
            correctIndex: 0,
            correctAnswer: 'REAR (Belakang) dan FRONT (Depan)',
            correctAnswerEn: 'REAR and FRONT',
            explanation: 'Elemen baru selalu bergabung di ujung belakang (REAR / Enqueue), sedangkan pelayanan selalu dilakukan di ujung depan (FRONT / Dequeue).',
            explanationEn: 'New elements enter at the REAR, and elements leave from the FRONT.'
        },
        {
            id: 'l8_q7',
            concept: 'LIFO',
            question: 'Seorang mekanik menumpuk ban mobil di gudang secara vertikal ke atas: Ban 1, Ban 2, Ban 3, Ban 4. Jika mekanik ingin mengambil Ban 2 tanpa merusak tumpukan, berapa banyak ban yang harus ia angkat terlebih dahulu?',
            questionEn: 'A mechanic stacks car tires vertically: Tire 1, Tire 2, Tire 3, Tire 4. To retrieve Tire 2 without damaging the stack, how many tires must be lifted off first?',
            options: ['2 ban (Ban 4 dan Ban 3)', '1 ban (Hanya Ban 4)', 'Tidak perlu mengangkat ban lain', 'Semua 4 ban'],
            optionsEn: ['2 tires (Tire 4 and Tire 3)', '1 tire (Only Tire 4)', 'Zero tires', 'All 4 tires'],
            correctIndex: 0,
            correctAnswer: '2 ban (Ban 4 dan Ban 3)',
            correctAnswerEn: '2 tires (Tire 4 and Tire 3)',
            explanation: 'Tumpukan dari bawah ke atas: [1, 2, 3, 4(TOP)]. Untuk mencapai Ban 2, mekanik harus mem-pop Ban 4 dan Ban 3 terlebih dahulu (total 2 ban).',
            explanationEn: 'Stack is [1, 2, 3, 4(TOP)]. To reach 2, one must pop 4 and 3 first (2 items).'
        },
        {
            id: 'l8_q8',
            concept: 'FIFO',
            question: 'Di sebuah rumah sakit, sistem antrean UGD mendahulukan pasien gawat darurat dibanding urutan waktu kedatangan biasa. Jenis modifikasi queue apakah ini?',
            questionEn: 'In a hospital ER, critical emergency patients are served before normal arrival sequence. What variation of Queue is this?',
            options: ['Priority Queue (Antrean Berprioritas)', 'Normal Stack', 'Circular Stack', 'Binary Queue'],
            optionsEn: ['Priority Queue', 'Normal Stack', 'Circular Stack', 'Binary Queue'],
            correctIndex: 0,
            correctAnswer: 'Priority Queue (Antrean Berprioritas)',
            correctAnswerEn: 'Priority Queue',
            explanation: 'Ketika antrean tidak murni berdasarkan urutan waktu saja melainkan memiliki faktor derajat urgensi/prioritas, struktur tersebut disebut Priority Queue.',
            explanationEn: 'When queue items are served based on importance or urgency, it is called a Priority Queue.'
        },
        {
            id: 'l8_q9',
            concept: 'isEmpty()',
            question: 'Kondisi saat sebuah program mencoba melakukan operasi pop() pada Stack yang tidak memiliki elemen sama sekali disebut...',
            questionEn: 'The condition when a program tries to execute pop() on a Stack containing zero elements is called...',
            options: ['Stack Underflow', 'Stack Overflow', 'Memory Leak', 'Infinite Loop'],
            optionsEn: ['Stack Underflow', 'Stack Overflow', 'Memory Leak', 'Infinite Loop'],
            correctIndex: 0,
            correctAnswer: 'Stack Underflow',
            correctAnswerEn: 'Stack Underflow',
            explanation: 'Mengambil data dari tumpukan kosong memicu "Stack Underflow", sedangkan menambahkan data ke tumpukan yang kapasitas memorinya penuh disebut "Stack Overflow".',
            explanationEn: 'Popping an empty stack causes Stack Underflow; pushing to an already full memory capacity causes Stack Overflow.'
        },
        {
            id: 'l8_q10',
            concept: 'FIFO',
            question: 'Manakah dari kasus berikut yang PALING TIDAK COCOK menggunakan struktur data Stack?',
            questionEn: 'Which of the following scenarios is LEAST SUITABLE for using a Stack data structure?',
            options: [
                'Antrean kasir pembayaran tol mobil di jalan tol',
                'Pemeriksaan pasangan tanda kurung matematika seperti ((A+B)*C)',
                'Fitur riwayat undo dan redo pada Photoshop',
                'Navigasi tombol kembali (Back button) pada smartphone'
            ],
            optionsEn: [
                'Toll booth vehicle payment line',
                'Parenthesis bracket validation like ((A+B)*C)',
                'Undo and Redo history in photo editing',
                'Back button navigation on a smartphone'
            ],
            correctIndex: 0,
            correctAnswer: 'Antrean kasir pembayaran tol mobil di jalan tol',
            correctAnswerEn: 'Toll booth vehicle payment line',
            explanation: 'Antrean gerbang tol jalan tol wajib menggunakan Queue (FIFO) agar mobil pertama dilayani pertama. Jika memakai Stack (LIFO), mobil pertama akan terjebak selamanya!',
            explanationEn: 'Highway toll lines must use Queue (FIFO). If a toll used Stack (LIFO), the first car would be trapped forever!'
        }
    ]
};

const ChallengeManager = {
    currentLevelId: 8,
    questions: [],
    currentIndex: 0,
    selectedIdxDraft: null,
    answeredInCurrent: false,

    startChallenge(levelId) {
        this.currentLevelId = Number(levelId);
        this.questions = CHALLENGE_BANKS[this.currentLevelId] || CHALLENGE_BANKS[8];
        this.currentIndex = 0;
        this.selectedIdxDraft = null;
        this.answeredInCurrent = false;

        if (window.ScoringSystem) {
            ScoringSystem.startLevel(this.currentLevelId, this.questions.length * 25);
        }

        // Update breadcrumb
        if (window.UI) {
            const levelObj = window.LevelsManager ? LevelsManager.getLevel(this.currentLevelId) : null;
            const levelTitle = levelObj ? t(levelObj.titleKey) : `Level ${this.currentLevelId}`;
            UI.updateBreadcrumbs([
                { nameKey: 'breadcrumbHome', screen: 'home' },
                { name: levelTitle, screen: 'challenge' },
                { name: `${t('levelNumber', { num: this.currentLevelId })} - Soal ${this.currentIndex + 1}`, active: true }
            ]);
        }

        this.renderQuestion();
    },

    jumpToQuestion(targetIndex) {
        if (targetIndex < 0 || targetIndex >= this.questions.length) return;
        this.currentIndex = targetIndex;
        this.selectedIdxDraft = null;
        
        // Update breadcrumb to current question
        if (window.UI) {
            const levelObj = window.LevelsManager ? LevelsManager.getLevel(this.currentLevelId) : null;
            const levelTitle = levelObj ? t(levelObj.titleKey) : `Level ${this.currentLevelId}`;
            UI.updateBreadcrumbs([
                { nameKey: 'breadcrumbHome', screen: 'home' },
                { name: levelTitle, screen: 'challenge' },
                { name: `Soal ${this.currentIndex + 1} dari ${this.questions.length}`, active: true }
            ]);
        }

        this.renderQuestion();
    },

    renderQuestionPalette() {
        const total = this.questions.length;
        const tempAnswers = window.StorageManager ? StorageManager.getAllTempAnswers(this.currentLevelId) : {};

        return `
            <div class="challenge-palette-wrapper">
                <div class="palette-header-row">
                    <span class="palette-title">📋 ${t('questionPaletteTitle')}</span>
                    <span class="palette-autosave-badge" id="palette-autosave-status">
                        <span class="save-dot">●</span> <span>${t('autoSavedStatus')}</span>
                    </span>
                </div>
                <div class="palette-pills-row" role="tablist" aria-label="Navigasi Nomor Soal">
                    ${this.questions.map((q, idx) => {
                        const saved = tempAnswers[idx];
                        let statusClass = 'empty';
                        let statusSymbol = idx + 1;

                        if (saved && saved.isSubmitted) {
                            statusClass = saved.isCorrect ? 'answered-correct' : 'answered-wrong';
                            statusSymbol = saved.isCorrect ? `✓ ${idx + 1}` : `✗ ${idx + 1}`;
                        } else if (saved && saved.selectedIndex !== undefined && saved.selectedIndex !== null) {
                            statusClass = 'draft';
                            statusSymbol = `✎ ${idx + 1}`;
                        }

                        const isActive = idx === this.currentIndex ? 'active' : '';

                        return `
                            <button class="palette-btn ${statusClass} ${isActive}" 
                                    onclick="ChallengeManager.jumpToQuestion(${idx})"
                                    title="Pindah ke Soal #${idx + 1} (${statusClass})"
                                    aria-label="Soal nomor ${idx + 1}">
                                ${statusSymbol}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    renderQuestion() {
        const qContainer = document.getElementById('challenge-card-stage');
        const progressEl = document.getElementById('challenge-progress-text');
        const scoreEl = document.getElementById('challenge-live-score');
        if (!qContainer) return;

        const lang = getLanguage();
        const total = this.questions.length;
        const currentQ = this.questions[this.currentIndex];
        
        // Retrieve temporary stored answer for this question if exists
        const savedAnswer = window.StorageManager ? StorageManager.getTempAnswer(this.currentLevelId, this.currentIndex) : null;
        
        this.answeredInCurrent = !!(savedAnswer && savedAnswer.isSubmitted);
        this.selectedIdxDraft = savedAnswer ? savedAnswer.selectedIndex : null;

        if (progressEl) {
            progressEl.textContent = t('challengeQuestion', { current: this.currentIndex + 1, total });
        }
        if (scoreEl && window.ScoringSystem) {
            scoreEl.textContent = `${t('scoreLabel')} ${ScoringSystem.currentLevelState.baseScore}`;
        }

        const qText = lang === 'en' ? (currentQ.questionEn || currentQ.question) : currentQ.question;
        const options = lang === 'en' ? (currentQ.optionsEn || currentQ.options) : currentQ.options;

        const isSubmitted = !!(savedAnswer && savedAnswer.isSubmitted);
        const isCorrect = savedAnswer ? savedAnswer.isCorrect : false;
        const explanationText = lang === 'en' ? (currentQ.explanationEn || currentQ.explanation) : currentQ.explanation;

        qContainer.innerHTML = `
            ${this.renderQuestionPalette()}

            <div class="challenge-scenario-card card animate-slide-up" role="region" aria-label="Pertanyaan ${this.currentIndex + 1}">
                <div class="scenario-meta">
                    <span class="concept-badge">📌 Konsep: ${currentQ.concept}</span>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        ${savedAnswer ? `
                            <span class="draft-indicator-pill" id="draft-saved-pill">
                                💾 ${savedAnswer.isSubmitted ? 'Tersimpan & Dinilai' : 'Disimpan Sementara'} (${savedAnswer.savedAt || 'Baru Saja'})
                            </span>
                        ` : ''}
                        <span class="points-tag">+10 Poin</span>
                    </div>
                </div>

                <h3 class="scenario-question-text">${qText}</h3>
                
                <div class="scenario-options-grid" role="group" aria-label="Pilihan Jawaban">
                    ${options.map((opt, idx) => {
                        let optionClass = '';
                        if (isSubmitted) {
                            if (idx === currentQ.correctIndex) {
                                optionClass = 'correct-choice';
                            } else if (idx === this.selectedIdxDraft) {
                                optionClass = 'wrong-choice';
                            }
                        } else if (idx === this.selectedIdxDraft) {
                            optionClass = 'selected-draft-choice';
                        }

                        return `
                            <button class="btn btn-option-choice ${optionClass}" 
                                    id="opt-btn-${idx}" 
                                    onclick="ChallengeManager.selectOptionDraft(${idx})"
                                    ${isSubmitted ? 'disabled' : ''}
                                    aria-pressed="${idx === this.selectedIdxDraft}">
                                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                                <span class="opt-label">${opt}</span>
                                ${idx === this.selectedIdxDraft && !isSubmitted ? '<span class="selected-check">✓ Dipilih</span>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Friendly In-Card Error / Alert (Hidden by default) -->
                <div id="challenge-inline-alert" class="challenge-inline-alert hidden"></div>

                <!-- Feedback & Explanation Box -->
                <div id="challenge-feedback-box" class="challenge-feedback-box ${isSubmitted ? (isCorrect ? 'success-callout' : 'error-callout') : 'hidden'}">
                    ${isSubmitted ? `
                        <div class="feedback-header">
                            <span class="${isCorrect ? 'badge-success' : 'badge-danger'}">
                                ${isCorrect ? t('correctBadge') : t('wrongBadge')}
                            </span>
                            <h4>${isCorrect ? t('kikoCorrect') : t('kikoWrong')}</h4>
                        </div>
                        <p><strong>${t('explanationTitle')}</strong> ${explanationText}</p>
                    ` : ''}
                </div>

                <!-- Main Action Controls Bar -->
                <div class="challenge-action-toolbar">
                    <div class="action-left-group">
                        <button class="btn btn-outline btn-with-icon" 
                                onclick="ChallengeManager.prevQuestion()" 
                                ${this.currentIndex === 0 ? 'disabled' : ''}
                                title="Kembali ke soal sebelumnya tanpa menghapus jawaban">
                            ⬅ ${t('prevQuestionBtn')}
                        </button>
                        
                        <button class="btn btn-amber-outline btn-with-icon" 
                                onclick="ChallengeManager.resetThisQuestion()"
                                title="Ulangi hanya soal ini (jawaban soal lain TIDAK akan terhapus)">
                            🔄 ${t('resetThisQuestionBtn')}
                        </button>
                    </div>

                    <div class="action-right-group">
                        <button class="btn btn-outline" onclick="ChallengeManager.useHint()">
                            💡 ${t('btnHint')} (-5)
                        </button>

                        <button class="btn btn-choice btn-with-icon" 
                                onclick="ChallengeManager.saveDraftExplicit()" 
                                ${isSubmitted ? 'disabled' : ''}
                                title="Simpan pilihan saat ini sebagai draft sementara">
                            💾 ${t('saveTempAnswerBtn')}
                        </button>

                        ${!isSubmitted ? `
                            <button class="btn btn-success" onclick="ChallengeManager.submitCurrentAnswer()">
                                ✓ ${t('btnCheck')}
                            </button>
                        ` : ''}

                        ${this.currentIndex + 1 < total ? `
                            <button id="challenge-next-btn" class="btn btn-primary" onclick="ChallengeManager.nextQuestion()">
                                ${t('nextQuestionBtn')} ➔
                            </button>
                        ` : `
                            <button id="challenge-finish-btn" class="btn btn-primary" onclick="ChallengeManager.promptFinishChallenge()">
                                🏁 ${t('finishChallengeBtn')}
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    selectOptionDraft(selectedIdx) {
        if (this.answeredInCurrent) return;

        this.selectedIdxDraft = selectedIdx;
        const currentQ = this.questions[this.currentIndex];
        const lang = getLanguage();
        const chosenText = (lang === 'en' ? (currentQ.optionsEn || currentQ.options) : currentQ.options)[selectedIdx];

        // Hide inline alert if was shown
        const alertEl = document.getElementById('challenge-inline-alert');
        if (alertEl) alertEl.classList.add('hidden');

        // Update UI option buttons selection highlight
        this.questions[this.currentIndex].options.forEach((_, idx) => {
            const btn = document.getElementById(`opt-btn-${idx}`);
            if (btn) {
                btn.classList.toggle('selected-draft-choice', idx === selectedIdx);
                const checkBadge = btn.querySelector('.selected-check');
                if (idx === selectedIdx) {
                    if (!checkBadge) {
                        const span = document.createElement('span');
                        span.className = 'selected-check';
                        span.textContent = '✓ Dipilih';
                        btn.appendChild(span);
                    }
                } else if (checkBadge) {
                    checkBadge.remove();
                }
            }
        });

        // Automatically persist temporary answer draft
        if (window.StorageManager) {
            StorageManager.saveTempAnswer(this.currentLevelId, this.currentIndex, {
                selectedIndex: selectedIdx,
                isSubmitted: false,
                isCorrect: null,
                chosenText: chosenText,
                questionId: currentQ.id
            });
        }

        // Update live indicator & palette
        this.updateAutosaveIndicator();
    },

    updateAutosaveIndicator() {
        const statusEl = document.getElementById('palette-autosave-status');
        if (statusEl) {
            statusEl.innerHTML = `<span>✓</span> <span>${t('autoSavedStatus')} (${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})</span>`;
            statusEl.classList.add('pulse-once');
            setTimeout(() => statusEl.classList.remove('pulse-once'), 1000);
        }
        
        // Re-render only palette pill for this question to reflect draft
        const paletteBtns = document.querySelectorAll('.palette-btn');
        if (paletteBtns && paletteBtns[this.currentIndex]) {
            const btn = paletteBtns[this.currentIndex];
            if (!btn.classList.contains('answered-correct') && !btn.classList.contains('answered-wrong')) {
                btn.className = `palette-btn draft active`;
                btn.textContent = `✎ ${this.currentIndex + 1}`;
            }
        }
    },

    saveDraftExplicit() {
        if (this.selectedIdxDraft === null || this.selectedIdxDraft === undefined) {
            this.showInlineAlert(t('pleaseSelectOptionWarning'));
            if (window.SoundManager) SoundManager.play('wrong');
            return;
        }

        const currentQ = this.questions[this.currentIndex];
        const lang = getLanguage();
        const chosenText = (lang === 'en' ? (currentQ.optionsEn || currentQ.options) : currentQ.options)[this.selectedIdxDraft];

        if (window.StorageManager) {
            StorageManager.saveTempAnswer(this.currentLevelId, this.currentIndex, {
                selectedIndex: this.selectedIdxDraft,
                isSubmitted: false,
                isCorrect: null,
                chosenText: chosenText,
                questionId: currentQ.id
            });
        }

        if (window.UI) {
            UI.showToast(t('tempAnswerSavedNotice'));
            UI.setKikoDialogue('Jawaban sementara soal ini tersimpan! Kamu bisa beralih ke soal lain kapan saja.', 'happy');
        }
        if (window.SoundManager) SoundManager.play('click');
        this.renderQuestion();
    },

    submitCurrentAnswer() {
        if (this.selectedIdxDraft === null || this.selectedIdxDraft === undefined) {
            this.showInlineAlert(t('pleaseSelectOptionWarning'));
            if (window.SoundManager) SoundManager.play('wrong');
            return;
        }

        const selectedIdx = this.selectedIdxDraft;
        const currentQ = this.questions[this.currentIndex];
        const isCorrect = selectedIdx === currentQ.correctIndex;
        const lang = getLanguage();
        const chosenText = (lang === 'en' ? (currentQ.optionsEn || currentQ.options) : currentQ.options)[selectedIdx];

        this.answeredInCurrent = true;

        // Persist verified answer to StorageManager
        if (window.StorageManager) {
            StorageManager.saveTempAnswer(this.currentLevelId, this.currentIndex, {
                selectedIndex: selectedIdx,
                isSubmitted: true,
                isCorrect: isCorrect,
                chosenText: chosenText,
                questionId: currentQ.id
            });
        }

        // Record in scoring system
        if (window.ScoringSystem) {
            ScoringSystem.recordAnswer(isCorrect, currentQ, chosenText);
        }

        if (isCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            if (window.UI) UI.setKikoDialogue(t('kikoCorrect'), 'happy');
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            if (window.UI) UI.setKikoDialogue(t('kikoWrong'), 'thinking');
        }

        this.renderQuestion();
    },

    resetThisQuestion() {
        const currentQ = this.questions[this.currentIndex];
        const savedAnswer = window.StorageManager ? StorageManager.getTempAnswer(this.currentLevelId, this.currentIndex) : null;

        if (!savedAnswer && (this.selectedIdxDraft === null || this.selectedIdxDraft === undefined)) {
            if (window.UI) UI.showToast("Soal ini belum dijawab, silakan pilih salah satu opsi.");
            return;
        }

        // Reset ONLY this question, preserving all other questions!
        if (window.StorageManager) {
            StorageManager.resetQuestionAnswer(this.currentLevelId, this.currentIndex, currentQ.id, currentQ.question);
        }

        this.selectedIdxDraft = null;
        this.answeredInCurrent = false;

        if (window.SoundManager) SoundManager.play('pop');
        if (window.UI) {
            UI.showToast(t('resetQuestionSuccessNotice'));
            UI.setKikoDialogue("Soal ini siap diulang! Pikirkan kembali pilihan yang paling tepat ya.", 'thinking');
        }

        this.renderQuestion();
    },

    showInlineAlert(message) {
        const alertEl = document.getElementById('challenge-inline-alert');
        if (alertEl) {
            alertEl.className = 'challenge-inline-alert error animate-shake';
            alertEl.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                    <div>${message}</div>
                    <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;" onclick="this.parentElement.parentElement.classList.add('hidden')">✕</button>
                </div>
            `;
            alertEl.classList.remove('hidden');
        }
    },

    useHint() {
        const currentQ = this.questions[this.currentIndex];
        const hint = `💡 Petunjuk Konsep: ${currentQ.concept}. Pikirkan apakah data masuk/keluar dari arah depan, belakang, atau tumpukan atas!`;
        if (window.UI) UI.showFeedback(true, hint, currentQ.concept);
        if (window.ScoringSystem) {
            ScoringSystem.useHint();
            const scoreEl = document.getElementById('challenge-live-score');
            if (scoreEl) {
                scoreEl.textContent = `${t('scoreLabel')} ${ScoringSystem.currentLevelState.baseScore}`;
            }
        }
    },

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.jumpToQuestion(this.currentIndex - 1);
        }
    },

    nextQuestion() {
        if (this.currentIndex + 1 < this.questions.length) {
            this.jumpToQuestion(this.currentIndex + 1);
        } else {
            this.promptFinishChallenge();
        }
    },

    promptFinishChallenge() {
        const total = this.questions.length;
        const tempAnswers = window.StorageManager ? StorageManager.getAllTempAnswers(this.currentLevelId) : {};
        const answeredCount = Object.values(tempAnswers).filter(a => a && a.isSubmitted).length;

        if (answeredCount < total) {
            const unanswered = total - answeredCount;
            const proceed = confirm(`Kamu telah menyelesaikan ${answeredCount} dari ${total} soal. Masih ada ${unanswered} soal yang belum diperiksa/dijawab.\n\nApakah kamu yakin ingin menyelesaikan sekarang? Tekan 'Batal' untuk memeriksa kembali.`);
            if (!proceed) return;
        }

        // Finish Challenge!
        if (window.UI) UI.showLoading("Menghitung skor evaluasi akhir...");
        setTimeout(() => {
            if (window.UI) UI.hideLoading();
            const finalScore = window.ScoringSystem ? ScoringSystem.finishLevel() : 85;
            LevelsManager.completeLevel(this.currentLevelId, finalScore);
            UI.showLevelCompleteModal(this.currentLevelId, finalScore);
        }, 600);
    }
};

window.ChallengeManager = ChallengeManager;
window.CHALLENGE_BANKS = CHALLENGE_BANKS;
