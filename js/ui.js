/**
 * ui.js
 * User Interface Controller, World Map Renderer, Modal Coordinator, and Kiko Character
 */

const UI = {
    currentScreen: 'home',
    screenHistory: [],
    reviewFilterState: { search: '', level: 'all', concept: 'all', status: 'all' },

    init() {
        this.bindEvents();
        this.renderWorldMap();
        this.updateBreadcrumbs();
        this.initReviewSearchListeners();

        // Ensure back button is hidden initially on home screen
        const backBtn = document.querySelector('.btn-utility-back');
        if (backBtn && this.currentScreen === 'home') {
            backBtn.style.display = 'none';
        }
    },

    bindEvents() {
        // Nav items
        document.querySelectorAll('[data-screen-target]').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = el.getAttribute('data-screen-target');
                if (target) {
                    this.switchScreen(target);
                }
            });
        });
    },

    switchScreen(screenId, pushHistory = true) {
        // Play click sound
        if (window.SoundManager) {
            SoundManager.play('click');
        }

        // Push to history stack if navigating to different screen
        if (pushHistory && this.currentScreen && this.currentScreen !== screenId) {
            this.screenHistory.push(this.currentScreen);
        }

        const screens = document.querySelectorAll('.app-screen');
        screens.forEach(s => {
            s.classList.remove('active');
        });

        const targetEl = document.getElementById(`screen-${screenId}`);
        if (targetEl) {
            targetEl.classList.add('active');
            this.currentScreen = screenId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Auto-hide back button on Home screen
        const backBtn = document.querySelector('.btn-utility-back');
        if (backBtn) {
            backBtn.style.display = (screenId === 'home') ? 'none' : 'inline-flex';
        }
        const navBar = document.getElementById('global-nav-utility-bar');
        if (navBar) {
            navBar.classList.toggle('is-home', screenId === 'home');
        }

        // Highlight active nav links and dropdown items
        document.querySelectorAll('.nav-link, .bottom-nav-item, .nav-dropdown-item').forEach(link => {
            if (link.getAttribute('data-screen-target') === screenId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Toggle active highlight for parent dropdown buttons
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            const hasActiveChild = dropdown.querySelector('.nav-dropdown-item.active');
            const parentBtn = dropdown.querySelector('.nav-dropdown-btn');
            if (parentBtn) {
                parentBtn.classList.toggle('active', !!hasActiveChild);
            }
        });

        // Update breadcrumb navigation
        this.updateBreadcrumbs();

        // Trigger screen specific lifecycle
        this.onScreenActivated(screenId);
    },

    goBack() {
        if (this.currentScreen === 'challenge') {
            const tempAnswers = window.StorageManager ? StorageManager.getAllTempAnswers(ChallengeManager.currentLevelId) : {};
            const hasDrafts = Object.keys(tempAnswers).length > 0;
            if (hasDrafts) {
                const proceed = confirm(t('confirmLeaveChallenge'));
                if (!proceed) return;
            }
        }

        if (this.screenHistory.length > 0) {
            const prev = this.screenHistory.pop();
            this.switchScreen(prev, false);
        } else {
            this.switchScreen('home', false);
        }
    },

    updateBreadcrumbs(customCrumbs = null) {
        const container = document.getElementById('global-breadcrumb-trail');
        if (!container) return;

        if (customCrumbs && Array.isArray(customCrumbs)) {
            container.innerHTML = customCrumbs.map((c, idx) => {
                const isLast = idx === customCrumbs.length - 1;
                const label = c.nameKey ? t(c.nameKey) : c.name;
                if (isLast || c.active) {
                    return `<span class="breadcrumb-item active" aria-current="page">${label}</span>`;
                }
                return `
                    <button class="breadcrumb-link" onclick="UI.switchScreen('${c.screen}')">${label}</button>
                    <span class="breadcrumb-separator" aria-hidden="true">›</span>
                `;
            }).join('');
            return;
        }

        const crumbs = [
            { nameKey: 'breadcrumbHome', screen: 'home' }
        ];

        switch (this.currentScreen) {
            case 'home':
                break;
            case 'learn-intro':
                crumbs.push({ name: '🌱 Pemahaman Awal', active: true });
                break;
            case 'learn-stack':
                crumbs.push({ nameKey: 'breadcrumbLearnStack', active: true });
                break;
            case 'learn-queue':
                crumbs.push({ nameKey: 'breadcrumbLearnQueue', active: true });
                break;
            case 'stack-sim':
                crumbs.push({ nameKey: 'breadcrumbLearnStack', screen: 'learn-stack' });
                crumbs.push({ nameKey: 'breadcrumbStackSim', active: true });
                break;
            case 'queue-sim':
                crumbs.push({ nameKey: 'breadcrumbLearnQueue', screen: 'learn-queue' });
                crumbs.push({ nameKey: 'breadcrumbQueueSim', active: true });
                break;
            case 'games':
                crumbs.push({ nameKey: 'breadcrumbGames', active: true });
                break;
            case 'puzzle':
                crumbs.push({ nameKey: 'breadcrumbPuzzle', active: true });
                break;
            case 'challenge':
                crumbs.push({ nameKey: 'breadcrumbChallenge', active: true });
                break;
            case 'achievements':
                crumbs.push({ nameKey: 'breadcrumbAchievements', active: true });
                break;
            case 'result':
                crumbs.push({ nameKey: 'breadcrumbResult', active: true });
                break;
            case 'group-project':
                crumbs.push({ name: '👥 Tugas Kelompok', active: true });
                break;
            case 'individual-tasks':
                crumbs.push({ name: '🎯 Tugas Individu', active: true });
                break;
            case 'evaluation':
                crumbs.push({ name: '📝 Evaluasi', active: true });
                break;
            case 'enrichment':
                crumbs.push({ name: '💡 Pengayaan & Remedial', active: true });
                break;
            case 'reflection':
                crumbs.push({ name: '🪞 Refleksi Individu', active: true });
                break;
            case 'guidelines':
                crumbs.push({ name: '📖 Panduan & Glosarium', active: true });
                break;
            default:
                crumbs.push({ name: this.currentScreen, active: true });
        }

        container.innerHTML = crumbs.map((c, idx) => {
            const isLast = idx === crumbs.length - 1;
            const label = c.nameKey ? t(c.nameKey) : c.name;
            if (isLast || c.active) {
                return `<span class="breadcrumb-item active" aria-current="page">${label}</span>`;
            }
            return `
                <button class="breadcrumb-link" onclick="UI.switchScreen('${c.screen}')">${label}</button>
                <span class="breadcrumb-separator" aria-hidden="true">›</span>
            `;
        }).join('');
    },

    showLoading(message = 'Memuat Data...') {
        const loader = document.getElementById('global-loading-indicator');
        const textEl = document.getElementById('global-loading-text');
        if (textEl) textEl.textContent = message;
        if (loader) loader.classList.remove('hidden');
    },

    hideLoading() {
        const loader = document.getElementById('global-loading-indicator');
        if (loader) loader.classList.add('hidden');
    },

    onScreenActivated(screenId) {
        if (screenId === 'home') {
            this.renderWorldMap();
            if (window.Player) Player.updatePlayerUI();
            this.setKikoDialogue(t('kikoGreeting'));
        } else if (screenId === 'learn-stack') {
            this.setKikoDialogue("Pelajari konsep LIFO melalui infografis foto, video interaktif, dan coba tumpuk piring mini!", 'happy');
            if (window.App) {
                App.renderHandsOnStack();
                App.jumpStackVideoChapter(0);
            }
        } else if (screenId === 'learn-queue') {
            this.setKikoDialogue("Pelajari konsep FIFO melalui infografis foto, video animasi antrean, dan kuis cepat!", 'happy');
            if (window.App) {
                App.renderHandsOnQueue();
                App.jumpQueueVideoChapter(0);
            }
        } else if (screenId === 'stack-sim') {
            this.setKikoDialogue("Selesaikan 4 misi praktikum Stack (push, pop, peek, batas) untuk mendapatkan skor 100!", 'cheering');
            if (window.App) App.updateStackMissionUI();
        } else if (screenId === 'queue-sim') {
            this.setKikoDialogue("Selesaikan 4 misi antrean Queue (enqueue, front, dequeue, batas) untuk membuka level berikutnya!", 'cheering');
            if (window.App) App.updateQueueMissionUI();
        } else if (screenId === 'group-project') {
            this.setKikoDialogue("Selamat datang di Lembar Kerja Tugas Kelompok! Pilih salah satu studi kasus dan selesaikan bersama tim.", 'cheering');
            if (window.App) App.initGroupProject();
        } else if (screenId === 'enrichment') {
            this.setKikoDialogue("Modul Pengayaan & Remedial! Perdalam materi lanjut atau mantapkan pemahaman dasar melalui latihan soal bertingkat.", 'happy');
            if (window.PBLAcademic) PBLAcademic.renderRemedialQuiz();
        } else if (screenId === 'puzzle') {
            this.setKikoDialogue("Zona Teka-Teki Logika! Pecahkan teka-teki untuk mengumpulkan 100 poin dan lanjut ke Level 7.", 'happy');
            if (window.PuzzlesManager) PuzzlesManager.updatePuzzleUIProgress();
        } else if (screenId === 'achievements') {
            if (window.AchievementsManager) AchievementsManager.renderAchievementsGrid();
        } else if (screenId === 'result') {
            this.renderFinalResult();
        }
    },

    // ----------------------------------------------------
    // WORLD MAP RENDERING & PROGRESS TRACKING
    // ----------------------------------------------------
    renderWorldMap() {
        const mapContainer = document.getElementById('world-map-nodes');
        if (!mapContainer || !window.LevelsManager) return;

        const levels = LevelsManager.getAllLevels();
        const scores = window.StorageManager ? StorageManager.getAllLevelScores() : {};
        const completedCount = Object.keys(scores).filter(k => scores[k] > 0).length;
        const percentage = Math.round((completedCount / 8) * 100);

        const progText = document.querySelector('.overall-progress-text');
        const progFill = document.querySelector('.overall-progress-bar-fill');
        if (progText) progText.textContent = `${completedCount} / 8 (${percentage}%)`;
        if (progFill) progFill.style.width = `${percentage}%`;

        mapContainer.innerHTML = levels.map((lvl, idx) => {
            const isUnlocked = LevelsManager.isUnlocked(lvl.id);
            const isCompleted = LevelsManager.isCompleted(lvl.id);
            const score = scores[lvl.id];

            let statusClass = 'locked';
            let statusText = t('statusLocked');
            let statusIcon = '🔒';

            if (isCompleted) {
                statusClass = 'completed';
                statusText = `${t('statusCompleted')} (${score} pts)`;
                statusIcon = '✓';
            } else if (isUnlocked) {
                statusClass = 'available';
                statusText = t('statusAvailable');
                statusIcon = '▶';
            }

            return `
                <div class="map-location-card ${statusClass}" 
                     onclick="${isUnlocked ? `UI.startLevelFromMap(${lvl.id})` : `UI.showLockedNotice(${lvl.id})`}">
                    <div class="loc-badge-num">${t('levelNumber', { num: lvl.id })}</div>
                    <div class="loc-icon-bubble">${lvl.icon}</div>
                    <div class="loc-info">
                        <h4 class="loc-title">${t(lvl.locationNameKey)}</h4>
                        <p class="loc-desc">${t(lvl.descKey)}</p>
                    </div>
                    <div class="loc-status-pill ${statusClass}">
                        <span class="status-symbol">${statusIcon}</span>
                        <span>${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    startLevelFromMap(levelId) {
        const lvl = LevelsManager.getLevel(levelId);
        if (!lvl) return;

        switch (lvl.type) {
            case 'intro-learning':
                this.switchScreen('learn-stack');
                break;
            case 'stack-sim':
                this.switchScreen('stack-sim');
                break;
            case 'queue-sim':
                this.switchScreen('queue-sim');
                break;
            case 'stack-games':
                this.switchScreen('games');
                this.loadMiniGameTab('books');
                break;
            case 'queue-games':
                this.switchScreen('games');
                this.loadMiniGameTab('supermarket');
                break;
            case 'puzzle-zone':
                this.switchScreen('puzzle');
                if (window.PuzzlesManager) PuzzlesManager.loadPuzzle('A');
                break;
            case 'tech-challenges':
                this.switchScreen('challenge');
                if (window.ChallengeManager) ChallengeManager.startChallenge(7);
                break;
            case 'final-exam':
                this.switchScreen('challenge');
                if (window.ChallengeManager) ChallengeManager.startChallenge(8);
                break;
            default:
                this.switchScreen('home');
        }
    },

    showLockedNotice(levelId) {
        if (window.SoundManager) SoundManager.play('wrong');
        this.showToast(`Level ${levelId} masih terkunci! Selesaikan level sebelumnya untuk membukanya.`);
        this.setKikoDialogue(`Level ${levelId} masih terkunci! Ayo selesaikan level sebelumnya dulu ya.`);
    },

    loadMiniGameTab(gameKey) {
        document.querySelectorAll('.game-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-game') === gameKey);
        });
        document.querySelectorAll('.mini-game-viewport').forEach(vp => {
            vp.classList.toggle('active', vp.id === `game-vp-${gameKey}`);
        });

        if (window.MiniGames && MiniGames[gameKey]) {
            MiniGames[gameKey].init();
        }
    },

    // ----------------------------------------------------
    // GUIDE MASCOT: KIKO
    // ----------------------------------------------------
    setKikoDialogue(message, expression = 'normal') {
        const bubbles = document.querySelectorAll('.kiko-speech-bubble');
        bubbles.forEach(b => {
            b.classList.remove('animate-pop');
            void b.offsetWidth; // trigger reflow
            b.classList.add('animate-pop');
            b.textContent = message;
        });

        const avatars = document.querySelectorAll('.kiko-avatar');
        avatars.forEach(av => {
            av.classList.remove('happy', 'thinking', 'cheering');
            if (expression !== 'normal') {
                av.classList.add(expression);
            }
        });
    },

    showFeedback(isSuccess, message, concept = '') {
        const banner = document.getElementById('global-feedback-banner');
        if (!banner) return;

        banner.className = `feedback-banner ${isSuccess ? 'success' : 'error'} animate-slide-down`;
        banner.innerHTML = `
            <span class="feedback-icon">${isSuccess ? '✨' : '⚠️'}</span>
            <div class="feedback-text">
                ${concept ? `<strong>[${concept}]</strong> ` : ''}${message}
            </div>
            <button class="feedback-close" onclick="this.parentElement.classList.add('hidden')">×</button>
        `;
        banner.classList.remove('hidden');

        this.setKikoDialogue(message, isSuccess ? 'happy' : 'thinking');

        clearTimeout(this._feedbackTimer);
        this._feedbackTimer = setTimeout(() => {
            banner.classList.add('hidden');
        }, 5000);
    },

    showToast(message) {
        const container = document.getElementById('toast-notification-area');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-alert animate-bounce-subtle';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    },

    showMiniGameSuccess(gameTitle, score = 100) {
        if (window.SoundManager) SoundManager.play('levelComplete');
        this.setKikoDialogue(`${gameTitle} berhasil diselesaikan dengan gemilang! Skor: ${score}!`, 'cheering');
        this.showToast(`🎉 Luar biasa! ${gameTitle} tuntas!`);

        // Check level completion
        const activeLevel = (gameTitle.includes('Supermarket') || gameTitle.includes('Kantin')) ? 5 : 4;
        LevelsManager.completeLevel(activeLevel, score);
        this.renderWorldMap();
    },

    _activeCompletedLevelId: 1,

    showLevelCompleteModal(levelId, score) {
        this._activeCompletedLevelId = Number(levelId);
        if (window.SoundManager) SoundManager.play('levelComplete');

        const modal = document.getElementById('level-complete-modal');
        const titleEl = document.getElementById('complete-level-title');
        const scoreEl = document.getElementById('complete-level-score');
        const nextBtn = document.getElementById('modal-next-level-btn');
        if (!modal) return;

        if (titleEl) titleEl.textContent = `Level ${levelId} Selesai!`;
        if (scoreEl) scoreEl.textContent = `${score} / 100`;

        const nextNum = Number(levelId) + 1;
        if (nextBtn) {
            nextBtn.textContent = nextNum <= 8 ? `▶ Lanjut ke Level ${nextNum} Sekarang` : `📊 Lihat Rapor Evaluasi Akhir`;
        }

        modal.classList.add('active');
        this.setKikoDialogue(t('kikoCompleteLevel'), 'cheering');
        this.renderWorldMap();
    },

    proceedToNextLevelFromModal() {
        const modal = document.getElementById('level-complete-modal');
        if (modal) modal.classList.remove('active');
        const nextId = (this._activeCompletedLevelId || 1) + 1;
        if (nextId <= 8) {
            this.goToNextLevel(this._activeCompletedLevelId || 1);
        } else {
            this.switchScreen('result');
        }
    },

    closeCompleteModal() {
        const modal = document.getElementById('level-complete-modal');
        if (modal) modal.classList.remove('active');
        this.switchScreen('home');
    },

    goToNextLevel(currentLevelId) {
        const current = Number(currentLevelId);
        const nextId = current + 1;

        if (window.StorageManager) {
            StorageManager.unlockLevel(nextId);
        }

        if (window.SoundManager) {
            SoundManager.play('click');
        }

        if (nextId === 2) {
            this.switchScreen('stack-sim');
            this.showToast("🚀 Berhasil masuk ke Level 2: Simulator Stack!");
        } else if (nextId === 3) {
            this.switchScreen('queue-sim');
            this.showToast("🚀 Berhasil masuk ke Level 3: Simulator Queue!");
        } else if (nextId === 4) {
            this.switchScreen('games');
            this.loadMiniGameTab('books');
            this.showToast("🚀 Masuk ke Level 4: Mini-Game Tumpukan Buku & Gudang!");
        } else if (nextId === 5) {
            this.switchScreen('games');
            this.loadMiniGameTab('supermarket');
            this.showToast("🚀 Masuk ke Level 5: Mini-Game Kasir Supermarket & Kantin!");
        } else if (nextId === 6) {
            this.switchScreen('puzzle');
            if (window.PuzzlesManager) PuzzlesManager.loadPuzzle('A');
            this.showToast("🚀 Masuk ke Level 6: Zona Puzzle Logika!");
        } else if (nextId === 7) {
            this.switchScreen('challenge');
            if (window.ChallengeManager) ChallengeManager.startChallenge(7);
            this.showToast("🚀 Masuk ke Level 7: Studi Kasus Teknologi!");
        } else if (nextId === 8) {
            this.switchScreen('challenge');
            if (window.ChallengeManager) ChallengeManager.startChallenge(8);
            this.showToast("🏆 Masuk ke Level 8: Evaluasi Akhir Juara!");
        } else {
            this.switchScreen('result');
            this.showToast("📊 Selamat! Seluruh level telah selesai!");
        }
    },

    // ----------------------------------------------------
    // FINAL RESULT & REPORT CARD
    // ----------------------------------------------------
    renderFinalResult() {
        if (!window.ScoringSystem) return;
        const avgScore = ScoringSystem.getFinalAverage();
        const predicate = ScoringSystem.getPredicate(avgScore);
        const analytics = ScoringSystem.getDetailedAnalytics();
        const scores = StorageManager.getAllLevelScores();
        const playerName = Player.getName();

        // Populate Result Card
        const nameEl = document.getElementById('result-player-name');
        const classEl = document.getElementById('result-player-class');
        const absenEl = document.getElementById('result-player-absen');
        const dateEl = document.getElementById('result-date');
        const scoreEl = document.getElementById('result-final-score');
        const predEl = document.getElementById('result-predicate-badge');
        const accEl = document.getElementById('result-accuracy');
        const corEl = document.getElementById('result-correct-count');
        const wroEl = document.getElementById('result-wrong-count');
        const timeEl = document.getElementById('result-play-time');
        const levelsGrid = document.getElementById('result-level-breakdown');
        const masteredList = document.getElementById('result-mastered-concepts');
        const practiceList = document.getElementById('result-practice-concepts');

        if (nameEl) nameEl.textContent = playerName || 'Siswa';
        if (classEl) classEl.textContent = Player.getClass() || 'Fase E (Kelas X)';
        if (absenEl) absenEl.textContent = Player.getAbsen() ? `No. ${Player.getAbsen()}` : '-';
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        if (scoreEl) scoreEl.textContent = avgScore;
        if (predEl) {
            predEl.textContent = predicate.text;
            predEl.className = `predicate-badge ${predicate.class}`;
        }
        if (accEl) accEl.textContent = `${analytics.accuracy}%`;
        if (corEl) corEl.textContent = analytics.correctAnswers;
        if (wroEl) wroEl.textContent = analytics.wrongAnswers;
        if (timeEl) timeEl.textContent = analytics.formattedTime;

        if (levelsGrid) {
            const pageScores = window.StorageManager ? StorageManager.getAllPageScores() : {};
            const groupProject = window.StorageManager ? StorageManager.getGroupProject() : null;

            let html = [1, 2, 3, 4, 5, 6, 7, 8].map(num => {
                const s = scores[num];
                const hasScore = s !== undefined && s !== null;
                return `
                    <div class="result-level-row">
                        <span class="lvl-label">Level ${num}</span>
                        <div class="lvl-bar-wrapper">
                            <div class="lvl-bar-fill" style="width: ${hasScore ? s : 0}%"></div>
                        </div>
                        <span class="lvl-score-val">${hasScore ? `${s} pts` : '-'}</span>
                    </div>
                `;
            }).join('');

            // Display Group Project row if present
            if (groupProject && (groupProject.score || groupProject.savedAt)) {
                const gpScore = groupProject.score || 100;
                const membersStr = (groupProject.members && groupProject.members.length > 0)
                    ? ` (${groupProject.members.map(m => typeof m === 'object' ? (m.name || '') : m).filter(Boolean).join(', ')})`
                    : '';
                html += `
                    <div class="result-level-row" style="background: rgba(14, 165, 233, 0.08); border-left: 3px solid #0284c7; padding: 6px 10px; margin-top: 8px; border-radius: 6px;">
                        <span class="lvl-label" style="font-weight: 700; color: #0284c7;">👥 Tugas Kelompok: ${groupProject.groupName || 'Tim'}${membersStr}</span>
                        <div class="lvl-bar-wrapper">
                            <div class="lvl-bar-fill" style="width: ${gpScore}%; background: #0284c7;"></div>
                        </div>
                        <span class="lvl-score-val" style="font-weight: 700; color: #0284c7;">${gpScore} pts</span>
                    </div>
                `;
            }

            // Display Interactive Module Scores breakdown
            const stackLearn = pageScores['learn-stack']?.score;
            const queueLearn = pageScores['learn-queue']?.score;
            const stackSim = pageScores['stack-sim']?.score;
            const queueSim = pageScores['queue-sim']?.score;

            if (stackLearn !== undefined || queueLearn !== undefined || stackSim !== undefined || queueSim !== undefined) {
                html += `
                    <div style="margin-top: 10px; padding: 10px; background: var(--surface-soft); border-radius: 8px; font-size: 0.85rem; border: 1px dashed var(--border-color);">
                        <strong style="color: var(--primary-sky); display: block; margin-bottom: 6px;">📌 Nilai Modul Pembelajaran & Lab Interaktif:</strong>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 6px;">
                            ${stackLearn !== undefined ? `<div>Materi Belajar Stack: <strong style="color: var(--success-emerald);">${stackLearn} pts</strong></div>` : ''}
                            ${queueLearn !== undefined ? `<div>Materi Belajar Queue: <strong style="color: var(--success-emerald);">${queueLearn} pts</strong></div>` : ''}
                            ${stackSim !== undefined ? `<div>Lab Simulator Stack: <strong style="color: var(--success-emerald);">${stackSim} pts</strong></div>` : ''}
                            ${queueSim !== undefined ? `<div>Lab Simulator Queue: <strong style="color: var(--success-emerald);">${queueSim} pts</strong></div>` : ''}
                        </div>
                    </div>
                `;
            }

            levelsGrid.innerHTML = html;
        }

        if (masteredList) {
            masteredList.innerHTML = analytics.mastered.length > 0 
                ? analytics.mastered.map(c => `<li><span class="check-icon">✓</span> <strong>${c}</strong></li>`).join('')
                : `<li><em>Belum ada data konsep</em></li>`;
        }

        if (practiceList) {
            practiceList.innerHTML = analytics.needsPractice.length > 0
                ? analytics.needsPractice.map(c => `<li><span class="warn-icon">⚠️</span> <strong>${c}</strong></li>`).join('')
                : `<li class="all-good-note">${t('allMasteredNotice')}</li>`;
        }
    },

    // ----------------------------------------------------
    // PUSAT BANK SOAL & RIWAYAT JAWABAN (SEARCH & FILTER)
    // ----------------------------------------------------
    initReviewSearchListeners() {
        const searchInput = document.getElementById('review-search-input');
        const clearBtn = document.getElementById('review-search-clear-btn');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                if (clearBtn) clearBtn.classList.toggle('hidden', !searchInput.value);
                this.applyReviewFilters();
            });
        }
    },

    openReviewAnswersModal(filterPreset = null) {
        const modal = document.getElementById('review-answers-modal');
        if (!modal) return;

        if (filterPreset) {
            const statusSelect = document.getElementById('review-filter-status');
            if (statusSelect) statusSelect.value = filterPreset;
        }

        this.applyReviewFilters();
        modal.classList.add('active');
    },

    closeReviewModal() {
        const modal = document.getElementById('review-answers-modal');
        if (modal) modal.classList.remove('active');
    },

    clearReviewSearch() {
        const searchInput = document.getElementById('review-search-input');
        const clearBtn = document.getElementById('review-search-clear-btn');
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        this.applyReviewFilters();
    },

    resetReviewFilters() {
        const searchInput = document.getElementById('review-search-input');
        const clearBtn = document.getElementById('review-search-clear-btn');
        const levelSelect = document.getElementById('review-filter-level');
        const conceptSelect = document.getElementById('review-filter-concept');
        const statusSelect = document.getElementById('review-filter-status');

        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        if (levelSelect) levelSelect.value = 'all';
        if (conceptSelect) conceptSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';

        this.applyReviewFilters();
        this.showToast("Filter telah dikembalikan ke semula.");
    },

    applyReviewFilters() {
        const searchInput = document.getElementById('review-search-input');
        const levelSelect = document.getElementById('review-filter-level');
        const conceptSelect = document.getElementById('review-filter-concept');
        const statusSelect = document.getElementById('review-filter-status');

        this.reviewFilterState = {
            search: searchInput ? searchInput.value.trim().toLowerCase() : '',
            level: levelSelect ? levelSelect.value : 'all',
            concept: conceptSelect ? conceptSelect.value : 'all',
            status: statusSelect ? statusSelect.value : 'all'
        };

        this.renderReviewList();
    },

    renderReviewList() {
        const container = document.getElementById('review-list-container');
        const counterEl = document.getElementById('review-results-counter');
        if (!container) return;

        const lang = getLanguage();
        const logs = window.StorageManager ? StorageManager.getAnswersLog() : [];
        const levels = [1, 7, 8];

        // Aggregate all questions across question banks with status metadata
        const allQuestionsList = [];
        levels.forEach(lvl => {
            const bank = window.CHALLENGE_BANKS ? (CHALLENGE_BANKS[lvl] || []) : [];
            const tempAnswers = window.StorageManager ? StorageManager.getAllTempAnswers(lvl) : {};

            bank.forEach((q, qIdx) => {
                // Find in submitted logs
                const logEntry = logs.find(l => (l.questionId && l.questionId === q.id) || (l.levelId === lvl && l.question === q.question));
                const draftEntry = tempAnswers[qIdx] || null;

                let status = 'unanswered';
                let isCorrect = null;
                let userAnswer = '-';
                let savedAt = null;

                if (logEntry) {
                    status = logEntry.isCorrect ? 'correct' : 'wrong';
                    isCorrect = logEntry.isCorrect;
                    userAnswer = logEntry.userAnswer;
                    savedAt = logEntry.timestamp;
                } else if (draftEntry && draftEntry.isSubmitted) {
                    status = draftEntry.isCorrect ? 'correct' : 'wrong';
                    isCorrect = draftEntry.isCorrect;
                    userAnswer = draftEntry.chosenText;
                    savedAt = draftEntry.savedAt;
                } else if (draftEntry && draftEntry.selectedIndex !== undefined && draftEntry.selectedIndex !== null) {
                    status = 'draft';
                    userAnswer = draftEntry.chosenText;
                    savedAt = draftEntry.savedAt;
                }

                allQuestionsList.push({
                    levelId: lvl,
                    qIndex: qIdx,
                    questionId: q.id,
                    concept: q.concept,
                    question: lang === 'en' ? (q.questionEn || q.question) : q.question,
                    correctAnswer: lang === 'en' ? (q.correctAnswerEn || q.correctAnswer) : q.correctAnswer,
                    explanation: lang === 'en' ? (q.explanationEn || q.explanation) : q.explanation,
                    options: lang === 'en' ? (q.optionsEn || q.options) : q.options,
                    status,
                    isCorrect,
                    userAnswer,
                    savedAt
                });
            });
        });

        // Filter items
        const { search, level, concept, status } = this.reviewFilterState;
        const filtered = allQuestionsList.filter(item => {
            // Search filter
            if (search) {
                const matchQ = item.question.toLowerCase().includes(search);
                const matchC = item.concept.toLowerCase().includes(search);
                const matchE = item.explanation.toLowerCase().includes(search);
                const matchA = (item.userAnswer || '').toLowerCase().includes(search);
                if (!matchQ && !matchC && !matchE && !matchA) return false;
            }

            // Level filter
            if (level !== 'all' && Number(level) !== item.levelId) {
                return false;
            }

            // Concept filter
            if (concept !== 'all' && item.concept !== concept) {
                return false;
            }

            // Status filter
            if (status !== 'all') {
                if (status === 'answered' && (item.status !== 'correct' && item.status !== 'wrong')) return false;
                if (status === 'correct' && item.status !== 'correct') return false;
                if (status === 'wrong' && item.status !== 'wrong') return false;
                if (status === 'draft' && item.status !== 'draft') return false;
                if (status === 'unanswered' && item.status !== 'unanswered') return false;
            }

            return true;
        });

        // Update counter
        if (counterEl) {
            counterEl.textContent = t('searchResultsCount', { count: filtered.length, total: allQuestionsList.length });
        }

        // Empty state handling
        if (filtered.length === 0) {
            const isFilterActive = search || level !== 'all' || concept !== 'all' || status !== 'all';
            container.innerHTML = `
                <div class="empty-state-card animate-pop">
                    <div class="empty-icon">${isFilterActive ? '🔍' : '📋'}</div>
                    <h4 class="empty-title">
                        ${isFilterActive ? t('emptySearchResultTitle') : t('emptyAnswerLogTitle')}
                    </h4>
                    <p class="empty-desc">
                        ${isFilterActive ? t('emptySearchResultDesc') : t('emptyAnswerLogDesc')}
                    </p>
                    <div class="empty-action-row">
                        ${isFilterActive ? `
                            <button class="btn btn-primary" onclick="UI.resetReviewFilters()">
                                🔄 ${t('btnResetFilter')}
                            </button>
                        ` : `
                            <button class="btn btn-primary" onclick="UI.closeReviewModal(); UI.startLevelFromMap(1);">
                                🚀 ${t('btnStartPracticing')}
                            </button>
                        `}
                    </div>
                </div>
            `;
            return;
        }

        // Render card items
        container.innerHTML = filtered.map((item, idx) => {
            let statusTagClass = 'tag-unanswered';
            let statusTagText = 'Belum Dikerjakan';

            if (item.status === 'correct') {
                statusTagClass = 'tag-correct';
                statusTagText = '✓ Benar';
            } else if (item.status === 'wrong') {
                statusTagClass = 'tag-wrong';
                statusTagText = '⚠️ Perlu Koreksi';
            } else if (item.status === 'draft') {
                statusTagClass = 'tag-draft';
                statusTagText = '✎ Draft Tersimpan';
            }

            const levelName = item.levelId === 1 ? 'Level 1: Konsep Dasar' : (item.levelId === 7 ? 'Level 7: Kasus Teknologi' : 'Level 8: Evaluasi Akhir');

            return `
                <div class="review-item-card ${item.status === 'correct' ? 'correct-entry' : (item.status === 'wrong' ? 'wrong-entry' : (item.status === 'draft' ? 'draft-entry' : 'unanswered-entry'))}">
                    <div class="review-item-header">
                        <div class="review-meta-pills">
                            <span class="review-lvl-badge">${levelName}</span>
                            <span class="review-q-num">Soal #${item.qIndex + 1}</span>
                            <span class="concept-badge-small">📌 ${item.concept}</span>
                        </div>
                        <span class="review-status-tag ${statusTagClass}">
                            ${statusTagText}
                        </span>
                    </div>

                    <h4 class="review-question-title">${item.question}</h4>

                    ${item.status !== 'unanswered' ? `
                        <div class="review-answers-box">
                            <p>
                                <strong>${t('yourAnswer')}</strong> 
                                <span class="${item.isCorrect ? 'text-success' : (item.status === 'draft' ? 'text-amber' : 'text-danger')}">
                                    ${item.userAnswer}
                                </span>
                            </p>
                            ${item.status === 'wrong' ? `
                                <p><strong>${t('correctAnswerIs')}</strong> <span class="text-success font-semibold">${item.correctAnswer}</span></p>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="review-unanswered-box">
                            <em>Soal ini belum pernah kamu kerjakan atau jawab.</em>
                        </div>
                    `}

                    <div class="review-explanation">
                        <strong>💡 ${t('explanationTitle')}</strong> ${item.explanation}
                    </div>

                    <div class="review-item-actions">
                        <button class="btn btn-primary btn-sm" onclick="UI.reopenQuestionInChallenge(${item.levelId}, ${item.qIndex})">
                            ${item.status === 'unanswered' ? '▶ Kerjakan Soal Ini' : '🔄 Ulangi Soal Ini di Arena'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    reopenQuestionInChallenge(levelId, qIndex) {
        this.closeReviewModal();
        this.switchScreen('challenge');
        if (window.ChallengeManager) {
            ChallengeManager.startChallenge(levelId);
            if (qIndex !== undefined) {
                ChallengeManager.jumpToQuestion(qIndex);
            }
        }
    },

    // ----------------------------------------------------
    // PRINT RESULT
    // ----------------------------------------------------
    printResult() {
        this.renderFinalResult();
        window.print();
    },

    // ----------------------------------------------------
    // RESET PROGRESS
    // ----------------------------------------------------
    promptResetProgress() {
        if (confirm(t('confirmReset'))) {
            StorageManager.resetAll();
            this.renderWorldMap();
            if (window.AchievementsManager) AchievementsManager.renderAchievementsGrid();
            this.showToast("Progres petualangan berhasil direset.");
            this.switchScreen('home');
        }
    }
};

window.UI = UI;
