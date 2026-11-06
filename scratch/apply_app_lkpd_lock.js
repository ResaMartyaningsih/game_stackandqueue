const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
let code = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

// 1. In executeRetryGroup, add persistProjectDraft
const oldRetry = `    executeRetryGroup() {
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
            this.renderGroupProjectUI();`;

const newRetry = `    executeRetryGroup() {
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
            this.persistProjectDraft();
            this.renderGroupProjectUI();`;

if (code.includes(oldRetry)) {
    code = code.replace(oldRetry, newRetry);
    console.log('✓ Updated executeRetryGroup with persistProjectDraft()');
} else {
    console.warn('! oldRetry not matched');
}

// 2. In initGroupProject, restore isLocked from StorageManager
const oldInit = `                } else if (saved.answers) {
                    // Backwards compatibility with old key names
                    this.groupProjectState.worksheet.reasoning = saved.answers.ans1 || '';
                    this.groupProjectState.worksheet.steps = saved.answers.ans2 || '';
                    this.groupProjectState.worksheet.conclusion = saved.answers.ans3 || '';
                }
            }
        }

        // Initialize simulation items for selected case if empty`;

const newInit = `                } else if (saved.answers) {
                    // Backwards compatibility with old key names
                    this.groupProjectState.worksheet.reasoning = saved.answers.ans1 || '';
                    this.groupProjectState.worksheet.steps = saved.answers.ans2 || '';
                    this.groupProjectState.worksheet.conclusion = saved.answers.ans3 || '';
                }
            }
            if (typeof StorageManager.getGroupAttempts === 'function') {
                const att = StorageManager.getGroupAttempts();
                this.groupProjectState.isLocked = !!(att && att.isLocked);
            }
        }

        // Initialize simulation items for selected case if empty`;

if (code.includes(oldInit)) {
    code = code.replace(oldInit, newInit);
    console.log('✓ Updated initGroupProject with isLocked check');
} else {
    console.warn('! oldInit not matched');
}

// 3. In selectGroupCase, prevent switching if isLocked
const oldSelectCase = `    selectGroupCase(caseKey) {
        if (!this.groupProjectState.cases[caseKey]) return;
        this.groupProjectState.selectedCase = caseKey;`;

const newSelectCase = `    selectGroupCase(caseKey) {
        if (!this.groupProjectState.cases[caseKey]) return;
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked) {
            if (window.UI) UI.showToast('🔒 Lembar LKPD telah terkunci untuk percobaan ini. Gunakan "Ulangi Seluruh Tugas" jika ingin mengganti studi kasus.');
            return;
        }
        this.groupProjectState.selectedCase = caseKey;`;

if (code.includes(oldSelectCase)) {
    code = code.replace(oldSelectCase, newSelectCase);
    console.log('✓ Updated selectGroupCase with isLocked check');
} else {
    console.warn('! oldSelectCase not matched');
}

// 4. In onWorksheetChange, guard with isLocked
const oldWsChange = `    onWorksheetChange(field, val) {
        this.groupProjectState.worksheet[field] = val;
        this.persistProjectDraft();
        this.updateWorkflowSteps();
    },`;

const newWsChange = `    onWorksheetChange(field, val) {
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked) return;
        this.groupProjectState.worksheet[field] = val;
        this.persistProjectDraft();
        this.updateWorkflowSteps();
    },`;

if (code.includes(oldWsChange)) {
    code = code.replace(oldWsChange, newWsChange);
    console.log('✓ Updated onWorksheetChange with isLocked guard');
} else {
    console.warn('! oldWsChange not matched');
}

// 5. In saveGroupProject, prevent re-evaluating if locked and user clicked button
const oldSaveGP = `    saveGroupProject(showFeedback = true) {
        this.syncIdentityFromDOM();`;

const newSaveGP = `    saveGroupProject(showFeedback = true) {
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked && !showFeedback) {
            return; // silent return for auto-saves
        }
        if (att && att.isLocked && showFeedback) {
            if (window.UI) UI.showToast(\`🔒 Lembar LKPD telah terkunci untuk percobaan ke-\${att.currentAttempt}. Gunakan 'Ulangi Seluruh Tugas' jika ingin mencoba lagi.\`);
            return;
        }
        this.syncIdentityFromDOM();`;

if (code.includes(oldSaveGP)) {
    code = code.replace(oldSaveGP, newSaveGP);
    console.log('✓ Updated saveGroupProject with isLocked guard');
} else {
    console.warn('! oldSaveGP not matched');
}

