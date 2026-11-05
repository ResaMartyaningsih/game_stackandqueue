const fs = require('fs');

let uiJs = fs.readFileSync('js/ui.js', 'utf8').replace(/\r\n/g, '\n');

// 1. Update switchScreen to gracefully redirect obsolete screens
const switchScreenTarget = `        const targetEl = document.getElementById(\`screen-\${screenId}\`);
        if (targetEl) {
            targetEl.classList.add('active');
            this.currentScreen = screenId;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }`;

const switchScreenRepl = `        let targetEl = document.getElementById(\`screen-\${screenId}\`);
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
        }`;

if (!uiJs.includes(switchScreenTarget)) {
  console.error('switchScreenTarget not found!');
  process.exit(1);
}
uiJs = uiJs.replace(switchScreenTarget, switchScreenRepl);
console.log('1. Updated switchScreen in js/ui.js');

// 2. Update renderFinalResult in js/ui.js
const rfStart = uiJs.indexOf('renderFinalResult() {');
const rfEnd = uiJs.indexOf('// ----------------------------------------------------', rfStart + 100);

if (rfStart === -1 || rfEnd === -1) {
  console.error('renderFinalResult bounds not found!');
  process.exit(1);
}

const newRenderFinalResult = `renderFinalResult() {
        if (!window.ScoringSystem) return;
        const comp = ScoringSystem.getComponentScores();
        const avgScore = comp.finalScore;
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

            const componentsList = [
                {
                    key: 'individual',
                    icon: '🎯',
                    title: '1. Tantangan Individu (4 Level Bertingkat)',
                    weight: 25,
                    score: comp.individual.score,
                    contrib: comp.individual.weightedContribution,
                    desc: 'Evaluasi ketepatan pemecahan masalah pada 4 level skenario kantin (C2-C4).'
                },
                {
                    key: 'miniLab',
                    icon: '🧪',
                    title: '2. Praktik Simulasi Mini-Lab (Stack & Queue)',
                    weight: 20,
                    score: comp.miniLab.score,
                    contrib: comp.miniLab.weightedContribution,
                    desc: 'Keberhasilan eksekusi operasi push, pop, enqueue, dan dequeue di laboratorium mini.'
                },
                {
                    key: 'groupProject',
                    icon: '👥',
                    title: '3. LKPD Kelompok (PBL: ' + ((groupProject && groupProject.groupName) ? groupProject.groupName : 'Tim Kolaborasi') + ')',
                    weight: 30,
                    score: comp.groupProject.score,
                    contrib: comp.groupProject.weightedContribution,
                    desc: membersList ? ('Anggota Tim: ' + membersList) : 'Analisis studi kasus kantin, perumusan algoritma, dan solusi presentasi kelompok.'
                },
                {
                    key: 'evaluation',
                    icon: '📝',
                    title: '4. Evaluasi Akhir (Asesmen Sumatif 5 Soal HOTS)',
                    weight: 25,
                    score: comp.evaluation.score,
                    contrib: comp.evaluation.weightedContribution,
                    desc: 'Penguasaan konsep secara mandiri melalui 5 butir soal analisis dan penerapan (C3-C4).'
                }
            ];

            let html = componentsList.map(c => {
                const isCompleted = c.score > 0;
                const barColor = c.score >= 75 ? '#10b981' : (c.score > 0 ? '#E76814' : '#D8D4BC');
                return \`
                    <div class="result-component-card" style="background: #FFFFFF; border: 1.5px solid #D8D4BC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; box-shadow: 0 2px 8px rgba(113, 66, 54, 0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                            <div style="flex: 1; min-width: 220px;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                                    <span style="font-size: 1.2rem;">\${c.icon}</span>
                                    <strong style="color: #891A10; font-size: 0.98rem; font-family: 'Syne', sans-serif;">\${c.title}</strong>
                                    <span style="font-size: 0.75rem; background: #FAF6ED; border: 1px solid #D8D4BC; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 700; color: #714236;">
                                        Bobot: \${c.weight}%
                                    </span>
                                </div>
                                <p style="font-size: 0.85rem; color: #714236; margin: 0 0 0.5rem 0; line-height: 1.4;">
                                    \${c.desc}
                                </p>
                            </div>
                            <div style="text-align: right; min-width: 140px;">
                                <div style="font-family: 'Space Mono', monospace; font-size: 1.2rem; font-weight: 800; color: \${isCompleted ? '#891A10' : '#714236'};">
                                    \${c.score} <span style="font-size: 0.8rem; font-weight: normal; color: #714236;">/ 100</span>
                                </div>
                                <span style="font-size: 0.78rem; font-weight: 700; color: #10b981;">
                                    Kontribusi: +\${c.contrib} poin
                                </span>
                            </div>
                        </div>
                        <div class="lvl-bar-wrapper" style="height: 10px; background: #FAF6ED; border-radius: 999px; overflow: hidden; margin-top: 0.4rem; border: 1px solid #D8D4BC;">
                            <div class="lvl-bar-fill" style="width: \${c.score}%; height: 100%; background: \${barColor}; border-radius: 999px; transition: width 0.6s ease;"></div>
                        </div>
                    </div>
                \`;
            }).join('');

            // Add Formative Quiz Feedback Section
            html += \`
                <div class="result-formative-card" style="background: #FAF6ED; border: 1.5px dashed #714236; border-radius: 12px; padding: 1rem 1.25rem; margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.2rem;">💬</span>
                                <strong style="color: #714236; font-size: 0.95rem;">Kuis Pemahaman Materi (Asesmen Formatif)</strong>
                                <span style="font-size: 0.72rem; background: #D8D4BC; padding: 0.15rem 0.45rem; border-radius: 999px; font-weight: 700; color: #2B1D19;">
                                    Bobot: 0% (Umpan Balik)
                                </span>
                            </div>
                            <p style="font-size: 0.82rem; color: #714236; margin: 0.3rem 0 0 0;">
                                Nilai Kuis Stack: <strong>\${comp.formative.stackScore} pts</strong> | Nilai Kuis Queue: <strong>\${comp.formative.queueScore} pts</strong> (Rata-rata: <strong>\${comp.formative.score} pts</strong>).
                            </p>
                        </div>
                        <div style="font-size: 0.8rem; color: #714236; font-style: italic; background: #FFFFFF; padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid #D8D4BC;">
                            ℹ️ Digunakan untuk refleksi dan pemantauan belajar mandiri.
                        </div>
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

uiJs = uiJs.substring(0, rfStart) + newRenderFinalResult + uiJs.substring(rfEnd);
console.log('2. Updated renderFinalResult in js/ui.js');

fs.writeFileSync('js/ui.js', uiJs, 'utf8');
console.log('Successfully written updated js/ui.js!');
