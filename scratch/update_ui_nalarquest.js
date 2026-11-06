const fs = require('fs');

let ui = fs.readFileSync('js/ui.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Add retry modal methods to UI object
const retryMethods = `
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
`;

const rfStart = ui.indexOf('renderFinalResult() {');
const rfEnd = ui.indexOf('// ----------------------------------------------------', rfStart + 100);

if (rfStart === -1 || rfEnd === -1) {
  console.error('renderFinalResult bounds not found in js/ui.js!');
  process.exit(1);
}

const newRenderFinalResult = `renderFinalResult() {
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

                return \`
                    <div class="result-component-card" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; box-shadow: 0 2px 8px rgba(113, 66, 54, 0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                            <div style="flex: 1; min-width: 220px;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <span style="font-size: 1.2rem;">\${c.icon}</span>
                                    <strong style="color: #891A10; font-size: 0.98rem; font-family: 'Syne', sans-serif;">\${c.title}</strong>
                                    <span style="font-size: 0.75rem; background: #FAF6ED; border: 1px solid #D8D4BC; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 700; color: #714236;">
                                        Bobot: \${c.weight}\${typeof c.weight === 'number' ? '%' : ''}
                                    </span>
                                </div>
                                <p style="font-size: 0.85rem; color: #714236; margin: 0 0 0.4rem 0; line-height: 1.4;">
                                    \${c.desc}
                                </p>
                                \${c.historyHTML ? \`
                                    <div style="margin-top: 0.35rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                                        <span style="font-size: 0.78rem; color: #714236; font-weight: 600;">Riwayat Percobaan:</span>
                                        \${c.historyHTML}
                                    </div>
                                \` : ''}
                            </div>
                            <div style="text-align: right; min-width: 140px;">
                                <div style="font-family: 'Space Mono', monospace; font-size: 1.25rem; font-weight: 800; color: \${isCompleted ? '#891A10' : '#714236'};">
                                    \${c.isBonus ? ('+' + c.score) : c.score} <span style="font-size: 0.8rem; font-weight: normal; color: #714236;">/ \${maxVal}</span>
                                </div>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #10b981;">
                                    Kontribusi: +\${c.contrib} poin
                                </span>
                            </div>
                        </div>
                        <div class="lvl-bar-wrapper" style="height: 10px; background: #FAF6ED; border-radius: 999px; overflow: hidden; margin-top: 0.5rem; border: 1px solid #D8D4BC;">
                            <div class="lvl-bar-fill" style="width: \${barWidth}%; height: 100%; background: \${barColor}; border-radius: 999px; transition: width 0.6s ease;"></div>
                        </div>
                    </div>
                \`;
            }).join('');

            // Presentation Rubric Notice
            html += \`
                <div class="result-presentation-notice" style="background: #FAF6ED; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 0.85rem 1.25rem; margin-top: 0.75rem; display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">📢</span>
                    <div style="font-size: 0.85rem; color: #714236; line-height: 1.5;">
                        <strong>Catatan Penilaian Pembelajaran Guru:</strong> Aspek <strong>Presentasi Kelompok (bobot 10%)</strong> dinilai secara manual oleh guru mata pelajaran melalui rubrik penilaian guru di luar sistem digital ini. Nilai akhir keseluruhan rapor siswa akan digabungkan secara manual oleh guru pengampu.
                    </div>
                </div>
            \`;

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
`;

ui = ui.substring(0, rfStart) + retryMethods + '\n    ' + newRenderFinalResult + ui.substring(rfEnd);
console.log('Updated js/ui.js with retry methods and new renderFinalResult!');

fs.writeFileSync('js/ui.js', ui, 'utf8');
console.log('Successfully written updated js/ui.js!');