// 6. Update renderGroupHOTSQuestions & answerHOTS_MC / answerHOTS_TF / answerHOTS_Essay
const oldHOTSSection = `    renderGroupHOTSQuestions() {
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
            return \`
                <button type="button" class="gp-hots-option-btn \${isSelected ? 'selected' : ''}" 
                        onclick="App.answerHOTS_MC('\${caseKey}', '\${opt.key}')">
                    <span class="gp-option-key">\${opt.key}</span>
                    <span>\${opt.text}</span>
                </button>
            \`;
        }).join('');

        // MC Feedback alert if answered
        let mcFeedbackHTML = '';
        if (mcUserChoice) {
            const selectedOpt = c.hots.mc.options.find(o => o.key === mcUserChoice);
            if (selectedOpt) {
                const isCorrect = !!selectedOpt.isCorrect;
                mcFeedbackHTML = \`
                    <div class="gp-feedback-alert \${isCorrect ? 'correct' : 'info'}">
                        <strong>\${isCorrect ? '✅ Analisis Logika Tepat!' : '💡 Pembahasan Komputasional:'}</strong>
                        \${selectedOpt.feedback || (isCorrect ? 'Jawaban pilihan kelompokmu tepat secara logika.' : 'Pertimbangkan kembali karakteristik penanganan alur data.')}
                    </div>
                \`;
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

            return \`
                <div class="gp-tf-item">
                    <div class="gp-tf-statement">📌 "\${tItem.statement}"</div>
                    <div class="gp-tf-actions">
                        <button type="button" class="gp-tf-btn \${userVal === true ? 'active-true' : ''}" 
                                onclick="App.answerHOTS_TF('\${caseKey}', '\${tItem.id}', true)">
                            ✓ BENAR
                        </button>
                        <button type="button" class="gp-tf-btn \${userVal === false ? 'active-false' : ''}" 
                                onclick="App.answerHOTS_TF('\${caseKey}', '\${tItem.id}', false)">
                            ✕ SALAH
                        </button>
                    </div>
                    \${hasAnswered ? \`
                        <div class="gp-feedback-alert \${isCorrect ? 'correct' : 'info'}" style="padding: 0.5rem 0.8rem; font-size: 0.82rem;">
                            <strong>\${isCorrect ? '✅ Tepat!' : '💡 Catatan Guru:'}</strong> \${explanationText}
                        </div>
                    \` : ''}
                </div>
            \`;
        }).join('');

        // Essay question
        const essayVal = savedAnswers.essay || '';
        const essayPrompt = (c.hots.essay && c.hots.essay.prompt) || c.hots.essayGuide || 'Jelaskan rancangan solusi algoritmik kelompokmu untuk kasus ini:';
        const essayPlaceholder = (c.hots.essay && c.hots.essay.placeholder) || 'Tuliskan rancangan solusi pemecahan masalah hasil diskusi kelompokmu...';

        container.innerHTML = \`
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
                <p class="gp-hots-prompt">\${c.hots.mc.question}</p>
                <div class="gp-hots-options">
                    \${mcOptionsHTML}
                </div>
                \${mcFeedbackHTML}
            </div>

            <!-- Question 2: Benar / Salah HOTS (C5 Evaluasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FAF3F0; color: #891A10; border: 1px solid #D8D4BC;">Soal 2 • Analisis Kritis Pernyataan (C5 - Mengevaluasi Benar/Salah)</span>
                <p class="gp-hots-prompt">Tentukan apakah setiap pernyataan komputasional di bawah ini Benar atau Salah, lalu cermati pembahasannya:</p>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    \${tfHTML}
                </div>
            </div>

            <!-- Question 3: Isian Singkat / Rancangan Solusi HOTS (C6 Kreasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FFF7EB; color: #DC8236; border: 1px solid #D8D4BC;">Soal 3 • Perancangan Solusi Algoritmik (C6 - Problem Solving)</span>
                <p class="gp-hots-prompt">\${essayPrompt}</p>
                <textarea class="gp-textarea-modern" placeholder="\${essayPlaceholder}" 
                          oninput="App.answerHOTS_Essay('\${caseKey}', this.value)">\${essayVal}</textarea>
                <div class="gp-textarea-hint">💡 Rancang aturan logis secara jelas bersama kelompokmu. Jawaban tersimpan otomatis.</div>
            </div>
        \`;
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
    },`;

