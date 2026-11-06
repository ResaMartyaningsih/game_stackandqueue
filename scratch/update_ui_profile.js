const fs = require('fs');
const path = require('path');

const uiPath = path.join(__dirname, '..', 'js', 'ui.js');
let code = fs.readFileSync(uiPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Breadcrumb update
const oldCrumb = `            case 'guidelines':
                crumbs.push({ name: '📖 Panduan & Glosarium', active: true });
                break;
            default:`;

const newCrumb = `            case 'guidelines':
                crumbs.push({ name: '📖 Panduan & Glosarium', active: true });
                break;
            case 'profile':
                crumbs.push({ name: '👤 Profil & Rapor Siswa', active: true });
                break;
            default:`;

if (code.includes(oldCrumb)) {
    code = code.replace(oldCrumb, newCrumb);
    console.log('✓ Breadcrumb updated for profile');
} else {
    console.warn('! oldCrumb not matched');
}

// 2. onScreenActivated update
const oldActivated = `        } else if (screenId === 'result') {
            this.renderFinalResult();
        }
    },`;

const newActivated = `        } else if (screenId === 'result') {
            this.renderFinalResult();
        } else if (screenId === 'profile') {
            this.setKikoDialogue("Halaman Profil & Rapor! Cek progres belajar, rincian nilai digital, dan unduh dokumen laporan resmi.", 'happy');
            this.renderProfilePage();
        }
    },`;

if (code.includes(oldActivated)) {
    code = code.replace(oldActivated, newActivated);
    console.log('✓ onScreenActivated updated for profile');
} else {
    console.warn('! oldActivated not matched');
}

// 3. Add profile rendering, download word, and print report methods
const profileMethods = `
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
                                '<button type="button" class="btn btn-outline btn-sm" onclick="UI.switchScreen(\\'' + st.target + '\\')" style="font-size: 0.78rem; font-weight: 700; padding: 0.35rem 0.75rem; border-radius: 8px; border: 1.5px solid #891A10; color: #891A10; background: #FFFFFF; cursor: pointer;">' +
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
            const cleanName = playerName.replace(/[^\\w\\d-_]/g, '_');
            const cleanClass = playerClass.replace(/[^\\w\\d-_]/g, '_');

            const docHTML = this.buildProfileReportHTML(true);
            const blob = new Blob(['\\ufeff' + docHTML], {
                type: 'application/msword;charset=utf-8'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`Rapor_Nilai_\${cleanName}_\${cleanClass}.doc\`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                a.remove();
                URL.revokeObjectURL(url);
            }, 1500);

            if (window.UI) {
                UI.showToast(\`📄 Rapor Nilai Word (.doc) "\${playerName}" berhasil diunduh!\`);
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
`;

// Append methods before promptResetProgress
const targetAnchor = `    // ----------------------------------------------------
    // RESET PROGRESS
    // ----------------------------------------------------`;

if (code.includes(targetAnchor)) {
    code = code.replace(targetAnchor, profileMethods + '\n' + targetAnchor);
    console.log('✓ Profile methods successfully injected into js/ui.js');
} else {
    console.warn('! targetAnchor not matched');
}

fs.writeFileSync(uiPath, code, 'utf8');
console.log('Successfully written updated js/ui.js');

