/**
 * cloud-sync.js
 * Engine Sinkronisasi Real-Time antara Web Siswa dan Dashboard Guru
 * Antigravity / LarasLogika - Pembelajaran Berpikir Komputasional (PBL)
 */

const CloudSync = {
    db: null,
    isInitialized: false,
    isConnected: false,
    lastSyncTime: null,
    currentStudentKey: null,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        try {
            if (window.FirebaseConfigManager) {
                this.db = window.FirebaseConfigManager.getDatabase();
                if (this.db) {
                    // Monitor connection state
                    this.db.ref('.info/connected').on('value', (snap) => {
                        this.isConnected = snap.val() === true;
                        if (this.isConnected) {
                            console.log('🌐 [CloudSync] Terhubung ke Firebase Realtime Database.');
                            this.flushPendingSync();
                        } else {
                            console.log('⚠️ [CloudSync] Offline / Mencari koneksi ke Cloud Database.');
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Inisialisasi CloudSync fallback:', e);
        }
    },

    cleanClassKey(rawClass) {
        if (!rawClass) return 'X-1';
        const str = String(rawClass).toUpperCase().replace(/\s+/g, '');
        if (str.includes('X.1') || str.includes('X1')) return 'X-1';
        if (str.includes('X.2') || str.includes('X2')) return 'X-2';
        if (str.includes('X.3') || str.includes('X3')) return 'X-3';
        if (str.includes('X.4') || str.includes('X4')) return 'X-4';
        if (str.includes('X.5') || str.includes('X5')) return 'X-5';
        if (str.includes('X.6') || str.includes('X6')) return 'X-6';
        if (str.includes('X.7') || str.includes('X7')) return 'X-7';
        return 'X-1';
    },

    cleanStudentKey(absen, name) {
        const num = parseInt(absen, 10);
        const paddedAbsen = (!isNaN(num) && num > 0) ? String(num).padStart(2, '0') : '00';
        const nameSlug = (name || 'siswa')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .slice(0, 25);
        return `absen_${paddedAbsen}_${nameSlug}`;
    },

    formatActivityName(screenId) {
        const map = {
            'screen-home': 'Melihat Beranda & Orientasi Masalah',
            'screen-learn-intro': 'Mempelajari Konsep Dasar CT',
            'screen-learn-stack': 'Mempelajari Materi Stack (LIFO)',
            'screen-learn-queue': 'Mempelajari Materi Queue (FIFO)',
            'screen-individual-tasks': 'Mengerjakan Tugas Individu 4 Level',
            'screen-group-project': 'Mengerjakan LKPD Kelompok',
            'screen-evaluation': 'Mengerjakan Evaluasi Akhir',
            'screen-enrichment': 'Membaca Materi Pengayaan',
            'screen-reflection': 'Mengisi Refleksi 3-2-1',
            'screen-profile': 'Melihat Rapor Digital Siswa',
            'screen-guidelines': 'Membaca Panduan Belajar'
        };
        return map[screenId] || 'Sedang Belajar';
    },

    /**
     * Mengambil seluruh data siswa saat ini dan menyelaraskan ke Cloud Database
     */
    syncStudentState(activityHint = null) {
        this.init();

        if (!window.StorageManager || !window.StorageManager.data) return;
        const data = window.StorageManager.data;

        const nama = data.playerName || '';
        const kelas = data.playerClass || 'Kelas X.1';
        const absen = data.playerAbsen || '1';

        // Hanya sinkron jika siswa sudah mengisi nama/bukan kosong default
        if (!nama || nama === 'Siswa Cerdas' || nama === 'Peserta Didik') {
            return;
        }

        const classKey = this.cleanClassKey(kelas);
        const studentKey = this.cleanStudentKey(absen, nama);
        this.currentStudentKey = studentKey;

        // Hitung nilai digital terkini
        let digitalScore = 0;
        let scoreBreakdown = { I: 0, L: 0, E: 0, B: 0 };
        if (window.ScoringSystem && typeof window.ScoringSystem.calculateNalarQuestFinalScore === 'function') {
            const res = window.ScoringSystem.calculateNalarQuestFinalScore();
            digitalScore = res.finalScore;
            scoreBreakdown = res.components;
        }

        // Ambil riwayat percobaan individu
        const indivAtt = data.individualAttempts || { currentAttempt: 1, bestScore: 0, history: [] };
        // Ambil riwayat percobaan LKPD kelompok
        const groupAtt = data.groupAttempts || { currentAttempt: 1, bestScore: 0, history: [] };
        // Ambil hasil evaluasi
        const evalScore = (data.pageScores && data.pageScores['evaluation']) ? (data.pageScores['evaluation'].score || 0) : 0;
        const isEvalDone = !!(data.pageScores && data.pageScores['evaluation'] && data.pageScores['evaluation'].completed);

        // Ambil bonus minilab
        const bonusMiniLab = data.miniLabBonus || 0;

        // Ambil rincian data kelompok
        const gp = data.groupProject || {};
        const groupName = gp.groupName || '-';
        const groupMembers = gp.members || [];
        const worksheet = gp.worksheet || {};

        const payload = {
            identitas: {
                nama: nama,
                kelas: kelas,
                classKey: classKey,
                absen: parseInt(absen, 10) || 1
            },
            status: {
                isOnline: true,
                currentActivity: activityHint || this.lastActivity || 'Sedang Aktif',
                lastActive: new Date().toISOString(),
                lastActiveTimestamp: Date.now()
            },
            nilai: {
                digitalScore: digitalScore,
                tugasIndividu: {
                    bestScore: indivAtt.bestScore || 0,
                    currentAttempt: indivAtt.currentAttempt || 1,
                    history: indivAtt.history || [],
                    isLocked: !!(indivAtt.lockedTasks && indivAtt.lockedTasks['4'] && indivAtt.lockedTasks['4'].isLocked)
                },
                lkpdKelompok: {
                    groupName: groupName,
                    members: groupMembers,
                    bestScore: groupAtt.bestScore || 0,
                    currentAttempt: groupAtt.currentAttempt || 1,
                    history: groupAtt.history || [],
                    isLocked: groupAtt.isLocked || false,
                    worksheet: {
                        selectedStructure: worksheet.selectedStructure || '',
                        reasoning: worksheet.reasoning || '',
                        steps: worksheet.steps || '',
                        conclusion: worksheet.conclusion || ''
                    }
                },
                evaluasiAkhir: {
                    score: evalScore,
                    isCompleted: isEvalDone
                },
                bonusMiniLab: bonusMiniLab,
                breakdown: scoreBreakdown
            }
        };

        // Simpan salinan lokal ke localStorage agar bisa diakses offline
        try {
            localStorage.setItem('laraslogika_cached_student_sync', JSON.stringify(payload));
        } catch (e) {}

        // Kirim ke Firebase Realtime Database
        if (this.db) {
            try {
                this.db.ref(`laraslogika/students/${classKey}/${studentKey}`).update(payload)
                    .then(() => {
                        this.lastSyncTime = Date.now();
                        // Pasang onDisconnect status
                        this.db.ref(`laraslogika/students/${classKey}/${studentKey}/status/isOnline`).onDisconnect().set(false);
                    })
                    .catch((err) => {
                        console.warn('Gagal sinkron data siswa ke cloud:', err);
                        this.queuePendingSync(payload);
                    });
            } catch (err) {
                this.queuePendingSync(payload);
            }
        } else {
            this.queuePendingSync(payload);
        }

        // Panggil custom event untuk UI jika diperlukan
        if (typeof window.dispatchEvent === 'function') {
            window.dispatchEvent(new CustomEvent('laraslogika:sync', { detail: payload }));
        }
    },

    updateActivity(screenId) {
        const activityText = this.formatActivityName(screenId);
        this.lastActivity = activityText;
        this.syncStudentState(activityText);
    },

    queuePendingSync(payload) {
        try {
            localStorage.setItem('laraslogika_pending_sync', JSON.stringify(payload));
        } catch (e) {}
    },

    flushPendingSync() {
        try {
            const raw = localStorage.getItem('laraslogika_pending_sync');
            if (raw && this.db) {
                const payload = JSON.parse(raw);
                if (payload && payload.identitas) {
                    const classKey = payload.identitas.classKey;
                    const studentKey = this.cleanStudentKey(payload.identitas.absen, payload.identitas.nama);
                    this.db.ref(`laraslogika/students/${classKey}/${studentKey}`).update(payload);
                    localStorage.removeItem('laraslogika_pending_sync');
                }
            }
        } catch (e) {}
    },

    // =========================================================================
    // METODE KHUSUS DASHBOARD GURU (TEACHER PORTAL COMMAND CENTER)
    // =========================================================================

    listenToAllStudents(callback) {
        this.init();
        if (this.db) {
            this.db.ref('laraslogika/students').on('value', (snapshot) => {
                const val = snapshot.val() || {};
                callback(val);
            });
            return true;
        }
        return false;
    },

    listenToClass(classKey, callback) {
        this.init();
        if (this.db) {
            this.db.ref(`laraslogika/students/${classKey}`).on('value', (snapshot) => {
                const val = snapshot.val() || {};
                callback(val);
            });
            return true;
        }
        return false;
    },

    saveTeacherPresentasiScore(classKey, studentKey, presentationScore, teacherNotes = '') {
        this.init();
        const score = Math.max(0, Math.min(100, parseInt(presentationScore, 10) || 0));
        const payload = {
            scorePresentasi: score,
            catatanGuru: teacherNotes || '',
            updatedAt: new Date().toISOString()
        };

        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}/${studentKey}/teacherEvaluation`).update(payload);
        } else {
            // Local fallback
            const localKey = `teacher_eval_${classKey}_${studentKey}`;
            localStorage.setItem(localKey, JSON.stringify(payload));
            return Promise.resolve();
        }
    },

    deleteStudentRecord(classKey, studentKey) {
        this.init();
        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}/${studentKey}`).remove();
        }
        return Promise.resolve();
    },

    resetClassRecords(classKey) {
        this.init();
        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}`).remove();
        }
        return Promise.resolve();
    },

    /**
     * Generator data demo untuk simulasi tampilan guru saat belum ada siswa online
     */
    generateDemoStudentsData() {
        const sampleClasses = ['X-1', 'X-2', 'X-3'];
        const sampleNames = [
            'Ahmad Fauzi', 'Anisa Rahmawati', 'Budi Santoso', 'Citra Dewi',
            'Dimas Pratama', 'Eka Putri Lestari', 'Fajar Nugraha', 'Gita Permata',
            'Hafizh Ramadhan', 'Indah Kusuma', 'Joko Susilo', 'Kartika Sari',
            'Lukman Hakim', 'Maulana Malik', 'Nabila Zahra', 'Oki Setiawan'
        ];

        const activities = [
            '🟢 Mengerjakan Evaluasi Akhir',
            '🟢 Diskusi LKPD Kasus Kantin',
            '🟢 Mengerjakan Tantangan Level 3',
            '🟡 Mempelajari Materi Queue',
            '🟢 Mengerjakan Tantangan Level 1',
            '⚪ Selesai (Rapor Digital)'
        ];

        const demoData = {};
        sampleClasses.forEach(cls => {
            demoData[cls] = {};
            sampleNames.forEach((name, idx) => {
                const absen = idx + 1;
                const studentKey = `absen_${String(absen).padStart(2, '0')}_${name.toLowerCase().replace(/\s+/g, '_')}`;
                
                const indivScore = (idx % 4 === 0) ? 100 : (idx % 3 === 0) ? 75 : 100;
                const lkpdScore = (idx % 2 === 0) ? 90 : 85;
                const evalScore = (idx % 5 === 0) ? 100 : 80;
                const bonus = 5;
                const digitalScore = Math.min(100, Math.round((indivScore * 0.3) + (lkpdScore * 0.35) + (evalScore * 0.35) + bonus));
                const presentasiScore = (idx % 3 === 0) ? 95 : 88;

                demoData[cls][studentKey] = {
                    identitas: {
                        nama: name,
                        kelas: `Kelas ${cls.replace('-', '.')}`,
                        classKey: cls,
                        absen: absen
                    },
                    status: {
                        isOnline: idx < 10,
                        currentActivity: activities[idx % activities.length],
                        lastActive: new Date(Date.now() - (idx * 180000)).toISOString(),
                        lastActiveTimestamp: Date.now() - (idx * 180000)
                    },
                    nilai: {
                        digitalScore: digitalScore,
                        tugasIndividu: {
                            bestScore: indivScore,
                            currentAttempt: (idx % 3) + 1,
                            history: [{ attempt: 1, score: indivScore }],
                            isLocked: true
                        },
                        lkpdKelompok: {
                            groupName: `Kelompok ${Math.floor(idx / 4) + 1}`,
                            bestScore: lkpdScore,
                            currentAttempt: 1,
                            history: [{ attempt: 1, score: lkpdScore }],
                            isLocked: true,
                            worksheet: {
                                selectedStructure: 'Queue (FIFO - First In First Out)',
                                reasoning: 'Loket pemesanan makanan kantin wajib melayani siswa yang datang lebih dulu secara adil.',
                                steps: '1. Siswa antre di loket kasir belakang (Rear)\n2. Kasir melayani siswa terdepan (Front)\n3. Siswa selesai diproses lalu keluar (Dequeue)',
                                conclusion: 'Struktur data Queue mencegah penyerobotan antrean dan memastikan waktu tunggu adil.'
                            }
                        },
                        evaluasiAkhir: {
                            score: evalScore,
                            isCompleted: true
                        },
                        bonusMiniLab: bonus,
                        breakdown: {
                            I: indivScore,
                            L: lkpdScore,
                            E: evalScore,
                            B: bonus
                        }
                    },
                    teacherEvaluation: {
                        scorePresentasi: presentasiScore,
                        catatanGuru: 'Argumentasi komputasional sangat logis dan runtut.'
                    }
                };
            });
        });

        return demoData;
    }
};

window.CloudSync = CloudSync;