const newHOTSSection = `    renderGroupHOTSQuestions() {
        const container = document.getElementById('gp-hots-questions-section');
        if (!container) return;

        const caseKey = this.groupProjectState.selectedCase;
        const c = this.groupProjectState.cases[caseKey];
        if (!c || !c.hots) return;

        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        const isLocked = !!(att && att.isLocked);
        const savedAnswers = this.groupProjectState.hotsAnswers[caseKey] || {};

        // Multiple choice options HTML (Single choice locks immediately upon selection)
        const mcUserChoice = savedAnswers.mc;
        const mcIsLocked = isLocked || !!mcUserChoice;
        const mcOptionsHTML = c.hots.mc.options.map(opt => {
            const isSelected = mcUserChoice === opt.key;
            return \`
                <button type="button" class="gp-hots-option-btn \${isSelected ? 'selected' : ''}" 
                        \${mcIsLocked ? 'disabled style="pointer-events: none; opacity: ' + (isSelected ? '1' : '0.6') + ';"' : ''}
                        onclick="App.answerHOTS_MC('\${caseKey}', '\${opt.key}')">
                    <span class="gp-option-key">\${opt.key}</span>
                    <span style="flex: 1;">\${opt.text}</span>
                    \${isSelected ? '<span class="task-locked-tag" style="margin-left: auto; font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: #891A10; color: #FFF; font-weight: 700;">🔒 Terkunci</span>' : ''}
                </button>
            \`;
        }).join('');

        // MC Feedback alert if answered
        let mcFeedbackHTML = '';
        if (mcUserChoice) {
            const selectedOpt = c.hots.mc.options.find(o => o.key === mcUserChoice);
            if (selectedOpt) {
                const isCorrect = !!selectedOpt.isCorrect;
                mcFeedbackHTML = \`
                    <div class="gp-feedback-alert \${isCorrect ? 'correct' : 'info'}">
                        <strong>\${isCorrect ? '✅ Analisis Logika Tepat!' : '💡 Pembahasan Komputasional:'}</strong>
                        \${selectedOpt.feedback || (isCorrect ? 'Jawaban pilihan kelompokmu tepat secara logika.' : 'Pertimbangkan kembali karakteristik penanganan alur data.')}
                    </div>
                \`;
            }
        }

        // True / False statements HTML (Locks immediately upon selection)
        const tfAnswers = savedAnswers.tf || {};
        const tfHTML = (c.hots.tf || []).map(tItem => {
            const userVal = tfAnswers[tItem.id];
            const hasAnswered = userVal !== undefined;
            const itemLocked = isLocked || hasAnswered;
            const expectedVal = (tItem.correct !== undefined) ? tItem.correct : tItem.isTrue;
            const explanationText = tItem.explanation || tItem.feedback || '';
            const isCorrect = hasAnswered && userVal === expectedVal;

            return \`
                <div class="gp-tf-item">
                    <div class="gp-tf-statement" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                        <span>📌 "\${tItem.statement}"</span>
                        \${hasAnswered ? '<span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: #891A10; color: #FFF; font-weight: 700; white-space: nowrap;">🔒 Terkunci</span>' : ''}
                    </div>
                    <div class="gp-tf-actions">
                        <button type="button" class="gp-tf-btn \${userVal === true ? 'active-true' : ''}" 
                                \${itemLocked ? 'disabled style="pointer-events: none; opacity: ' + (userVal === true ? '1' : '0.45') + ';"' : ''}
                                onclick="App.answerHOTS_TF('\${caseKey}', '\${tItem.id}', true)">
                            ✓ BENAR
                        </button>
                        <button type="button" class="gp-tf-btn \${userVal === false ? 'active-false' : ''}" 
                                \${itemLocked ? 'disabled style="pointer-events: none; opacity: ' + (userVal === false ? '1' : '0.45') + ';"' : ''}
                                onclick="App.answerHOTS_TF('\${caseKey}', '\${tItem.id}', false)">
                            ✕ SALAH
                        </button>
                    </div>
                    \${hasAnswered ? \`
                        <div class="gp-feedback-alert \${isCorrect ? 'correct' : 'info'}" style="padding: 0.5rem 0.8rem; font-size: 0.82rem;">
                            <strong>\${isCorrect ? '✅ Tepat!' : '💡 Catatan Guru:'}</strong> \${explanationText}
                        </div>
                    \` : ''}
                </div>
            \`;
        }).join('');

        // Essay question
        const essayVal = savedAnswers.essay || '';
        const essayPrompt = (c.hots.essay && c.hots.essay.prompt) || c.hots.essayGuide || 'Jelaskan rancangan solusi algoritmik kelompokmu untuk kasus ini:';
        const essayPlaceholder = (c.hots.essay && c.hots.essay.placeholder) || 'Tuliskan rancangan solusi pemecahan masalah hasil diskusi kelompokmu...';

        container.innerHTML = \`
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
                <p class="gp-hots-prompt">\${c.hots.mc.question}</p>
                <div class="gp-hots-options">
                    \${mcOptionsHTML}
                </div>
                \${mcFeedbackHTML}
            </div>

            <!-- Question 2: Benar / Salah HOTS (C5 Evaluasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FAF3F0; color: #891A10; border: 1px solid #D8D4BC;">Soal 2 • Analisis Kritis Pernyataan (C5 - Mengevaluasi Benar/Salah)</span>
                <p class="gp-hots-prompt">Tentukan apakah setiap pernyataan komputasional di bawah ini Benar atau Salah, lalu cermati pembahasannya:</p>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    \${tfHTML}
                </div>
            </div>

            <!-- Question 3: Isian Singkat / Rancangan Solusi HOTS (C6 Kreasi) -->
            <div class="gp-hots-card">
                <span class="gp-hots-badge" style="background: #FFF7EB; color: #DC8236; border: 1px solid #D8D4BC;">Soal 3 • Perancangan Solusi Algoritmik (C6 - Problem Solving)</span>
                <p class="gp-hots-prompt">\${essayPrompt}</p>
                <textarea class="gp-textarea-modern" placeholder="\${essayPlaceholder}" 
                          \${isLocked ? 'disabled style="background: #FAF8F5; cursor: not-allowed;"' : ''}
                          oninput="App.answerHOTS_Essay('\${caseKey}', this.value)">\${essayVal}</textarea>
                <div class="gp-textarea-hint">\${isLocked ? '🔒 Lembar kerja terkunci karena LKPD telah disimpan.' : '💡 Rancang aturan logis secara jelas bersama kelompokmu. Jawaban tersimpan otomatis.'}</div>
            </div>
        \`;
    },

    answerHOTS_MC(caseKey, optionKey) {
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked) return;
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        if (this.groupProjectState.hotsAnswers[caseKey].mc) return; // Answer locked immediately once selected!
        this.groupProjectState.hotsAnswers[caseKey].mc = optionKey;
        this.persistProjectDraft();
        this.renderGroupHOTSQuestions();
        this.updateWorkflowSteps();
        if (window.SoundManager) SoundManager.play('click');
        if (window.UI) UI.showToast('🔒 Jawaban Pilihan Ganda Terkunci!');
    },

    answerHOTS_TF(caseKey, tfId, value) {
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked) return;
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        if (!this.groupProjectState.hotsAnswers[caseKey].tf) {
            this.groupProjectState.hotsAnswers[caseKey].tf = {};
        }
        if (this.groupProjectState.hotsAnswers[caseKey].tf[tfId] !== undefined) return; // Locked once answered!
        this.groupProjectState.hotsAnswers[caseKey].tf[tfId] = value;
        this.persistProjectDraft();
        this.renderGroupHOTSQuestions();
        this.updateWorkflowSteps();
        if (window.SoundManager) SoundManager.play('click');
        if (window.UI) UI.showToast('🔒 Jawaban Analisis Kritis Terkunci!');
    },

    answerHOTS_Essay(caseKey, text) {
        const att = (window.StorageManager && StorageManager.getGroupAttempts) ? StorageManager.getGroupAttempts() : { isLocked: false };
        if (att && att.isLocked) return;
        if (!this.groupProjectState.hotsAnswers[caseKey]) {
            this.groupProjectState.hotsAnswers[caseKey] = {};
        }
        this.groupProjectState.hotsAnswers[caseKey].essay = text;
        this.persistProjectDraft();
        this.updateWorkflowSteps();
    },`;

if (code.includes(oldHOTSSection)) {
    code = code.replace(oldHOTSSection, newHOTSSection);
    console.log('✓ Updated renderGroupHOTSQuestions and answer handlers with locking system');
} else {
    console.warn('! oldHOTSSection not matched');
}

fs.writeFileSync(appPath, code, 'utf8');
console.log('Successfully written updated js/app.js');

