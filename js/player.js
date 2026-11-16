/**
 * player.js
 * Player Profile & Adventure Session Management
 */

const Player = {
    name: '',
    className: 'Kelas X.1',
    absen: '',
    currentSessionStartTime: Date.now(),

    init() {
        if (window.StorageManager) {
            this.name = StorageManager.getPlayerName();
            this.className = StorageManager.getPlayerClass() || 'Kelas X.1';
            this.absen = StorageManager.getPlayerAbsen();
        }
        this.updatePlayerUI();
        if (this.hasValidProfile()) {
            this.restoreScoresFromCloud();
        }
    },

    getName() {
        return this.name || '';
    },

    setName(newName) {
        this.name = (newName || '').trim();
        if (window.StorageManager) {
            StorageManager.setPlayerName(this.name);
        }
        this.updatePlayerUI();
    },

    getClass() {
        return this.className || 'Kelas X.1';
    },

    setClass(newClass) {
        this.className = (newClass || 'Kelas X.1').trim();
        if (window.StorageManager) {
            StorageManager.setPlayerClass(this.className);
        }
        this.updatePlayerUI();
    },

    getAbsen() {
        return this.absen || '';
    },

    setAbsen(newAbsen) {
        this.absen = (newAbsen !== undefined && newAbsen !== null) ? String(newAbsen).trim() : '';
        if (window.StorageManager) {
            StorageManager.setPlayerAbsen(this.absen);
        }
        this.updatePlayerUI();
    },

    setProfile(newName, newClass, newAbsen) {
        this.name = (newName || '').trim();
        this.className = (newClass || 'Kelas X.1').trim();
        this.absen = (newAbsen !== undefined && newAbsen !== null) ? String(newAbsen).trim() : '';
        if (window.StorageManager) {
            StorageManager.setProfile(this.name, this.className, this.absen);
        }
        this.updatePlayerUI();
        this.restoreScoresFromCloud();
    },

    hasValidProfile() {
        const cleanName = (this.name || '').trim();
        const cleanClass = (this.className || '').trim();
        const cleanAbsen = (this.absen || '').trim();
        return cleanName.length >= 2 && cleanName.toLowerCase() !== 'petualang' && cleanClass.length > 0 && cleanAbsen.length > 0;
    },

    hasName() {
        return this.hasValidProfile();
    },

    updatePlayerUI() {
        const displayName = this.getName() || 'Siswa';
        const displayClass = this.getClass();
        const displayAbsen = this.getAbsen();

        document.querySelectorAll('.player-display-name').forEach(el => {
            el.textContent = displayName;
        });

        document.querySelectorAll('.player-display-class').forEach(el => {
            el.textContent = displayClass;
        });

        document.querySelectorAll('.player-display-absen').forEach(el => {
            el.textContent = displayAbsen ? `No. ${displayAbsen}` : '-';
        });

        document.querySelectorAll('.player-display-full').forEach(el => {
            if (this.hasValidProfile()) {
                el.textContent = `${displayName} (${displayClass} - Absen ${displayAbsen})`;
            } else {
                el.textContent = displayName;
            }
        });

        // Update dynamic greetings with interpolation
        document.querySelectorAll('[data-i18n-greeting]').forEach(el => {
            el.textContent = t('greeting', { name: displayName });
        });

        // Update overall progress bar
        this.updateProgressSummary();

        // Refresh profile page if active
        if (window.UI && typeof UI.renderProfilePage === 'function' && UI.currentScreen === 'profile') {
            UI.renderProfilePage();
        }
    },

    updateProgressSummary() {
        if (!window.StorageManager) return;
        const totalLevels = 4;
        const tasks = StorageManager.data.individualTasks || {};
        let completedCount = 0;
        for (let i = 1; i <= 4; i++) {
            if (tasks[i] && tasks[i].isSubmitted) {
                completedCount++;
            }
        }
        const progressPct = Math.round((completedCount / totalLevels) * 100);

        document.querySelectorAll('.overall-progress-bar-fill').forEach(el => {
            el.style.width = `${progressPct}%`;
        });

        document.querySelectorAll('.overall-progress-text').forEach(el => {
            el.textContent = `${completedCount} / ${totalLevels} Level Selesai (${progressPct}%)`;
        });
    },

    async restoreScoresFromCloud() {
        if (!window.StorageManager) return;
        const currentAbsen = parseInt(this.getAbsen(), 10);
        const currentName = (this.getName() || '').toLowerCase().trim();
        const currentClass = this.getClass();

        // Konversi nama kelas menjadi key pencarian (e.g. 'Kelas X.2' -> 'X-2')
        let classKey = 'X-2';
        const matchClass = currentClass.match(/X[-. ]?(\d+)/i);
        if (matchClass) {
            classKey = 'X-' + matchClass[1];
        }

        try {
            const resp = await fetch('/api/students');
            if (!resp.ok) return;
            const allData = await resp.json();
            const classData = allData[classKey] || allData['X-2'];
            if (!classData) return;

            // Cari data siswa yang cocok dengan nomor absen atau kemiripan nama
            let student = null;
            Object.values(classData).forEach(s => {
                if (!s || !s.identitas) return;
                const sAbs = parseInt(s.identitas.absen, 10);
                const sName = (s.identitas.nama || '').toLowerCase().trim();
                if (currentAbsen && sAbs === currentAbsen) {
                    student = s;
                } else if (!student && currentName && (sName.includes(currentName) || currentName.includes(sName))) {
                    student = s;
                }
            });

            if (!student || !student.nilai) return;

            const n = student.nilai;
            let updated = false;

            // 1. Pulihkan tugas individu
            if (n.tugasIndividu && n.tugasIndividu.bestScore > 0) {
                if (!StorageManager.data.individualAttempts) StorageManager.data.individualAttempts = {};
                const currentBest = StorageManager.data.individualAttempts.bestScore || 0;
                if (n.tugasIndividu.bestScore > currentBest) {
                    StorageManager.data.individualAttempts.bestScore = n.tugasIndividu.bestScore;
                    StorageManager.data.individualAttempts.history = n.tugasIndividu.history || [
                        { attempt: 1, score: n.tugasIndividu.bestScore, correctCount: Math.round(n.tugasIndividu.bestScore / 25), completedAt: new Date().toISOString() }
                    ];
                    updated = true;
                }
            }

            // 2. Pulihkan LKPD kelompok
            if (n.lkpdKelompok && n.lkpdKelompok.score > 0) {
                if (!StorageManager.data.groupAttempts) StorageManager.data.groupAttempts = {};
                const currentGrp = (StorageManager.data.groupProject && StorageManager.data.groupProject.score) || 0;
                if (n.lkpdKelompok.score > currentGrp) {
                    StorageManager.data.groupProject = {
                        groupName: n.lkpdKelompok.groupName,
                        score: n.lkpdKelompok.score,
                        selectedCase: n.lkpdKelompok.selectedCase,
                        role: n.lkpdKelompok.role,
                        members: n.lkpdKelompok.members,
                        savedAt: n.lkpdKelompok.verifiedAt || new Date().toISOString()
                    };
                    StorageManager.data.groupAttempts.bestScore = n.lkpdKelompok.score;
                    StorageManager.data.groupAttempts.isLocked = true;
                    updated = true;
                }
            }

            // 3. Pulihkan evaluasi akhir
            if (n.evaluasiAkhir && n.evaluasiAkhir.score > 0) {
                if (!StorageManager.data.pageScores) StorageManager.data.pageScores = {};
                const currentEval = (StorageManager.data.pageScores['evaluation'] && StorageManager.data.pageScores['evaluation'].score) || 0;
                if (n.evaluasiAkhir.score > currentEval) {
                    StorageManager.data.pageScores['evaluation'] = {
                        score: n.evaluasiAkhir.score,
                        completed: true,
                        completedAt: n.evaluasiAkhir.completedAt || new Date().toISOString()
                    };
                    updated = true;
                }
            }

            // 4. Pulihkan operasi mini-lab
            if (student.simulasi && student.simulasi.operations) {
                StorageManager.data.miniLabOps = {
                    ...StorageManager.data.miniLabOps,
                    ...student.simulasi.operations
                };
                updated = true;
            }

            if (updated) {
                StorageManager.save();
                this.updatePlayerUI();
                if (window.UI && typeof UI.renderProfilePage === 'function' && UI.currentScreen === 'profile') {
                    UI.renderProfilePage();
                }
                console.log(`[Player] Nilai resmi siswa ${student.identitas.nama} berhasil dipulihkan dari server!`);
            }
        } catch (e) {
            console.warn('[Player] Sinkronisasi pemulihan nilai fallback:', e);
        }
    }
};

window.Player = Player;
