/**
 * puzzles.js
 * Interactive Puzzle Zone: Drag & Drop, Ordering, and Concept Matching
 * Supports both HTML5 Drag & Drop and Click-to-Place (for seamless tablet/touch support)
 */

const PuzzlesManager = {
    currentPuzzle: 'A',
    selectedCard: null,

    init() {
        this.loadPuzzle('A');
    },

    loadPuzzle(type) {
        this.currentPuzzle = type;
        this.selectedCard = null;

        // Update tab buttons
        document.querySelectorAll('.puzzle-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-puzzle') === type);
        });

        const container = document.getElementById('puzzle-stage');
        if (!container) return;

        switch (type) {
            case 'A':
                this.renderPuzzleA(container);
                break;
            case 'B':
                this.renderPuzzleB(container);
                break;
            case 'C':
                this.renderPuzzleC(container);
                break;
            case 'D':
                this.renderPuzzleD(container);
                break;
            case 'E':
                this.renderPuzzleE(container);
                break;
        }
    },

    // ----------------------------------------------------
    // PUZZLE A: Arrange people according to FIFO
    // ----------------------------------------------------
    renderPuzzleA(container) {
        const people = [
            { id: 'p1', name: 'Rian (Tiba Pukul 07.00)', order: 1, avatar: '🏃‍♂️' },
            { id: 'p2', name: 'Maya (Tiba Pukul 07.05)', order: 2, avatar: '👩' },
            { id: 'p3', name: 'Soni (Tiba Pukul 07.10)', order: 3, avatar: '👨‍💼' },
            { id: 'p4', name: 'Alin (Tiba Pukul 07.15)', order: 4, avatar: '👧' }
        ];

        // Shuffle draggable pool
        const shuffled = [...people].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="puzzle-header-desc">
                <h3>🧩 ${t('puzzleADesc')}</h3>
                <p>Klik orang, lalu klik slot urutan giliran pelayanan (1 = Dilayani Pertama).</p>
            </div>
            <div class="puzzle-slots-container">
                ${[1, 2, 3, 4].map(num => `
                    <div class="puzzle-slot" data-slot="${num}" onclick="PuzzlesManager.handleSlotClick(${num})">
                        <span class="slot-number">Giliran #${num}</span>
                        <div class="slot-content" id="slot-a-${num}">
                            <span class="slot-placeholder">${t('dropHere')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-pool-container" id="puzzle-a-pool">
                ${shuffled.map(p => `
                    <div class="puzzle-draggable-card" id="card-${p.id}" data-id="${p.id}" data-order="${p.order}"
                         onclick="PuzzlesManager.handleCardClick('${p.id}', ${p.order})">
                        <span class="card-avatar">${p.avatar}</span>
                        <span class="card-text">${p.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-actions">
                <button class="btn btn-primary" onclick="PuzzlesManager.checkPuzzleA()">${t('btnCheck')}</button>
                <button class="btn btn-outline" onclick="PuzzlesManager.loadPuzzle('A')">${t('btnReset')}</button>
            </div>
        `;
    },

    // ----------------------------------------------------
    // PUZZLE B: Arrange stacked objects according to LIFO
    // ----------------------------------------------------
    renderPuzzleB(container) {
        // Items placed bottom to top: 1 (bottom), 2, 3, 4 (top)
        // Taking order: 4 first, then 3, then 2, then 1!
        const items = [
            { id: 'b1', name: 'Kardus 1 (Ditaruh Pertama - Paling Bawah)', takeOrder: 4, icon: '📦' },
            { id: 'b2', name: 'Kardus 2 (Ditaruh Kedua)', takeOrder: 3, icon: '📦' },
            { id: 'b3', name: 'Kardus 3 (Ditaruh Ketiga)', takeOrder: 2, icon: '📦' },
            { id: 'b4', name: 'Kardus 4 (Ditaruh Terakhir - Paling Atas)', takeOrder: 1, icon: '📦' }
        ];

        const shuffled = [...items].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="puzzle-header-desc">
                <h3>🧩 ${t('puzzleBDesc')}</h3>
                <p>Urutkan kardus mana yang DIAMBIL PERTAMA (Giliran 1) sampai TERAKHIR (LIFO).</p>
            </div>
            <div class="puzzle-slots-container">
                ${[1, 2, 3, 4].map(num => `
                    <div class="puzzle-slot" data-slot="${num}" onclick="PuzzlesManager.handleSlotClick(${num})">
                        <span class="slot-number">Ambil ke-#${num}</span>
                        <div class="slot-content" id="slot-b-${num}">
                            <span class="slot-placeholder">${t('dropHere')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-pool-container" id="puzzle-b-pool">
                ${shuffled.map(item => `
                    <div class="puzzle-draggable-card" id="card-${item.id}" data-id="${item.id}" data-order="${item.takeOrder}"
                         onclick="PuzzlesManager.handleCardClick('${item.id}', ${item.takeOrder})">
                        <span class="card-avatar">${item.icon}</span>
                        <span class="card-text">${item.name}</span>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-actions">
                <button class="btn btn-primary" onclick="PuzzlesManager.checkPuzzleB()">${t('btnCheck')}</button>
                <button class="btn btn-outline" onclick="PuzzlesManager.loadPuzzle('B')">${t('btnReset')}</button>
            </div>
        `;
    },

    // ----------------------------------------------------
    // PUZZLE C: Identify next element out (Stack vs Queue)
    // ----------------------------------------------------
    renderPuzzleC(container) {
        container.innerHTML = `
            <div class="puzzle-header-desc">
                <h3>🧩 ${t('puzzleCDesc')}</h3>
                <p>Amati dua wadah di bawah ini, lalu pilih elemen mana yang akan keluar jika operasi dipanggil!</p>
            </div>
            <div class="puzzle-c-grid">
                <div class="puzzle-c-card card">
                    <h4>Kasus 1: Antrean Tiket Bioskop (QUEUE - FIFO)</h4>
                    <div class="visual-mini-line">
                        <span class="item-tag front">FRONT ➔ [Ani]</span>
                        <span class="item-tag">[Bagas]</span>
                        <span class="item-tag">[Citra] ➔ REAR</span>
                    </div>
                    <p class="question-prompt">Jika kasir memanggil <code>dequeue()</code>, siapakah yang maju?</p>
                    <div class="puzzle-c-options">
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(1, 'Ani', true)">Ani</button>
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(1, 'Bagas', false)">Bagas</button>
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(1, 'Citra', false)">Citra</button>
                    </div>
                    <div id="c-feedback-1" class="c-feedback"></div>
                </div>

                <div class="puzzle-c-card card">
                    <h4>Kasus 2: Tumpukan Piring Bersih (STACK - LIFO)</h4>
                    <div class="visual-mini-stack">
                        <span class="item-tag top">[Piring Merah] ➔ TOP</span>
                        <span class="item-tag">[Piring Hijau]</span>
                        <span class="item-tag">[Piring Biru] (Bottom)</span>
                    </div>
                    <p class="question-prompt">Jika koki mengambil piring dengan <code>pop()</code>, piring warna apa yang terambil?</p>
                    <div class="puzzle-c-options">
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(2, 'Piring Merah', true)">Piring Merah</button>
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(2, 'Piring Hijau', false)">Piring Hijau</button>
                        <button class="btn btn-choice" onclick="PuzzlesManager.checkPuzzleCOption(2, 'Piring Biru', false)">Piring Biru</button>
                    </div>
                    <div id="c-feedback-2" class="c-feedback"></div>
                </div>
            </div>
        `;
    },

    // ----------------------------------------------------
    // PUZZLE D: Match terms (FIFO -> Queue, LIFO -> Stack, etc.)
    // ----------------------------------------------------
    renderPuzzleD(container) {
        const terms = [
            { id: 't1', label: 'FIFO (First In, First Out)', target: 'QUEUE' },
            { id: 't2', label: 'LIFO (Last In, First Out)', target: 'STACK' },
            { id: 't3', label: 'Posisi TOP (Puncak Tumpukan)', target: 'STACK' },
            { id: 't4', label: 'Posisi FRONT & REAR', target: 'QUEUE' },
            { id: 't5', label: 'Tombol Undo & Browser Back', target: 'STACK' },
            { id: 't6', label: 'Antrean Kasir & Printer Spooler', target: 'QUEUE' }
        ];

        const shuffled = [...terms].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="puzzle-header-desc">
                <h3>🧩 ${t('puzzleDDesc')}</h3>
                <p>Klik kartu konsep, lalu klik wadah STACK atau QUEUE yang sesuai!</p>
            </div>
            <div class="puzzle-categories-grid">
                <div class="puzzle-category-box stack-box" onclick="PuzzlesManager.handleCategoryClick('STACK')">
                    <div class="cat-header">📚 WADAH STACK (Tumpukan)</div>
                    <div class="cat-items" id="cat-stack-items"></div>
                </div>
                <div class="puzzle-category-box queue-box" onclick="PuzzlesManager.handleCategoryClick('QUEUE')">
                    <div class="cat-header">👥 WADAH QUEUE (Antrean)</div>
                    <div class="cat-items" id="cat-queue-items"></div>
                </div>
            </div>
            <div class="puzzle-pool-container" id="puzzle-d-pool">
                ${shuffled.map(t => `
                    <div class="puzzle-draggable-card" id="card-${t.id}" data-id="${t.id}" data-target="${t.target}"
                         onclick="PuzzlesManager.handleDCardClick('${t.id}', '${t.target}')">
                        <span class="card-text">${t.label}</span>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-actions">
                <button class="btn btn-primary" onclick="PuzzlesManager.checkPuzzleD()">${t('btnCheck')}</button>
                <button class="btn btn-outline" onclick="PuzzlesManager.loadPuzzle('D')">${t('btnReset')}</button>
            </div>
        `;
    },

    // ----------------------------------------------------
    // PUZZLE E: Match operations
    // ----------------------------------------------------
    renderPuzzleE(container) {
        const ops = [
            { id: 'o1', name: 'push(item)', target: 'STACK', desc: 'Menambah ke puncak' },
            { id: 'o2', name: 'pop()', target: 'STACK', desc: 'Mengambil dari puncak' },
            { id: 'o3', name: 'peek()', target: 'STACK', desc: 'Melihat elemen TOP' },
            { id: 'o4', name: 'enqueue(item)', target: 'QUEUE', desc: 'Menambah di REAR' },
            { id: 'o5', name: 'dequeue()', target: 'QUEUE', desc: 'Mengambil di FRONT' },
            { id: 'o6', name: 'front()', target: 'QUEUE', desc: 'Melihat elemen terdepan' }
        ];

        const shuffled = [...ops].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="puzzle-header-desc">
                <h3>🧩 ${t('puzzleEDesc')}</h3>
                <p>Kelompokkan setiap method/operasi data structure ke kotak yang tepat!</p>
            </div>
            <div class="puzzle-categories-grid">
                <div class="puzzle-category-box stack-box" onclick="PuzzlesManager.handleCategoryClick('STACK', 'E')">
                    <div class="cat-header">📚 OPERASI STACK</div>
                    <div class="cat-items" id="cat-e-stack-items"></div>
                </div>
                <div class="puzzle-category-box queue-box" onclick="PuzzlesManager.handleCategoryClick('QUEUE', 'E')">
                    <div class="cat-header">👥 OPERASI QUEUE</div>
                    <div class="cat-items" id="cat-e-queue-items"></div>
                </div>
            </div>
            <div class="puzzle-pool-container" id="puzzle-e-pool">
                ${shuffled.map(o => `
                    <div class="puzzle-draggable-card op-card" id="card-${o.id}" data-id="${o.id}" data-target="${o.target}"
                         onclick="PuzzlesManager.handleDCardClick('${o.id}', '${o.target}')">
                        <strong>${o.name}</strong>
                        <small>${o.desc}</small>
                    </div>
                `).join('')}
            </div>
            <div class="puzzle-actions">
                <button class="btn btn-primary" onclick="PuzzlesManager.checkPuzzleE()">${t('btnCheck')}</button>
                <button class="btn btn-outline" onclick="PuzzlesManager.loadPuzzle('E')">${t('btnReset')}</button>
            </div>
        `;
    },

    // ----------------- Interaction handlers -----------------
    handleCardClick(cardId, order) {
        document.querySelectorAll('.puzzle-draggable-card').forEach(c => c.classList.remove('selected'));
        const card = document.getElementById(`card-${cardId}`);
        if (card) {
            card.classList.add('selected');
            this.selectedCard = { id: cardId, order, element: card };
            if (window.SoundManager) SoundManager.play('click');
        }
    },

    handleSlotClick(slotNum) {
        if (!this.selectedCard) return;
        const prefix = this.currentPuzzle === 'A' ? 'slot-a-' : 'slot-b-';
        const slotEl = document.getElementById(`${prefix}${slotNum}`);
        if (!slotEl) return;

        // Move card to slot
        slotEl.innerHTML = '';
        slotEl.appendChild(this.selectedCard.element);
        slotEl.setAttribute('data-placed-order', this.selectedCard.order);
        this.selectedCard.element.classList.remove('selected');
        this.selectedCard = null;
        if (window.SoundManager) SoundManager.play('click');
    },

    handleDCardClick(cardId, target) {
        document.querySelectorAll('.puzzle-draggable-card').forEach(c => c.classList.remove('selected'));
        const card = document.getElementById(`card-${cardId}`);
        if (card) {
            card.classList.add('selected');
            this.selectedCard = { id: cardId, target, element: card };
            if (window.SoundManager) SoundManager.play('click');
        }
    },

    handleCategoryClick(targetCategory, puzzleType = 'D') {
        if (!this.selectedCard) return;
        const prefix = puzzleType === 'D' ? 'cat-' : 'cat-e-';
        const boxId = `${prefix}${targetCategory.toLowerCase()}-items`;
        const boxEl = document.getElementById(boxId);
        if (!boxEl) return;

        boxEl.appendChild(this.selectedCard.element);
        this.selectedCard.element.setAttribute('data-current-box', targetCategory);
        this.selectedCard.element.classList.remove('selected');
        this.selectedCard = null;
        if (window.SoundManager) SoundManager.play('click');
    },

    // ----------------- Check logic -----------------
    checkPuzzleA() {
        let allCorrect = true;
        for (let i = 1; i <= 4; i++) {
            const slot = document.getElementById(`slot-a-${i}`);
            const placedOrder = slot ? Number(slot.getAttribute('data-placed-order')) : null;
            if (placedOrder !== i) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            UI.showFeedback(true, `${t('puzzleSuccess')} (Prinsip FIFO: 07.00 -> 07.05 -> 07.10 -> 07.15)`, 'FIFO');
            this.rewardPuzzleSolved('A');
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, t('puzzleIncorrect'), 'FIFO');
        }
    },

    checkPuzzleB() {
        let allCorrect = true;
        for (let i = 1; i <= 4; i++) {
            const slot = document.getElementById(`slot-b-${i}`);
            const placedOrder = slot ? Number(slot.getAttribute('data-placed-order')) : null;
            if (placedOrder !== i) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            UI.showFeedback(true, `${t('puzzleSuccess')} (Prinsip LIFO: Kardus 4 paling atas keluar dulu, kardus 1 terakhir)`, 'LIFO');
            this.rewardPuzzleSolved('B');
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, t('puzzleIncorrect'), 'LIFO');
        }
    },

    checkPuzzleCOption(caseNum, selectedAnswer, isCorrect) {
        const feedbackEl = document.getElementById(`c-feedback-${caseNum}`);
        if (!feedbackEl) return;

        if (isCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            feedbackEl.innerHTML = `<span class="badge-correct">✓ Benar! ${selectedAnswer} keluar karena mematuhi aturan data structure.</span>`;
            this.rewardPuzzleSolved(`C${caseNum}`);
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            feedbackEl.innerHTML = `<span class="badge-wrong">✕ Belum tepat. Ingat kembali apakah wadah ini Queue (FIFO) atau Stack (LIFO)!</span>`;
        }
    },

    checkPuzzleD() {
        const cards = document.querySelectorAll('#cat-stack-items .puzzle-draggable-card, #cat-queue-items .puzzle-draggable-card');
        if (cards.length < 6) {
            UI.showFeedback(false, "Harap masukkan semua kartu ke dalam wadah terlebih dahulu!", 'General');
            return;
        }

        let allCorrect = true;
        cards.forEach(card => {
            const expected = card.getAttribute('data-target');
            const actual = card.getAttribute('data-current-box');
            if (expected !== actual) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            UI.showFeedback(true, t('puzzleSuccess'), 'General');
            this.rewardPuzzleSolved('D');
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, t('puzzleIncorrect'), 'General');
        }
    },

    checkPuzzleE() {
        const cards = document.querySelectorAll('#cat-e-stack-items .puzzle-draggable-card, #cat-e-queue-items .puzzle-draggable-card');
        if (cards.length < 6) {
            UI.showFeedback(false, "Harap kelompokkan seluruh method ke wadah terlebih dahulu!", 'General');
            return;
        }

        let allCorrect = true;
        cards.forEach(card => {
            const expected = card.getAttribute('data-target');
            const actual = card.getAttribute('data-current-box');
            if (expected !== actual) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            if (window.SoundManager) SoundManager.play('correct');
            UI.showFeedback(true, t('puzzleSuccess'), 'General');
            this.rewardPuzzleSolved('E');
        } else {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, t('puzzleIncorrect'), 'General');
        }
    },

    rewardPuzzleSolved(code) {
        if (window.ScoringSystem) {
            ScoringSystem.currentLevelState.correctCount++;
        }
        if (window.AchievementsManager && (code === 'D' || code === 'E')) {
            AchievementsManager.check('PUZZLE_SOLVER');
        }
    }
};

window.PuzzlesManager = PuzzlesManager;
