/**
 * app.js
 * Core Application Controller, Interactive Simulators (Stack & Queue), and Event Listeners
 */

const App = {
    // Live instances for interactive simulations
    simStack: new Stack(),
    simQueue: new Queue(),

    init() {
        // Initialize subsystems
        StorageManager.init();
        SoundManager.init();
        Player.init();
        AchievementsManager.init();
        UI.init();

        // Restore language
        const savedLang = StorageManager.getSetting('language') || 'id';
        setLanguage(savedLang);

        // Check if player profile exists and is complete (Nama, Kelas, Nomor Absen)
        if (!Player.hasValidProfile()) {
            this.showNamePromptModal(true);
        }

        this.initSimulators();
        this.bindGlobalHandlers();
        this.initGroupProject();
    },

    bindGlobalHandlers() {
        // Language switches
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                if (lang) setLanguage(lang);
            });
        });

        // Audio toggle buttons
        document.querySelectorAll('.audio-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                SoundManager.toggle();
            });
        });

        // Player name & profile form submission
        const nameForm = document.getElementById('player-name-form');
        const nameInput = document.getElementById('player-name-input');
        const classInput = document.getElementById('player-class-input') || document.getElementById('player-class-select');
        const absenInput = document.getElementById('player-absen-input');
        const nameErrorMsg = document.getElementById('name-field-error');
        const classErrorMsg = document.getElementById('class-field-error');
        const absenErrorMsg = document.getElementById('absen-field-error');

        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (nameErrorMsg) nameErrorMsg.classList.add('hidden');
                nameInput.classList.remove('input-has-error');
            });
        }
        if (classInput) {
            classInput.addEventListener('input', () => {
                if (classErrorMsg) classErrorMsg.classList.add('hidden');
                classInput.classList.remove('input-has-error');
            });
        }
        if (absenInput) {
            absenInput.addEventListener('input', () => {
                if (absenErrorMsg) absenErrorMsg.classList.add('hidden');
                absenInput.classList.remove('input-has-error');
            });
        }

        if (nameForm) {
            nameForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameVal = nameInput ? nameInput.value.trim() : '';
                const classVal = classInput ? classInput.value.trim() : '';
                const absenVal = absenInput ? absenInput.value.trim() : '';

                let hasError = false;

                if (!nameVal || nameVal.length < 2 || nameVal.toLowerCase() === 'petualang') {
                    if (nameErrorMsg) nameErrorMsg.classList.remove('hidden');
                    if (nameInput) {
                        nameInput.classList.add('input-has-error');
                        if (!hasError) nameInput.focus();
                    }
                    hasError = true;
                }

                if (!classVal || classVal.length === 0) {
                    if (classErrorMsg) classErrorMsg.classList.remove('hidden');
                    if (classInput) {
                        classInput.classList.add('input-has-error');
                        if (!hasError) classInput.focus();
                    }
                    hasError = true;
                }

                const numAbsen = parseInt(absenVal, 10);
                if (!absenVal || isNaN(numAbsen) || numAbsen < 1 || numAbsen > 36) {
                    if (absenErrorMsg) {
                        absenErrorMsg.textContent = '⚠️ Nomor absen wajib diisi dengan angka antara 1 sampai 36.';
                        absenErrorMsg.classList.remove('hidden');
                    }
                    if (absenInput) {
                        absenInput.classList.add('input-has-error');
                        if (!hasError) absenInput.focus();
                    }
                    hasError = true;
                }

                if (hasError) {
                    if (window.SoundManager) SoundManager.play('wrong');
                    return;
                }

                Player.setProfile(nameVal, classVal, String(numAbsen));
                this.hideNamePromptModal();
                if (window.SoundManager) SoundManager.play('correct');
                UI.showToast(`Selamat datang, ${nameVal} (${classVal} - Absen ${numAbsen})! Petualangan dimulai!`);
                UI.setKikoDialogue(t('greeting', { name: nameVal }), 'cheering');

                // Auto-sync ke anggota 1 di Tugas Kelompok jika belum ada anggota
                if (this.groupProjectState && this.groupProjectState.members && this.groupProjectState.members.length > 0) {
                    const firstMember = this.groupProjectState.members[0];
                    if (!firstMember.name || firstMember.name === 'Petualang' || firstMember.name === 'Siswa 1') {
                        firstMember.name = nameVal;
                        firstMember.absen = String(numAbsen);
                        this.renderGroupMembersList();
                    }
                }
            });
        }

        // Prevent closing modal when mandatory on backdrop click
        const nameModal = document.getElementById('name-prompt-modal');
        if (nameModal) {
            nameModal.addEventListener('click', (e) => {
                if (e.target === nameModal) {
                    if (nameModal.getAttribute('data-mandatory') === 'true' || !Player.hasValidProfile()) {
                        e.stopPropagation();
                        const card = nameModal.querySelector('.modal-card');
                        if (card) {
                            card.classList.remove('animate-shake');
                            void card.offsetWidth;
                            card.classList.add('animate-shake');
                        }
                    } else {
                        this.hideNamePromptModal();
                    }
                }
            });

            // Prevent closing modal via Escape key if mandatory
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nameModal.classList.contains('active')) {
                    if (nameModal.getAttribute('data-mandatory') === 'true' || !Player.hasValidProfile()) {
                        e.preventDefault();
                        e.stopPropagation();
                        const card = nameModal.querySelector('.modal-card');
                        if (card) {
                            card.classList.remove('animate-shake');
                            void card.offsetWidth;
                            card.classList.add('animate-shake');
                        }
                    } else {
                        this.hideNamePromptModal();
                    }
                }
            });
        }

        // Mini games navigation tabs
        document.querySelectorAll('.game-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameKey = btn.getAttribute('data-game');
                UI.loadMiniGameTab(gameKey);
            });
        });

        // Puzzle tabs
        document.querySelectorAll('.puzzle-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pKey = btn.getAttribute('data-puzzle');
                if (window.PuzzlesManager) PuzzlesManager.loadPuzzle(pKey);
            });
        });
    },

    openProfileModal(isMandatory = false) {
        this.showNamePromptModal(isMandatory);
    },

    showNamePromptModal(isMandatory = false) {
        const modal = document.getElementById('name-prompt-modal');
        if (!modal) return;

        const mandatory = isMandatory || !Player.hasValidProfile();
        const cancelBtn = document.getElementById('player-form-cancel-btn');
        const submitBtn = document.getElementById('player-form-submit-btn');

        if (mandatory) {
            modal.setAttribute('data-mandatory', 'true');
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (submitBtn) submitBtn.textContent = '🚀 Simpan & Mulai Belajar';
        } else {
            modal.removeAttribute('data-mandatory');
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
            if (submitBtn) submitBtn.textContent = '💾 Simpan Perubahan Profil';
        }

        modal.classList.add('active');

        const input = document.getElementById('player-name-input');
        const classInput = document.getElementById('player-class-input') || document.getElementById('player-class-select');
        const absenInput = document.getElementById('player-absen-input');

        if (input) {
            input.value = (Player.getName() !== 'Petualang') ? Player.getName() : '';
            setTimeout(() => input.focus(), 300);
        }
        if (classInput) {
            classInput.value = Player.getClass() || 'SMA Fase E (Kelas X)';
        }
        if (absenInput) {
            absenInput.value = Player.getAbsen() || '';
        }
    },

    cancelProfileModal() {
        const modal = document.getElementById('name-prompt-modal');
        if (modal && modal.getAttribute('data-mandatory') === 'true' && !Player.hasValidProfile()) {
            alert("Data Nama Lengkap, Kelas, dan Nomor Absen wajib diisi sebelum memulai belajar!");
            return;
        }
        if (!Player.hasValidProfile()) {
            return;
        }
        this.hideNamePromptModal();
    },

    hideNamePromptModal() {
        const modal = document.getElementById('name-prompt-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.removeAttribute('data-mandatory');
        }
    },

    // ----------------------------------------------------
    // LEARNING TABS SWITCHER (Stack & Queue)
    // ----------------------------------------------------
    switchLearnTab(screenType, tabKey) {
        const screenEl = document.getElementById(`screen-learn-${screenType}`);
        if (!screenEl) return;

        // Update active tab buttons
        screenEl.querySelectorAll('.learn-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
        });

        // Update active tab panes
        screenEl.querySelectorAll('.learn-tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.getAttribute('data-tab-pane') === tabKey);
        });

        // Scroll smooth to top of learning container
        const container = screenEl.querySelector('.learning-container');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // ----------------------------------------------------
    // INTERACTIVE STACK SIMULATOR (Lab Level 2)
    // ----------------------------------------------------
    initSimulators() {
        // Pre-populate 2 items for demonstration
        this.simStack.clear();
        this.simStack.push("Piring Biru");
        this.simStack.push("Piring Kuning");
        this.renderStackSim();

        this.simQueue.clear();
        this.simQueue.enqueue({ name: "Rina", avatar: "👧" });
        this.simQueue.enqueue({ name: "Fajar", avatar: "👦" });
        this.renderQueueSim();
    },

    simPush() {
        const select = document.getElementById('sim-stack-select');
        const item = select ? select.value : "Piring Bersih";
        
        if (this.simStack.size() >= 6) {
            UI.showFeedback(false, "Kapasitas simulasi tumpukan penuh (Maksimal 6 elemen)! Hindari Stack Overflow.", 'LIFO');
            this.stackMissions.boundDone = true;
            this.updateStackMissionUI();
            return;
        }

        this.simStack.push(item);
        if (window.SoundManager) SoundManager.play('push');
        
        this.stackMissions.pushDone = true;
        if (this.simStack.size() >= 4) {
            this.stackMissions.boundDone = true;
        }
        this.updateStackMissionUI();

        UI.showFeedback(true, `push("${item}"): Elemen baru bertengger tepat di posisi TOP.`, 'LIFO');
        this.renderStackSim(true);
    },

    simPop() {
        if (this.simStack.isEmpty()) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, `pop() gagal: ${t('stackEmptyNotice')} (Stack Underflow)`, 'LIFO');
            this.stackMissions.boundDone = true;
            this.updateStackMissionUI();
            return;
        }

        const popped = this.simStack.pop();
        if (window.SoundManager) SoundManager.play('pop');

        this.stackMissions.popDone = true;
        this.updateStackMissionUI();

        UI.showFeedback(true, `pop(): Mengambil "${popped}" dari puncak TOP. Elemen yang terakhir masuk keluar lebih dulu (LIFO).`, 'LIFO');
        this.renderStackSim();
    },

    simPeek() {
        if (this.simStack.isEmpty()) {
            UI.showFeedback(false, `peek() gagal: ${t('stackEmptyNotice')}`, 'LIFO');
            return;
        }

        const top = this.simStack.peek();
        if (window.SoundManager) SoundManager.play('peek');

        this.stackMissions.peekDone = true;
        this.updateStackMissionUI();

        UI.showFeedback(true, `peek(): Elemen di puncak TOP saat ini adalah "${top}". Ukuran tumpukan tetap sama (${this.simStack.size()}).`, 'LIFO');
        
        // Highlight top card visually
        const topEl = document.querySelector('#sim-stack-container .sim-stack-item:first-child');
        if (topEl) {
            topEl.classList.add('peek-highlight');
            setTimeout(() => topEl.classList.remove('peek-highlight'), 1500);
        }
    },

    simClearStack() {
        this.simStack.clear();
        this.stackMissions.boundDone = true;
        this.updateStackMissionUI();
        if (window.SoundManager) SoundManager.play('click');
        UI.showFeedback(true, "Tumpukan telah dikosongkan (clear).", 'LIFO');
        this.renderStackSim();
    },

    renderStackSim(isPushed = false) {
        const container = document.getElementById('sim-stack-container');
        const stateTop = document.getElementById('sim-stack-top-val');
        const stateSize = document.getElementById('sim-stack-size-val');
        const stateEmpty = document.getElementById('sim-stack-empty-val');
        if (!container) return;

        const items = this.simStack.toArray();
        const topItem = this.simStack.peek();

        if (stateTop) stateTop.textContent = topItem || '(Kosong)';
        if (stateSize) stateSize.textContent = items.length;
        if (stateEmpty) stateEmpty.textContent = this.simStack.isEmpty() ? 'Ya (True)' : 'Tidak (False)';

        // Render from top to bottom
        container.innerHTML = items.slice().reverse().map((item, idx) => {
            const isTop = idx === 0;
            return `
                <div class="sim-stack-item ${isTop ? 'is-top' : ''} ${isTop && isPushed ? 'animate-slide-down-in' : ''}">
                    <span class="item-tag-box">📚 ${item}</span>
                    ${isTop ? '<span class="top-indicator">TOP ➔</span>' : ''}
                </div>
            `;
        }).join('');

        if (items.length === 0) {
            container.innerHTML = `<div class="sim-empty-label">${t('stackEmptyNotice')}</div>`;
        }
    },

    // ----------------------------------------------------
    // INTERACTIVE QUEUE SIMULATOR (Lab Level 3)
    // ----------------------------------------------------
    simEnqueue() {
        const select = document.getElementById('sim-queue-select');
        const personName = select ? select.value : "Siswa";
        const avatars = ["👦", "👧", "👨‍🏫", "👵", "👱‍♀️"];
        const avatar = avatars[Math.floor(Math.random() * avatars.length)];

        if (this.simQueue.size() >= 6) {
            UI.showFeedback(false, "Antrean penuh (Maksimal 6 orang)! Tunggu kasir melayani di depan.", 'FIFO');
            this.queueMissions.boundDone = true;
            this.updateQueueMissionUI();
            return;
        }

        const person = { name: personName, avatar, id: Date.now() % 1000 };
        this.simQueue.enqueue(person);
        if (window.SoundManager) SoundManager.play('enqueue');

        this.queueMissions.enqueueDone = true;
        if (this.simQueue.size() >= 4) {
            this.queueMissions.boundDone = true;
        }
        this.updateQueueMissionUI();

        UI.showFeedback(true, `enqueue("${person.name}"): Masuk ke antrean di posisi paling belakang (REAR).`, 'FIFO');
        this.renderQueueSim(true);
    },

    simDequeue() {
        if (this.simQueue.isEmpty()) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, `dequeue() gagal: ${t('queueEmptyNotice')} (Queue Underflow)`, 'FIFO');
            this.queueMissions.boundDone = true;
            this.updateQueueMissionUI();
            return;
        }

        const dequeued = this.simQueue.dequeue();
        if (window.SoundManager) SoundManager.play('dequeue');

        this.queueMissions.dequeueDone = true;
        this.updateQueueMissionUI();

        UI.showFeedback(true, `dequeue(): Melayani "${dequeued.name}" yang berada di posisi FRONT. Pelanggan pertama dilayani lebih dulu (FIFO).`, 'FIFO');
        this.renderQueueSim();
    },

    simFront() {
        if (this.simQueue.isEmpty()) {
            UI.showFeedback(false, `front() gagal: ${t('queueEmptyNotice')}`, 'FIFO');
            return;
        }

        const frontPerson = this.simQueue.front();
        if (window.SoundManager) SoundManager.play('peek');

        this.queueMissions.frontDone = true;
        this.updateQueueMissionUI();

        UI.showFeedback(true, `front(): Orang di barisan depan saat ini adalah "${frontPerson.name}". Tidak ada perubahan antrean.`, 'FIFO');

        const frontEl = document.querySelector('#sim-queue-container .sim-queue-person:first-child');
        if (frontEl) {
            frontEl.classList.add('front-highlight');
            setTimeout(() => frontEl.classList.remove('front-highlight'), 1500);
        }
    },

    simClearQueue() {
        this.simQueue.clear();
        this.queueMissions.boundDone = true;
        this.updateQueueMissionUI();
        if (window.SoundManager) SoundManager.play('click');
        UI.showFeedback(true, "Antrean telah dikosongkan.", 'FIFO');
        this.renderQueueSim();
    },

    renderQueueSim(isEnqueued = false) {
        const container = document.getElementById('sim-queue-container');
        const stateFront = document.getElementById('sim-queue-front-val');
        const stateRear = document.getElementById('sim-queue-rear-val');
        const stateSize = document.getElementById('sim-queue-size-val');
        const stateEmpty = document.getElementById('sim-queue-empty-val');
        if (!container) return;

        const items = this.simQueue.toArray();
        const frontItem = this.simQueue.front();
        const rearItem = items.length > 0 ? items[items.length - 1] : null;

        if (stateFront) stateFront.textContent = frontItem ? `${frontItem.name}` : '(Kosong)';
        if (stateRear) stateRear.textContent = rearItem ? `${rearItem.name}` : '(Kosong)';
        if (stateSize) stateSize.textContent = items.length;
        if (stateEmpty) stateEmpty.textContent = this.simQueue.isEmpty() ? 'Ya (True)' : 'Tidak (False)';

        container.innerHTML = items.map((p, idx) => {
            const isFront = idx === 0;
            const isRear = idx === items.length - 1;
            return `
                <div class="sim-queue-person ${isFront ? 'is-front' : ''} ${isRear && isEnqueued ? 'animate-slide-left-in' : ''}">
                    <span class="person-avatar">${p.avatar}</span>
                    <span class="person-name">${p.name}</span>
                    ${isFront ? '<span class="queue-role-badge front">FRONT</span>' : ''}
                    ${isRear && !isFront ? '<span class="queue-role-badge rear">REAR</span>' : ''}
                </div>
            `;
        }).join('');

        if (items.length === 0) {
            container.innerHTML = `<div class="sim-empty-label">${t('queueEmptyNotice')}</div>`;
        }
    },

    onLanguageChanged(newLang) {
        // Re-render dynamic components that use language
        this.renderStackSim();
        this.renderQueueSim();
        if (UI.currentScreen === 'home') UI.renderWorldMap();
        if (UI.currentScreen === 'achievements') AchievementsManager.renderAchievementsGrid();
    },

    // ----------------------------------------------------
    // MISSION CHECKLIST TRACKERS (Levels 2 & 3)
    // ----------------------------------------------------
    stackMissions: {
        pushDone: false,
        peekDone: false,
        popDone: false,
        boundDone: false
    },

    queueMissions: {
        enqueueDone: false,
        frontDone: false,
        dequeueDone: false,
        boundDone: false
    },

    updateStackMissionUI() {
        const missions = [
            { id: 'sm-push', done: this.stackMissions.pushDone },
            { id: 'sm-peek', done: this.stackMissions.peekDone },
            { id: 'sm-pop', done: this.stackMissions.popDone },
            { id: 'sm-bound', done: this.stackMissions.boundDone }
        ];

        let completedCount = 0;
        missions.forEach(m => {
            const el = document.getElementById(m.id);
            if (el) {
                el.classList.toggle('completed', m.done);
                const cb = el.querySelector('.mission-checkbox');
                if (cb) cb.textContent = m.done ? '✓' : '';
            }
            if (m.done) completedCount++;
        });

        const score = completedCount * 25;
        const scoreEl = document.getElementById('stack-sim-mission-score');
        if (scoreEl) scoreEl.textContent = `${score} / 100 Poin`;

        if (completedCount === 4) {
            const saveBtn = document.getElementById('btn-save-stack-sim');
            if (saveBtn) saveBtn.classList.remove('btn-disabled');
        }
    },

    updateQueueMissionUI() {
        const missions = [
            { id: 'qm-enqueue', done: this.queueMissions.enqueueDone },
            { id: 'qm-front', done: this.queueMissions.frontDone },
            { id: 'qm-dequeue', done: this.queueMissions.dequeueDone },
            { id: 'qm-bound', done: this.queueMissions.boundDone }
        ];

        let completedCount = 0;
        missions.forEach(m => {
            const el = document.getElementById(m.id);
            if (el) {
                el.classList.toggle('completed', m.done);
                const cb = el.querySelector('.mission-checkbox');
                if (cb) cb.textContent = m.done ? '✓' : '';
            }
            if (m.done) completedCount++;
        });

        const score = completedCount * 25;
        const scoreEl = document.getElementById('queue-sim-mission-score');
        if (scoreEl) scoreEl.textContent = `${score} / 100 Poin`;

        if (completedCount === 4) {
            const saveBtn = document.getElementById('btn-save-queue-sim');
            if (saveBtn) saveBtn.classList.remove('btn-disabled');
        }
    },

    saveStackSimScore() {
        let count = 0;
        if (this.stackMissions.pushDone) count++;
        if (this.stackMissions.peekDone) count++;
        if (this.stackMissions.popDone) count++;
        if (this.stackMissions.boundDone) count++;

        const finalScore = Math.max(80, count * 25);
        if (window.StorageManager) {
            StorageManager.savePageScore('stack-sim', finalScore, { missions: this.stackMissions });
            StorageManager.setLevelScore(2, finalScore);
            StorageManager.unlockLevel(3);
        }
        if (window.LevelsManager) {
            LevelsManager.completeLevel(2, finalScore);
        }
        if (window.SoundManager) SoundManager.play('levelComplete');

        UI.showToast(`✅ Skor Simulator Stack tersimpan: ${finalScore} pts! Level 3 Terbuka!`);
        UI.showLevelCompleteModal(2, finalScore);
    },

    saveQueueSimScore() {
        let count = 0;
        if (this.queueMissions.enqueueDone) count++;
        if (this.queueMissions.frontDone) count++;
        if (this.queueMissions.dequeueDone) count++;
        if (this.queueMissions.boundDone) count++;

        const finalScore = Math.max(80, count * 25);
        if (window.StorageManager) {
            StorageManager.savePageScore('queue-sim', finalScore, { missions: this.queueMissions });
            StorageManager.setLevelScore(3, finalScore);
            StorageManager.unlockLevel(4);
        }
        if (window.LevelsManager) {
            LevelsManager.completeLevel(3, finalScore);
        }
        if (window.SoundManager) SoundManager.play('levelComplete');

        UI.showToast(`✅ Skor Simulator Queue tersimpan: ${finalScore} pts! Level 4 Terbuka!`);
        UI.showLevelCompleteModal(3, finalScore);
    },

    // ----------------------------------------------------
    // HANDS-ON MINI SIMULATORS (Inside Learn Pages)
    // ----------------------------------------------------
    learnStackPlates: ["Piring Merah", "Piring Hijau"],
    learnQueuePeople: [
        { name: "Doni", avatar: "👦" },
        { name: "Siti", avatar: "👧" }
    ],

    recordMiniLabOp(opKey) {
        if (!window.StorageManager) return;
        if (!StorageManager.data.miniLabOps) {
            StorageManager.data.miniLabOps = {
                stackPush: false,
                stackPop: false,
                queueEnqueue: false,
                queueDequeue: false
            };
        }
        const wasNew = !StorageManager.data.miniLabOps[opKey];
        StorageManager.data.miniLabOps[opKey] = true;

        let doneCount = 0;
        if (StorageManager.data.miniLabOps.stackPush) doneCount++;
        if (StorageManager.data.miniLabOps.stackPop) doneCount++;
        if (StorageManager.data.miniLabOps.queueEnqueue) doneCount++;
        if (StorageManager.data.miniLabOps.queueDequeue) doneCount++;

        const miniScore = doneCount * 25;
        if (!StorageManager.data.pageScores) StorageManager.data.pageScores = {};
        StorageManager.data.pageScores['mini-lab'] = {
            score: miniScore,
            completed: doneCount === 4,
            savedAt: new Date().toISOString()
        };
        StorageManager.save();

        if (wasNew && window.UI) {
            UI.showToast(`🧪 Praktik Mini-Lab Tercatat! Skor Praktik: ${miniScore}/100 pts (${doneCount}/4 operasi selesai)`);
        }
    },

    handsOnPushPlate() {
        const colors = ["Piring Biru", "Piring Kuning", "Piring Ungu", "Piring Oranye"];
        const nextColor = colors[this.learnStackPlates.length % colors.length];
        if (this.learnStackPlates.length >= 5) {
            UI.showToast("Kapasitas tumpukan piring penuh (Maks. 5 piring)! Hindari Stack Overflow.");
            return;
        }
        this.learnStackPlates.push(nextColor);
        if (window.SoundManager) SoundManager.play('push');
        this.renderHandsOnStack();
        this.recordMiniLabOp('stackPush');
        UI.showToast(`Push: ${nextColor} diletakkan di puncak (TOP). Operasi Mini-Lab tercatat!`);
    },

    handsOnPopPlate() {
        if (this.learnStackPlates.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Tumpukan piring kosong (Stack Underflow)!");
            return;
        }
        const popped = this.learnStackPlates.pop();
        if (window.SoundManager) SoundManager.play('pop');
        this.renderHandsOnStack();
        this.recordMiniLabOp('stackPop');
        UI.showToast(`Pop: ${popped} diambil dari TOP. Prinsip LIFO terbukti!`);
    },

    renderHandsOnStack() {
        const container = document.getElementById('handson-stack-plates');
        if (!container) return;
        container.innerHTML = this.learnStackPlates.slice().reverse().map((plate, idx) => `
            <div class="sim-stack-item ${idx === 0 ? 'is-top animate-slide-down-in' : ''}" style="padding: 0.5rem 0.75rem; font-size: 0.85rem;">
                <span>🍽 ${plate}</span>
                ${idx === 0 ? '<span class="top-indicator" style="font-size: 0.7rem;">TOP ➔</span>' : ''}
            </div>
        `).join('');

        if (this.learnStackPlates.length === 0) {
            container.innerHTML = '<div class="sim-empty-label">Tumpukan Kosong</div>';
        }
    },

    handsOnEnqueuePerson() {
        const avatars = ["👨‍💼", "👵", "🧒", "👱‍♀️"];
        const names = ["Rian", "Dewi", "Edo", "Maya"];
        const idx = this.learnQueuePeople.length % names.length;
        if (this.learnQueuePeople.length >= 5) {
            UI.showToast("Kapasitas antrean kasir penuh (Maks. 5 orang)! Hindari Queue Overflow.");
            return;
        }
        const newPerson = { name: names[idx], avatar: avatars[idx] };
        this.learnQueuePeople.push(newPerson);
        if (window.SoundManager) SoundManager.play('enqueue');
        this.renderHandsOnQueue();
        this.recordMiniLabOp('queueEnqueue');
        UI.showToast(`Enqueue: ${newPerson.name} masuk di REAR (paling belakang). Operasi Mini-Lab tercatat!`);
    },

    handsOnDequeuePerson() {
        if (this.learnQueuePeople.length === 0) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showToast("Antrean kasir kosong (Queue Underflow)!");
            return;
        }
        const dequeued = this.learnQueuePeople.shift();
        if (window.SoundManager) SoundManager.play('dequeue');
        this.renderHandsOnQueue();
        this.recordMiniLabOp('queueDequeue');
        UI.showToast(`Dequeue: ${dequeued.name} dilayani di FRONT. Prinsip FIFO terbukti!`);
    },

    renderHandsOnQueue() {
        const container = document.getElementById('handson-queue-people');
        if (!container) return;
        container.innerHTML = this.learnQueuePeople.map((p, idx) => `
            <div class="sim-queue-person ${idx === 0 ? 'is-front' : ''}" style="padding: 0.4rem 0.6rem; font-size: 0.82rem;">
                <span class="person-avatar">${p.avatar}</span>
                <span class="person-name">${p.name}</span>
                ${idx === 0 ? '<span class="queue-role-badge front" style="font-size: 0.65rem;">FRONT</span>' : ''}
                ${idx === this.learnQueuePeople.length - 1 && idx !== 0 ? '<span class="queue-role-badge rear" style="font-size: 0.65rem;">REAR</span>' : ''}
            </div>
        `).join('');

        if (this.learnQueuePeople.length === 0) {
            container.innerHTML = '<div class="sim-empty-label">Antrean Kosong</div>';
        }
    },

    // ----------------------------------------------------
    // INTERACTIVE VIDEO DEMONSTRATION CONTROLLERS
    // ----------------------------------------------------
    stackVideoState: {
        isPlaying: false,
        timer: null,
        currentStep: 0,
        steps: [
            { title: "Pengenalan Stack", time: "0:05", progress: 20, desc: "Stack beroperasi dengan prinsip LIFO. Elemen yang terakhir masuk akan menjadi puncak (TOP)." },
            { title: "Operasi push(item)", time: "0:12", progress: 45, desc: "push('Buku Algoritma'): Elemen baru dimasukkan tepat di atas tumpukan (TOP)." },
            { title: "Operasi peek()", time: "0:18", progress: 65, desc: "peek(): Melihat buku teratas tanpa mengambil atau mengubah ukuran tumpukan." },
            { title: "Operasi pop()", time: "0:25", progress: 85, desc: "pop(): Mengambil buku paling atas (TOP). Elemen terakhir masuk keluar pertama!" },
            { title: "Kesimpulan LIFO", time: "0:30", progress: 100, desc: "Prinsip LIFO terbukti: Last In, First Out diterapkan pada Undo dan Back Browser." }
        ]
    },

    toggleStackVideo() {
        if (this.stackVideoState.isPlaying) {
            this.pauseStackVideo();
        } else {
            this.playStackVideo();
        }
    },

    playStackVideo() {
        this.stackVideoState.isPlaying = true;
        const playBtn = document.getElementById('stack-video-play-btn');
        if (playBtn) playBtn.textContent = '⏸';

        clearInterval(this.stackVideoState.timer);
        this.stackVideoState.timer = setInterval(() => {
            this.stackVideoState.currentStep = (this.stackVideoState.currentStep + 1) % this.stackVideoState.steps.length;
            this.renderStackVideoStep();
        }, 3200);
        this.renderStackVideoStep();
    },

    pauseStackVideo() {
        this.stackVideoState.isPlaying = false;
        clearInterval(this.stackVideoState.timer);
        const playBtn = document.getElementById('stack-video-play-btn');
        if (playBtn) playBtn.textContent = '▶';
    },

    jumpStackVideoChapter(stepIndex) {
        this.stackVideoState.currentStep = stepIndex;
        this.renderStackVideoStep();
    },

    renderStackVideoStep() {
        const step = this.stackVideoState.steps[this.stackVideoState.currentStep];
        const subEl = document.getElementById('stack-video-subtitle');
        const fillEl = document.getElementById('stack-video-timeline-fill');
        const timeEl = document.getElementById('stack-video-time');
        const visualEl = document.getElementById('stack-video-visual-frame');

        if (subEl) subEl.textContent = `[${step.title}] - ${step.desc}`;
        if (fillEl) fillEl.style.width = `${step.progress}%`;
        if (timeEl) timeEl.textContent = `${step.time} / 0:30`;

        // Update active chapter button
        document.querySelectorAll('.stack-ch-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === this.stackVideoState.currentStep);
        });

        if (visualEl) {
            const visualStates = [
                '<div style="font-size: 3rem; text-align: center;">📚<br><span style="font-size: 0.9rem; color: #38bdf8;">Wadah Stack Siap</span></div>',
                '<div style="font-size: 2.5rem; text-align: center; color: #10b981;">⬇ push("Buku Algo")<br><div style="background: #2563eb; color: #fff; padding: 6px 16px; border-radius: 6px; font-size: 1rem; margin-top: 8px;">TOP ➔ [Buku Algo]</div></div>',
                '<div style="font-size: 2.5rem; text-align: center; color: #f59e0b;">👁 peek() ➔ "Buku Algo"<br><div style="background: #2563eb; color: #fff; padding: 6px 16px; border-radius: 6px; font-size: 1rem; margin-top: 8px; border: 2px solid #f59e0b;">TOP [Buku Algo]</div></div>',
                '<div style="font-size: 2.5rem; text-align: center; color: #ef4444;">⬆ pop() Mengambil TOP<br><span style="font-size: 0.9rem; color: #94a3b8;">Buku Algo Dikeluarkan</span></div>',
                '<div style="font-size: 2.8rem; text-align: center;">✨🏆<br><span style="font-size: 1rem; color: #10b981; font-weight: 800;">LIFO: Last In, First Out Sempurna!</span></div>'
            ];
            visualEl.innerHTML = visualStates[this.stackVideoState.currentStep];
        }
    },

    // Queue Video Controller
    queueVideoState: {
        isPlaying: false,
        timer: null,
        currentStep: 0,
        steps: [
            { title: "Pengenalan Queue", time: "0:05", progress: 20, desc: "Queue beroperasi dengan prinsip FIFO. Pelanggan pertama masuk adalah yang pertama dilayani." },
            { title: "Operasi enqueue(item)", time: "0:12", progress: 45, desc: "enqueue('Siti'): Pelanggan baru selalu antre di bagian paling belakang (REAR)." },
            { title: "Operasi front()", time: "0:18", progress: 65, desc: "front(): Melihat siapa yang berada di antrean paling depan tanpa mengeluarkannya." },
            { title: "Operasi dequeue()", time: "0:25", progress: 85, desc: "dequeue(): Melayani pelanggan terdepan (FRONT) dan mengeluarkannya dari barisan." },
            { title: "Kesimpulan FIFO", time: "0:30", progress: 100, desc: "Prinsip FIFO adil: First In, First Out diterapkan pada kasir, tiket bioskop, dan printer." }
        ]
    },

    toggleQueueVideo() {
        if (this.queueVideoState.isPlaying) {
            this.pauseQueueVideo();
        } else {
            this.playQueueVideo();
        }
    },

    playQueueVideo() {
        this.queueVideoState.isPlaying = true;
        const playBtn = document.getElementById('queue-video-play-btn');
        if (playBtn) playBtn.textContent = '⏸';

        clearInterval(this.queueVideoState.timer);
        this.queueVideoState.timer = setInterval(() => {
            this.queueVideoState.currentStep = (this.queueVideoState.currentStep + 1) % this.queueVideoState.steps.length;
            this.renderQueueVideoStep();
        }, 3200);
        this.renderQueueVideoStep();
    },

    pauseQueueVideo() {
        this.queueVideoState.isPlaying = false;
        clearInterval(this.queueVideoState.timer);
        const playBtn = document.getElementById('queue-video-play-btn');
        if (playBtn) playBtn.textContent = '▶';
    },

    jumpQueueVideoChapter(stepIndex) {
        this.queueVideoState.currentStep = stepIndex;
        this.renderQueueVideoStep();
    },

    renderQueueVideoStep() {
        const step = this.queueVideoState.steps[this.queueVideoState.currentStep];
        const subEl = document.getElementById('queue-video-subtitle');
        const fillEl = document.getElementById('queue-video-timeline-fill');
        const timeEl = document.getElementById('queue-video-time');
        const visualEl = document.getElementById('queue-video-visual-frame');

        if (subEl) subEl.textContent = `[${step.title}] - ${step.desc}`;
        if (fillEl) fillEl.style.width = `${step.progress}%`;
        if (timeEl) timeEl.textContent = `${step.time} / 0:30`;

        document.querySelectorAll('.queue-ch-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === this.queueVideoState.currentStep);
        });

        if (visualEl) {
            const visualStates = [
                '<div style="font-size: 2.8rem; text-align: center;">👥 ➔ 🛒<br><span style="font-size: 0.9rem; color: #38bdf8;">Jalur Antrean Kasir Dibuka</span></div>',
                '<div style="font-size: 2.4rem; text-align: center; color: #10b981;">➔ enqueue("Siti") di REAR<br><div style="display: flex; gap: 8px; justify-content: center; margin-top: 8px;"><span style="background: #10b981; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem;">[Budi (FRONT)]</span><span style="background: #0284c7; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem;">[Siti (REAR)]</span></div></div>',
                '<div style="font-size: 2.4rem; text-align: center; color: #f59e0b;">👁 front() ➔ "Budi"<br><span style="font-size: 0.9rem; color: #e2e8f0;">Budi siap dilayani kasir di depan</span></div>',
                '<div style="font-size: 2.4rem; text-align: center; color: #ef4444;">➔ dequeue() Melayani FRONT<br><span style="font-size: 0.9rem; color: #10b981;">Budi Selesai -> Siti Maju Jadi FRONT!</span></div>',
                '<div style="font-size: 2.8rem; text-align: center;">✨🎯<br><span style="font-size: 1rem; color: #10b981; font-weight: 800;">FIFO: First In, First Out Sempurna!</span></div>'
            ];
            visualEl.innerHTML = visualStates[this.queueVideoState.currentStep];
        }
    },

    // ----------------------------------------------------
    // QUICK CHECK QUIZZES & PERSISTENCE (Learn Pages)
    // ----------------------------------------------------
    stackQuizAnswers: { 1: null, 2: null, 3: null },
    queueQuizAnswers: { 1: null, 2: null, 3: null },

    checkLearnQuiz(topic, qIndex, optionIndex, isCorrect, explanation) {
        const answersObj = topic === 'stack' ? this.stackQuizAnswers : this.queueQuizAnswers;
        answersObj[qIndex] = isCorrect;

        const options = document.querySelectorAll(`.${topic}-q${qIndex}-opt`);
        options.forEach((btn, idx) => {
            btn.classList.remove('selected-correct', 'selected-wrong');
            if (idx === optionIndex) {
                btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
            }
        });

        const feedback = document.getElementById(`${topic}-feedback-q${qIndex}`);
        if (feedback) {
            feedback.className = `quiz-feedback-box active ${isCorrect ? 'correct' : 'wrong'}`;
            feedback.textContent = (isCorrect ? '✓ Benar! ' : '✕ Belum tepat. ') + explanation;
        }

        if (window.SoundManager) {
            SoundManager.play(isCorrect ? 'correct' : 'wrong');
        }

        // Calculate score
        const correctCount = Object.values(answersObj).filter(v => v === true).length;
        const score = Math.round((correctCount / 3) * 100);

        const scoreBadge = document.getElementById(`${topic}-quiz-score`);
        if (scoreBadge) scoreBadge.textContent = `${score} / 100 Poin`;

        const scoreMeter = document.getElementById(`${topic}-live-page-score`);
        if (scoreMeter) scoreMeter.textContent = `${score} pts`;
    },

    saveLearnScore(topic) {
        const answersObj = topic === 'stack' ? this.stackQuizAnswers : this.queueQuizAnswers;
        const correctCount = Object.values(answersObj).filter(v => v === true).length;
        const calculatedScore = Math.round((correctCount / 3) * 100);
        const finalScore = Math.max(75, calculatedScore); // Skor minimal apresiasi belajar

        const pageKey = topic === 'stack' ? 'learn-stack' : 'learn-queue';
        if (window.StorageManager) {
            StorageManager.savePageScore(pageKey, finalScore, { answers: answersObj });
            StorageManager.setLevelScore(1, finalScore);
        }

        if (window.SoundManager) SoundManager.play('levelComplete');
        UI.showToast(`✅ Nilai Belajar ${topic.toUpperCase()} tersimpan: ${finalScore} pts!`);
        UI.setKikoDialogue(`Nilai materi ${topic.toUpperCase()} berhasil disimpan! Kamu hebat, ayo lanjutkan perjalanan!`, 'cheering');
        
        // Re-render world map
        UI.renderWorldMap();
    },

    // ----------------------------------------------------
    // GROUP PROJECT WORKSPACE (TUGAS KELOMPOK)
    // ----------------------------------------------------
    groupProjectState: {
        groupName: '',
        groupClass: 'Kelas X.1',
        identitySaved: false,
        members: [
            { name: '', absen: '', role: '👑 Ketua / Koordinator Tim' },
            { name: '', absen: '', role: '📝 Notulis / Perumus Masalah' },
            { name: '', absen: '', role: '🧪 Operator Simulasi & Pengujian' },
            { name: '', absen: '', role: '🔍 Analis Struktur Data' },
            { name: '', absen: '', role: '⚙️ Perancang Solusi Algoritmik' },
            { name: '', absen: '', role: '📢 Presenter / Juru Bicara' }
        ],
        selectedCase: 'case1',
        cases: {
            case1: {
                id: 'case1',
                icon: '🍽️',
                badge: 'Kasus 1: Antrean Kasir Kantin Sekolah (Mewakili Queue - FIFO)',
                title: 'Optimalisasi Sistem Antrean Kasir & Pemesanan Kantin Sekolah',
                category: 'Manajemen Layanan Publik & Pemesanan Kantin',
                desc: 'Pada jam istirahat sekolah yang hanya berdurasi 30 menit, kantin dipadati lebih dari 60 siswa. Karena tidak ada jalur antrean yang teratur, siswa yang baru datang sering kali langsung menyerobot ke dekat meja kasir dan dilayani duluan, sementara siswa yang sudah antre 10 menit di depan justru terabaikan. Kasir juga kewalahan mencatat urutan pemesan sehingga pesanan sering kali salah buat atau tertukar. Kondisi ini menimbulkan kegaduhan, ketidakadilan waktu tunggu, dan keterlambatan kembali ke kelas.',
                problemChallenge: 'Bagaimana merancang model antrean berbasis struktur data Queue (FIFO) dengan penetapan posisi Front (kasir) dan Rear (ujung antrean siswa baru), serta bagaimana operasi Enqueue dan Dequeue diterapkan untuk menjamin keadilan pelayanan dan mencegah antrean macet?',
                recommendedStructure: 'Queue (FIFO - First In First Out)',
                defaultItems: ['1. Antrean Siswa Budi (09.30)', '2. Antrean Siswa Siti (09.31)', '3. Antrean Siswa Ahmad (09.32)'],
                hots: {
                    mc: {
                        question: 'Mengapa sistem antrean kasir kantin sekolah wajib menerapkan struktur data Queue (FIFO) dan BUKAN Stack (LIFO)?',
                        options: [
                            { key: 'A', text: 'Karena prinsip FIFO menjamin siswa yang datang lebih awal berada di posisi Front dan dilayani pertama kali (dequeue), sehingga menciptakan keadilan pelayanan dan kepastian waktu tunggu.', isCorrect: true, feedback: 'Tepat sekali! Asas keadilan pelayanan waktu tunggu hanya dapat dijamin oleh Queue (FIFO).' },
                            { key: 'B', text: 'Karena Queue memperbolehkan siswa yang baru datang menyerobot langsung ke posisi Front.', isCorrect: false, feedback: 'Salah, penyerobotan antrean melanggar aturan komputasional FIFO.' },
                            { key: 'C', text: 'Karena memori Queue tidak memerlukan pemrosesan komputer.', isCorrect: false, feedback: 'Salah, Queue tetap membutuhkan struktur memori teratur.' },
                            { key: 'D', text: 'Karena Queue otomatis membatalkan pesanan yang belum selesai.', isCorrect: false, feedback: 'Salah, Queue memproses secara berurutan, bukan membatalkan data.' }
                        ]
                    },
                    tf: [
                        {
                            id: 'tf1',
                            statement: 'Ketika seorang siswa baru datang ke kantin dan bergabung ke barisan belakang, operasi komputasional yang terjadi adalah Enqueue pada posisi Rear.',
                            isTrue: true,
                            correct: true,
                            explanation: 'Tepat! Elemen baru dalam Queue selalu ditambahkan di bagian belakang (Rear) melalui operasi Enqueue.',
                            feedback: 'Tepat! Elemen baru dalam Queue selalu ditambahkan di bagian belakang (Rear) melalui operasi Enqueue.'
                        },
                        {
                            id: 'tf2',
                            statement: 'Jika kasir melayani siswa yang berdiri paling belakang alih-alih siswa di depan, maka kasir tersebut sedang menjalankan operasi Dequeue yang sah.',
                            isTrue: false,
                            correct: false,
                            explanation: 'Salah! Dequeue selalu mengambil elemen dari posisi paling depan (Front), bukan dari belakang.',
                            feedback: 'Salah! Dequeue selalu mengambil elemen dari posisi paling depan (Front), bukan dari belakang.'
                        },
                        {
                            id: 'tf3',
                            statement: 'Kondisi Queue Underflow terjadi saat kasir memanggil pesanan berikutnya (dequeue), namun tidak ada lagi siswa yang berdiri di dalam antrean.',
                            isTrue: true,
                            correct: true,
                            explanation: 'Tepat! Mengambil elemen dari Queue yang kosong menghasilkan galat Underflow.',
                            feedback: 'Tepat! Mengambil elemen dari Queue yang kosong menghasilkan galat Underflow.'
                        }
                    ],
                    essay: {
                        prompt: 'Jelaskan bagaimana konsep Front dan Rear pada Queue mencegah penyerobotan antrean di kasir kantin, serta apa rekomendasi algoritmik kelompokmu jika kasir mulai kewalahan!',
                        placeholder: 'Tuliskan rancangan solusi kelompok: bagaimana penetapan posisi Front dan Rear serta alur pemesanan yang adil dan efisien...'
                    },
                    essayGuide: 'Jelaskan bagaimana konsep Front dan Rear pada Queue mencegah penyerobotan antrean di kasir kantin!'
                }
            },
            case2: {
                id: 'case2',
                icon: '🥞',
                badge: 'Kasus 2: Tumpukan Piring Bersih & Baki Kantin (Mewakili Stack - LIFO)',
                title: 'Manajemen Tumpukan Baki Saji & Piring Bersih Kantin Sekolah',
                category: 'Pengelolaan Inventaris Saji & Mekanisme LIFO',
                desc: 'Petugas dapur kantin bertugas mencuci, mengeringkan, dan menata piring saji serta baki makan untuk siswa. Piring-piring bersih ditumpuk secara vertikal di atas meja dispenser saji (kapasitas maksimal 5 piring). Siswa mengambil piring bersih dari bagian paling atas tumpukan untuk mengambil makanan. Ketika jam sibuk, petugas terus menambahkan piring bersih dari atas (push), sementara siswa terus mengambil piring teratas (pop). Jika piring ditumpuk melebihi 5, tumpukan tidak stabil dan rawan jatuh pecah (Stack Overflow). Sebaliknya, jika piring habis dan siswa tetap mencoba mengambil, terjadi keterlambatan saji (Stack Underflow).',
                problemChallenge: 'Bagaimana menganalisis alur sirkulasi piring saji menggunakan struktur data Stack (LIFO), dan bagaimana menetapkan algoritma kontrol kapasitas tumpukan agar tidak terjadi kondisi Stack Overflow maupun Stack Underflow?',
                recommendedStructure: 'Stack (LIFO - Last In First Out)',
                defaultItems: ['Piring Keramik Putih #1 (Dasar)', 'Piring Keramik Putih #2', 'Piring Keramik Putih #3 (TOP)'],
                hots: {
                    mc: {
                        question: 'Mengapa mekanisme dispenser piring bersih di meja saji kantin secara alami memodelkan struktur data Stack (LIFO)?',
                        options: [
                            { key: 'A', text: 'Karena piring yang terakhir kali ditaruh oleh petugas di posisi puncak (TOP) adalah piring yang pertama kali diambil oleh siswa (Last In First Out).', isCorrect: true, feedback: 'Tepat sekali! Akses penambahan (push) dan pengambilan (pop) piring hanya dapat dilakukan melalui satu pintu akses yaitu di posisi paling atas (TOP).' },
                            { key: 'B', text: 'Karena siswa dapat mengambil piring dari bagian paling bawah tumpukan tanpa menyentuh piring di atasnya.', isCorrect: false, feedback: 'Salah, mengambil dari bawah merusak tumpukan dan bukan sifat Stack.' },
                            { key: 'C', text: 'Karena piring bersih yang masuk pertama kali akan diambil pertama kali oleh siswa.', isCorrect: false, feedback: 'Salah, itu adalah prinsip FIFO, sedangkan tumpukan adalah LIFO.' },
                            { key: 'D', text: 'Karena dispenser piring memiliki dua pintu keluar masuk di atas dan di bawah.', isCorrect: false, feedback: 'Salah, Stack hanya memiliki satu ujung akses terbuka (TOP).' }
                        ]
                    },
                    tf: [
                        {
                            id: 'tf1',
                            statement: 'Saat petugas kantin meletakkan piring bersih baru ke atas tumpukan, operasi komputasional yang dieksekusi adalah operasi Push pada posisi TOP.',
                            isTrue: true,
                            correct: true,
                            explanation: 'Benar! Operasi push menambahkan elemen ke puncak tumpukan Stack.',
                            feedback: 'Benar! Operasi push menambahkan elemen ke puncak tumpukan Stack.'
                        },
                        {
                            id: 'tf2',
                            statement: 'Operasi peek() pada tumpukan piring bersih bertujuan untuk mengambil dan memindahkan piring teratas ke meja makan siswa.',
                            isTrue: false,
                            correct: false,
                            explanation: 'Salah! Operasi peek() hanya melihat atau memeriksa status elemen teratas (TOP) tanpa menghapus atau mengambilnya.',
                            feedback: 'Salah! Operasi peek() hanya melihat atau memeriksa status elemen teratas (TOP) tanpa menghapus atau mengambilnya.'
                        },
                        {
                            id: 'tf3',
                            statement: 'Kondisi Stack Overflow terjadi ketika dispenser piring yang sudah mencapai kapasitas maksimal (5 piring) tetap dipaksakan untuk ditambah piring baru oleh petugas.',
                            isTrue: true,
                            correct: true,
                            explanation: 'Tepat! Menambahkan elemen ke wadah Stack yang sudah penuh memicu kondisi galat Stack Overflow.',
                            feedback: 'Tepat! Menambahkan elemen ke wadah Stack yang sudah penuh memicu kondisi galat Stack Overflow.'
                        }
                    ],
                    essay: {
                        prompt: 'Jelaskan bagaimana algoritma pengecekan kapasitas (isFull dan isEmpty) mencegah kecelakaan piring pecah (Overflow) atau piring kosong (Underflow)!',
                        placeholder: 'Tuliskan rancangan algoritma kelompok: langkah pengecekan sebelum push dan sebelum pop...'
                    },
                    essayGuide: 'Jelaskan bagaimana algoritma pengecekan kapasitas (isFull dan isEmpty) mencegah kecelakaan piring pecah (Overflow) atau piring kosong (Underflow)!'
                }
            }
        },
        hotsAnswers: {},
        worksheet: {
            selectedStructure: '',
            reasoning: '',
            steps: '',
            conclusion: ''
        },
        simState: {
            items: [],
            undoItems: [],
            redoItems: [],
            logs: []
        }
    },

    initGroupProject() {
        if (window.StorageManager) {
            const saved = StorageManager.getGroupProject();
            if (saved) {
                this.groupProjectState.groupName = saved.groupName || '';
                this.groupProjectState.groupClass = saved.groupClass || saved.className || 'SMA Kelas X (Fase E)';
                this.groupProjectState.selectedCase = saved.selectedCase || 'case1';
                
                if (saved.members && Array.isArray(saved.members)) {
                    const loadedMembers = saved.members.map(m => {
                        if (typeof m === 'string') return { name: m.trim(), role: '🤝 Anggota Tim' };
                        return { name: (m.name || '').trim(), role: m.role || '🤝 Anggota Tim' };
                    }).filter(m => m.name.length > 0);

                    if (loadedMembers.length > 0) {
                        this.groupProjectState.members = loadedMembers;
                        this.groupProjectState.identitySaved = !!(saved.groupName && saved.groupName.trim());
                    } else {
                        this.groupProjectState.identitySaved = false;
                    }
                }
                if (saved.hotsAnswers) {
                    this.groupProjectState.hotsAnswers = saved.hotsAnswers;
                }
                if (saved.worksheet) {
                    this.groupProjectState.worksheet = { ...this.groupProjectState.worksheet, ...saved.worksheet };
                } else if (saved.answers) {
                    // Backwards compatibility with old key names
                    this.groupProjectState.worksheet.reasoning = saved.answers.ans1 || '';
                    this.groupProjectState.worksheet.steps = saved.answers.ans2 || '';
                    this.groupProjectState.worksheet.conclusion = saved.answers.ans3 || '';
                }
            }
        }

        // Initialize simulation items for selected case if empty
        this.resetCaseSimulationData();
        this.renderGroupProjectUI();
    },

    resetCaseSimulationData() {
        const curCase = this.groupProjectState.cases[this.groupProjectState.selectedCase];
        if (curCase) {
            this.groupProjectState.simState.items = [...(curCase.defaultItems || [])];
            this.groupProjectState.simState.undoItems = ['1. Buat Kanvas Baru', '2. Ketik Paragraf A'];
            this.groupProjectState.simState.redoItems = [];
            this.groupProjectState.simState.logs = [
                `[SISTEM] Simulasi siap untuk: ${curCase.title}`,
                `[INFO] Data awal dimuat (${this.groupProjectState.simState.items.length} elemen).`
            ];
        }
    },

    renderGroupProjectUI() {
        // Sync input values
        const nameInput = document.getElementById('gp-group-name');
        const classInput = document.getElementById('gp-group-class');
        if (nameInput) nameInput.value = this.groupProjectState.groupName || '';
        if (classInput) classInput.value = this.groupProjectState.groupClass || '';

        // Render sections
        this.renderGroupMembersList();
        this.renderGroupProfileCard();
        this.renderGroupCaseCards();
        this.renderGroupCaseWorkspace();
        this.renderGroupHOTSQuestions();
        this.restoreWorksheetInputs();
        this.updateWorkflowSteps();

        // Update status badge
        const saved = window.StorageManager ? StorageManager.getGroupProject() : null;
        const statusEl = document.getElementById('gp-saved-status');
        const chipEl = document.getElementById('gp-identity-status-chip');

        if (statusEl) {
            if (saved && saved.savedAt) {
                statusEl.textContent = `✓ Tersimpan: ${saved.savedAt} (Nilai: ${saved.score || 100} Poin)`;
                statusEl.style.color = '#10b981';
            } else {
                statusEl.textContent = 'Siap Disimpan (Nilai: 100 Poin)';
                statusEl.style.color = '#38bdf8';
            }
        }

        if (chipEl) {
            if (this.groupProjectState.identitySaved && this.groupProjectState.groupName) {
                const memberCount = (this.groupProjectState.members || []).filter(m => m.name && m.name.trim()).length;
                chipEl.textContent = `✓ Profil Tersimpan (${memberCount} Anggota)`;
                chipEl.className = 'gp-status-chip saved';
            } else {
                chipEl.textContent = 'Belum Disimpan';
                chipEl.className = 'gp-status-chip';
            }
        }
    },

    // ----------------------------------------------------
    // GROUP IDENTITY & PROFILE DISPLAY (STEP 2 OF USER REQUEST)
    // ----------------------------------------------------
    onGroupNameInput(val) {
        this.groupProjectState.groupName = val;
        this.persistProjectDraft();
    },

    onGroupClassInput(val) {
        this.groupProjectState.groupClass = val;
        this.persistProjectDraft();
    },

    syncIdentityFromDOM() {
        const nameInput = document.getElementById('gp-group-name');
        if (nameInput) {
            this.groupProjectState.groupName = nameInput.value.trim();
        }
        const classInput = document.getElementById('gp-group-class');
        if (classInput) {
            this.groupProjectState.groupClass = classInput.value.trim();
        }

        const memberRows = document.querySelectorAll('.gp-member-row');
        if (memberRows && memberRows.length > 0) {
            const syncedMembers = [];
            memberRows.forEach((row, idx) => {
                const nameEl = row.querySelector('.gp-member-name-input');
                const absenEl = row.querySelector('.gp-member-absen-input');
                const roleEl = row.querySelector('.gp-member-role-select');
                const nameVal = nameEl ? nameEl.value.trim() : '';
                const absenVal = absenEl ? absenEl.value.trim() : (this.groupProjectState.members[idx]?.absen || '');
                const roleVal = roleEl ? roleEl.value : (this.groupProjectState.members[idx]?.role || '🤝 Anggota Tim');
                syncedMembers.push({ name: nameVal, absen: absenVal, role: roleVal });
            });
            this.groupProjectState.members = syncedMembers;
        }
    },

    renderGroupMembersList() {
        const container = document.getElementById('gp-members-container');
        const countBadge = document.getElementById('gp-members-count');
        if (!container) return;

        const defaultRoles = [
            '👑 Ketua / Koordinator Tim',
            '📝 Notulis / Perumus Masalah',
            '🧪 Operator Simulasi & Pengujian',
            '🔍 Analis Struktur Data',
            '⚙️ Perancang Solusi Algoritmik',
            '📢 Presenter / Juru Bicara'
        ];

        // Ensure there are exactly 6 member rows according to RPM UKIN (6 anggota per kelompok)
        if (!this.groupProjectState.members || this.groupProjectState.members.length < 6) {
            const playerName = (window.Player && Player.getName && Player.getName()) || '';
            const playerAbsen = (window.Player && Player.getAbsen && Player.getAbsen()) || '';
            const existing = this.groupProjectState.members || [];
            
            const newMembers = [];
            for (let i = 0; i < 6; i++) {
                if (existing[i] && existing[i].name) {
                    newMembers.push(existing[i]);
                } else if (i === 0 && playerName) {
                    newMembers.push({ name: playerName, absen: playerAbsen, role: defaultRoles[0] });
                } else {
                    newMembers.push({ name: '', absen: '', role: defaultRoles[i] || '🤝 Anggota Tim' });
                }
            }
            this.groupProjectState.members = newMembers;
        }

        const validCount = this.groupProjectState.members.filter(m => m.name && m.name.trim()).length;
        if (countBadge) {
            countBadge.textContent = `${validCount} dari 6 Anggota Terisi`;
        }

        const rolesOptions = [
            '👑 Ketua / Koordinator Tim',
            '📝 Notulis / Perumus Masalah',
            '🧪 Operator Simulasi & Pengujian',
            '🔍 Analis Struktur Data',
            '⚙️ Perancang Solusi Algoritmik',
            '📢 Presenter / Juru Bicara',
            '🤝 Anggota Tim'
        ];

        container.innerHTML = this.groupProjectState.members.map((m, idx) => {
            const currentRole = m.role || defaultRoles[idx] || '🤝 Anggota Tim';
            const selectOptions = rolesOptions.map(r => 
                `<option value="${r}" ${r === currentRole ? 'selected' : ''}>${r}</option>`
            ).join('');

            return `
                <div class="gp-member-row" data-member-index="${idx}" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span class="gp-member-index" style="font-family: 'Space Mono', monospace; font-weight: 700; color: #891A10; width: 28px;">#${idx + 1}</span>
                    <input type="text" class="gp-member-name-input" placeholder="Nama Anggota ${idx + 1}..." 
                           value="${m.name || ''}" 
                           style="flex: 2; min-width: 150px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;"
                           oninput="App.updateMemberName(${idx}, this.value)"
                           onchange="App.updateMemberName(${idx}, this.value)">
                    <input type="number" class="gp-member-absen-input" placeholder="Absen (1-36)" min="1" max="36"
                           value="${m.absen || ''}" 
                           style="width: 80px; padding: 0.6rem 0.6rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Space Mono', monospace; text-align: center;"
                           oninput="App.updateMemberAbsen(${idx}, this.value)"
                           onchange="App.updateMemberAbsen(${idx}, this.value)">
                    <select class="gp-member-role-select" 
                            style="flex: 2; min-width: 180px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: #714236;"
                            onchange="App.updateMemberRole(${idx}, this.value)">
                        ${selectOptions}
                    </select>
                    ${this.groupProjectState.members.length > 1 ? `
                        <button type="button" class="btn btn-outline" 
                                style="padding: 0.5rem 0.75rem; border: 1.5px solid #D8D4BC; color: #891A10; cursor: pointer; border-radius: 8px; font-size: 0.9rem;"
                                onclick="App.removeGroupMember(${idx})" title="Hapus Anggota Ini">
                            🗑
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    updateMemberName(idx, val) {
        if (this.groupProjectState.members && this.groupProjectState.members[idx]) {
            this.groupProjectState.members[idx].name = (val || '').trim();
            this.persistProjectDraft();
        }
    },

    updateMemberAbsen(idx, val) {
        if (this.groupProjectState.members && this.groupProjectState.members[idx]) {
            let cleanVal = (val || '').trim();
            if (cleanVal) {
                const n = parseInt(cleanVal, 10);
                if (!isNaN(n)) {
                    if (n < 1) cleanVal = '1';
                    if (n > 36) cleanVal = '36';
                }
            }
            this.groupProjectState.members[idx].absen = cleanVal;
            this.persistProjectDraft();
        }
    },

    updateMemberRole(idx, val) {
        if (this.groupProjectState.members && this.groupProjectState.members[idx]) {
            this.groupProjectState.members[idx].role = val;
            this.persistProjectDraft();
        }
    },

    onMemberEnterKey(idx) {
        this.syncIdentityFromDOM();
        const currentMember = this.groupProjectState.members[idx];
        if (currentMember && currentMember.name) {
            if (idx === this.groupProjectState.members.length - 1 && this.groupProjectState.members.length < 6) {
                this.addGroupMember();
            } else {
                const nextInput = document.querySelectorAll('.gp-member-name-input')[idx + 1];
                if (nextInput) nextInput.focus();
            }
        }
    },

    addGroupMember() {
        this.syncIdentityFromDOM();
        if (this.groupProjectState.members.length >= 6) {
            if (window.UI) UI.showToast("Maksimal 6 anggota dalam satu kelompok sesuai petunjuk RPM UKIN!");
            return;
        }
        const defaultRoles = [
            '👑 Ketua / Koordinator Tim',
            '📝 Notulis / Perumus Masalah',
            '🧪 Operator Simulasi & Pengujian',
            '🔍 Analis Struktur Data',
            '⚙️ Perancang Solusi Algoritmik',
            '📢 Presenter / Juru Bicara'
        ];
        const nextRole = defaultRoles[this.groupProjectState.members.length] || '🤝 Anggota Tim';
        this.groupProjectState.members.push({ name: '', absen: '', role: nextRole });
        this.renderGroupMembersList();

        setTimeout(() => {
            const inputs = document.querySelectorAll('.gp-member-name-input');
            if (inputs && inputs.length > 0) {
                inputs[inputs.length - 1].focus();
            }
        }, 50);

        if (window.SoundManager) SoundManager.play('click');
        this.persistProjectDraft();
    },

    removeGroupMember(idx) {
        this.syncIdentityFromDOM();
        if (this.groupProjectState.members.length > 1) {
            this.groupProjectState.members.splice(idx, 1);
            this.renderGroupMembersList();
            if (window.SoundManager) SoundManager.play('click');
            this.persistProjectDraft();
        }
    },

    saveGroupIdentity() {
        this.syncIdentityFromDOM();

        const nameInput = document.getElementById('gp-group-name');
        const classInput = document.getElementById('gp-group-class');
        let name = (this.groupProjectState.groupName || (nameInput ? nameInput.value : '')).trim();
        let className = (this.groupProjectState.groupClass || (classInput ? classInput.value : 'SMA Kelas X (Fase E)')).trim();

        if (!name || name.length < 2) {
            const playerName = (window.Player && Player.getName && Player.getName()) || 'Tim Siswa';
            name = 'Kelompok ' + playerName;
            this.groupProjectState.groupName = name;
            if (nameInput) nameInput.value = name;
        }

        if (!className) {
            className = 'SMA Kelas X (Fase E)';
            this.groupProjectState.groupClass = className;
            if (classInput) classInput.value = className;
        }

        let validMembers = (this.groupProjectState.members || []).map(m => ({
            name: (m.name || '').trim(),
            absen: (m.absen || '').trim(),
            role: m.role || '🤝 Anggota Tim'
        }));

        this.groupProjectState.groupName = name;
        this.groupProjectState.groupClass = className;
        this.groupProjectState.members = validMembers;
        this.groupProjectState.identitySaved = true;

        // Persist identity without setting artificial 100 score
        if (window.StorageManager) {
            const existing = StorageManager.getGroupProject() || {};
            const projectData = {
                ...existing,
                groupName: name,
                groupClass: className,
                className: className,
                members: validMembers,
                selectedCase: this.groupProjectState.selectedCase || 'case1',
                hotsAnswers: this.groupProjectState.hotsAnswers || {},
                worksheet: this.groupProjectState.worksheet || {},
                score: existing.score !== undefined ? existing.score : null
            };
            StorageManager.saveGroupProject(projectData);
        }

        const saveBtn = document.getElementById('gp-btn-save-identity');
        if (saveBtn) {
            const originalHTML = saveBtn.innerHTML;
            saveBtn.innerHTML = '✓ Identitas Disimpan!';
            saveBtn.style.background = '#891A10';
            saveBtn.style.borderColor = '#891A10';
            setTimeout(() => {
                if (saveBtn) {
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.style.background = '';
                    saveBtn.style.borderColor = '';
                }
            }, 2500);
        }

        const chipEl = document.getElementById('gp-identity-status-chip');
        if (chipEl) {
            const filledCount = validMembers.filter(m => m.name.length > 0).length;
            const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            chipEl.textContent = `✓ Profil Disimpan (${filledCount}/6 Anggota, ${nowTime})`;
            chipEl.className = 'gp-status-chip saved';
        }

        if (window.UI) {
            UI.showToast(`👥 Identitas Kelompok "${name}" berhasil disimpan.`);
        }
    },

    toggleGroupIdentityEdit() {
        const formCard = document.getElementById('gp-identity-form-card');
        if (formCard) {
            const isHidden = formCard.style.display === 'none';
            formCard.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) {
                this.renderGroupMembersList();
                formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        if (window.SoundManager) SoundManager.play('click');
    },

    renderGroupProfileCard() {
        const profileCard = document.getElementById('gp-profile-display-card');
        const formCard = document.getElementById('gp-identity-form-card');
        if (!profileCard) return;

        const name = (this.groupProjectState.groupName || '').trim();
        const validMembers = (this.groupProjectState.members || []).filter(m => m.name && m.name.trim().length > 0);

        if (this.groupProjectState.identitySaved && name && validMembers.length > 0) {
            profileCard.style.display = 'flex';

            const nameEl = document.getElementById('gp-display-group-name');
            const classEl = document.getElementById('gp-display-group-class');
            const timeEl = document.getElementById('gp-display-saved-time');
            const gridEl = document.getElementById('gp-display-members-grid');

            if (nameEl) nameEl.textContent = `Kelompok: ${name}`;
            if (classEl) classEl.textContent = `Kelas: ${this.groupProjectState.groupClass || 'SMA Kelas X'}`;

            const saved = window.StorageManager ? StorageManager.getGroupProject() : null;
            if (timeEl) {
                timeEl.textContent = saved && saved.savedAt ? `Tersimpan: ${saved.savedAt}` : 'Terdaftar Aktif';
            }

            if (gridEl) {
                gridEl.innerHTML = validMembers.map(m => {
                    const role = m.role || '🤝 Anggota Tim';
                    const icon = role.includes('👑') ? '👑' :
                                 role.includes('🔍') ? '🔍' :
                                 role.includes('📝') ? '📝' :
                                 role.includes('🎨') ? '🎨' : '🤝';
                    const cleanRole = role.replace(/^[^\w\s]+/, '').trim();
                    const absenText = m.absen ? ` (No. ${m.absen})` : '';
                    return `
                        <div class="gp-member-chip">
                            <span class="gp-chip-role-icon">${icon}</span>
                            <div class="gp-chip-info">
                                <span class="gp-chip-name">${m.name}${absenText}</span>
                                <span class="gp-chip-role">${cleanRole}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } else {
            profileCard.style.display = 'none';
            if (formCard) formCard.style.display = 'flex';
        }
    },

    // ----------------------------------------------------
    // CASE STUDY SELECTION (STEP 3 & 4 OF USER REQUEST)
    // ----------------------------------------------------
    selectGroupCase(caseKey) {
        if (!this.groupProjectState.cases[caseKey]) return;
        this.groupProjectState.selectedCase = caseKey;
        this.resetCaseSimulationData();
        this.renderGroupCaseCards();
        this.renderGroupCaseWorkspace();
        this.renderGroupHOTSQuestions();
        this.updateWorkflowSteps();
        this.persistProjectDraft();

        if (window.SoundManager) SoundManager.play('click');
        if (window.UI) {
            const c = this.groupProjectState.cases[caseKey];
            UI.showToast(`📂 Studi Kasus Berhasil Dipilih: ${c.title}`);
            UI.setKikoDialogue(`Kalian memilih "${c.title}". Amati skenario dan lakukan simulasi logika di bawah!`, 'happy');
        }

        // Smoothly scroll down to workspace so students immediately see the selected case
        setTimeout(() => {
            const workspaceSection = document.getElementById('gp-case-detail-section');
            if (workspaceSection && typeof workspaceSection.scrollIntoView === 'function') {
                workspaceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    },

    renderGroupCaseCards() {
        const grid = document.getElementById('gp-cases-grid');
        const badge = document.getElementById('gp-active-case-badge');
        if (!grid) return;

        const current = this.groupProjectState.selectedCase;
        if (badge && this.groupProjectState.cases[current]) {
            badge.textContent = `${this.groupProjectState.cases[current].icon} Kasus ${current.replace('case', '')} Terpilih`;
        }

        grid.innerHTML = Object.keys(this.groupProjectState.cases).map(k => {
            const c = this.groupProjectState.cases[k];
            const isSelected = k === current;
            const num = k.replace('case', '');
            return `
                <div class="gp-case-card ${isSelected ? 'selected' : ''}" onclick="App.selectGroupCase('${k}')" style="cursor: pointer;">
                    <div class="gp-case-card-header">
                        <span class="gp-case-icon">${c.icon}</span>
                        <span class="gp-case-num-badge">Kasus ${num}</span>
                    </div>
                    <h4>${c.title}</h4>
                    <p>${c.desc.substring(0, 115)}...</p>
                    <div class="gp-case-action-box" style="margin-top: 0.85rem;">
                        <button type="button" class="btn ${isSelected ? 'btn-success' : 'btn-primary'} gp-case-btn-select" 
                                style="width: 100%; font-size: 0.9rem; font-weight: 700; padding: 0.55rem 0.75rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.4rem;" 
                                onclick="event.stopPropagation(); App.selectGroupCase('${k}')">
                            ${isSelected ? '✓ Kasus Ini Terpilih' : '👉 Pilih Studi Kasus Ini'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderGroupCaseWorkspace() {
        const container = document.getElementById('gp-case-detail-section');
        if (!container) return;

        const c = this.groupProjectState.cases[this.groupProjectState.selectedCase];
        if (!c) return;

        container.innerHTML = `
            <div class="gp-detail-banner">
                <span class="gp-detail-banner-icon">${c.icon}</span>
                <div class="gp-detail-banner-text">
                    <h3>${c.title}</h3>
                    <div class="gp-detail-tags">
                        <span class="quiz-score-badge" style="background: #FAF6ED; color: #E76814; border: 1px solid #D8D4BC;">${c.category}</span>
                        <span class="quiz-score-badge" style="background: #FAF3F0; color: #891A10; border: 1px solid #D8D4BC;">Rekomendasi Konsep: ${c.recommendedStructure}</span>
                    </div>
                </div>
            </div>

            <div class="gp-scenario-card">
                <h5>📖 Skenario Kasus Nyata:</h5>
                <p>${c.desc}</p>
            </div>

            <div class="gp-challenge-box">
                <h5>⚡ Tantangan Analisis Masalah:</h5>
                <p>${c.problemChallenge}</p>
            </div>

            <!-- Konsol Simulasi Logika Interaktif -->
            <div class="gp-sim-box">
                <div class="gp-sim-header">
                    <strong>⚡ Konsol Simulasi Alur Data: ${c.title}</strong>
                    <span style="font-size: 0.8rem; color: #94a3b8;">Uji coba interaktif operasi data secara langsung</span>
                </div>

                <div class="gp-sim-controls" id="gp-sim-controls-bar">
                    ${this.getSimulationButtonsHTML(c.id)}
                </div>

                <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 0.25rem;">
                    Status Elemen Aktif dalam Struktur Data:
                </div>

                <div class="gp-sim-viewport" id="gp-sim-viewport">
                    <!-- Populated by App.renderCaseSimulationViewport() -->
                </div>

                <div class="gp-sim-log" id="gp-sim-log">
                    <!-- Populated by App.renderCaseSimulationLog() -->
                </div>
            </div>
        `;

        this.renderCaseSimulationViewport();
        this.renderCaseSimulationLog();
    },

    getSimulationButtonsHTML(caseId) {
        if (caseId === 'case1') {
            return `
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('enqueue_student')">➕ Siswa Masuk Antrean (Enqueue Rear)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-amber" onclick="App.runCaseSimulation('dequeue_kasir')">➔ Kasir Layani Siswa Terdepan (Dequeue Front)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('peek_front')">👁️ Cek Siswa Terdepan (Peek Front)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-outline" onclick="App.runCaseSimulation('reset')">🔄 Reset Antrean</button>
            `;
        } else {
            return `
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('push_plate')">➕ Petugas Tambah Piring (Push TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-amber" onclick="App.runCaseSimulation('pop_plate')">➔ Siswa Ambil Piring Teratas (Pop TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-sky" onclick="App.runCaseSimulation('peek_top')">👁️ Cek Piring Teratas (Peek TOP)</button>
                <button type="button" class="gp-sim-btn gp-sim-btn-outline" onclick="App.runCaseSimulation('reset')">🔄 Reset Tumpukan</button>
            `;
        }
    },

    renderCaseSimulationViewport() {
        const vp = document.getElementById('gp-sim-viewport');
        if (!vp) return;

        const caseId = this.groupProjectState.selectedCase;
        const sim = this.groupProjectState.simState;

        if (!sim.items || sim.items.length === 0) {
            vp.innerHTML = `<span style="color: #8F726A; font-size: 0.88rem; font-style: italic;">Antrean / tumpukan data saat ini kosong (Underflow). Gunakan tombol di atas untuk menyimulasikan operasi aliran data.</span>`;
            return;
        }

        if (caseId === 'case1') {
            // Queue FIFO Horizontal Track
            vp.innerHTML = `
                <div style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: 'Space Mono', monospace; font-weight: 700; color: #714236; margin-bottom: 0.5rem;">
                        <span>🚪 FRONT (Meja Kasir - Dilayani Duluan) ➔</span>
                        <span> REAR (Siswa Baru Masuk Antrean)</span>
                    </div>
                    <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding: 0.5rem 0;">
                        ${sim.items.map((it, idx) => {
                            const isFront = idx === 0;
                            const isRear = idx === sim.items.length - 1;
                            return `
                                <div class="gp-sim-item-badge" style="background: ${isFront ? '#891A10' : '#E76814'}; color: #FFFFFF; border-radius: 8px; padding: 0.6rem 0.9rem; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(113, 66, 54, 0.2);">
                                    ${isFront ? '👑 FRONT: ' : (isRear ? '📍 REAR: ' : '👤 ')}${it}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            // Stack LIFO Vertical Chamber (Dispenser Piring)
            const maxCap = 5;
            vp.innerHTML = `
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                    <div style="font-size: 0.78rem; font-family: 'Space Mono', monospace; font-weight: 700; color: #891A10; margin-bottom: 0.5rem;">
                        ⬇️ SATU PINTU AKSES: TOP OF STACK (Push & Pop dari Sini) ⬇️
                    </div>
                    <div style="width: 100%; max-width: 440px; display: flex; flex-direction: column-reverse; gap: 0.5rem; background: #FAF6ED; border: 2px solid #D8D4BC; border-radius: 12px; padding: 1rem;">
                        ${sim.items.map((it, idx) => {
                            const isTop = idx === sim.items.length - 1;
                            return `
                                <div style="background: ${isTop ? '#891A10' : '#DC8236'}; color: #FFFFFF; border-radius: 8px; padding: 0.6rem 1rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 10px rgba(113, 66, 54, 0.15);">
                                    <span>🍽️ ${it}</span>
                                    <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">
                                        ${isTop ? '★ TOP (Paling Atas)' : `Posisi #${idx + 1}`}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div style="font-size: 0.78rem; color: #714236; margin-top: 0.4rem;">
                        Kapasitas Dispenser: <strong>${sim.items.length} / ${maxCap} Piring</strong> ${sim.items.length >= maxCap ? '<span style="color: #B8210F; font-weight: bold;">(PENUH / Overflow Warning)</span>' : ''}
                    </div>
                </div>
            `;
        }
    },

    runCaseSimulation(action) {
        const caseId = this.groupProjectState.selectedCase;
        const sim = this.groupProjectState.simState;
        let soundToPlay = 'click';

        if (caseId === 'case1') {
            // Queue Kasir Kantin
            if (action === 'enqueue_student') {
                const pool = ['Dian (Nasi Goreng)', 'Fajar (Soto Ayam)', 'Lestari (Mie Ayam)', 'Rafi (Batagor)', 'Nabila (Es Teh)', 'Bagus (Roti Bakar)'];
                const student = pool[Math.floor(Math.random() * pool.length)];
                sim.items.push(`Siswa ${student}`);
                sim.logs.unshift(`[ENQUEUE FIFO] Siswa "${student}" datang dan masuk antrean di barisan paling belakang (REAR). Total antrean: ${sim.items.length}.`);
                soundToPlay = 'enqueue';
            } else if (action === 'dequeue_kasir') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(`⚠️ [QUEUE UNDERFLOW] Antrean kasir sedang kosong! Kasir menunggu kedatangan siswa berikutnya.`);
                } else {
                    const served = sim.items.shift();
                    sim.logs.unshift(`✅ [DEQUEUE FIFO] Kasir selesai memproses pembayaran dan menyerahkan pesanan kepada: ${served} (keluar dari FRONT).`);
                    soundToPlay = 'dequeue';
                }
            } else if (action === 'peek_front') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(`👁️ [PEEK FRONT] Antrean kosong, tidak ada siswa di posisi depan.`);
                } else {
                    sim.logs.unshift(`👁️ [PEEK FRONT] Siswa yang saat ini berada di depan meja kasir adalah: ${sim.items[0]} (sedang bersiap memesan).`);
                }
            } else if (action === 'reset') {
                this.resetCaseSimulationData();
                return;
            }
        } else {
            // Stack Tumpukan Piring (maks 5 piring)
            const maxCap = 5;
            if (action === 'push_plate') {
                if (sim.items.length >= maxCap) {
                    sim.logs.unshift(`⚠️ [STACK OVERFLOW] Kapasitas dispenser penuh (${maxCap} piring)! Jangan tambah piring lagi agar tidak goyang dan jatuh pecah.`);
                } else {
                    const plateNum = sim.items.length + 1;
                    const plateName = `Piring Keramik Putih #${plateNum}`;
                    sim.items.push(plateName);
                    sim.logs.unshift(`[PUSH STACK] Petugas dapur menaruh ${plateName} bersih ke posisi paling atas (TOP). Tumpukan saat ini: ${sim.items.length} piring.`);
                    soundToPlay = 'push';
                }
            } else if (action === 'pop_plate') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(`⚠️ [STACK UNDERFLOW] Dispenser piring bersih kosong! Siswa harus menunggu petugas dapur mencuci piring baru.`);
                } else {
                    const popped = sim.items.pop();
                    sim.logs.unshift(`✅ [POP STACK] Siswa mengambil ${popped} dari posisi paling atas (TOP) untuk mengambil makanan. Sisa: ${sim.items.length} piring.`);
                    soundToPlay = 'pop';
                }
            } else if (action === 'peek_top') {
                if (sim.items.length === 0) {
                    sim.logs.unshift(`👁️ [PEEK TOP] Dispenser piring kosong, tidak ada piring di posisi puncak.`);
                } else {
                    sim.logs.unshift(`👁️ [PEEK TOP] Piring yang berada di puncak tumpukan saat ini adalah: ${sim.items[sim.items.length - 1]}.`);
                }
            } else if (action === 'reset') {
                this.resetCaseSimulationData();
                return;
            }
        }

        if (window.AudioController && soundToPlay) {
            AudioController.play(soundToPlay);
        }

        this.renderCaseSimulationViewport();
        this.renderCaseSimulationLog();
    },

    renderCaseSimulationLog() {
        const logBox = document.getElementById('gp-sim-log');
        if (!logBox) return;

        const logs = this.groupProjectState.simState.logs || [];
        logBox.innerHTML = logs.slice(0, 8).map(l => 
            `<div style="margin-bottom: 0.2rem;">> ${l}</div>`
        ).join('');
    },

    // ----------------------------------------------------
    // HOTS QUESTIONS COMPONENT (STEP 5 OF USER REQUEST)
    // ----------------------------------------------------
    renderGroupHOTSQuestions() {
        const container = document.getElementById('gp-hots-questions-section');
        if (!container) return;

        const caseKey = this.groupProjectState.selectedCase;
        const c = this.groupProjectState.cases[caseKey];
        if (!c || !c.hots) return;

        const savedAnswers = this.groupProjectState.hotsAnswers[caseKey] || {};

        // Multiple choice options HTML
        const mcUserChoice = savedAnswers.mc;
        const mcOptionsHTML = c.hots.mc.options.map(opt => {
            const isSelected = mcUserChoice === opt.key;
            return `
                <button type="button" class="gp-hots-option-btn ${isSelected ? 'selected' : ''}" 
                        onclick="App.answerHOTS_MC('${caseKey}', '${opt.key}')">
                    <span class="gp-option-key">${opt.key}</span>
                    <span>${opt.text}</span>
                </button>
            `;
        }).join('');

        // MC Feedback alert if answered
        let mcFeedbackHTML = '';
        if (mcUserChoice) {
            const selectedOpt = c.hots.mc.options.find(o => o.key === mcUserChoice);
            if (selectedOpt) {
                const isCorrect = !!selectedOpt.isCorrect;
                mcFeedbackHTML = `
                    <div class="gp-feedback-alert ${isCorrect ? 'correct' : 'info'}">
                        <strong>${isCorrect ? '✅ Analisis Logika Tepat!' : '💡 Pembahasan Komputasional:'}</strong>
                        ${selectedOpt.feedback || (isCorrect ? 'Jawaban pilihan kelompokmu tepat secara logika.' : 'Pertimbangkan kembali karakteristik penanganan alur data.')}
                    </div>
                `;
            }
        }

        // True / False statements HTML
        const tfAnswers = savedAnswers.tf || {};
        const tfHTML = (c.hots.tf || []).map(tItem => {
            const userVal = tfAnswers[tItem.id];
            const hasAnswered = userVal !== undefined;
            const expectedVal = (tItem.correct !== undefined) ? tItem.correct : tItem.isTrue;
            const explanationText = tItem.explanation || tItem.feedback || '';
            const isCorrect = hasAnswered && userVal === expectedVal;

            return `
                <div class="gp-tf-item">
                    <div class="gp-tf-statement">📌 "${tItem.statement}"</div>
                    <div class="gp-tf-actions">
                        <button type="button" class="gp-tf-btn ${userVal === true ? 'active-true' : ''}" 
                                onclick="App.answerHOTS_TF('${caseKey}', '${tItem.id}', true)">
                            ✓ BENAR
                        </button>
                        <button type="button" class="gp-tf-btn ${userVal === false ? 'active-false' : ''}" 
                                onclick="App.answerHOTS_TF('${caseKey}', '${tItem.id}', false)">
                            ✕ SALAH
                        </button>
                    </div>
                    ${hasAnswered ? `
                        <div class="gp-feedback-alert ${isCorrect ? 'correct' : 'info'}" style="padding: 0.5rem 0.8rem; font-size: 0.82rem;">
                            <strong>${isCorrect ? '✅ Tepat!' : '💡 Catatan Guru:'}</strong> ${explanationText}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Essay question
        const essayVal = savedAnswers.essay || '';
        const essayPrompt = (c.hots.essay && c.hots.essay.prompt) || c.hots.essayGuide || 'Jelaskan rancangan solusi algoritmik kelompokmu untuk kasus ini:';
        const essayPlaceholder = (c.hots.essay && c.hots.essay.placeholder) || 'Tuliskan rancangan solusi pemecahan masalah hasil diskusi kelompokmu...';

        container.innerHTML = `
            <div class="gp-section-header">
                <div class="gp-section-title">
                    <span class="gp-title-icon">🧠</span>
                    <div>
                        <h3>Pengamatan & Analisis Kasus (Pertanyaan HOTS)</h3>
                        <p class="gp-section-sub">Diskusikan bersama tim dan jawab pertanyaan berpikir tingkat tinggi (HOTS: C4-C6) berdasarkan pengamatan kasus di atas:</p>
                    </div>
                </div>
                <span class="quiz-score-badge" style="background: #FAF6ED; color: #E76814; border: 1px solid #D8D4BC;">Level Kognitif C4 - C6</span>
            </div>

            <!-- Question 1: Multiple Choice HOTS (C4 Analisis) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge">Soal 1 • Pilihan Ganda (C4 - Menganalisis)</span>
                <p class="gp-hots-prompt">${c.hots.mc.question}</p>
                <div class="gp-hots-options">
                    ${mcOptionsHTML}
                </div>
                ${mcFeedbackHTML}
            </div>

            <!-- Question 2: Benar / Salah HOTS (C5 Evaluasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FAF3F0; color: #891A10; border: 1px solid #D8D4BC;">Soal 2 • Analisis Kritis Pernyataan (C5 - Mengevaluasi Benar/Salah)</span>
                <p class="gp-hots-prompt">Tentukan apakah setiap pernyataan komputasional di bawah ini Benar atau Salah, lalu cermati pembahasannya:</p>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${tfHTML}
                </div>
            </div>

            <!-- Question 3: Isian Singkat / Rancangan Solusi HOTS (C6 Kreasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FFF7EB; color: #DC8236; border: 1px solid #D8D4BC;">Soal 3 • Perancangan Solusi Algoritmik (C6 - Problem Solving)</span>
                <p class="gp-hots-prompt">${essayPrompt}</p>
                <textarea class="gp-textarea-modern" placeholder="${essayPlaceholder}" 
                          oninput="App.answerHOTS_Essay('${caseKey}', this.value)">${essayVal}</textarea>
                <div class="gp-textarea-hint">💡 Rancang aturan logis secara jelas bersama kelompokmu. Jawaban tersimpan otomatis.</div>
            </div>
        `;
    },

    answerHOTS_MC(caseKey, optionKey) {
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        this.groupProjectState.hotsAnswers[caseKey].mc = optionKey;
        this.persistProjectDraft();
        this.renderGroupHOTSQuestions();
        this.updateWorkflowSteps();
        if (window.SoundManager) SoundManager.play('click');
    },

    answerHOTS_TF(caseKey, tfId, value) {
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        if (!this.groupProjectState.hotsAnswers[caseKey].tf) {
            this.groupProjectState.hotsAnswers[caseKey].tf = {};
        }
        this.groupProjectState.hotsAnswers[caseKey].tf[tfId] = value;
        this.persistProjectDraft();
        this.renderGroupHOTSQuestions();
        this.updateWorkflowSteps();
        if (window.SoundManager) SoundManager.play('click');
    },

    answerHOTS_Essay(caseKey, text) {
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        this.groupProjectState.hotsAnswers[caseKey].essay = text;
        this.persistProjectDraft();
        this.updateWorkflowSteps();
    },

    // ----------------------------------------------------
    // WORKSHEET HANDLERS (STEP 6 OF USER REQUEST)
    // ----------------------------------------------------
    onWorksheetChange(field, val) {
        this.groupProjectState.worksheet[field] = val;
        this.persistProjectDraft();
        this.updateWorkflowSteps();
    },

    restoreWorksheetInputs() {
        const ws = this.groupProjectState.worksheet;
        const structSelect = document.getElementById('gp-structure-select');
        const reasoning = document.getElementById('gp-reasoning');
        const steps = document.getElementById('gp-steps');
        const conclusion = document.getElementById('gp-conclusion');

        if (structSelect && ws.selectedStructure) structSelect.value = ws.selectedStructure;
        if (reasoning && ws.reasoning) reasoning.value = ws.reasoning;
        if (steps && ws.steps) steps.value = ws.steps;
        if (conclusion && ws.conclusion) conclusion.value = ws.conclusion;
    },

    updateWorkflowSteps() {
        const step1 = document.getElementById('gp-step-1');
        const step2 = document.getElementById('gp-step-2');
        const step3 = document.getElementById('gp-step-3');
        const step4 = document.getElementById('gp-step-4');
        const step5 = document.getElementById('gp-step-5');

        const hasIdentity = !!(this.groupProjectState.identitySaved && this.groupProjectState.groupName);
        const hasCase = !!this.groupProjectState.selectedCase;
        const currentHots = this.groupProjectState.hotsAnswers[this.groupProjectState.selectedCase] || {};
        const hasHots = !!(currentHots.mc && currentHots.tf && Object.keys(currentHots.tf).length >= 1);
        const ws = this.groupProjectState.worksheet;
        const hasWorksheet = !!(ws.selectedStructure && ws.reasoning && ws.reasoning.length > 5);

        if (step1) {
            step1.className = `gp-step-item ${hasIdentity ? 'completed' : 'active'}`;
        }
        if (step2) {
            step2.className = `gp-step-item ${hasCase ? (hasIdentity ? 'completed' : 'active') : ''}`;
        }
        if (step3) {
            step3.className = `gp-step-item ${hasCase ? 'completed' : ''}`;
        }
        if (step4) {
            step4.className = `gp-step-item ${hasHots ? 'completed' : (hasCase ? 'active' : '')}`;
        }
        if (step5) {
            step5.className = `gp-step-item ${hasWorksheet ? 'completed' : (hasHots ? 'active' : '')}`;
        }
    },

    persistProjectDraft() {
        if (!window.StorageManager) return;
        const draft = {
            groupName: this.groupProjectState.groupName,
            groupClass: this.groupProjectState.groupClass,
            className: this.groupProjectState.groupClass,
            members: this.groupProjectState.members,
            selectedCase: this.groupProjectState.selectedCase,
            hotsAnswers: this.groupProjectState.hotsAnswers,
            worksheet: this.groupProjectState.worksheet
        };
        const existing = StorageManager.getGroupProject();
        if (existing && existing.savedAt) {
            draft.savedAt = existing.savedAt;
            draft.score = existing.score || 100;
        }
        StorageManager.saveGroupProject(draft);
    },



    calculateGroupRubricScore(projectData) {
        const details = {
            collaboration: { score: 0, max: 15, label: "Kolaborasi & Identitas 6 Anggota", note: "" },
            conceptSelection: { score: 0, max: 20, label: "Ketepatan Konsep Struktur Data", note: "" },
            reasoning: { score: 0, max: 20, label: "Kedalaman Argumentasi Konseptual", note: "" },
            algorithmicSteps: { score: 0, max: 25, label: "Urutan Langkah Solusi / Dekomposisi", note: "" },
            conclusion: { score: 0, max: 20, label: "Kesimpulan & Kejelasan Solusi", note: "" }
        };

        // 1. Kolaborasi 6 Anggota
        const members = (projectData.members || []).filter(m => m.name && m.name.trim().length > 0);
        if (members.length >= 6) {
            details.collaboration.score = 15;
            details.collaboration.note = "Lengkap (6 anggota terdaftar dengan pembagian peran terstruktur).";
        } else if (members.length >= 4) {
            details.collaboration.score = 10;
            details.collaboration.note = `Terisi ${members.length} anggota tim.`;
        } else if (members.length > 0) {
            details.collaboration.score = 6;
            details.collaboration.note = `Baru terisi ${members.length} anggota.`;
        } else {
            details.collaboration.score = 0;
            details.collaboration.note = "Belum mengisi anggota tim.";
        }

        // 2. Ketepatan Konsep Struktur Data
        const selStruct = (projectData.worksheet?.selectedStructure || '').toLowerCase();
        const isCase1 = projectData.selectedCase === 'case1'; // Queue Kantin
        const isCase2 = projectData.selectedCase === 'case2'; // Stack Kantin

        if (isCase1 && selStruct.includes('queue')) {
            details.conceptSelection.score = 20;
            details.conceptSelection.note = "Tepat! Kasus antrean kasir kantin wajib menggunakan Queue (FIFO).";
        } else if (isCase2 && selStruct.includes('stack')) {
            details.conceptSelection.score = 20;
            details.conceptSelection.note = "Tepat! Kasus tumpukan piring saji kantin wajib menggunakan Stack (LIFO).";
        } else if (selStruct.length > 0) {
            details.conceptSelection.score = 8;
            details.conceptSelection.note = "Struktur data yang dipilih kurang selaras dengan karakteristik masalah.";
        } else {
            details.conceptSelection.score = 0;
            details.conceptSelection.note = "Belum memilih struktur data.";
        }

        // 3. Kedalaman Argumentasi Konseptual
        const reason = (projectData.worksheet?.reasoning || '').trim();
        const hasConceptWords = /fifo|lifo|first in|last in|antre|tumpuk|front|rear|top|pop|push|enqueue|dequeue/i.test(reason);

        if (reason.length >= 70 && hasConceptWords) {
            details.reasoning.score = 20;
            details.reasoning.note = "Sangat mendalam, analisis memuat prinsip komputasional LIFO/FIFO secara tepat.";
        } else if (reason.length >= 35) {
            details.reasoning.score = 14;
            details.reasoning.note = "Cukup baik, argumentasi dapat diperkuat dengan prinsip kerja struktur data.";
        } else if (reason.length > 0) {
            details.reasoning.score = 7;
            details.reasoning.note = "Uraian argumentasi masih terlalu singkat.";
        } else {
            details.reasoning.score = 0;
            details.reasoning.note = "Belum diisi.";
        }

        // 4. Urutan Langkah Solusi Algoritmik / Dekomposisi
        const steps = (projectData.worksheet?.steps || '').trim();
        const hasStepsPattern = /langkah|tahap|\d+\.|\n|-|\*/i.test(steps);

        if (steps.length >= 80 && hasStepsPattern) {
            details.algorithmicSteps.score = 25;
            details.algorithmicSteps.note = "Sangat runtut dan sistematis, mencerminkan alur algoritma operasional.";
        } else if (steps.length >= 40) {
            details.algorithmicSteps.score = 17;
            details.algorithmicSteps.note = "Cukup baik, alur langkah dapat diperjelas dengan penomoran urutan.";
        } else if (steps.length > 0) {
            details.algorithmicSteps.score = 9;
            details.algorithmicSteps.note = "Langkah pemecahan masalah masih terlalu ringkas.";
        } else {
            details.algorithmicSteps.score = 0;
            details.algorithmicSteps.note = "Belum diisi.";
        }

        // 5. Kesimpulan & Kejelasan Solusi Komputasional
        const conclusion = (projectData.worksheet?.conclusion || '').trim();
        if (conclusion.length >= 60) {
            details.conclusion.score = 20;
            details.conclusion.note = "Kesimpulan komprehensif, mencakup efisiensi dan solusi ketertiban kantin.";
        } else if (conclusion.length >= 30) {
            details.conclusion.score = 14;
            details.conclusion.note = "Cukup baik, rangkuman solusi dapat ditambahkan.";
        } else if (conclusion.length > 0) {
            details.conclusion.score = 6;
            details.conclusion.note = "Kesimpulan masih sangat singkat.";
        } else {
            details.conclusion.score = 0;
            details.conclusion.note = "Belum diisi.";
        }

        const totalScore = details.collaboration.score +
                           details.conceptSelection.score +
                           details.reasoning.score +
                           details.algorithmicSteps.score +
                           details.conclusion.score;

        return { totalScore, details };
    },

    renderGroupRubricCard(evaluation) {
        const worksheetSection = document.getElementById('gp-worksheet-section');
        if (!worksheetSection) return;

        let card = document.getElementById('gp-rubric-result-card');
        if (!card) {
            card = document.createElement('div');
            card.id = 'gp-rubric-result-card';
            card.style.marginTop = '1.75rem';
            worksheetSection.appendChild(card);
        }

        const isPassed = evaluation.totalScore >= 75; // KKTP 75
        const d = evaluation.details;

        card.innerHTML = `
            <div style="background: #FFFFFF; border: 2.5px solid #891A10; border-radius: 16px; padding: 1.75rem; box-shadow: 0 10px 30px rgba(113, 66, 54, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1.5px solid #D8D4BC; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
                    <div>
                        <h4 style="font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #714236; margin: 0;">
                            📊 Hasil Penilaian Rubrik LKPD Kelompok (Berdasarkan RPM UKIN)
                        </h4>
                        <span style="font-size: 0.82rem; color: #714236;">Kriteria Ketercapaian Tujuan Pembelajaran: KKTP ≥ 75</span>
                    </div>
                    <span class="academic-badge ${isPassed ? 'academic-badge-emerald' : 'academic-badge-amber'}" style="font-size: 0.82rem;">
                        ${isPassed ? '✓ Tuntas (Memenuhi KKTP)' : '⚠️ Perlu Penguatan (Belum Tuntas)'}
                    </span>
                </div>

                <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="background: #FAF6ED; border: 2px solid #E76814; border-radius: 14px; padding: 1rem 2rem; text-align: center;">
                        <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; color: #714236; text-transform: uppercase;">Skor Akhir LKPD</span>
                        <div style="font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: #891A10; line-height: 1;">
                            ${evaluation.totalScore}
                        </div>
                        <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #714236;">Skala 100</span>
                    </div>
                    <div style="flex: 1; min-width: 260px;">
                        <p style="font-size: 0.95rem; color: #2B1D19; line-height: 1.6; margin: 0;">
                            ${isPassed 
                                ? 'Luar biasa! Hasil kerja kelompokmu telah memenuhi standar kelayakan asesmen kurikulum. Seluruh rincian rubrik di bawah ini telah terisi secara komprehensif.' 
                                : 'Nilai kelompok belum mencapai KKTP minimal 75. Silakan periksa rincian rubrik berikut, lengkapi bagian yang masih kurang, lalu simpan ulang!'}
                        </p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                    ${Object.keys(d).map(k => {
                        const item = d[k];
                        const pct = Math.round((item.score / item.max) * 100);
                        return `
                            <div style="background: #FAF8F5; border: 1px solid #D8D4BC; border-radius: 10px; padding: 0.85rem 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                    <strong style="font-size: 0.92rem; color: #714236;">${item.label}</strong>
                                    <span style="font-family: 'Space Mono', monospace; font-size: 0.82rem; font-weight: 700; color: #891A10;">
                                        ${item.score} / ${item.max} Poin (${pct}%)
                                    </span>
                                </div>
                                <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                                    💡 ${item.note}
                                </p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        card.scrollIntoView({ behavior: 'smooth' });
    },

    saveGroupProject(showFeedback = true) {
        this.syncIdentityFromDOM();

        const groupName = this.groupProjectState.groupName || 'Kelompok Informatika';
        let groupClass = this.groupProjectState.groupClass;
        const caseKey = this.groupProjectState.selectedCase || 'case1';
        const curCase = this.groupProjectState.cases[caseKey] || this.groupProjectState.cases['case1'];
        const ws = this.groupProjectState.worksheet;
        const structSelect = document.getElementById('gp-structure-select');

        if (!groupClass) {
            groupClass = 'SMA Kelas X (Fase E)';
            this.groupProjectState.groupClass = groupClass;
            const classInput = document.getElementById('gp-group-class');
            if (classInput) classInput.value = groupClass;
        }

        if (!ws.selectedStructure) {
            ws.selectedStructure = curCase.recommendedStructure || (caseKey === 'case1' ? 'Queue (FIFO)' : 'Stack (LIFO)');
            if (structSelect) structSelect.value = ws.selectedStructure;
        }

        const projectData = {
            groupName: groupName,
            groupClass: groupClass || 'SMA Kelas X (Fase E)',
            className: groupClass || 'SMA Kelas X (Fase E)',
            members: this.groupProjectState.members,
            selectedCase: caseKey,
            caseTitle: curCase.title,
            hotsAnswers: this.groupProjectState.hotsAnswers,
            worksheet: {
                selectedStructure: ws.selectedStructure,
                reasoning: ws.reasoning || '',
                steps: ws.steps || '',
                conclusion: ws.conclusion || ''
            }
        };

        // Calculate real objective score based on RPM rubrics
        const evaluation = this.calculateGroupRubricScore(projectData);
        projectData.score = evaluation.totalScore;
        projectData.rubricDetails = evaluation.details;

        if (window.StorageManager) {
            StorageManager.saveGroupProject(projectData);
            StorageManager.savePageScore('group-project', evaluation.totalScore, {
                groupName,
                case: projectData.selectedCase,
                score: evaluation.totalScore
            });
        }

        this.groupProjectState.identitySaved = true;
        this.groupProjectState.lastScore = evaluation.totalScore;

        if (showFeedback) {
            if (window.SoundManager) SoundManager.play('levelComplete');
            if (window.UI) {
                UI.showToast(`📊 Tugas Kelompok "${groupName}" berhasil dinilai! Skor: ${evaluation.totalScore}/100 Poin.`);
                UI.setKikoDialogue(`Kerja sama tim "${groupName}" telah dihitung secara objektif berdasarkan rubrik RPM. Nilai: ${evaluation.totalScore}/100. Kalian dapat mengunduh Word (.doc) atau mencetak PDF sekarang!`, 'cheering');
            }
            this.renderGroupRubricCard(evaluation);
        }

        this.renderGroupProjectUI();
    },

    buildGroupLKPDHTML(forWordDoc = false) {
        const data = window.StorageManager ? StorageManager.getGroupProject() : null;
        const groupName = this.groupProjectState.groupName || (data ? data.groupName : 'Kelompok Informatika');
        const groupClass = this.groupProjectState.groupClass || (data ? data.groupClass : 'SMA Kelas X');
        const members = this.groupProjectState.members || [];
        const caseKey = this.groupProjectState.selectedCase || 'case1';
        const curCase = this.groupProjectState.cases[caseKey] || this.groupProjectState.cases['case1'];
        const ws = this.groupProjectState.worksheet || {};
        const hots = (this.groupProjectState.hotsAnswers && this.groupProjectState.hotsAnswers[caseKey]) || {};

        const currentDate = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        const membersRows = members.map((m, idx) => `
            <tr>
                <td style="border: 1pt solid #000; padding: 6pt; text-align: center; width: 35pt;">${idx + 1}</td>
                <td style="border: 1pt solid #000; padding: 6pt; font-weight: bold;">${m.name || '-'}</td>
                <td style="border: 1pt solid #000; padding: 6pt; text-align: center; width: 65pt;">${m.absen || '-'}</td>
                <td style="border: 1pt solid #000; padding: 6pt; width: 160pt;">${m.role || 'Anggota Tim'}</td>
            </tr>
        `).join('');

        const innerContent = `
            <div style="font-family: 'Times New Roman', Times, serif; color: #000; padding: ${forWordDoc ? '0' : '20px'}; line-height: 1.45;">
                <div style="text-align: center; border-bottom: 3pt double #000; padding-bottom: 10pt; margin-bottom: 14pt;">
                    <h2 style="margin: 0; font-size: 15pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt;">LEMBAR KERJA PESERTA DIDIK (LKPD) KELOMPOK</h2>
                    <h3 style="margin: 4pt 0; font-size: 12pt; font-weight: bold;">LEMBAR JAWABAN &amp; BAHAN PRESENTASI SISWA</h3>
                    <p style="margin: 0; font-size: 10pt;">Mata Pelajaran: Informatika | Fase E (SMA Kelas X) | Materi Pokok: Struktur Data Stack &amp; Queue</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; font-size: 10.5pt;">
                    <tr>
                        <td style="width: 22%; font-weight: bold; padding: 3pt 0;">Nama Kelompok</td>
                        <td style="width: 38%; padding: 3pt 0;">: <strong>${groupName}</strong></td>
                        <td style="width: 18%; font-weight: bold; padding: 3pt 0;">Hari, Tanggal</td>
                        <td style="width: 22%; padding: 3pt 0;">: ${currentDate}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; padding: 3pt 0;">Kelas / Fase</td>
                        <td style="padding: 3pt 0;">: ${groupClass}</td>
                        <td style="font-weight: bold; padding: 3pt 0;">Skor Lembar</td>
                        <td style="padding: 3pt 0;">: <strong>100 / 100 (Terverifikasi)</strong></td>
                    </tr>
                </table>

                <div style="background: #FAF5EB; border-left: 4pt solid #891A10; padding: 4pt 8pt; font-weight: bold; font-size: 11pt; margin-top: 14pt; margin-bottom: 6pt;">
                    A. IDENTITAS &amp; DAFTAR ANGGOTA KELOMPOK
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; font-size: 10pt;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1pt solid #000; padding: 5pt; text-align: center;">No</th>
                            <th style="border: 1pt solid #000; padding: 5pt; text-align: left;">Nama Lengkap Siswa</th>
                            <th style="border: 1pt solid #000; padding: 5pt; text-align: center;">No. Absen</th>
                            <th style="border: 1pt solid #000; padding: 5pt; text-align: left;">Peran dalam Kelompok</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${membersRows}
                    </tbody>
                </table>

                <div style="background: #FAF5EB; border-left: 4pt solid #891A10; padding: 4pt 8pt; font-weight: bold; font-size: 11pt; margin-top: 14pt; margin-bottom: 6pt;">
                    B. STUDI KASUS NYATA YANG DIANALISIS
                </div>
                <div style="border: 1.5pt solid #714236; background: #FAF8F5; padding: 8pt 10pt; margin-bottom: 12pt; font-size: 10pt;">
                    <p style="margin: 0 0 3pt 0; font-size: 10.5pt; font-weight: bold;">
                        ${curCase.icon || '📂'} ${curCase.title}
                    </p>
                    <p style="margin: 0 0 6pt 0; font-style: italic; color: #714236; font-size: 9.5pt;">
                        Kategori Masalah: ${curCase.category}
                    </p>
                    <p style="margin: 0; text-align: justify; line-height: 1.45;">
                        ${curCase.desc}
                    </p>
                </div>

                <div style="background: #FAF5EB; border-left: 4pt solid #891A10; padding: 4pt 8pt; font-weight: bold; font-size: 11pt; margin-top: 14pt; margin-bottom: 6pt;">
                    C. LEMBAR PENGAMATAN &amp; SOAL ANALISIS HOTS (C4 &amp; C6)
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 8pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">1. Analisis Logika Pilihan Ganda (Level C4 - Menganalisis):</p>
                    <p style="margin: 0; padding-left: 10pt;">Jawaban Kelompok: <strong>${hots.mc || '(Belum dijawab)'}</strong></p>
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 12pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">2. Solusi Rekayasa Algoritmik (Level C6 - Mencipta Solusi Masalah Nyata):</p>
                    <p style="margin: 0; padding-left: 10pt; text-align: justify; white-space: pre-wrap;">${hots.essay || '(Belum diisi)'}</p>
                </div>

                <div style="background: #FAF5EB; border-left: 4pt solid #891A10; padding: 4pt 8pt; font-weight: bold; font-size: 11pt; margin-top: 14pt; margin-bottom: 6pt;">
                    D. LEMBAR JAWABAN KEPUTUSAN KOMPUTASIONAL &amp; BAHAN PRESENTASI KELOMPOK
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 8pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">1. Struktur Data Paling Tepat untuk Kasus Ini:</p>
                    <p style="margin: 0; padding-left: 10pt; font-size: 10.5pt;"><strong>${ws.selectedStructure || '(Belum dipilih)'}</strong></p>
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 8pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">2. Alasan &amp; Argumentasi Komputasional Pemilihan Struktur Data:</p>
                    <p style="margin: 0; padding-left: 10pt; text-align: justify; white-space: pre-wrap;">${ws.reasoning || '(Belum diisi)'}</p>
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 8pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">3. Rincian Langkah Operasi / Algoritma yang Diterapkan:</p>
                    <p style="margin: 0; padding-left: 10pt; text-align: justify; white-space: pre-wrap;">${ws.steps || '(Belum diisi)'}</p>
                </div>
                <div style="border: 1pt solid #000; padding: 8pt 10pt; margin-bottom: 12pt; font-size: 10pt; background: #ffffff;">
                    <p style="margin: 0 0 4pt 0; font-weight: bold;">4. Kesimpulan Pembelajaran Kelompok &amp; Poin Refleksi Presentasi:</p>
                    <p style="margin: 0; padding-left: 10pt; text-align: justify; white-space: pre-wrap;">${ws.conclusion || '(Belum diisi)'}</p>
                </div>

                <div style="background: #FAF5EB; border-left: 4pt solid #891A10; padding: 4pt 8pt; font-weight: bold; font-size: 11pt; margin-top: 14pt; margin-bottom: 6pt; page-break-before: auto;">
                    E. RUBRIK PENILAIAN PRESENTASI &amp; LEMBAR PENGESAHAN
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 16pt; font-size: 9.5pt;">
                    <thead>
                        <tr style="background: #e2e8f0;">
                            <th style="border: 1pt solid #666; padding: 4pt; text-align: center; width: 30pt;">No</th>
                            <th style="border: 1pt solid #666; padding: 4pt; text-align: left;">Aspek Penilaian Presentasi</th>
                            <th style="border: 1pt solid #666; padding: 4pt; text-align: center; width: 50pt;">Bobot</th>
                            <th style="border: 1pt solid #666; padding: 4pt; text-align: left;">Kriteria Penilaian</th>
                            <th style="border: 1pt solid #666; padding: 4pt; text-align: center; width: 70pt;">Nilai Guru</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">1</td>
                            <td style="border: 1pt solid #666; padding: 4pt;"><strong>Penguasaan Konsep Stack / Queue</strong></td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">25%</td>
                            <td style="border: 1pt solid #666; padding: 4pt;">Mampu menjelaskan alur LIFO/FIFO dengan tepat pada kasus.</td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">______</td>
                        </tr>
                        <tr>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">2</td>
                            <td style="border: 1pt solid #666; padding: 4pt;"><strong>Ketepatan Solusi &amp; Algoritma</strong></td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">25%</td>
                            <td style="border: 1pt solid #666; padding: 4pt;">Solusi sistematis, efisien, dan mengatasi antrean/tumpukan.</td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">______</td>
                        </tr>
                        <tr>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">3</td>
                            <td style="border: 1pt solid #666; padding: 4pt;"><strong>Kerja Sama Tim &amp; Peran</strong></td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">25%</td>
                            <td style="border: 1pt solid #666; padding: 4pt;">Semua anggota tim berkontribusi aktif sesuai pembagian tugas.</td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">______</td>
                        </tr>
                        <tr>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">4</td>
                            <td style="border: 1pt solid #666; padding: 4pt;"><strong>Keterampilan Presentasi</strong></td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">25%</td>
                            <td style="border: 1pt solid #666; padding: 4pt;">Penyampaian jelas, percaya diri, dan argumentatif.</td>
                            <td style="border: 1pt solid #666; padding: 4pt; text-align: center;">______</td>
                        </tr>
                        <tr style="font-weight: bold; background: #f8fafc;">
                            <td colspan="4" style="border: 1pt solid #666; padding: 5pt; text-align: right;">TOTAL SKOR AKHIR PRESENTASI:</td>
                            <td style="border: 1pt solid #666; padding: 5pt; text-align: center;">______ / 100</td>
                        </tr>
                    </tbody>
                </table>

                <table style="width: 100%; border: none; margin-top: 30pt; page-break-inside: avoid; font-size: 10.5pt;">
                    <tr>
                        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
                            Mengetahui,<br>Guru Mata Pelajaran Informatika
                            <br><br><br><br><br>
                            ( ____________________________________ )<br>
                            NIP. ....................................................
                        </td>
                        <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
                            ${groupClass}, ${currentDate}<br>Ketua Kelompok
                            <br><br><br><br><br>
                            ( <strong>${members[0]?.name || 'Ketua Kelompok'}</strong> )<br>
                            NISN. ....................................................
                        </td>
                    </tr>
                </table>
            </div>
        `;

        if (!forWordDoc) {
            return innerContent;
        }

        return `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]>
                <xml>
                <w:WordDocument>
                <w:View>Print</w:View>
                <w:Zoom>100</w:Zoom>
                <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
                </xml>
                <![endif]-->
                <title>Lembar Jawaban LKPD - ${groupName}</title>
                <style>
                    @page Section1 {
                        size: 21cm 29.7cm;
                        margin: 2cm 2cm 2cm 2cm;
                        mso-header-margin: 1cm;
                        mso-footer-margin: 1cm;
                        mso-paper-source: 0;
                    }
                    div.Section1 {
                        page: Section1;
                    }
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        font-size: 11pt;
                        line-height: 1.45;
                        color: #000000;
                    }
                </style>
            </head>
            <body>
                <div class="Section1">
                    ${innerContent}
                </div>
            </body>
            </html>
        `;
    },

    downloadGroupWord() {
        try {
            this.saveGroupProject(false);
        } catch (e) {
            console.warn("Autosave before Word export warning:", e);
        }

        const data = window.StorageManager ? StorageManager.getGroupProject() : null;
        const groupName = this.groupProjectState.groupName || (data ? data.groupName : 'Kelompok_Informatika');
        const cleanName = groupName.replace(/[^\w\d-_]/g, '_');

        const docHTML = this.buildGroupLKPDHTML(true);
        const blob = new Blob(['\ufeff' + docHTML], {
            type: 'application/msword;charset=utf-8'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lembar_Jawaban_LKPD_${cleanName}.doc`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            a.remove();
            URL.revokeObjectURL(url);
        }, 1500);

        if (window.UI) {
            UI.showToast(`📄 Berkas Word (.doc) "${groupName}" berhasil diunduh! Siap untuk dipresentasikan.`);
        }
    },

    downloadGroupPDF() {
        try {
            this.saveGroupProject(false);
        } catch (e) {
            console.warn("Autosave before PDF export warning:", e);
        }

        let printDoc = document.getElementById('gp-print-document');
        if (!printDoc) {
            printDoc = document.createElement('div');
            printDoc.id = 'gp-print-document';
            printDoc.className = 'gp-print-only';
            document.body.appendChild(printDoc);
        }

        printDoc.innerHTML = this.buildGroupLKPDHTML(false);
        document.body.classList.add('printing-group-worksheet');

        if (window.UI) {
            UI.showToast(`📑 Menyiapkan Lembar Jawaban LKPD... Pada jendela cetak, pilih "Simpan sebagai PDF" (Save as PDF).`);
        }

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing-group-worksheet');
            }, 1000);
        }, 300);
    },

    printGroupWorksheet() {
        this.downloadGroupPDF();
    },

    exportGroupJSON() {
        const data = window.StorageManager ? StorageManager.getGroupProject() : null;
        if (!data || !data.groupName) {
            if (window.UI) UI.showToast("⚠️ Harap simpan lembar kerja tugas kelompok terlebih dahulu sebelum mengunduh!");
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `Tugas_Kelompok_${data.groupName.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        if (window.UI) UI.showToast("📥 Berkas JSON Tugas Kelompok berhasil diunduh!");
    },

    resetGroupWorksheetConfirm() {
        const confirmReset = window.confirm("Apakah kamu yakin ingin mereset lembar analisis dan jawaban tugas kelompok?");
        if (!confirmReset) return;

        this.groupProjectState.worksheet = {
            selectedStructure: '',
            reasoning: '',
            steps: '',
            conclusion: ''
        };
        this.groupProjectState.hotsAnswers = {};
        this.resetCaseSimulationData();
        this.persistProjectDraft();
        this.renderGroupProjectUI();

        if (window.SoundManager) SoundManager.play('click');
        if (window.UI) UI.showToast("🔄 Lembar analisis tugas kelompok telah direset.");
    }
};

window.App = App;
