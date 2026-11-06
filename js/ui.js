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

        let targetEl = document.getElementById(`screen-${screenId}`);
        if (!targetEl) {
            if (screenId === 'stack-sim' || screenId === 'games') {
                return this.switchScreen('learn-stack', pushHistory);
            }
            if (screenId === 'queue-sim' || screenId === 'puzzle' || screenId === 'challenge') {
                return this.switchScreen('learn-queue', pushHistory);
            }
            targetEl = document.getElementById('screen-home');
            screenId = 'home';
        }
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
            case 'profile':
                crumbs.push({ name: '👤 Profil & Rapor Siswa', active: true });
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
        } else if (screenId === 'profile') {
            this.setKikoDialogue("Halaman Profil & Rapor! Cek progres belajar, rincian nilai digital, dan unduh dokumen laporan resmi.", 'happy');
            this.renderProfilePage();
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
    
    // ----------------------------------------------------
    // RETRY CONFIRMATION MODAL & RETRY FLOW (NALARQUEST)
    // ----------------------------------------------------
    currentRetryType: 'individual',

    openRetryModal(type = 'individual') {
        this.currentRetryType = type;
        const modal = document.getElementById('retry-confirm-modal');
        if (!modal) return;

        const titleEl = document.getElementById('retry-modal-title');
        const msgEl = document.getElementById('retry-modal-message');

        if (type === 'individual') {
            if (titleEl) titleEl.textContent = 'Ulangi Seluruh Tugas?';
            if (msgEl) msgEl.textContent = 'Seluruh jawaban pada tugas ini akan dihapus dan kamu akan memulai kembali dari soal pertama. Kesempatan pengerjaan akan berkurang satu.';
        } else if (type === 'group') {
            if (titleEl) titleEl.textContent = 'Ulangi Seluruh Tugas?';
            if (msgEl) msgEl.textContent = 'Seluruh jawaban pada tugas ini akan dihapus dan kamu akan memulai kembali dari soal pertama. Kesempatan pengerjaan akan berkurang satu.';
        }

        modal.style.display = 'flex';
        modal.classList.add('active');
        if (window.SoundManager) SoundManager.play('click');
    },

    closeRetryModal() {
        const modal = document.getElementById('retry-confirm-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    },

    confirmRetryAction() {
        this.closeRetryModal();
        if (this.currentRetryType === 'individual') {
            if (window.PBLAcademic && typeof PBLAcademic.executeRetryIndividual === 'function') {
                PBLAcademic.executeRetryIndividual();
            }
        } else if (this.currentRetryType === 'group') {
            if (window.App && typeof App.executeRetryGroup === 'function') {
                App.executeRetryGroup();
            }
        }
    },

    renderFinalResult() {
        if (!window.ScoringSystem) return;
        const comp = ScoringSystem.getComponentScores();
        const avgScore = comp.finalScore; // Nilai Digital (ND)
        const predicate = ScoringSystem.getPredicate(avgScore);
        const analytics = ScoringSystem.getDetailedAnalytics();
        const playerName = (window.Player && Player.getName && Player.getName()) || 'Peserta Didik';
        const playerClass = (window.Player && Player.getClass && Player.getClass()) || 'Kelas X.1';
        const playerAbsen = (window.Player && Player.getAbsen && Player.getAbsen()) || '';

        // Populate Result Card Identity
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

        if (nameEl) nameEl.textContent = playerName;
        if (classEl) classEl.textContent = playerClass;
        if (absenEl) absenEl.textContent = playerAbsen ? ('No. ' + playerAbsen) : '—';
        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
        }
        if (scoreEl) scoreEl.textContent = avgScore;
        if (predEl) {
            predEl.textContent = predicate.text;
            predEl.className = 'predicate-badge ' + predicate.class;
            predEl.style.backgroundColor = predicate.badgeColor;
            predEl.style.color = '#FFFFFF';
            predEl.title = predicate.desc;
        }
        if (accEl) accEl.textContent = analytics.accuracy + '%';
        if (corEl) corEl.textContent = analytics.correctAnswers;
        if (wroEl) wroEl.textContent = analytics.wrongAnswers;
        if (timeEl) timeEl.textContent = analytics.formattedTime;

        if (levelsGrid) {
            const groupProject = window.StorageManager ? StorageManager.getGroupProject() : null;
            const membersList = (groupProject && groupProject.members && groupProject.members.length > 0)
                ? groupProject.members.map(m => typeof m === 'object' ? (m.name || '') : m).filter(Boolean).join(', ')
                : '';

            // Format attempt history text
            const formatHistoryBadges = (hist = [], best = 0) => {
                if (!hist || hist.length === 0) return '<span style="color: #714236; font-size: 0.8rem; font-style: italic;">Belum ada percobaan selesai</span>';
                return hist.map(h => {
                    const isBest = h.score === best && best > 0;
                    return '<span style="display: inline-block; background: ' + (isBest ? '#10b981' : '#FAF6ED') + '; color: ' + (isBest ? '#FFFFFF' : '#714236') + '; border: 1px solid ' + (isBest ? '#10b981' : '#D8D4BC') + '; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; margin-right: 0.35rem;">P' + h.attempt + ': ' + h.score + ' pts' + (isBest ? ' ★ Terbaik' : '') + '</span>';
                }).join('');
            };

            const componentsList = [
                {
                    key: 'individual',
                    icon: '🎯',
                    title: '1. Tugas Individu (4 Level)',
                    weight: 30,
                    score: comp.individual.score,
                    contrib: comp.individual.weightedContribution,
                    desc: 'Nilai terbaik dari maksimal 3 percobaan pengerjaan tugas mandiri bertingkat (bobot 30%).',
                    historyHTML: formatHistoryBadges(comp.individual.history, comp.individual.score)
                },
                {
                    key: 'groupProject',
                    icon: '👥',
                    title: '2. LKPD Kelompok (PBL: ' + ((groupProject && groupProject.groupName) ? groupProject.groupName : 'Tim Kolaborasi') + ')',
                    weight: 35,
                    score: comp.groupProject.score,
                    contrib: comp.groupProject.weightedContribution,
                    desc: (membersList ? ('Anggota Tim: ' + membersList + '. ') : '') + 'Nilai terbaik kelompok dari maksimal 3 percobaan analisis studi kasus kantin (bobot 35%).',
                    historyHTML: formatHistoryBadges(comp.groupProject.history, comp.groupProject.score)
                },
                {
                    key: 'evaluation',
                    icon: '📝',
                    title: '3. Evaluasi Akhir (Asesmen Sumatif 5 Soal HOTS)',
                    weight: 35,
                    score: comp.evaluation.score,
                    contrib: comp.evaluation.weightedContribution,
                    desc: 'Penguasaan konsep secara mandiri melalui 5 butir soal HOTS (bobot 35%).',
                    historyHTML: null
                },
                {
                    key: 'miniLabBonus',
                    icon: '✨',
                    title: '4. Bonus Mini-Lab (Tambahan di Luar Bobot Utama)',
                    weight: '+5 Pts',
                    score: comp.miniLabBonus.score,
                    contrib: comp.miniLabBonus.contribution,
                    desc: 'Poin bonus atas keberhasilan mengeksekusi 4 operasi dasar di Mini-Lab (push, pop, enqueue, dequeue). Maksimal +5 poin.',
                    historyHTML: null,
                    isBonus: true
                }
            ];

            let html = componentsList.map(c => {
                const isCompleted = c.score > 0;
                const barColor = c.isBonus ? '#E76814' : (c.score >= 75 ? '#10b981' : (c.score > 0 ? '#DC8236' : '#D8D4BC'));
                const maxVal = c.isBonus ? 5 : 100;
                const barWidth = c.isBonus ? ((c.score / 5) * 100) : c.score;

                return `
                    <div class="result-component-card" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; box-shadow: 0 2px 8px rgba(113, 66, 54, 0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                            <div style="flex: 1; min-width: 220px;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <span style="font-size: 1.2rem;">${c.icon}</span>
                                    <strong style="color: #891A10; font-size: 0.98rem; font-family: 'Syne', sans-serif;">${c.title}</strong>
                                    <span style="font-size: 0.75rem; background: #FAF6ED; border: 1px solid #D8D4BC; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 700; color: #714236;">
                                        Bobot: ${c.weight}${typeof c.weight === 'number' ? '%' : ''}
                                    </span>
                                </div>
                                <p style="font-size: 0.85rem; color: #714236; margin: 0 0 0.4rem 0; line-height: 1.4;">
                                    ${c.desc}
                                </p>
                                ${c.historyHTML ? `
                                    <div style="margin-top: 0.35rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                                        <span style="font-size: 0.78rem; color: #714236; font-weight: 600;">Riwayat Percobaan:</span>
                                        ${c.historyHTML}
                                    </div>
                                ` : ''}
                            </div>
                            <div style="text-align: right; min-width: 140px;">
                                <div style="font-family: 'Space Mono', monospace; font-size: 1.25rem; font-weight: 800; color: ${isCompleted ? '#891A10' : '#714236'};">
                                    ${c.isBonus ? ('+' + c.score) : c.score} <span style="font-size: 0.8rem; font-weight: normal; color: #714236;">/ ${maxVal}</span>
                                </div>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #10b981;">
                                    Kontribusi: +${c.contrib} poin
                                </span>
                            </div>
                        </div>
                        <div class="lvl-bar-wrapper" style="height: 10px; background: #FAF6ED; border-radius: 999px; overflow: hidden; margin-top: 0.5rem; border: 1px solid #D8D4BC;">
                            <div class="lvl-bar-fill" style="width: ${barWidth}%; height: 100%; background: ${barColor}; border-radius: 999px; transition: width 0.6s ease;"></div>
                        </div>
                    </div>
                `;
            }).join('');

            // Presentation Rubric Notice
            html += `
                <div class="result-presentation-notice" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.85rem 1.25rem; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">📢</span>
                    <div style="font-size: 0.85rem; color: #714236; line-height: 1.5;">
                        <strong>Catatan Penilaian Pembelajaran Guru:</strong> Aspek <strong>Presentasi Kelompok (bobot 10%)</strong> dinilai secara manual oleh guru mata pelajaran melalui rubrik penilaian guru di luar sistem digital ini. Nilai akhir keseluruhan rapor siswa akan digabungkan secara manual oleh guru pengampu.
                    </div>
                </div>
            `;

            levelsGrid.innerHTML = html;
        }

        if (masteredList) {
            masteredList.innerHTML = analytics.mastered.length > 0 
                ? analytics.mastered.map(c => '<li><span class="check-icon" style="color: #10b981;">✓</span> <strong>' + c + '</strong></li>').join('')
                : '<li><span class="check-icon" style="color: #10b981;">✓</span> <strong>Prinsip LIFO &amp; FIFO</strong></li>';
        }

        if (practiceList) {
            practiceList.innerHTML = analytics.needsPractice.length > 0
                ? analytics.needsPractice.map(c => '<li><span class="warn-icon" style="color: #DC8236;">⚠️</span> <strong>' + c + '</strong></li>').join('')
                : '<li class="all-good-note" style="color: #10b981;">🎉 Seluruh indikator pembelajaran Stack &amp; Queue telah dikuasai dengan baik!</li>';
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
    // STUDENT PROFILE, PROGRESS & DIGITAL REPORT (RAPOR)
    // ----------------------------------------------------
    renderProfilePage() {
        if (!window.StorageManager || !window.ScoringSystem) return;

        const playerName = (window.Player && Player.getName && Player.getName()) || 'Peserta Didik';
        const playerClass = (window.Player && Player.getClass && Player.getClass()) || 'Kelas X.1';
        const playerAbsen = (window.Player && Player.getAbsen && Player.getAbsen()) || '';

        // 1. Hero Identity Banner
        const heroNameEl = document.getElementById('prof-hero-name');
        const heroClassEl = document.getElementById('prof-hero-class');
        const heroAbsenEl = document.getElementById('prof-hero-absen');

        if (heroNameEl) heroNameEl.textContent = playerName;
        if (heroClassEl) heroClassEl.textContent = playerClass;
        if (heroAbsenEl) heroAbsenEl.textContent = playerAbsen ? ('Absen: ' + playerAbsen) : 'Absen: -';

        // 2. Scores & Predicate
        const comp = ScoringSystem.getComponentScores();
        const finalScore = comp.finalScore; // Formula ND
        const predicate = ScoringSystem.getPredicate(finalScore);
        const isTuntas = finalScore >= 75;

        const scoreNumEl = document.getElementById('prof-digital-score-num');
        const predBadgeEl = document.getElementById('prof-predicate-badge');
        const kktpStatusEl = document.getElementById('prof-kktp-status-pill');

        if (scoreNumEl) scoreNumEl.textContent = finalScore;
        if (predBadgeEl) {
            predBadgeEl.textContent = predicate.text;
            predBadgeEl.style.backgroundColor = predicate.badgeColor || '#891A10';
        }
        if (kktpStatusEl) {
            if (isTuntas) {
                kktpStatusEl.textContent = '✓ TUNTAS KKTP (≥ 75)';
                kktpStatusEl.style.background = '#10b981';
                kktpStatusEl.style.color = '#FFFFFF';
            } else {
                kktpStatusEl.textContent = '⚠️ BELUM TUNTAS KKTP (< 75)';
                kktpStatusEl.style.background = '#891A10';
                kktpStatusEl.style.color = '#FFFFFF';
            }
        }

        // 3. Render 4 Components Grid
        const gridEl = document.getElementById('prof-components-grid');
        if (gridEl) {
            const formatHistoryBadges = (hist = [], best = 0) => {
                if (!hist || hist.length === 0) return '<span style="color: #714236; font-size: 0.78rem; font-style: italic;">Belum ada riwayat percobaan selesai</span>';
                return hist.map(h => {
                    const isBest = h.score === best && best > 0;
                    return '<span style="display: inline-block; background: ' + (isBest ? '#10b981' : '#FAF6ED') + '; color: ' + (isBest ? '#FFFFFF' : '#714236') + '; border: 1px solid ' + (isBest ? '#10b981' : '#D8D4BC') + '; padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.76rem; font-weight: 700; margin-right: 0.35rem; margin-bottom: 0.25rem;">P' + h.attempt + ': ' + h.score + ' pts' + (isBest ? ' ★' : '') + '</span>';
                }).join('');
            };

            const groupProject = StorageManager.getGroupProject ? StorageManager.getGroupProject() : null;
            const groupName = (groupProject && groupProject.groupName) ? groupProject.groupName : 'Tim Informatika';

            const compCardsData = [
                {
                    title: 'Tugas Individu (4 Level)',
                    badge: 'Bobot: 30%',
                    badgeBg: '#891A10',
                    score: comp.individual.score,
                    contrib: comp.individual.weightedContribution,
                    desc: 'Nilai terbaik dari maksimal 3 kesempatan pengerjaan mandiri bertingkat.',
                    attemptInfo: 'Percobaan ke-' + comp.individual.currentAttempt + ' dari 3',
                    historyHTML: formatHistoryBadges(comp.individual.history, comp.individual.score)
                },
                {
                    title: 'LKPD Kelompok (' + groupName + ')',
                    badge: 'Bobot: 35%',
                    badgeBg: '#E76814',
                    score: comp.groupProject.score,
                    contrib: comp.groupProject.weightedContribution,
                    desc: 'Nilai terbaik diskusi kelompok pemecahan masalah antrean kantin (PBL).',
                    attemptInfo: 'Percobaan ke-' + comp.groupProject.currentAttempt + ' dari 3',
                    historyHTML: formatHistoryBadges(comp.groupProject.history, comp.groupProject.score)
                },
                {
                    title: 'Evaluasi Akhir (HOTS)',
                    badge: 'Bobot: 35%',
                    badgeBg: '#714236',
                    score: comp.evaluation.score,
                    contrib: comp.evaluation.weightedContribution,
                    desc: 'Hasil asesmen sumatif mandiri 5 butir soal penalaran C4-C6 (KKTP: 75).',
                    attemptInfo: 'Asesmen Akhir Mandiri',
                    historyHTML: '<span style="color: #714236; font-size: 0.8rem; font-weight: 600;">Skor: ' + comp.evaluation.score + ' / 100 Poin</span>'
                },
                {
                    title: 'Bonus Praktik Mini-Lab',
                    badge: 'Maks +5 Pts',
                    badgeBg: '#10b981',
                    score: comp.miniLabBonus.score,
                    contrib: comp.miniLabBonus.contribution,
                    desc: 'Poin tambahan di luar bobot utama dari simulasi Push, Pop, Enqueue, Dequeue.',
                    attemptInfo: 'Praktik Operasi Mandiri',
                    historyHTML: '<span style="color: #10b981; font-size: 0.8rem; font-weight: 700;">+' + comp.miniLabBonus.score + ' Poin Tambahan</span>'
                }
            ];

            gridEl.innerHTML = compCardsData.map(c => {
                return '<div style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">' +
                    '<div>' +
                        '<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.6rem;">' +
                            '<h4 style="font-family: var(--font-heading); color: #891A10; margin: 0; font-size: 1.05rem; font-weight: 700;">' + c.title + '</h4>' +
                            '<span style="background: ' + c.badgeBg + '; color: #FFFFFF; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; white-space: nowrap; font-family: Space Mono, monospace;">' + c.badge + '</span>' +
                        '</div>' +
                        '<p style="color: #714236; font-size: 0.82rem; margin: 0 0 0.85rem 0; line-height: 1.4;">' + c.desc + '</p>' +
                        '<div style="background: #FAF6ED; border: 1px solid #D8D4BC; border-radius: 8px; padding: 0.65rem 0.85rem; margin-bottom: 0.85rem;">' +
                            '<div style="display: flex; justify-content: space-between; align-items: baseline;">' +
                                '<span style="font-size: 0.8rem; color: #714236;">Nilai Komponen:</span>' +
                                '<strong style="font-size: 1.3rem; font-family: Space Mono, monospace; color: #891A10;">' + c.score + '</strong>' +
                            '</div>' +
                            '<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.2rem; border-top: 1px dashed #D8D4BC; padding-top: 0.35rem;">' +
                                '<span style="font-size: 0.78rem; color: #714236;">Kontribusi ke ND:</span>' +
                                '<strong style="font-size: 0.95rem; font-family: Space Mono, monospace; color: #E76814;">+' + c.contrib + ' Poin</strong>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-size: 0.75rem; font-weight: 700; color: #714236; margin-bottom: 0.3rem;">' + c.attemptInfo + ':</div>' +
                        '<div>' + c.historyHTML + '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        // 4. Learning Stages Progress Table (8 Stages of PBL)
        const pageScores = StorageManager.data.pageScores || {};
        const indAtt = StorageManager.getIndividualAttempts ? StorageManager.getIndividualAttempts() : { bestScore: 0, currentAttempt: 1 };
        const groupAtt = StorageManager.getGroupAttempts ? StorageManager.getGroupAttempts() : { bestScore: 0, currentAttempt: 1 };
        const miniLabOps = StorageManager.data.miniLabOps || {};
        let miniLabCount = 0;
        if (miniLabOps.stackPush) miniLabCount++;
        if (miniLabOps.stackPop) miniLabCount++;
        if (miniLabOps.queueEnqueue) miniLabCount++;
        if (miniLabOps.queueDequeue) miniLabCount++;

        const stages = [
            {
                num: 1,
                name: '🌱 Pemahaman Awal (Berpikir Komputasional)',
                target: 'learn-intro',
                desc: 'Pengenalan 4 pilar CT (Dekomposisi, Pola, Abstraksi, Algoritma) & stimulus kantin.',
                isDone: !!(pageScores['learn-intro'] || StorageManager.data.introCompleted),
                detail: (pageScores['learn-intro'] && pageScores['learn-intro'].score > 0) ? (pageScores['learn-intro'].score + ' pts') : 'Materi Selesai'
            },
            {
                num: 2,
                name: '📚 Materi Belajar Stack (LIFO)',
                target: 'learn-stack',
                desc: 'Prinsip tumpukan piring kantin, 4 operasi dasar (Push, Pop, Peek, Status), infografis & video.',
                isDone: !!(pageScores['learn-stack'] && pageScores['learn-stack'].score > 0),
                detail: (pageScores['learn-stack'] && pageScores['learn-stack'].score > 0) ? ('Kuis Formatif: ' + pageScores['learn-stack'].score + ' pts') : 'Belum Selesai'
            },
            {
                num: 3,
                name: '👥 Materi Belajar Queue (FIFO)',
                target: 'learn-queue',
                desc: 'Prinsip antrean kasir kantin, 4 operasi dasar (Enqueue, Dequeue, Front, Status), infografis & video.',
                isDone: !!(pageScores['learn-queue'] && pageScores['learn-queue'].score > 0),
                detail: (pageScores['learn-queue'] && pageScores['learn-queue'].score > 0) ? ('Kuis Formatif: ' + pageScores['learn-queue'].score + ' pts') : 'Belum Selesai'
            },
            {
                num: 4,
                name: '🧪 Praktik Simulasi Mini-Lab',
                target: 'learn-stack',
                desc: 'Eksplorasi operasional Stack & Queue (Push, Pop, Enqueue, Dequeue) menghasilkan bonus nilai.',
                isDone: miniLabCount >= 4,
                detail: miniLabCount + '/4 Operasi (Bonus +' + comp.miniLabBonus.score + ' pts)'
            },
            {
                num: 5,
                name: '🎯 Tugas Individu (4 Level Studi Kasus)',
                target: 'individual-tasks',
                desc: 'Penyelidikan mandiri 4 level: Konsep Dasar, Antrean Kasir, Tumpukan Piring, Tracing & Rekayasa.',
                isDone: indAtt.bestScore > 0,
                detail: indAtt.bestScore > 0 ? ('Terbaik: ' + indAtt.bestScore + ' pts (Percobaan ' + indAtt.currentAttempt + '/3)') : 'Belum Dikerjakan'
            },
            {
                num: 6,
                name: '🤝 LKPD Kelompok (PBL Kasus Riil)',
                target: 'group-project',
                desc: 'Diskusi 6 anggota tim, analisis masalah kantin sekolah, soal HOTS C4-C6, & solusi algoritmik.',
                isDone: groupAtt.bestScore > 0,
                detail: groupAtt.bestScore > 0 ? ('Terbaik: ' + groupAtt.bestScore + ' pts (Percobaan ' + groupAtt.currentAttempt + '/3)') : 'Belum Dikerjakan'
            },
            {
                num: 7,
                name: '📝 Evaluasi Akhir (Asesmen Sumatif)',
                target: 'evaluation',
                desc: 'Uji pemahaman komprehensif mandiri 5 butir soal HOTS berbasis kasus nyata (KKTP: 75).',
                isDone: !!(pageScores['evaluation'] && pageScores['evaluation'].score !== undefined && pageScores['evaluation'].score > 0),
                detail: (pageScores['evaluation'] && pageScores['evaluation'].score !== undefined) ? ('Skor: ' + pageScores['evaluation'].score + ' pts') : 'Belum Dikerjakan'
            },
            {
                num: 8,
                name: '🪞 Refleksi Individu (Metakognitif 3-2-1)',
                target: 'reflection',
                desc: 'Sintaks 5 PBL: Analisis & evaluasi pengalaman belajar (3 hal dipahami, 2 menarik, 1 ditanyakan).',
                isDone: !!(pageScores['reflection'] || StorageManager.data.reflectionAnswers),
                detail: (pageScores['reflection'] || StorageManager.data.reflectionAnswers) ? '✓ Refleksi Terisi' : 'Belum Mengisi'
            }
        ];

        const completedCount = stages.filter(s => s.isDone).length;
        const progressPct = Math.round((completedCount / stages.length) * 100);

        // Update progress indicators
        const progTextEl = document.getElementById('prof-progress-pct-text');
        const progFillEl = document.getElementById('prof-progress-bar-fill');
        const stagesBadgeEl = document.getElementById('prof-stages-completed-badge');

        if (progTextEl) progTextEl.textContent = progressPct + '% Tuntas (' + completedCount + ' dari 8 Tahapan)';
        if (progFillEl) progFillEl.style.width = progressPct + '%';
        if (stagesBadgeEl) stagesBadgeEl.textContent = completedCount + ' dari ' + stages.length + ' Tahapan Selesai';

        const tableContainerEl = document.getElementById('prof-stages-table-container');
        if (tableContainerEl) {
            tableContainerEl.innerHTML = '<table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 10px; overflow: hidden;">' +
                '<thead>' +
                    '<tr style="background: #FAF6ED; border-bottom: 2px solid #D8D4BC; color: #714236; text-align: left;">' +
                        '<th style="padding: 0.75rem 1rem; width: 60px;">No</th>' +
                        '<th style="padding: 0.75rem 1rem;">Tahapan Pembelajaran PBL</th>' +
                        '<th style="padding: 0.75rem 1rem;">Status & Capaian Nilai</th>' +
                        '<th style="padding: 0.75rem 1rem; text-align: center; width: 110px;">Aksi</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' +
                    stages.map((st, sIdx) => {
                        const statusPill = st.isDone
                            ? '<span style="display: inline-block; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd; font-weight: 700; font-size: 0.76rem; padding: 0.2rem 0.6rem; border-radius: 999px;">✓ Tuntas: ' + st.detail + '</span>'
                            : '<span style="display: inline-block; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-weight: 700; font-size: 0.76rem; padding: 0.2rem 0.6rem; border-radius: 999px;">⏳ Belum Tuntas</span>';

                        return '<tr style="border-bottom: 1px solid #e2e8f0; ' + (sIdx % 2 === 1 ? 'background: #FAF8F5;' : '') + '">' +
                            '<td style="padding: 0.75rem 1rem; font-family: Space Mono, monospace; font-weight: 700; color: #891A10;">#' + st.num + '</td>' +
                            '<td style="padding: 0.75rem 1rem;">' +
                                '<div style="font-weight: 700; color: #891A10; margin-bottom: 0.15rem;">' + st.name + '</div>' +
                                '<div style="font-size: 0.8rem; color: #714236;">' + st.desc + '</div>' +
                            '</td>' +
                            '<td style="padding: 0.75rem 1rem;">' + statusPill + '</td>' +
                            '<td style="padding: 0.75rem 1rem; text-align: center;">' +
                                '<button type="button" class="btn btn-outline btn-sm" onclick="UI.switchScreen(\'' + st.target + '\')" style="font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 8px; border: 1.5px solid #891A10; color: #891A10; background: #FFFFFF; cursor: pointer;">' +
                                    'Buka ➔' +
                                '</button>' +
                            '</td>' +
                        '</tr>';
                    }).join('') +
                '</tbody>' +
            '</table>';
        }
    },

    // ----------------------------------------------------
    // BUILD OFFICIAL PROFILE & PROGRESS REPORT HTML
    // ----------------------------------------------------
    buildProfileReportHTML(forWordDoc = false) {
        const playerName = (window.Player && Player.getName && Player.getName()) || 'Peserta Didik';
        const playerClass = (window.Player && Player.getClass && Player.getClass()) || 'Kelas X.1';
        const playerAbsen = (window.Player && Player.getAbsen && Player.getAbsen()) || '-';
        const printDate = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        const comp = (window.ScoringSystem && ScoringSystem.getComponentScores)
            ? ScoringSystem.getComponentScores()
            : { finalScore: 0, individual: { score: 0, weightedContribution: 0, history: [] }, groupProject: { score: 0, weightedContribution: 0, history: [] }, evaluation: { score: 0, weightedContribution: 0 }, miniLabBonus: { score: 0, contribution: 0 } };
        
        const predicate = (window.ScoringSystem && ScoringSystem.getPredicate)
            ? ScoringSystem.getPredicate(comp.finalScore)
            : { text: 'Perlu Belajar Lagi (E)', class: '' };

        const isTuntas = comp.finalScore >= 75;

        const groupProject = (window.StorageManager && StorageManager.getGroupProject) ? StorageManager.getGroupProject() : null;
        const groupName = (groupProject && groupProject.groupName) ? groupProject.groupName : 'Kelompok Informatika';
        const membersList = (groupProject && groupProject.members && groupProject.members.length > 0)
            ? groupProject.members.map(m => typeof m === 'object' ? (m.name || '') : m).filter(Boolean).join(', ')
            : '-';

        const pageScores = (window.StorageManager && StorageManager.data && StorageManager.data.pageScores) ? StorageManager.data.pageScores : {};
        const miniLabOps = (window.StorageManager && StorageManager.data && StorageManager.data.miniLabOps) ? StorageManager.data.miniLabOps : {};
        let miniLabCount = 0;
        if (miniLabOps.stackPush) miniLabCount++;
        if (miniLabOps.stackPop) miniLabCount++;
        if (miniLabOps.queueEnqueue) miniLabCount++;
        if (miniLabOps.queueDequeue) miniLabCount++;

        const stages = [
            { name: '1. Pemahaman Awal (Berpikir Komputasional)', done: !!(pageScores['learn-intro'] || (StorageManager.data && StorageManager.data.introCompleted)), detail: (pageScores['learn-intro'] && pageScores['learn-intro'].score > 0) ? (pageScores['learn-intro'].score + ' pts') : 'Tuntas Dibaca' },
            { name: '2. Materi Belajar Stack (LIFO & Hands-on)', done: !!(pageScores['learn-stack'] && pageScores['learn-stack'].score > 0), detail: (pageScores['learn-stack'] && pageScores['learn-stack'].score > 0) ? ('Formatif: ' + pageScores['learn-stack'].score + ' pts') : 'Belum Kuis' },
            { name: '3. Materi Belajar Queue (FIFO & Hands-on)', done: !!(pageScores['learn-queue'] && pageScores['learn-queue'].score > 0), detail: (pageScores['learn-queue'] && pageScores['learn-queue'].score > 0) ? ('Formatif: ' + pageScores['learn-queue'].score + ' pts') : 'Belum Kuis' },
            { name: '4. Praktik Simulasi Mini-Lab (Operasi Dasar)', done: miniLabCount >= 4, detail: miniLabCount + '/4 Operasi Selesai (+' + comp.miniLabBonus.score + ' pts)' },
            { name: '5. Tugas Individu (4 Level Studi Kasus)', done: comp.individual.score > 0, detail: 'Terbaik: ' + comp.individual.score + ' pts' },
            { name: '6. LKPD Kelompok (PBL Kasus Riil)', done: comp.groupProject.score > 0, detail: 'Terbaik: ' + comp.groupProject.score + ' pts (' + groupName + ')' },
            { name: '7. Evaluasi Akhir (5 Soal HOTS C4-C6)', done: !!(pageScores['evaluation'] && pageScores['evaluation'].score > 0), detail: (pageScores['evaluation'] && pageScores['evaluation'].score !== undefined) ? ('Skor: ' + pageScores['evaluation'].score + ' pts') : 'Belum Dikerjakan' },
            { name: '8. Refleksi Individu (Metakognitif 3-2-1)', done: !!(pageScores['reflection'] || (StorageManager.data && StorageManager.data.reflectionAnswers)), detail: (pageScores['reflection'] || (StorageManager.data && StorageManager.data.reflectionAnswers)) ? '✓ Refleksi Terisi' : 'Belum Mengisi' }
        ];

        const completedCount = stages.filter(s => s.done).length;
        const progressPct = Math.round((completedCount / stages.length) * 100);

        const formatHistoryText = (hist = [], best = 0) => {
            if (!hist || hist.length === 0) return 'Belum ada percobaan selesai';
            return hist.map(h => 'Percobaan ' + h.attempt + ': ' + h.score + ' pts' + (h.score === best ? ' (Nilai Terbaik)' : '')).join(' | ');
        };

        const indHistoryStr = formatHistoryText(comp.individual.history, comp.individual.score);
        const groupHistoryStr = formatHistoryText(comp.groupProject.history, comp.groupProject.score);

        return '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
                '<meta charset="utf-8">' +
                '<title>Rapor Nilai Siswa - ' + playerName + '</title>' +
                '<style>' +
                    'body { font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.45; color: #000000; margin: 20px; }' +
                    '.report-kop { text-align: center; border-bottom: 2.5px double #000000; padding-bottom: 8px; margin-bottom: 16px; }' +
                    '.report-kop h2 { margin: 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }' +
                    '.report-kop h3 { margin: 3px 0; font-size: 12pt; text-transform: uppercase; }' +
                    '.report-kop p { margin: 2px 0; font-size: 9.5pt; font-style: italic; }' +
                    '.meta-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10.5pt; }' +
                    '.meta-table td { padding: 4px 6px; }' +
                    '.section-title { font-size: 11.5pt; font-weight: bold; text-transform: uppercase; margin: 12px 0 6px 0; border-bottom: 1px solid #000000; padding-bottom: 2px; }' +
                    '.data-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10pt; }' +
                    '.data-table th, .data-table td { border: 1px solid #000000; padding: 5px 7px; text-align: left; }' +
                    '.data-table th { background-color: #f2f2f2; text-align: center; font-weight: bold; }' +
                    '.score-highlight { font-size: 13pt; font-weight: bold; color: #000000; text-align: center; }' +
                    '.note-box { border: 1px solid #333333; background-color: #fafafa; padding: 6px 10px; font-size: 9.5pt; margin-bottom: 14px; }' +
                    '.signature-table { width: 100%; border-collapse: collapse; margin-top: 25px; page-break-inside: avoid; }' +
                    '.signature-table td { width: 50%; text-align: center; vertical-align: top; font-size: 10.5pt; }' +
                '</style>' +
            '</head>' +
            '<body>' +
                '<div class="report-kop">' +
                    '<h2>LEMBAR RAPOR HASIL BELAJAR DIGITAL SISWA</h2>' +
                    '<h3>MATA PELAJARAN INFORMATIKA • FASE E (SMA KELAS X)</h3>' +
                    '<p>Media Pembelajaran: NalarQuest – Computational Thinking: Stack dan Queue (Problem-Based Learning 2 JP / 90 Menit)</p>' +
                '</div>' +

                '<table class="meta-table">' +
                    '<tr>' +
                        '<td style="width: 20%; font-weight: bold;">Nama Peserta Didik</td>' +
                        '<td style="width: 40%;">: ' + playerName + '</td>' +
                        '<td style="width: 18%; font-weight: bold;">Mata Pelajaran</td>' +
                        '<td style="width: 22%;">: Informatika</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td style="font-weight: bold;">Kelas</td>' +
                        '<td>: ' + playerClass + '</td>' +
                        '<td style="font-weight: bold;">Materi Pokok</td>' +
                        '<td>: Stack &amp; Queue (CT)</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td style="font-weight: bold;">Nomor Absen</td>' +
                        '<td>: ' + playerAbsen + '</td>' +
                        '<td style="font-weight: bold;">Tanggal Cetak</td>' +
                        '<td>: ' + printDate + '</td>' +
                    '</tr>' +
                '</table>' +

                '<div class="section-title">I. REKAPITULASI NILAI AKHIR DIGITAL (ND)</div>' +
                '<table class="data-table">' +
                    '<tr>' +
                        '<th style="width: 35%;">Nilai Akhir Digital (ND)</th>' +
                        '<th style="width: 30%;">Predikat Kelulusan</th>' +
                        '<th style="width: 35%;">Ketercapaian KKTP (Minimal 75)</th>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="score-highlight">' + comp.finalScore + ' / 100 Poin</td>' +
                        '<td style="text-align: center; font-weight: bold; font-size: 11pt;">' + predicate.text + '</td>' +
                        '<td style="text-align: center; font-weight: bold; font-size: 11pt;">' + (isTuntas ? 'TUNTAS KKTP (≥ 75)' : 'BELUM TUNTAS KKTP (< 75)') + '</td>' +
                    '</tr>' +
                '</table>' +

                '<div class="note-box">' +
                    '<strong>Rumus Pembobotan Nilai Digital:</strong> ND = min(100, round((Individu × 30%) + (LKPD × 35%) + (Evaluasi × 35%) + Bonus Mini-Lab))<br>' +
                    '<strong>Catatan Penting Guru:</strong> Penilaian Presentasi Kelompok (10%) dilakukan secara terpisah melalui rubrik observasi presentasi kelas langsung oleh guru.' +
                '</div>' +

                '<div class="section-title">II. RINCIAN KOMPONEN PEMBOBOTAN ASESMEN</div>' +
                '<table class="data-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 5%;">No</th>' +
                            '<th style="width: 35%;">Komponen Penilaian</th>' +
                            '<th style="width: 12%;">Bobot</th>' +
                            '<th style="width: 15%;">Nilai Komponen</th>' +
                            '<th style="width: 15%;">Kontribusi Nilai</th>' +
                            '<th style="width: 18%;">Keterangan / Percobaan</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td style="text-align: center;">1</td>' +
                            '<td><strong>Tugas Individu (4 Level)</strong><br><small style="color: #444;">' + indHistoryStr + '</small></td>' +
                            '<td style="text-align: center;">30%</td>' +
                            '<td style="text-align: center; font-weight: bold;">' + comp.individual.score + '</td>' +
                            '<td style="text-align: center;">+' + comp.individual.weightedContribution + ' Poin</td>' +
                            '<td style="text-align: center;">Percobaan ' + comp.individual.currentAttempt + ' dari 3</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td style="text-align: center;">2</td>' +
                            '<td><strong>LKPD Kelompok (' + groupName + ')</strong><br><small style="color: #444;">Anggota: ' + membersList + '<br>' + groupHistoryStr + '</small></td>' +
                            '<td style="text-align: center;">35%</td>' +
                            '<td style="text-align: center; font-weight: bold;">' + comp.groupProject.score + '</td>' +
                            '<td style="text-align: center;">+' + comp.groupProject.weightedContribution + ' Poin</td>' +
                            '<td style="text-align: center;">Percobaan ' + comp.groupProject.currentAttempt + ' dari 3</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td style="text-align: center;">3</td>' +
                            '<td><strong>Evaluasi Akhir (Asesmen Sumatif 5 Soal HOTS)</strong><br><small style="color: #444;">Penguasaan konsep individu (C4-C6)</small></td>' +
                            '<td style="text-align: center;">35%</td>' +
                            '<td style="text-align: center; font-weight: bold;">' + comp.evaluation.score + '</td>' +
                            '<td style="text-align: center;">+' + comp.evaluation.weightedContribution + ' Poin</td>' +
                            '<td style="text-align: center;">Asesmen Akhir</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td style="text-align: center;">4</td>' +
                            '<td><strong>Bonus Mini-Lab (Stack &amp; Queue)</strong><br><small style="color: #444;">Penyelesaian 4 operasi dasar (Push, Pop, Enqueue, Dequeue)</small></td>' +
                            '<td style="text-align: center;">+5 Pts</td>' +
                            '<td style="text-align: center; font-weight: bold;">+' + comp.miniLabBonus.score + '</td>' +
                            '<td style="text-align: center;">+' + comp.miniLabBonus.contribution + ' Poin</td>' +
                            '<td style="text-align: center;">' + miniLabCount + '/4 Operasi</td>' +
                        '</tr>' +
                        '<tr style="background-color: #f9f9f9; font-weight: bold;">' +
                            '<td colspan="2" style="text-align: right;">TOTAL NILAI DIGITAL AKHIR (ND):</td>' +
                            '<td style="text-align: center;">100%</td>' +
                            '<td colspan="2" style="text-align: center; font-size: 11pt;">' + comp.finalScore + ' / 100 Poin</td>' +
                            '<td style="text-align: center;">' + predicate.text + '</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +

                '<div class="section-title">III. CEK PROGRES TAHAPAN PEMBELAJARAN (PROBLEM-BASED LEARNING)</div>' +
                '<table class="data-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 6%;">No</th>' +
                            '<th style="width: 54%;">Tahapan Aktivitas Pembelajaran</th>' +
                            '<th style="width: 20%;">Status Capaian</th>' +
                            '<th style="width: 20%;">Catatan Nilai</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        stages.map((st, idx) => {
                            return '<tr>' +
                                '<td style="text-align: center;">' + (idx + 1) + '</td>' +
                                '<td>' + st.name + '</td>' +
                                '<td style="text-align: center; font-weight: bold;">' + (st.done ? '✓ Tuntas' : 'Belum Tuntas') + '</td>' +
                                '<td style="text-align: center;">' + st.detail + '</td>' +
                            '</tr>';
                        }).join('') +
                        '<tr style="background-color: #f2f2f2; font-weight: bold;">' +
                            '<td colspan="2" style="text-align: right;">Total Kemajuan Belajar:</td>' +
                            '<td colspan="2" style="text-align: center;">' + completedCount + ' dari 8 Tahapan (' + progressPct + '% Tuntas)</td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +

                '<table class="signature-table">' +
                    '<tr>' +
                        '<td>' +
                            'Mengetahui,<br>Peserta Didik<br><br><br><br>' +
                            '<strong>(' + playerName + ')</strong><br>' +
                            'NIS / Absen: ' + playerAbsen +
                        '</td>' +
                        '<td>' +
                            'Guru Mata Pelajaran Informatika<br><br><br><br><br>' +
                            '<strong>(______________________________)</strong><br>' +
                            'NIP. ........................................' +
                        '</td>' +
                    '</tr>' +
                '</table>' +
            '</body>' +
            '</html>';
    },

    downloadProfileWordReport() {
        try {
            const playerName = (window.Player && Player.getName && Player.getName()) || 'Peserta_Didik';
            const playerClass = (window.Player && Player.getClass && Player.getClass()) || 'Kelas_X';
            const cleanName = playerName.replace(/[^\w\d-_]/g, '_');
            const cleanClass = playerClass.replace(/[^\w\d-_]/g, '_');

            const docHTML = this.buildProfileReportHTML(true);
            const blob = new Blob(['\ufeff' + docHTML], {
                type: 'application/msword;charset=utf-8'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Rapor_Nilai_${cleanName}_${cleanClass}.doc`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(url);
            }, 1500);

            if (window.UI) {
                UI.showToast(`📄 Rapor Nilai Word (.doc) "${playerName}" berhasil diunduh!`);
            }
        } catch (e) {
            console.error("Gagal mengunduh rapor Word:", e);
            alert("Terjadi kendala saat mengunduh berkas rapor. Silakan gunakan tombol Cetak PDF.");
        }
    },

    printProfileReport() {
        let printDoc = document.getElementById('profile-print-document');
        if (!printDoc) {
            printDoc = document.createElement('div');
            printDoc.id = 'profile-print-document';
            printDoc.className = 'profile-print-only';
            document.body.appendChild(printDoc);
        }

        printDoc.innerHTML = this.buildProfileReportHTML(false);
        document.body.classList.add('printing-profile-report');

        if (window.UI) {
            UI.showToast("📑 Menyiapkan Rapor Nilai... Pada jendela cetak, pilih 'Simpan sebagai PDF' (Save as PDF).");
        }

        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing-profile-report');
            }, 1000);
        }, 300);
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
