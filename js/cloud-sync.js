/**
 * cloud-sync.js
 * Engine Sinkronisasi Multi-Saluran Real-Time antara Web Siswa dan Dashboard Guru
 * LarasLogika / NalarQuest — Pembelajaran Berpikir Komputasional (PBL)
 * 
 * Saluran Sinkronisasi Terpadu:
 * 1. Cloud MQTT over Secure WebSockets (EMQX, HiveMQ, Mosquitto) dengan QoS 1 & Retained Messages (Auto-Replay State)
 * 2. HTTPS Cloud Relay (ntfy.sh) via Server-Sent Events (SSE) & Caching HTTP REST (Port 443, Bebas Blokir Firewall)
 * 3. BroadcastChannel ('laraslogika_live_channel') -> Komunikasi Kilat 0ms Antar-Tab di Browser yang Sama
 * 4. LocalStorage Window Storage Events -> Berbagi di Domain yang Sama
 * 5. Local Node.js Express API (/api/sync & /api/students) -> Mode Hotspot Offline Tanpa Internet
 * 6. Firebase Realtime Database (Opsional jika Bapak/Ibu memasukkan URL custom)
 */

const CloudSync = {
    db: null,
    isInitialized: false,
    isConnected: false,
    isMqttConnected: false,
    isRelayConnected: false,
    isLocalServerConnected: false,
    mqttClient: null,
    relayEventSource: null,
    cmdEventSource: null,
    broadcastChannel: null,
    lastSyncTime: null,
    currentStudentKey: null,
    lastActivity: 'Membuka Media Pembelajaran',
    role: 'student', // 'student' | 'guru'
    teacherListeners: [],
    reconnectTimer: null,

    // Public MQTT Brokers (Fallback Bertingkat)
    MQTT_BROKER_URLS: [
        'wss://broker.emqx.io:8084/mqtt',
        'wss://broker.hivemq.com:8884/mqtt',
        'wss://test.mosquitto.org:8081/mqtt'
    ],
    currentBrokerIndex: 0,
    MQTT_TOPIC_PREFIX: 'laraslogika/edu/v1',

    // HTTPS Cloud Relay (Port 443 - Bebas Blokir Jaringan Sekolah / Operator Seluler)
    RELAY_URL: 'https://ntfy.sh/laraslogika_edu_pbl_v1',
    RELAY_CMD_URL: 'https://ntfy.sh/laraslogika_cmd_pbl_v1',

    init(role = 'student') {
        if (this.isInitialized && this.role === role) return;
        this.isInitialized = true;
        this.role = role;

        // 1. Inisialisasi BroadcastChannel untuk komunikasi kilat 0ms antar-tab browser yang sama
        try {
            if (typeof BroadcastChannel !== 'undefined') {
                this.broadcastChannel = new BroadcastChannel('laraslogika_live_channel');
                this.broadcastChannel.onmessage = (event) => {
                    if (!event || !event.data) return;
                    if (this.role === 'student' && event.data.type === 'REQUEST_SYNC') {
                        this.syncStudentState('Sinkronisasi Tab Diminta Guru');
                    }
                    if (this.role === 'guru' && event.data.type === 'STUDENT_UPDATE' && event.data.payload) {
                        this.notifyTeacherListeners(event.data.payload);
                    }
                };
            }
        } catch (e) {
            console.warn('[CloudSync] BroadcastChannel tidak didukung di browser ini:', e);
        }

        // 2. Inisialisasi Cloud MQTT over Secure WebSockets (Dengan Retain & Auto-Failover)
        this.initMqtt(role);

        // 3. Inisialisasi HTTPS Cloud Relay (SSE & REST Cache)
        this.initHttpRelay(role);

        // 4. Inisialisasi Firebase Cloud Database (jika custom URL aktif)
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

        // 5. Khusus Siswa: Auto-sync awal & heartbeat berkala
        if (role === 'student') {
            setTimeout(() => {
                this.syncStudentState('Membuka Media Pembelajaran');
            }, 600);

            // Heartbeat berkala (setiap 8 detik) agar status online di layar guru terus menyala hijau
            setInterval(() => {
                this.syncStudentState();
            }, 8000);
        }
    },

    /**
     * Inisialisasi koneksi Cloud MQTT WebSocket dengan Failover Otomatis
     */
    initMqtt(role) {
        if (typeof mqtt === 'undefined') {
            console.warn('[CloudSync] Library MQTT.js belum dimuat. Menggunakan fallback HTTPS relay.');
            return;
        }

        try {
            const targetUrl = this.MQTT_BROKER_URLS[this.currentBrokerIndex % this.MQTT_BROKER_URLS.length];
            const clientId = (role === 'guru' ? 'laras_guru_' : 'laras_siswa_') + Math.random().toString(16).slice(2, 10);
            
            if (this.mqttClient) {
                try { this.mqttClient.end(true); } catch (e) {}
            }

            this.mqttClient = mqtt.connect(targetUrl, {
                clientId: clientId,
                clean: true,
                connectTimeout: 9000,
                reconnectPeriod: 4000,
                keepalive: 30
            });

            this.mqttClient.on('connect', () => {
                this.isMqttConnected = true;
                console.log(`📡 [CloudSync] Terhubung ke Cloud MQTT Broker (${role}) via ${targetUrl}`);
                this.updateStatusPill(true);

                if (role === 'guru') {
                    // Guru berlangganan seluruh feed murid (QoS 1)
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/live/#`, { qos: 1 });
                    // Minta seluruh siswa yang sedang aktif untuk segera membalas state terkini (PING)
                    setTimeout(() => {
                        this.requestAllStudentsSync();
                    }, 400);
                } else {
                    // Siswa mendengarkan perintah PING dari guru & evaluasi presentasi
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/cmd/request_sync`, { qos: 1 });
                    this.mqttClient.subscribe(`${this.MQTT_TOPIC_PREFIX}/eval/#`, { qos: 1 });
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
                this.handleMqttDisconnect();
            });

            this.mqttClient.on('close', () => {
                this.isMqttConnected = false;
                this.updateStatusPill(this.isRelayConnected);
            });
        } catch (e) {
            console.warn('[CloudSync] Gagal inisialisasi MQTT:', e);
        }
    },

    handleMqttDisconnect() {
        this.isMqttConnected = false;
        this.updateStatusPill(this.isRelayConnected);
        
        // Coba broker cadangan berikutnya jika terjadi kegagalan koneksi
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                if (!this.isMqttConnected) {
                    this.currentBrokerIndex++;
                    console.log(`🔄 [CloudSync] Beralih ke MQTT broker cadangan #${this.currentBrokerIndex % this.MQTT_BROKER_URLS.length}...`);
                    this.initMqtt(this.role);
                }
            }, 3000);
        }
    },

    /**
     * Inisialisasi HTTPS Cloud Relay (ntfy.sh) via Server-Sent Events (SSE) & REST
     */
    initHttpRelay(role) {
        // Polling langsung untuk mengambil pesan cache sebelumnya (12 jam terakhir)
        if (role === 'guru') {
            this.pollHttpRelayCache();
        }

        // Dengarkan aliran real-time via Server-Sent Events (SSE)
        try {
            if (typeof EventSource !== 'undefined') {
                if (role === 'guru') {
                    if (this.relayEventSource) try { this.relayEventSource.close(); } catch(e) {}
                    this.relayEventSource = new EventSource(`${this.RELAY_URL}/sse`);
                    
                    this.relayEventSource.onopen = () => {
                        this.isRelayConnected = true;
                        this.updateStatusPill(true);
                        console.log('⚡ [CloudSync] HTTPS Cloud Relay SSE Terhubung.');
                    };

                    this.relayEventSource.onmessage = (event) => {
                        try {
                            const parsed = JSON.parse(event.data);
                            if (parsed && parsed.event === 'message' && parsed.message) {
                                const studentData = JSON.parse(parsed.message);
                                this.notifyTeacherListeners(studentData);
                            }
                        } catch (e) {}
                    };

                    this.relayEventSource.onerror = () => {
                        this.isRelayConnected = false;
                        this.updateStatusPill(this.isMqttConnected);
                    };

                    // Interval polling cadangan setiap 6 detik jika browser menahan SSE
                    setInterval(() => {
                        this.pollHttpRelayCache('30s');
                    }, 6000);

                } else {
                    // Siswa mendengarkan perintah ping guru via relay
                    if (this.cmdEventSource) try { this.cmdEventSource.close(); } catch(e) {}
                    this.cmdEventSource = new EventSource(`${this.RELAY_CMD_URL}/sse`);
                    this.cmdEventSource.onmessage = (event) => {
                        try {
                            const parsed = JSON.parse(event.data);
                            if (parsed && parsed.event === 'message') {
                                this.syncStudentState('Sinkronisasi Diminta Guru via HTTPS Relay');
                            }
                        } catch (e) {}
                    };
                }
            }
        } catch (e) {
            console.warn('[CloudSync] HTTPS Relay SSE tidak aktif:', e);
        }
    },

    /**
     * Mengambil seluruh data siswa yang dicache pada HTTPS relay server
     */
    pollHttpRelayCache(since = '12h') {
        const url = `${this.RELAY_URL}/json?poll=1&since=${since}`;
        fetch(url)
            .then(res => res.text())
            .then(text => {
                if (!text) return;
                const lines = text.trim().split('\n');
                lines.forEach(line => {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed && parsed.event === 'message' && parsed.message) {
                            const studentData = JSON.parse(parsed.message);
                            this.notifyTeacherListeners(studentData);
                        }
                    } catch (e) {}
                });
            })
            .catch(() => {});
    },

    notifyTeacherListeners(data) {
        if (!data || typeof data !== 'object') return;
        this.teacherListeners.forEach(cb => {
            try { cb(data); } catch (e) {}
        });
    },

    handleIncomingMqttMessage(topic, message) {
        try {
            const str = message.toString();
            if (!str) return;
            const data = JSON.parse(str);

            // Jika GURU menerima data siswa
            if (this.role === 'guru' && topic.startsWith(`${this.MQTT_TOPIC_PREFIX}/live/`)) {
                this.notifyTeacherListeners(data);
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
        const payload = JSON.stringify({ timestamp: Date.now() });

        // 1. Kirim via MQTT
        if (this.mqttClient && this.isMqttConnected) {
            try {
                this.mqttClient.publish(
                    `${this.MQTT_TOPIC_PREFIX}/cmd/request_sync`,
                    payload,
                    { qos: 1 }
                );
            } catch (e) {}
        }

        // 2. Kirim via HTTPS Cloud Relay
        try {
            fetch(this.RELAY_CMD_URL, {
                method: 'POST',
                headers: { 'Title': 'REQUEST_SYNC' },
                body: payload
            }).catch(() => {});
        } catch (e) {}

        // 3. Kirim via BroadcastChannel
        try {
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({ type: 'REQUEST_SYNC' });
            }
        } catch (e) {}

        // 4. Tarik cache HTTPS Relay
        this.pollHttpRelayCache('12h');
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
                guruPill.title = 'Terhubung ke Multi-Channel Cloud Sync (MQTT WebSocket & HTTPS Relay).';
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

        // Ambil data evaluasi simulasi (Skala 1 - 4 & 100 Pts Akumulasi)
        const simData = (window.StorageManager && typeof StorageManager.getSimulationEvaluation === 'function')
            ? StorageManager.getSimulationEvaluation()
            : (data.simulationEvaluation || { score: 1, totalScore: 0, predicate: 'Perlu Bimbingan', count: 0, operations: {} });

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
                totalScore: simData.totalScore || 0, // Akumulasi nilai 0 - 100 pts
                predicate: simData.predicate || 'Perlu Bimbingan',
                count: simData.count || 0,
                operations: simData.operations || {},
                queueChallenge: simData.queueChallenge || null,
                stackChallenge: simData.stackChallenge || null,
                stats: simData.stats || { opsCount: 0, queueCorrect: 0, stackCorrect: 0, totalCompleted: 0 },
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
        // SALURAN 1: Cloud MQTT over Secure WebSockets (Dengan Retain & QoS 1)
        // ---------------------------------------------------------------------
        if (this.mqttClient && this.isMqttConnected) {
            try {
                this.mqttClient.publish(
                    `${this.MQTT_TOPIC_PREFIX}/live/${classKey}/${studentKey}`,
                    jsonString,
                    { qos: 1, retain: true }
                );
            } catch (e) {
                console.warn('[CloudSync] Gagal publish MQTT:', e);
            }
        }

        // ---------------------------------------------------------------------
        // SALURAN 2: HTTPS Cloud Relay (ntfy.sh - Caching 12 Jam, Bebas Blokir)
        // ---------------------------------------------------------------------
        try {
            fetch(this.RELAY_URL, {
                method: 'POST',
                headers: {
                    'Title': `${classKey}_${studentKey}`,
                    'Tags': 'student_sync'
                },
                body: jsonString
            }).catch(() => {});
        } catch (e) {}

        // ---------------------------------------------------------------------
        // SALURAN 3: BroadcastChannel (Komunikasi Instan 0ms Antar-Tab)
        // ---------------------------------------------------------------------
        try {
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({ type: 'STUDENT_UPDATE', payload });
            }
        } catch (e) {}

        // ---------------------------------------------------------------------
        // SALURAN 4: LocalStorage Event (Berbagi Langsung di Domain yang Sama)
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
        // SALURAN 5: Local Node.js Server API (/api/sync)
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
        // SALURAN 6: Firebase Realtime Cloud Database (Jika Custom URL Ada)
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

        // Segera ambil cache data yang tersimpan di cloud relay
        this.pollHttpRelayCache('12h');

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
                    { qos: 1, retain: true }
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
