/**
 * cloud-sync.js
 * Engine Sinkronisasi Multi-Saluran Real-Time antara Web Siswa dan Dashboard Guru
 * LarasLogika / NalarQuest — Pembelajaran Berpikir Komputasional (PBL)
 * 
 * Saluran Sinkronisasi:
 * 1. MQTT Cloud WebSocket Relay (wss://broker.emqx.io:8084/mqtt) -> Online Vercel & Lintas Perangkat (HP ke Laptop)
 * 2. Local Node.js Express API (/api/sync & /api/students) -> Offline Kelas Tanpa Internet (WiFi Hotspot Laptop Guru)
 * 3. BroadcastChannel ('laraslogika_live_channel') -> Tab Berdampingan di Browser yang Sama
 * 4. LocalStorage Window Storage Events -> Berbagi di Domain yang Sama
 * 5. Firebase Realtime Database (Opsional jika Bapak/Ibu memasukkan URL custom)
 */

const CloudSync = {
    db: null,
    isInitialized: false,
    isConnected: false,
    isMqttConnected: false,
    isLocalServerConnected: false,
    mqttClient: null,
    broadcastChannel: null,
    lastSyncTime: null,
    currentStudentKey: null,
    lastActivity: 'Membuka Media Pembelajaran',
    role: 'student', // 'student' | 'guru'
    teacherListeners: [],

    MQTT_BROKER_URL: 'wss://broker.emqx.io:8084/mqtt',
    MQTT_TOPIC_PREFIX: 'laraslogika/edu/v1',

    init(role = 'student') {
        if (this.isInitialized && this.role === role) return;
        this.isInitialized = true;
        this.role = role;

        // 1. Inisialisasi BroadcastChannel untuk komunikasi kilat 0ms antar-tab browser yang sama
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannel = new BroadcastChannel('laraslogika_live_channel');
            }
        } catch (e) {
            console.warn('[CloudSync] BroadcastChannel tidak didukung di browser ini:', e);
        }

        // 2. Inisialisasi Cloud MQTT over Secure WebSockets (EMQX Live Relay)
        this.initMqtt(role);

        // 3. Inisialisasi Firebase Cloud Database (jika tersedia atau custom)
        try {
            if (window.FirebaseConfigManager) {
                this.db = window.FirebaseConfigManager.getDatabase();
                if (this.db) {
                    this.db.ref('.info/connected').on('value', (snap) => {
                        this.isConnected = snap.val() === true;
                        if (this.isConnected) {
                            console.log('🌐 [CloudSync] Terhubung ke Firebase Realtime Database.');
                            this.flushPendingSync();
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('[CloudSync] Firebase init fallback:', e);
        }

        // 4. Khusus Siswa: Auto-sync awal & heartbeat berkala
        if (role === 'student') {
            setTimeout(() => {
                this.syncStudentState('Membuka Media Pembelajaran');
            }, 600);

            // Heartbeat berkala (setiap 10 detik) agar status online di layar guru terus menyala hijau
            setInterval(() => {
                this.syncStudentState();
            }, 10000);
        }
    },

    /**
     * Inisialisasi koneksi Cloud MQTT WebSocket
     */
    initMqtt(role) {
        if (typeof mqtt === 'undefined') {
            console.warn('[CloudSync] Library MQTT.js belum dimuat. Mencoba memuat...');
            return;
        }

        try {
            const clientId = (role === 'guru' ? 'laras_guru_' : 'laras_siswa_') + Math.random().toString(16).slice(2, 10);
            this.mqttClient = mqtt.connect(this.MQTT_BROKER_URL, {
                clientId: clientId,
                clean: true,
                connectTimeout: 5000,
                reconnectPeriod: 3000
            });

            this.mqttClient.on('connect', () => {
                this.isMqttConnected = true;
                console.log(`📡 [CloudSync] Terhubung ke Cloud MQTT Broker (${role}).`);
                this.updateStatusPill(true);

                if (role === 'guru') {
                    // Guru berlangganan seluruh feed murid
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/live/#`, { qos: 0 });
                    // Minta seluruh siswa yang sedang aktif untuk segera membalas state terkini (PING)
                    setTimeout(() => {
                        this.requestAllStudentsSync();
                    }, 500);
                } else {
                    // Siswa mendengarkan perintah PING dari guru & evaluasi presentasi
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/cmd/request_sync`, { qos: 0 });
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/eval/#`, { qos: 0 });
                    // Kirim data langsung begitu terhubung ke broker
                    setTimeout(() => {
                        this.syncStudentState('Terhubung ke Cloud Guru');
                    }, 300);
                }
            });

            this.mqttClient.on('message', (topic, message) => {
                this.handleIncomingMqttMessage(topic, message);
            });

            this.mqttClient.on('error', (err) => {
                console.warn('[CloudSync] MQTT Error:', err && err.message);
                this.isMqttConnected = false;
                this.updateStatusPill(false);
            });

            this.mqttClient.on('close', () => {
                this.isMqttConnected = false;
                this.updateStatusPill(false);
            });
        } catch (e) {
            console.warn('[CloudSync] Gagal inisialisasi MQTT:', e);
        }
    },

    handleIncomingMqttMessage(topic, message) {
        try {
            const str = message.toString();
            if (!str) return;
            const data = JSON.parse(str);

            // Jika GURU menerima data siswa
            if (this.role === 'guru' && topic.startsWith(`${this.MQTT_TOPIC_PREFIX}/live/`)) {
                this.teacherListeners.forEach(cb => {
                    try { cb(data); } catch (e) {}
                });
            }

            // Jika SISWA menerima instruksi PING dari guru
            if (this.role === 'student' && topic === `${this.MQTT_TOPIC_PREFIX}/cmd/request_sync`) {
                this.syncStudentState('Sinkronisasi Otomatis Diminta Guru');
            }

            // Jika SISWA menerima penilaian presentasi dari guru
            if (this.role === 'student' && topic.startsWith(`${this.MQTT_TOPIC_PREFIX}/eval/`)) {
                if (data && typeof data.scorePresentasi === 'number') {
                    this.handleTeacherEvaluationReceived(data);
                }
            }
        } catch (err) {
            console.warn('[CloudSync] Gagal mengurai pesan MQTT:', err);
        }
    },

    requestAllStudentsSync() {
        if (this.mqttClient && this.isMqttConnected) {
            try {
                this.mqttClient.publish(
                    `${this.MQTT_TOPIC_PREFIX}/cmd/request_sync`,
                    JSON.stringify({ timestamp: Date.now() }),
                    { qos: 0 }
                );
            } catch (e) {}
        }
    },

    handleTeacherEvaluationReceived(evalData) {
        if (!window.StorageManager || !window.StorageManager.data) return;
        window.StorageManager.data.teacherEvaluation = evalData;
        window.StorageManager.save();
        if (typeof window.UI !== 'undefined' && typeof window.UI.showToast === 'function') {
            window.UI.showToast(`📢 Guru telah memberikan nilai presentasi: ${evalData.scorePresentasi} pts! Cek menu Profil & Nilai.`, 'info');
        }
    },

    updateStatusPill(isConnected) {
        // 1. Indikator di halaman siswa
        const studentPill = document.getElementById('cloud-sync-status-pill');
        if (studentPill) {
            if (isConnected) {
                studentPill.className = 'live-sync-indicator connected';
                studentPill.innerHTML = '<span class="live-sync-dot"></span><span class="live-sync-text">Terhubung ke Guru</span>';
                studentPill.title = 'Terkoneksi real-time ke Dashboard Guru. Aktivitas & nilai disinkronkan otomatis.';
            } else {
                studentPill.className = 'live-sync-indicator connecting';
                studentPill.innerHTML = '<span class="live-sync-dot" style="background: #F59E0B;"></span><span class="live-sync-text">Menghubungkan...</span>';
                studentPill.title = 'Mencoba menghubungkan kembali ke cloud server guru...';
            }
        }

        // 2. Indikator di header guru
        const guruPill = document.getElementById('live-connection-pill') || document.getElementById('guru-live-status-pill');
        if (guruPill) {
            if (isConnected) {
                guruPill.innerHTML = '<span class="live-status-dot"></span> Realtime Cloud Aktif';
                guruPill.style.borderColor = '#A7F3D0';
                guruPill.style.color = '#065F46';
                guruPill.style.background = '#ECFDF5';
            } else {
                guruPill.innerHTML = '<span class="live-status-dot" style="background:#F59E0B;"></span> Menghubungkan Cloud...';
                guruPill.style.borderColor = '#FDE68A';
                guruPill.style.color = '#92400E';
                guruPill.style.background = '#FFFBEB';
            }
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
     * Mengambil seluruh data siswa saat ini dan menyelaraskan ke seluruh saluran
     */
    syncStudentState(activityHint = null) {
        if (!this.isInitialized) this.init('student');

        if (!window.StorageManager || !window.StorageManager.data) return;
        const data = window.StorageManager.data;

        // Ambil nama, jika kosong gunakan default yang sopan
        let nama = (data.playerName || '').trim();
        const kelas = (data.playerClass || 'Kelas X.1').trim();
        const absen = data.playerAbsen || '1';

        if (!nama) {
            nama = `Peserta Didik (Absen ${absen})`;
        }

        const classKey = this.cleanClassKey(kelas);
        const studentKey = this.cleanStudentKey(absen, nama);
        this.currentStudentKey = studentKey;

        if (activityHint) {
            this.lastActivity = activityHint;
        }

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

        // Ambil data evaluasi simulasi (Skala 1 - 4)
        const simData = (window.StorageManager && typeof StorageManager.getSimulationEvaluation === 'function')
            ? StorageManager.getSimulationEvaluation()
            : (data.simulationEvaluation || { score: 1, predicate: 'Perlu Bimbingan', count: 0, operations: {} });

        // Ambil data refleksi 3-2-1
        const refData = data.reflection || null;

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
                currentActivity: this.lastActivity || 'Sedang Aktif',
                lastActive: new Date().toISOString(),
                lastActiveTimestamp: Date.now()
            },
            simulasi: {
                score: simData.score || 1, // Skala 1 sampai 4
                predicate: simData.predicate || 'Perlu Bimbingan',
                count: simData.count || 0,
                operations: simData.operations || {},
                lastUpdated: simData.lastUpdated || null
            },
            refleksi: refData,
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

        const jsonString = JSON.stringify(payload);

        // ---------------------------------------------------------------------
        // SALURAN 1: Cloud MQTT over Secure WebSockets (Lintas Perangkat & Vercel)
        // ---------------------------------------------------------------------
        if (this.mqttClient && this.isMqttConnected) {
            try {
                this.mqttClient.publish(
                    `${this.MQTT_TOPIC_PREFIX}/live/${classKey}/${studentKey}`,
                    jsonString,
                    { qos: 0 }
                );
            } catch (e) {
                console.warn('[CloudSync] Gagal publish MQTT:', e);
            }
        }

        // ---------------------------------------------------------------------
        // SALURAN 2: BroadcastChannel (Komunikasi Instan 0ms Antar-Tab)
        // ---------------------------------------------------------------------
        try {
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({ type: 'STUDENT_UPDATE', payload });
            }
        } catch (e) {}

        // ---------------------------------------------------------------------
        // SALURAN 3: LocalStorage Event (Berbagi Langsung di Domain yang Sama)
        // ---------------------------------------------------------------------
        try {
            localStorage.setItem(`laraslogika_student_${classKey}_${studentKey}`, jsonString);
            localStorage.setItem('laraslogika_latest_packet', JSON.stringify({
                classKey,
                studentKey,
                payload,
                timestamp: Date.now()
            }));
        } catch (e) {}

        // ---------------------------------------------------------------------
        // SALURAN 4: Local Node.js Server API (/api/sync)
        // ---------------------------------------------------------------------
        try {
            fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: jsonString
            }).then(r => {
                if (r.ok) this.isLocalServerConnected = true;
            }).catch(() => {});
        } catch (e) {}

        // ---------------------------------------------------------------------
        // SALURAN 5: Firebase Realtime Cloud Database (Jika Custom URL Ada)
        // ---------------------------------------------------------------------
        if (this.db) {
            try {
                this.db.ref(`laraslogika/students/${classKey}/${studentKey}`).update(payload)
                    .then(() => {
                        this.lastSyncTime = Date.now();
                        this.db.ref(`laraslogika/students/${classKey}/${studentKey}/status/isOnline`).onDisconnect().set(false);
                    })
                    .catch(() => {
                        this.queuePendingSync(payload);
                    });
            } catch (err) {
                this.queuePendingSync(payload);
            }
        }

        // Custom window event
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
        this.init('guru');
        if (typeof callback === 'function') {
            this.teacherListeners.push(callback);
        }

        // Callback juga dipanggil oleh Firebase jika aktif
        if (this.db) {
            this.db.ref('laraslogika/students').on('value', (snapshot) => {
                const val = snapshot.val() || {};
                callback(val);
            });
            return true;
        }
        return false;
    },

    saveTeacherPresentasiScore(classKey, studentKey, presentationScore, teacherNotes = '') {
        this.init('guru');
        const score = Math.max(0, Math.min(100, parseInt(presentationScore, 10) || 0));
        const payload = {
            scorePresentasi: score,
            catatanGuru: teacherNotes || '',
            updatedAt: new Date().toISOString()
        };

        // Kirim via MQTT ke siswa
        if (this.mqttClient && this.isMqttConnected) {
            try {
                this.mqttClient.publish(
                    `${this.MQTT_TOPIC_PREFIX}/eval/${classKey}/${studentKey}`,
                    JSON.stringify(payload),
                    { qos: 0 }
                );
            } catch (e) {}
        }

        // Kirim via Firebase jika aktif
        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}/${studentKey}/teacherEvaluation`).update(payload);
        } else {
            return Promise.resolve();
        }
    },

    deleteStudentRecord(classKey, studentKey) {
        this.init('guru');
        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}/${studentKey}`).remove();
        }
        return Promise.resolve();
    },

    resetClassRecords(classKey) {
        this.init('guru');
        if (this.db) {
            return this.db.ref(`laraslogika/students/${classKey}`).remove();
        }
        return Promise.resolve();
    }
};

window.CloudSync = CloudSync;

// Auto-init jika dibuka di halaman siswa (bukan dashboard guru)
if (typeof window !== 'undefined') {
    const isGuruPage = window.location.pathname.includes('guru');
    if (!isGuruPage) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => CloudSync.init('student'));
        } else {
            CloudSync.init('student');
        }
    }
}
