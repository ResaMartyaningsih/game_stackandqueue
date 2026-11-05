const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

// 1. Replace renderGroupMembersList
const renderStart = appJs.indexOf('renderGroupMembersList() {');
const renderEnd = appJs.indexOf('updateMemberName(idx, val) {', renderStart);

if (renderStart === -1 || renderEnd === -1) {
    console.error('Could not find renderGroupMembersList');
    process.exit(1);
}

const newRenderMembers = `renderGroupMembersList() {
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
            countBadge.textContent = \`\${validCount} dari 6 Anggota Terisi\`;
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
                \`<option value="\${r}" \${r === currentRole ? 'selected' : ''}>\${r}</option>\`
            ).join('');

            return \`
                <div class="gp-member-row" data-member-index="\${idx}" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <span class="gp-member-index" style="font-family: 'Space Mono', monospace; font-weight: 700; color: #891A10; width: 28px;">#\${idx + 1}</span>
                    <input type="text" class="gp-member-name-input" placeholder="Nama Anggota \${idx + 1}..." 
                           value="\${m.name || ''}" 
                           style="flex: 2; min-width: 150px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;"
                           oninput="App.updateMemberName(\${idx}, this.value)"
                           onchange="App.updateMemberName(\${idx}, this.value)">
                    <input type="number" class="gp-member-absen-input" placeholder="Absen" min="1" max="60"
                           value="\${m.absen || ''}" 
                           style="width: 80px; padding: 0.6rem 0.6rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Space Mono', monospace; text-align: center;"
                           oninput="App.updateMemberAbsen(\${idx}, this.value)"
                           onchange="App.updateMemberAbsen(\${idx}, this.value)">
                    <select class="gp-member-role-select" 
                            style="flex: 2; min-width: 180px; padding: 0.6rem 0.8rem; border: 1.5px solid #D8D4BC; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: #714236;"
                            onchange="App.updateMemberRole(\${idx}, this.value)">
                        \${selectOptions}
                    </select>
                </div>
            \`;
        }).join('');
    },

    `;

appJs = appJs.substring(0, renderStart) + newRenderMembers + appJs.substring(renderEnd);
console.log('1. Replaced renderGroupMembersList');

// 2. Replace saveGroupIdentity (remove 100 points auto-award)
const saveIdStart = appJs.indexOf('saveGroupIdentity() {');
const saveIdEnd = appJs.indexOf('toggleGroupIdentityEdit() {', saveIdStart);

if (saveIdStart === -1 || saveIdEnd === -1) {
    console.error('Could not find saveGroupIdentity');
    process.exit(1);
}

const newSaveIdentity = `saveGroupIdentity() {
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
            chipEl.textContent = \`✓ Profil Disimpan (\${filledCount}/6 Anggota, \${nowTime})\`;
            chipEl.className = 'gp-status-chip saved';
        }

        if (window.UI) {
            UI.showToast(\`👥 Identitas Kelompok "\${name}" berhasil disimpan.\`);
        }
    },

    `;

appJs = appJs.substring(0, saveIdStart) + newSaveIdentity + appJs.substring(saveIdEnd);
console.log('2. Replaced saveGroupIdentity');

// 3. Replace saveGroupProject and add calculateGroupRubricScore and renderGroupRubricCard
const saveProjStart = appJs.indexOf('saveGroupProject(showFeedback = true) {');
const saveProjEnd = appJs.indexOf('buildGroupLKPDHTML(forWordDoc = false) {', saveProjStart);

if (saveProjStart === -1 || saveProjEnd === -1) {
    console.error('Could not find saveGroupProject');
    process.exit(1);
}

const newSaveProjectAndRubric = `calculateGroupRubricScore(projectData) {
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
            details.collaboration.note = \`Terisi \${members.length} anggota tim.\`;
        } else if (members.length > 0) {
            details.collaboration.score = 6;
            details.collaboration.note = \`Baru terisi \${members.length} anggota.\`;
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
        const hasStepsPattern = /langkah|tahap|\\d+\\.|\\n|-|\\*/i.test(steps);

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

        card.innerHTML = \`
            <div style="background: #FFFFFF; border: 2.5px solid #891A10; border-radius: 16px; padding: 1.75rem; box-shadow: 0 10px 30px rgba(113, 66, 54, 0.08);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1.5px solid #D8D4BC; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
                    <div>
                        <h4 style="font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: #714236; margin: 0;">
                            📊 Hasil Penilaian Rubrik LKPD Kelompok (Berdasarkan RPM UKIN)
                        </h4>
                        <span style="font-size: 0.82rem; color: #714236;">Kriteria Ketercapaian Tujuan Pembelajaran: KKTP ≥ 75</span>
                    </div>
                    <span class="academic-badge \${isPassed ? 'academic-badge-emerald' : 'academic-badge-amber'}" style="font-size: 0.82rem;">
                        \${isPassed ? '✓ Tuntas (Memenuhi KKTP)' : '⚠️ Perlu Penguatan (Belum Tuntas)'}
                    </span>
                </div>

                <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="background: #FAF6ED; border: 2px solid #E76814; border-radius: 14px; padding: 1rem 2rem; text-align: center;">
                        <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; font-weight: 700; color: #714236; text-transform: uppercase;">Skor Akhir LKPD</span>
                        <div style="font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: #891A10; line-height: 1;">
                            \${evaluation.totalScore}
                        </div>
                        <span style="font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #714236;">Skala 100</span>
                    </div>
                    <div style="flex: 1; min-width: 260px;">
                        <p style="font-size: 0.95rem; color: #2B1D19; line-height: 1.6; margin: 0;">
                            \${isPassed 
                                ? 'Luar biasa! Hasil kerja kelompokmu telah memenuhi standar kelayakan asesmen kurikulum. Seluruh rincian rubrik di bawah ini telah terisi secara komprehensif.' 
                                : 'Nilai kelompok belum mencapai KKTP minimal 75. Silakan periksa rincian rubrik berikut, lengkapi bagian yang masih kurang, lalu simpan ulang!'}
                        </p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                    \${Object.keys(d).map(k => {
                        const item = d[k];
                        const pct = Math.round((item.score / item.max) * 100);
                        return \`
                            <div style="background: #FAF8F5; border: 1px solid #D8D4BC; border-radius: 10px; padding: 0.85rem 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                    <strong style="font-size: 0.92rem; color: #714236;">\${item.label}</strong>
                                    <span style="font-family: 'Space Mono', monospace; font-size: 0.82rem; font-weight: 700; color: #891A10;">
                                        \${item.score} / \${item.max} Poin (\${pct}%)
                                    </span>
                                </div>
                                <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
                                    💡 \${item.note}
                                </p>
                            </div>
                        \`;
                    }).join('')}
                </div>
            </div>
        \`;

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
                UI.showToast(\`📊 Tugas Kelompok "\${groupName}" berhasil dinilai! Skor: \${evaluation.totalScore}/100 Poin.\`);
                UI.setKikoDialogue(\`Kerja sama tim "\${groupName}" telah dihitung secara objektif berdasarkan rubrik RPM. Nilai: \${evaluation.totalScore}/100. Kalian dapat mengunduh Word (.doc) atau mencetak PDF sekarang!\`, 'cheering');
            }
            this.renderGroupRubricCard(evaluation);
        }

        this.renderGroupProjectUI();
    },

    `;

appJs = appJs.substring(0, saveProjStart) + newSaveProjectAndRubric + appJs.substring(saveProjEnd);
console.log('3. Replaced saveGroupProject and added calculateGroupRubricScore');

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Successfully saved app.js part 2!');

