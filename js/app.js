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

        // Check if player name exists
        if (!Player.hasName()) {
            this.showNamePromptModal();
        }

        this.initSimulators();
        this.bindGlobalHandlers();
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

        // Player name form submission
        const nameForm = document.getElementById('player-name-form');
        if (nameForm) {
            nameForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('player-name-input');
                const val = input ? input.value.trim() : '';
                if (val) {
                    Player.setName(val);
                    this.hideNamePromptModal();
                    if (window.SoundManager) SoundManager.play('correct');
                    UI.showToast(`Selamat datang, ${val}! Petualangan dimulai!`);
                    UI.setKikoDialogue(t('greeting', { name: val }), 'cheering');
                } else {
                    alert(t('enterNameAlert'));
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

    showNamePromptModal() {
        const modal = document.getElementById('name-prompt-modal');
        if (modal) {
            modal.classList.add('active');
            const input = document.getElementById('player-name-input');
            if (input) setTimeout(() => input.focus(), 300);
        }
    },

    hideNamePromptModal() {
        const modal = document.getElementById('name-prompt-modal');
        if (modal) modal.classList.remove('active');
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
            return;
        }

        this.simStack.push(item);
        if (window.SoundManager) SoundManager.play('push');
        
        UI.showFeedback(true, `push("${item}"): Elemen baru bertengger tepat di posisi TOP.`, 'LIFO');
        this.renderStackSim(true);

        // Check level 2 progress
        if (this.simStack.size() >= 4 && window.LevelsManager) {
            LevelsManager.completeLevel(2, 95);
        }
    },

    simPop() {
        if (this.simStack.isEmpty()) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, `pop() gagal: ${t('stackEmptyNotice')} (Stack Underflow)`, 'LIFO');
            return;
        }

        const popped = this.simStack.pop();
        if (window.SoundManager) SoundManager.play('pop');

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
            return;
        }

        const person = { name: personName, avatar, id: Date.now() % 1000 };
        this.simQueue.enqueue(person);
        if (window.SoundManager) SoundManager.play('enqueue');

        UI.showFeedback(true, `enqueue("${person.name}"): Masuk ke antrean di posisi paling belakang (REAR).`, 'FIFO');
        this.renderQueueSim(true);

        // Check level 3 progress
        if (this.simQueue.size() >= 4 && window.LevelsManager) {
            LevelsManager.completeLevel(3, 95);
        }
    },

    simDequeue() {
        if (this.simQueue.isEmpty()) {
            if (window.SoundManager) SoundManager.play('wrong');
            UI.showFeedback(false, `dequeue() gagal: ${t('queueEmptyNotice')} (Queue Underflow)`, 'FIFO');
            return;
        }

        const dequeued = this.simQueue.dequeue();
        if (window.SoundManager) SoundManager.play('dequeue');

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

        UI.showFeedback(true, `front(): Orang di barisan depan saat ini adalah "${frontPerson.name}". Tidak ada perubahan antrean.`, 'FIFO');

        const frontEl = document.querySelector('#sim-queue-container .sim-queue-person:first-child');
        if (frontEl) {
            frontEl.classList.add('front-highlight');
            setTimeout(() => frontEl.classList.remove('front-highlight'), 1500);
        }
    },

    simClearQueue() {
        this.simQueue.clear();
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
    }
};

window.App = App;
