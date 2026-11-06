const fs = require('fs');

let pbl = fs.readFileSync('js/pbl-academic.js', 'utf8').replace(/\r\n/g, '\n');

// Find renderTaskLevel definition in js/pbl-academic.js
const rStart = pbl.indexOf('// ----------------------------------------------------');
const indMgrStart = pbl.indexOf('// INDIVIDUAL TASKS MANAGER', rStart);
const funcStart = pbl.indexOf('renderTaskLevel(lvl) {', indMgrStart);
const funcEnd = pbl.indexOf('// ----------------------------------------------------', funcStart);

if (funcStart === -1 || funcEnd === -1) {
  console.error('Individual tasks manager bounds not found!');
  process.exit(1);
}

const newIndividualManagerCode = `renderIndividualAttemptTracker() {
        if (!window.StorageManager || !StorageManager.getIndividualAttempts) return;
        const att = StorageManager.getIndividualAttempts();
        const textEl = document.getElementById('individual-attempt-text');
        const pillsEl = document.getElementById('individual-attempt-pills');
        const bestEl = document.getElementById('individual-best-score-badge');
        const retryBtn = document.getElementById('individual-retry-btn');

        if (textEl) {
            textEl.textContent = \`Kesempatan pengerjaan: \${att.currentAttempt} dari 3\`;
        }

        if (pillsEl) {
            let pillsHtml = '';
            for (let i = 1; i <= 3; i++) {
                const hist = (att.history || []).find(h => h.attempt === i);
                const isCurrent = (att.currentAttempt === i);
                if (hist) {
                    pillsHtml += \`<span class="attempt-pill completed" style="background: #10b981; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">✓ P\${i}: \${hist.score} pts</span>\`;
                } else if (isCurrent) {
                    pillsHtml += \`<span class="attempt-pill active" style="background: #891A10; color: #fff; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 700;">● P\${i} (Aktif)</span>\`;
                } else {
                    pillsHtml += \`<span class="attempt-pill pending" style="background: #FAF6ED; border: 1px solid #D8D4BC; color: #714236; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.78rem;">○ P\${i}</span>\`;
                }
            }
            pillsEl.innerHTML = pillsHtml;
        }

        if (bestEl) {
            bestEl.textContent = \`🏆 Nilai Terbaik: \${att.bestScore || 0} pts\`;
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
        if (scenarioEl) scenarioEl.textContent = \`"\${taskData.scenario}"\`;
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

                    return \`
                        <button type="button" class="academic-option-btn \${extraClass}" disabled style="cursor: not-allowed; opacity: \${isChosen || isCorrect ? '1' : '0.65'};">
                            <span class="option-letter">\${String.fromCharCode(65 + idx)}</span>
                            <span style="flex: 1; text-align: left;">\${opt.substring(3)}</span>
                            \${lockTag}
                        </button>
                    \`;
                }).join('');
            }

            // Show feedback with explanation & locked notice
            if (feedbackEl) {
                feedbackEl.className = \`academic-feedback-box show \${lockedInfo.isCorrect ? 'correct' : 'wrong'}\`;
                feedbackEl.innerHTML = \`
                    <div style="font-size: 0.82rem; background: rgba(0,0,0,0.06); padding: 0.35rem 0.65rem; border-radius: 6px; margin-bottom: 0.5rem; font-weight: 700;">
                        🔒 Jawaban Level \${lvl} Terkunci pada Percobaan ke-\${att.currentAttempt} (Tidak dapat diubah terpisah)
                    </div>
                    <strong>\${lockedInfo.isCorrect ? '✓ Jawaban Tepat!' : '⚠️ Perlu Koreksi:'}</strong> \${taskData.explanation}
                \`;
            }

            // Show Next Button
            if (nextBtn) {
                nextBtn.style.display = 'inline-flex';
                if (this.currentTaskLevel < 4) {
                    nextBtn.textContent = \`Lanjut ke Level \${this.currentTaskLevel + 1} ➔\`;
                    nextBtn.onclick = () => PBLAcademic.goToNextTaskLevel();
                } else {
                    nextBtn.textContent = '🎉 Semua 4 Level Tuntas! Buka Tugas Kelompok ➔';
                    nextBtn.onclick = () => UI.switchScreen('group-project');
                }
            }
        } else {
            // Render options as interactive single-choice (Auto-Lock on select)
            if (optionsContainer) {
                optionsContainer.innerHTML = taskData.options.map((opt, idx) => \`
                    <button type="button" class="academic-option-btn" onclick="PBLAcademic.selectTaskOption(\${idx})">
                        <span class="option-letter">\${String.fromCharCode(65 + idx)}</span>
                        <span>\${opt.substring(3)}</span>
                    </button>
                \`).join('');
            }
        }

        // Render Interactive Game / Simulation for this Level
        this.renderInteractiveTaskGame(lvl);
    },

    selectTaskOption(idx) {
        if (!window.StorageManager || !StorageManager.saveIndividualTaskLock) return;
        const att = StorageManager.getIndividualAttempts();
        if (att.lockedTasks && att.lockedTasks[this.currentTaskLevel]?.isLocked) {
            return; // Already locked!
        }

        const taskData = this.individualTasks.find(t => t.level === this.currentTaskLevel);
        if (!taskData) return;

        this.selectedTaskOption = idx;
        const isCorrect = (idx === taskData.correct);

        // Immediate answer lock
        const lockResult = StorageManager.saveIndividualTaskLock(this.currentTaskLevel, idx, isCorrect);

        if (window.SoundManager) {
            SoundManager.play(isCorrect ? 'levelComplete' : 'wrong');
        }

        // Re-render level UI with locked state
        this.renderTaskLevel(this.currentTaskLevel);
        this.updateTaskChipsState();

        if (window.UI) {
            if (isCorrect) {
                UI.showToast(\`🔒 Jawaban Level \${this.currentTaskLevel} Terkunci: Tepat Sekali! (+25 Poin)\`);
            } else {
                UI.showToast(\`🔒 Jawaban Level \${this.currentTaskLevel} Terkunci: Kurang Tepat. Pelajari pembahasannya!\`);
            }

            if (lockResult && lockResult.isAllLocked) {
                UI.showToast(\`🎉 SELAMAT! Seluruh 4 Level selesai pada Percobaan ke-\${att.currentAttempt}! Nilai: \${lockResult.currentScore}/100 Poin.\`);
            }
        }
    },

    showTaskResultUI(chosenIndex, isCorrect, taskData) {
        // Fallback for rendering result UI
        this.renderTaskLevel(this.currentTaskLevel);
    },

    goToNextTaskLevel() {
        if (this.currentTaskLevel < 4) {
            this.renderTaskLevel(this.currentTaskLevel + 1);
            window.scrollTo({ top: 300, behavior: 'smooth' });
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
            progressLabel.textContent = \`\${completedCount} dari 4 Level Selesai (\${Math.round((completedCount/4)*100)}%)\`;
        }
    },

    restoreTaskProgress() {
        this.updateTaskChipsState();
        this.renderIndividualAttemptTracker();
    },
`;

pbl = pbl.substring(0, funcStart) + newIndividualManagerCode + '\n    ' + pbl.substring(funcEnd);
console.log('Updated individual task manager in js/pbl-academic.js!');

fs.writeFileSync('js/pbl-academic.js', pbl, 'utf8');
console.log('Successfully written updated js/pbl-academic.js!');

