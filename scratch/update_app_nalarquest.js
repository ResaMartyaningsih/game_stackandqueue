const fs = require('fs');

let app = fs.readFileSync('js/app.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Add attempt tracker methods to App
const trackerMethods = `
    // ----------------------------------------------------
    // LKPD GROUP ATTEMPT TRACKER & RETRY SYSTEM (NALARQUEST)
    // ----------------------------------------------------
    renderGroupAttemptTracker() {
        if (!window.StorageManager || !StorageManager.getGroupAttempts) return;
        const att = StorageManager.getGroupAttempts();
        const textEl = document.getElementById('group-attempt-text');
        const pillsEl = document.getElementById('group-attempt-pills');
        const bestEl = document.getElementById('group-best-score-badge');
        const retryBtn = document.getElementById('group-retry-btn');

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
            if (att.currentAttempt >= 3 && att.isLocked) {
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

    promptRetryGroup() {
        if (!window.StorageManager || !StorageManager.getGroupAttempts) return;
        const att = StorageManager.getGroupAttempts();
        if (att.currentAttempt >= 3) {
            if (window.UI) UI.showToast("Kesempatan pengerjaan LKPD kelompok telah habis (3 dari 3)!");
            return;
        }
        if (window.UI) {
            UI.openRetryModal('group');
        }
    },

    executeRetryGroup() {
        if (!window.StorageManager || !StorageManager.resetGroupAttempt) return;
        const success = StorageManager.resetGroupAttempt();
        if (success) {
            this.groupProjectState.worksheet = {
                selectedStructure: '',
                reasoning: '',
                steps: '',
                conclusion: ''
            };
            this.groupProjectState.hotsAnswers = {};
            this.groupProjectState.isLocked = false;
            this.renderGroupProjectUI();
            this.renderGroupAttemptTracker();
            const step2 = document.getElementById('gp-step-2');
            if (step2) step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.UI) {
                UI.showToast("🔄 Percobaan baru LKPD dimulai. Silakan diskusikan dan lengkapi kembali lembar kerja dari awal!");
            }
        } else {
            if (window.UI) UI.showToast("Kesempatan pengerjaan telah habis (3 dari 3)!");
        }
    },
`;

const targetInitGroup = '    initGroupProject() {';
if (!app.includes(targetInitGroup)) {
  console.error('targetInitGroup not found!');
  process.exit(1);
}
app = app.replace(targetInitGroup, trackerMethods + '\n    initGroupProject() {');
console.log('1. Added tracker methods to App');

// 2. In renderGroupProjectUI, call renderGroupAttemptTracker
const oldRenderUI = `        this.renderGroupCaseWorkspace();
        this.renderGroupHOTSQuestions();
        this.restoreWorksheetInputs();
        this.updateWorkflowSteps();`;

const newRenderUI = `        this.renderGroupCaseWorkspace();
        this.renderGroupHOTSQuestions();
        this.restoreWorksheetInputs();
        this.updateWorkflowSteps();
        this.renderGroupAttemptTracker();`;

if (!app.includes(oldRenderUI)) {
  console.error('oldRenderUI not found!');
  process.exit(1);
}
app = app.replace(oldRenderUI, newRenderUI);
console.log('2. Called renderGroupAttemptTracker in renderGroupProjectUI');

// 3. In saveGroupProject, call StorageManager.saveGroupAttemptRecord
const oldSaveCall = `        if (window.StorageManager) {
            StorageManager.saveGroupProject(projectData);
            StorageManager.savePageScore('group-project', evaluation.totalScore, {
                groupName,
                case: projectData.selectedCase,
                score: evaluation.totalScore
            });
        }`;

const newSaveCall = `        if (window.StorageManager) {
            StorageManager.saveGroupProject(projectData);
            if (typeof StorageManager.saveGroupAttemptRecord === 'function') {
                StorageManager.saveGroupAttemptRecord(evaluation.totalScore, projectData.selectedCase);
            }
            StorageManager.savePageScore('group-project', evaluation.totalScore, {
                groupName,
                case: projectData.selectedCase,
                score: evaluation.totalScore
            });
        }
        this.groupProjectState.isLocked = true;
        this.renderGroupAttemptTracker();`;

if (!app.includes(oldSaveCall)) {
  console.error('oldSaveCall not found!');
  process.exit(1);
}
app = app.replace(oldSaveCall, newSaveCall);
console.log('3. Added saveGroupAttemptRecord and isLocked flag to saveGroupProject');

// 4. Update restoreWorksheetInputs to lock inputs when isLocked is true
const oldRestoreWS = `    restoreWorksheetInputs() {
        const ws = this.groupProjectState.worksheet;
        const structSelect = document.getElementById('gp-structure-select');
        const reasoning = document.getElementById('gp-reasoning');
        const steps = document.getElementById('gp-steps');
        const conclusion = document.getElementById('gp-conclusion');

        if (structSelect && ws.selectedStructure) structSelect.value = ws.selectedStructure;
        if (reasoning && ws.reasoning) reasoning.value = ws.reasoning;
        if (steps && ws.steps) steps.value = ws.steps;
        if (conclusion && ws.conclusion) conclusion.value = ws.conclusion;
    },`;

const newRestoreWS = `    restoreWorksheetInputs() {
        const ws = this.groupProjectState.worksheet;
        const structSelect = document.getElementById('gp-structure-select');
        const reasoning = document.getElementById('gp-reasoning');
        const steps = document.getElementById('gp-steps');
        const conclusion = document.getElementById('gp-conclusion');

        if (structSelect && ws.selectedStructure) structSelect.value = ws.selectedStructure;
        if (reasoning && ws.reasoning) reasoning.value = ws.reasoning;
        if (steps && ws.steps) steps.value = ws.steps;
        if (conclusion && ws.conclusion) conclusion.value = ws.conclusion;

        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        const isLocked = !!(att && att.isLocked);

        [reasoning, steps, conclusion, structSelect].forEach(el => {
            if (el) {
                el.disabled = isLocked;
                el.style.cursor = isLocked ? 'not-allowed' : 'auto';
                el.style.backgroundColor = isLocked ? '#FAF8F5' : '#FFFFFF';
            }
        });

        const saveBtn = document.getElementById('gp-btn-save-project');
        if (saveBtn) {
            if (isLocked) {
                saveBtn.textContent = \`🔒 Lembar Kerja Terkunci (Percobaan ke-\${att.currentAttempt})\`;
                saveBtn.style.opacity = '0.75';
            } else {
                saveBtn.textContent = '💾 Simpan & Hitung Nilai Kelompok';
                saveBtn.style.opacity = '1';
            }
        }
    },`;

if (!app.includes(oldRestoreWS)) {
  console.error('oldRestoreWS not found!');
  process.exit(1);
}
app = app.replace(oldRestoreWS, newRestoreWS);
console.log('4. Updated restoreWorksheetInputs to lock inputs when isLocked is true');

fs.writeFileSync('js/app.js', app, 'utf8');
console.log('Successfully written updated js/app.js!');

