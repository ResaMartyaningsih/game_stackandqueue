/**
 * ui.js
 * User Interface Controller, World Map Renderer, Modal Coordinator, and Kiko Character
 */

const UI = {
    currentScreen: 'home',

    init() {
        this.bindEvents();
        this.renderWorldMap();
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

    switchScreen(screenId) {
        // Play click sound
        if (window.SoundManager) {
            SoundManager.play('click');
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

        // Highlight active nav links
        document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
            if (link.getAttribute('data-screen-target') === screenId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger screen specific lifecycle
        this.onScreenActivated(screenId);
    },

    onScreenActivated(screenId) {
        if (screenId === 'home') {
            this.renderWorldMap();
            if (window.Player) Player.updatePlayerUI();
            this.setKikoDialogue(t('kikoGreeting'));
        } else if (screenId === 'learn-stack') {
            this.setKikoDialogue(t('kikoStackTip'));
        } else if (screenId === 'learn-queue') {
            this.setKikoDialogue(t('kikoQueueTip'));
        } else if (screenId === 'achievements') {
            if (window.AchievementsManager) AchievementsManager.renderAchievementsGrid();
        } else if (screenId === 'result') {
            this.renderFinalResult();
        }
    },

    // ----------------------------------------------------
    // WORLD MAP RENDERING
    // ----------------------------------------------------
    renderWorldMap() {
        const mapContainer = document.getElementById('world-map-nodes');
        if (!mapContainer || !window.LevelsManager) return;

        const levels = LevelsManager.getAllLevels();
        const scores = window.StorageManager ? StorageManager.getAllLevelScores() : {};

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

    showLevelCompleteModal(levelId, score) {
        if (window.SoundManager) SoundManager.play('levelComplete');

        const modal = document.getElementById('level-complete-modal');
        const titleEl = document.getElementById('complete-level-title');
        const scoreEl = document.getElementById('complete-level-score');
        if (!modal) return;

        if (titleEl) titleEl.textContent = `Level ${levelId} Selesai!`;
        if (scoreEl) scoreEl.textContent = `${score} / 100`;

        modal.classList.add('active');
        this.setKikoDialogue(t('kikoCompleteLevel'), 'cheering');
        this.renderWorldMap();
    },

    closeCompleteModal() {
        const modal = document.getElementById('level-complete-modal');
        if (modal) modal.classList.remove('active');
        this.switchScreen('home');
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
            levelsGrid.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(num => {
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
    // REVIEW ANSWERS MODAL
    // ----------------------------------------------------
    openReviewAnswersModal(filter = 'all') {
        const modal = document.getElementById('review-answers-modal');
        const container = document.getElementById('review-list-container');
        if (!modal || !container) return;

        const logs = window.StorageManager ? StorageManager.getAnswersLog() : [];
        let filtered = logs;
        if (filter === 'correct') {
            filtered = logs.filter(l => l.isCorrect);
        } else if (filter === 'wrong') {
            filtered = logs.filter(l => !l.isCorrect);
        }

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state">${t('noQuestionsAnsweredYet')}</div>`;
        } else {
            container.innerHTML = filtered.map((item, idx) => `
                <div class="review-item-card ${item.isCorrect ? 'correct-entry' : 'wrong-entry'}">
                    <div class="review-item-header">
                        <span class="review-q-num">#${idx + 1} (${item.concept})</span>
                        <span class="review-status-tag ${item.isCorrect ? 'tag-correct' : 'tag-wrong'}">
                            ${item.isCorrect ? '✓ Benar' : '✕ Perlu Koreksi'}
                        </span>
                    </div>
                    <h4 class="review-question-title">${item.question}</h4>
                    <div class="review-answers-box">
                        <p><strong>${t('yourAnswer')}</strong> <span class="${item.isCorrect ? 'text-success' : 'text-danger'}">${item.userAnswer}</span></p>
                        ${!item.isCorrect ? `<p><strong>${t('correctAnswerIs')}</strong> <span class="text-success">${item.correctAnswer}</span></p>` : ''}
                    </div>
                    <div class="review-explanation">
                        <strong>💡 ${t('explanationTitle')}</strong> ${item.explanation}
                    </div>
                </div>
            `).join('');
        }

        modal.classList.add('active');
    },

    closeReviewModal() {
        const modal = document.getElementById('review-answers-modal');
        if (modal) modal.classList.remove('active');
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
